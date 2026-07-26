import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null

const app = express()
app.use(cors())
app.use(express.json())

// Serve Admin UI statically
app.use('/admin', express.static(path.join(__dirname, 'server', 'admin')))

const PORT = process.env.PORT || 3001
const CONFIG_PATH = path.join(__dirname, 'server', 'config.json')

// Ensure config dir exists
if (!fs.existsSync(path.join(__dirname, 'server'))) {
  fs.mkdirSync(path.join(__dirname, 'server'), { recursive: true })
}

// Load config helper
const loadConfig = () => {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8')
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('Error loading config:', e)
  }
  return { 
    provider: 'openai', 
    openaiKey: process.env.OPENAI_API_KEY || '', 
    openrouterKey: '',
    openrouterModel: 'google/gemini-2.5-flash',
    elevenLabsKey: '',
    elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM' // Default voice (Rachel or similar)
  }
}

// Save config helper
const saveConfig = (newConfig) => {
  const current = loadConfig()
  const updated = { ...current, ...newConfig }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf8')
  return updated
}

// ---------------- Admin API ---------------- //
app.get('/api/admin/config', (req, res) => {
  const config = loadConfig()
  // Mask keys for security
  res.json({
    ...config,
    openaiKey: config.openaiKey ? `${config.openaiKey.substring(0, 6)}...` : '',
    openrouterKey: config.openrouterKey ? `${config.openrouterKey.substring(0, 6)}...` : '',
    elevenLabsKey: config.elevenLabsKey ? `${config.elevenLabsKey.substring(0, 6)}...` : ''
  })
})

app.post('/api/admin/config', (req, res) => {
  try {
    const updated = saveConfig(req.body)
    res.json({ success: true, message: '設定已更新', provider: updated.provider })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ---------------- Chat API ---------------- //
app.post('/api/chat', async (req, res) => {
  try {
    // 1. JWT Authentication
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }
    const token = authHeader.split(' ')[1]
    
    if (supabase) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' })
      }
    } else {
      console.warn('⚠️ Server Supabase client not configured. Skipping JWT validation.')
    }

    const config = loadConfig()
    // Frontend can override provider, otherwise use backend default
    const provider = req.body.provider || config.provider 
    const { messages, systemPrompt } = req.body

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    ]

    // ── OpenAI ──
    if (provider === 'openai') {
      const key = config.openaiKey
      if (!key) return res.status(500).json({ error: 'OpenAI API Key is not configured on the server.' })

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: formattedMessages,
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'OpenAI API error')
      }

      const data = await response.json()
      res.json(data)
    } 
    // ── OpenRouter ──
    else if (provider === 'openrouter') {
      const key = config.openrouterKey
      if (!key) return res.status(500).json({ error: 'OpenRouter API Key is not configured on the server.' })

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': 'http://localhost:5173', 
          'X-Title': 'Japanese Learning App'
        },
        body: JSON.stringify({
          model: config.openrouterModel || 'google/gemini-2.5-flash',
          messages: formattedMessages,
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'OpenRouter API error')
      }

      const data = await response.json()
      // Note: OpenRouter JSON mode support varies by model. 
      // But we requested it, so we pass it through.
      res.json(data)
    } 
    else {
      res.status(400).json({ error: `Unsupported provider: ${provider}` })
    }
  } catch (error) {
    console.error('Server Proxy Error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ---------------- TTS API ---------------- //
app.post('/api/tts', async (req, res) => {
  try {
    const config = loadConfig()
    const { text, voice } = req.body

    const openaiVoice = voice || 'nova' // 'nova' is a very natural female voice

    // 1. Try OpenAI TTS first (Cheaper / Included)
    if (config.openaiKey) {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: openaiVoice
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`OpenAI TTS error: ${errorText}`)
      }

      res.setHeader('Content-Type', 'audio/mpeg')
      const buffer = await response.arrayBuffer()
      return res.send(Buffer.from(buffer))
    }

    // 2. Fallback to ElevenLabs if specifically configured
    if (config.elevenLabsKey) {
      const voiceId = config.elevenLabsVoiceId || '21m00Tcm4TlvDq8ikWAM'
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': config.elevenLabsKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`ElevenLabs API error: ${errorText}`)
      }

      res.setHeader('Content-Type', 'audio/mpeg')
      const buffer = await response.arrayBuffer()
      return res.send(Buffer.from(buffer))
    }

    return res.status(400).json({ error: 'No TTS API Key configured' })

  } catch (error) {
    console.error('TTS Proxy Error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`)
})
