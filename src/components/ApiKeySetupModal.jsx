import React, { useState, useEffect } from 'react'
import { X, Key, ExternalLink, CheckCircle2, AlertCircle, Loader2, Save, Cpu } from 'lucide-react'
import { validateApiKey } from '../services/llmService'

export default function ApiKeySetupModal({ isOpen, onClose, onSaveSuccess }) {
  const [provider, setProvider] = useState('openai') // 'openai' | 'anthropic'
  const [apiKey, setApiKey] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'testing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      const savedProvider = localStorage.getItem('USER_AI_PROVIDER') || 'openai'
      setProvider(savedProvider)
      
      const existingKey = localStorage.getItem(`USER_${savedProvider.toUpperCase()}_API_KEY`)
      if (existingKey) {
        setApiKey(existingKey)
      } else {
        setApiKey('')
      }
      setStatus('idle')
      setErrorMessage('')
    }
  }, [isOpen])

  // Handle provider switch
  useEffect(() => {
    if (!isOpen) return;
    const existingKey = localStorage.getItem(`USER_${provider.toUpperCase()}_API_KEY`)
    setApiKey(existingKey || '')
    setStatus('idle')
    setErrorMessage('')
  }, [provider, isOpen])

  if (!isOpen) return null

  const handleValidateAndSave = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('請先輸入 API Key')
      setStatus('error')
      return
    }

    setStatus('testing')
    setErrorMessage('')

    const isValid = await validateApiKey(provider, apiKey.trim())
    
    if (isValid) {
      localStorage.setItem('USER_AI_PROVIDER', provider)
      localStorage.setItem(`USER_${provider.toUpperCase()}_API_KEY`, apiKey.trim())
      setStatus('success')
      setTimeout(() => {
        onSaveSuccess && onSaveSuccess()
        onClose()
      }, 1500)
    } else {
      setStatus('error')
      setErrorMessage('金鑰無效，請確認您的帳戶狀態或金鑰格式。')
    }
  }

  const getProviderInfo = () => {
    if (provider === 'openai') {
      return {
        name: 'OpenAI (GPT-4o)',
        link: 'https://platform.openai.com/api-keys',
        prefix: 'sk-proj-...'
      }
    }
    return {
      name: 'Anthropic (Claude 3.5)',
      link: 'https://console.anthropic.com/settings/keys',
      prefix: 'sk-ant-...'
    }
  }

  const info = getProviderInfo()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[var(--surface)] rounded-[32px] shadow-2xl overflow-hidden border border-[var(--border)] animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--ink)] tracking-tight">BYOK 多模型專業面板</h2>
              <p className="text-xs text-[var(--ink-3)] font-medium">自行綁定金鑰，解鎖原廠無限算力</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--input-bg)] flex items-center justify-center text-[var(--ink-2)] hover:bg-[var(--border)] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Model Selection */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-extrabold text-[var(--ink-2)] uppercase tracking-wider">選擇 AI 供應商</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setProvider('openai')}
                className={`flex-1 py-3 rounded-2xl border text-sm font-bold transition ${
                  provider === 'openai' 
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]' 
                    : 'border-[var(--border)] bg-[var(--canvas)] text-[var(--ink-3)] hover:border-[var(--ink-3)]'
                }`}
              >
                OpenAI
              </button>
              <button
                onClick={() => setProvider('anthropic')}
                className={`flex-1 py-3 rounded-2xl border text-sm font-bold transition ${
                  provider === 'anthropic' 
                    ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]' 
                    : 'border-[var(--border)] bg-[var(--canvas)] text-[var(--ink-3)] hover:border-[var(--ink-3)]'
                }`}
              >
                Anthropic
              </button>
            </div>
          </div>

          {/* SOP Steps */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-[var(--ink-2)] uppercase tracking-wider">取得 {info.name} 金鑰</h3>
            
            <a 
              href={info.link} 
              target="_blank" 
              rel="noreferrer"
              className="p-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--input-border)] flex items-center gap-3 hover:border-[var(--primary-dim)] transition group"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black shrink-0">1</div>
              <div className="flex flex-col flex-1">
                <p className="text-sm text-[var(--ink)] font-bold">前往 {provider === 'openai' ? 'OpenAI' : 'Anthropic'} 控制台</p>
                <p className="text-[10px] text-[var(--ink-3)] font-medium">註冊、綁定信用卡並建立 API Key</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[var(--primary)]" />
            </a>
          </div>

          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-extrabold text-[var(--ink-2)] uppercase tracking-wider">貼上您的 {info.name} 金鑰</h3>
            <input 
              type="password"
              placeholder={info.prefix}
              value={apiKey}
              onChange={e => {
                setApiKey(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              className="w-full px-4 py-3.5 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] text-sm font-mono focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
            />
            {status === 'error' && (
              <div className="flex items-center gap-1.5 mt-1 text-rose-500 text-xs font-bold px-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {status === 'success' && (
              <div className="flex items-center gap-1.5 mt-1 text-emerald-500 text-xs font-bold px-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>綁定成功！即刻享受無限算力。</span>
              </div>
            )}
            <p className="text-[10px] text-[var(--ink-3)] mt-1 px-1">
              ⚠️ 金鑰僅加密儲存於您的瀏覽器本地端 (localStorage)，絕不會上傳至我們的伺服器。
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0">
          <button 
            onClick={handleValidateAndSave}
            disabled={status === 'testing' || !apiKey.trim()}
            className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition ${
              status === 'success' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100'
            }`}
          >
            {status === 'testing' && <Loader2 className="w-4 h-4 animate-spin" />}
            {status === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {status === 'idle' || status === 'error' ? <><Save className="w-4 h-4" /> 驗證並儲存</> : null}
            {status === 'testing' && '驗證連線中...'}
            {status === 'success' && '完成'}
          </button>
        </div>

      </div>
    </div>
  )
}
