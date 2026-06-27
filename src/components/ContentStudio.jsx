import { useMemo, useState } from 'react'
import { supabase } from '../supabase'
import { STUDIO_TRACKS } from '../data/contentStudioTemplates'
import './ContentStudio.css'

function slugify(value) {
  return String(value || 'item')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function splitArrayValue(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  return String(value)
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseDelimitedText(text) {
  const blocks = text
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks.map((block) => {
    const entry = {}
    block.split('\n').forEach((line) => {
      const index = line.indexOf(':')
      if (index === -1) return
      const key = line.slice(0, index).trim()
      const value = line.slice(index + 1).trim()
      entry[key] = value
    })
    return entry
  })
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((item) => item.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((item) => item.trim())
    return headers.reduce((entry, header, index) => {
      entry[header] = values[index] || ''
      return entry
    }, {})
  })
}

function parseRawContent(rawText, fileName) {
  const trimmed = rawText.trim()
  if (!trimmed) return []

  const lowerName = (fileName || '').toLowerCase()

  if (lowerName.endsWith('.json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) return parsed
    if (Array.isArray(parsed.items)) return parsed.items
    return [parsed]
  }

  if (lowerName.endsWith('.csv')) {
    return parseCsv(trimmed)
  }

  return parseDelimitedText(trimmed)
}

function normalizeItem(track, module, item, index) {
  const baseId = item.id || `${track}-${module}-${String(index + 1).padStart(3, '0')}-${slugify(item.headword || item.pattern || item.title || item.kanji || item.phrase_ja || item.errorType || 'entry')}`

  if (track === 'japanese' && module === 'grammar') {
    return {
      id: baseId,
      level: item.level || '',
      pattern: item.pattern || '',
      meaning_zh: item.meaning_zh || '',
      meaning_en: item.meaning_en || '',
      example_ja: item.example_ja || '',
      example_zh: item.example_zh || '',
      explanation: item.explanation || '',
    }
  }

  if (track === 'japanese' && module === 'vocabulary') {
    return {
      id: baseId,
      level: item.level || '',
      kanji: item.kanji || '',
      reading: item.reading || '',
      meaning_zh: item.meaning_zh || '',
      meaning_en: item.meaning_en || '',
      pos: item.pos || '',
      example_ja: item.example_ja || '',
      example_zh: item.example_zh || '',
    }
  }

  if (track === 'japanese' && module === 'phrases') {
    return {
      id: baseId,
      phrase_ja: item.phrase_ja || '',
      reading: item.reading || '',
      meaning_zh: item.meaning_zh || '',
      meaning_en: item.meaning_en || '',
      context: item.context || '',
      formal: item.formal || '',
      casual: item.casual || '',
      example: item.example || '',
    }
  }

  if (track === 'english' && module === 'vocabulary') {
    return {
      id: baseId,
      headword: item.headword || '',
      category: item.category || '',
      focus: item.focus || '',
      register: item.register || '',
      meaningZh: item.meaningZh || item.meaning_zh || '',
      nuanceNote: item.nuanceNote || item.nuance_note || '',
      collocations: splitArrayValue(item.collocations),
      examples: splitArrayValue(item.examples),
    }
  }

  if (track === 'english' && module === 'expressions') {
    return {
      id: baseId,
      pattern: item.pattern || '',
      category: item.category || '',
      function: item.function || '',
      register: item.register || '',
      explanationZh: item.explanationZh || item.explanation_zh || '',
      usageNote: item.usageNote || item.usage_note || '',
      exampleSentence: item.exampleSentence || item.example_sentence || '',
      exampleZh: item.exampleZh || item.example_zh || '',
    }
  }

  if (track === 'english' && module === 'writing') {
    return {
      id: baseId,
      category: item.category || '',
      errorType: item.errorType || item.error_type || '',
      tone: item.tone || '',
      weakSentence: item.weakSentence || item.weak_sentence || '',
      betterSentence: item.betterSentence || item.better_sentence || '',
      betterSentenceZh: item.betterSentenceZh || item.better_sentence_zh || '',
      bestSentence: item.bestSentence || item.best_sentence || '',
      bestSentenceZh: item.bestSentenceZh || item.best_sentence_zh || '',
      explanationZh: item.explanationZh || item.explanation_zh || '',
      coachingTip: item.coachingTip || item.coaching_tip || '',
    }
  }

  if (track === 'english' && module === 'reading') {
    return {
      id: baseId,
      title: item.title || '',
      topic: item.topic || '',
      difficulty: item.difficulty || '',
      questionFocus: item.questionFocus || item.question_focus || '',
      passage: item.passage || '',
      summaryZh: item.summaryZh || item.summary_zh || '',
    }
  }

  return { id: baseId, ...item }
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function describeError(error) {
  if (!error) return 'Unknown error.'
  if (error instanceof Error) return error.message
  if (typeof error === 'object') {
    const details = [error.message, error.details, error.hint, error.code].filter(Boolean)
    if (details.length > 0) return details.join(' | ')
    try {
      return JSON.stringify(error)
    } catch {
      return 'Unable to serialize error.'
    }
  }
  return String(error)
}

function getTableName(track, module) {
  if (track === 'japanese' && module === 'grammar') return 'grammar'
  if (track === 'japanese' && module === 'vocabulary') return 'vocabulary'
  if (track === 'japanese' && module === 'phrases') return 'phrases'
  if (track === 'english' && module === 'vocabulary') return 'english_vocabulary'
  if (track === 'english' && module === 'expressions') return 'english_expressions'
  if (track === 'english' && module === 'writing') return 'english_writing_points'
  if (track === 'english' && module === 'reading') return 'english_readings'
  return null
}

function toDatabaseRow(track, module, item) {
  if (track === 'japanese' && module === 'grammar') {
    return {
      id: item.id,
      level: item.level || 'custom',
      pattern: item.pattern,
      meaning_zh: item.meaning_zh,
      meaning_en: item.meaning_en,
      example_ja: item.example_ja,
      example_zh: item.example_zh,
      explanation: item.explanation,
    }
  }

  if (track === 'japanese' && module === 'vocabulary') {
    return {
      id: item.id,
      level: item.level || 'custom',
      kanji: item.kanji,
      reading: item.reading,
      meaning_zh: item.meaning_zh,
      meaning_en: item.meaning_en,
      pos: item.pos,
      example_ja: item.example_ja,
      example_zh: item.example_zh,
    }
  }

  if (track === 'japanese' && module === 'phrases') {
    return {
      id: item.id,
      phrase_ja: item.phrase_ja,
      reading: item.reading,
      meaning_zh: item.meaning_zh,
      meaning_en: item.meaning_en,
      context: item.context,
      formal: item.formal,
      casual: item.casual,
      example: item.example,
    }
  }

  if (track === 'english' && module === 'vocabulary') {
    return {
      id: item.id,
      headword: item.headword,
      category: item.category,
      focus: item.focus,
      register: item.register,
      meaning_zh: item.meaningZh,
      nuance_note: item.nuanceNote,
      collocations: item.collocations || [],
      examples: item.examples || [],
    }
  }

  if (track === 'english' && module === 'expressions') {
    return {
      id: item.id,
      pattern: item.pattern,
      category: item.category,
      function: item.function,
      register: item.register,
      explanation_zh: item.explanationZh,
      usage_note: item.usageNote,
      example_sentence: item.exampleSentence,
      example_zh: item.exampleZh,
    }
  }

  if (track === 'english' && module === 'writing') {
    return {
      id: item.id,
      category: item.category,
      error_type: item.errorType,
      tone: item.tone,
      weak_sentence: item.weakSentence,
      better_sentence: item.betterSentence,
      better_sentence_zh: item.betterSentenceZh,
      best_sentence: item.bestSentence,
      best_sentence_zh: item.bestSentenceZh,
      explanation_zh: item.explanationZh,
      coaching_tip: item.coachingTip,
    }
  }

  if (track === 'english' && module === 'reading') {
    return {
      id: item.id,
      title: item.title,
      topic: item.topic,
      difficulty: item.difficulty || 'custom',
      question_focus: item.questionFocus,
      passage: item.passage,
      summary_zh: item.summaryZh,
    }
  }

  return item
}

export default function ContentStudio() {
  const [track, setTrack] = useState('english')
  const [module, setModule] = useState('expressions')
  const [rawText, setRawText] = useState('')
  const [fileName, setFileName] = useState('')
  const [saveState, setSaveState] = useState({ status: 'idle', message: '' })

  const activeTrack = STUDIO_TRACKS[track]
  const moduleOptions = activeTrack.modules
  const activeModule = moduleOptions[module]

  const { normalizedItems, parseError } = useMemo(() => {
    if (!rawText.trim()) return { normalizedItems: [], parseError: '' }
    try {
      const parsed = parseRawContent(rawText, fileName)
      return {
        normalizedItems: parsed.map((item, index) => normalizeItem(track, module, item, index)),
        parseError: '',
      }
    } catch (error) {
      return {
        normalizedItems: [],
        parseError: error instanceof Error ? error.message : 'Unable to parse content.',
      }
    }
  }, [fileName, module, rawText, track])

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setRawText(await file.text())
  }

  const handleTrackChange = (nextTrack) => {
    setTrack(nextTrack)
    const firstModule = Object.keys(STUDIO_TRACKS[nextTrack].modules)[0]
    setModule(firstModule)
    setSaveState({ status: 'idle', message: '' })
  }

  const handleModuleChange = (nextModule) => {
    setModule(nextModule)
    setSaveState({ status: 'idle', message: '' })
  }

  const handleSaveToSupabase = async () => {
    const tableName = getTableName(track, module)
    if (!tableName || normalizedItems.length === 0) return

    try {
      setSaveState({ status: 'saving', message: 'Saving to Supabase...' })
      const rows = normalizedItems.map((item) => toDatabaseRow(track, module, item))
      const { error } = await supabase.from(tableName).upsert(rows)
      if (error) throw error
      setSaveState({
        status: 'success',
        message: `Saved ${rows.length} item(s) to ${tableName}.`,
      })
    } catch (error) {
      setSaveState({
        status: 'error',
        message: describeError(error),
      })
    }
  }

  return (
    <section className="content-studio">
      <div className="content-studio__hero">
        <div>
          <p className="content-studio__eyebrow">Content Ingestion Studio</p>
          <h2>Upload source material and turn it into course-ready content</h2>
          <p className="content-studio__description">
            This studio can normalize structured uploads for both Japanese and English modules. It works best with
            `json`, `csv`, or field-based text blocks. If you later want arbitrary documents converted by AI, we can
            add an API-backed step on top of this intake layer.
          </p>
        </div>
        <div className="content-studio__hero-card">
          <p>Works now</p>
          <ul>
            <li>Upload or paste source content</li>
            <li>Choose track and module</li>
            <li>Preview normalized course items</li>
            <li>Export clean JSON for later import</li>
          </ul>
        </div>
      </div>

      <div className="content-studio__layout">
        <section className="content-studio__panel">
          <div className="content-studio__selectors">
            <div className="content-studio__toggle">
              {Object.entries(STUDIO_TRACKS).map(([key, value]) => (
                <button
                  key={key}
                  className={track === key ? 'is-active' : ''}
                  onClick={() => handleTrackChange(key)}
                >
                  {value.label}
                </button>
              ))}
            </div>

            <div className="content-studio__chips">
              {Object.entries(moduleOptions).map(([key, value]) => (
                <button
                  key={key}
                  className={module === key ? 'is-active' : ''}
                  onClick={() => handleModuleChange(key)}
                >
                  {value.label}
                </button>
              ))}
            </div>
          </div>

          <label className="content-studio__upload">
            <span>Upload source file</span>
            <input type="file" accept=".json,.csv,.txt,.md" onChange={handleFile} />
          </label>

          <textarea
            className="content-studio__textarea"
            placeholder="Paste JSON, CSV, or field-based text blocks here."
            value={rawText}
            onChange={(event) => {
              setRawText(event.target.value)
              setSaveState({ status: 'idle', message: '' })
            }}
          />

          <div className="content-studio__actions">
            <button
              className="content-studio__button content-studio__button--secondary"
              onClick={() => {
                setRawText(activeModule.example)
                setSaveState({ status: 'idle', message: '' })
              }}
            >
              Load Example Template
            </button>
            <button
              className="content-studio__button"
              onClick={() => downloadJson(`${track}-${module}-normalized.json`, normalizedItems)}
              disabled={normalizedItems.length === 0}
            >
              Export Normalized JSON
            </button>
            <button
              className="content-studio__button"
              onClick={handleSaveToSupabase}
              disabled={normalizedItems.length === 0 || saveState.status === 'saving'}
            >
              {saveState.status === 'saving' ? 'Saving...' : 'Save To Supabase'}
            </button>
          </div>

          {fileName && <p className="content-studio__meta">Current file: {fileName}</p>}
          {parseError && <p className="content-studio__error">Parse error: {parseError}</p>}
          {saveState.message && (
            <p className={`content-studio__status content-studio__status--${saveState.status}`}>
              {saveState.message}
            </p>
          )}
        </section>

        <section className="content-studio__panel">
          <div className="content-studio__template">
            <p className="content-studio__eyebrow">Template Fields</p>
            <div className="content-studio__tags">
              {activeModule.fields.map((field) => (
                <span key={field}>{field}</span>
              ))}
            </div>
            <pre>{activeModule.example}</pre>
          </div>

          <div className="content-studio__preview">
            <div className="content-studio__preview-header">
              <div>
                <p className="content-studio__eyebrow">Normalized Preview</p>
                <h3>{normalizedItems.length} item(s)</h3>
              </div>
            </div>

            {normalizedItems.length === 0 ? (
              <div className="content-studio__empty">Upload content or load the example template to preview normalized course items.</div>
            ) : (
              <div className="content-studio__preview-list">
                {normalizedItems.map((item) => (
                  <article key={item.id} className="content-studio__preview-card">
                    <p className="content-studio__preview-id">{item.id}</p>
                    <pre>{JSON.stringify(item, null, 2)}</pre>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  )
}
