import { useEffect, useState } from 'react'
import './SpeechSettingsPanel.css'

const STORAGE_KEYS = {
  femalePreferred: 'speech-female-preferred',
  rateJa: 'speech-rate-ja',
  rateEn: 'speech-rate-en',
  englishRegion: 'speech-english-region',
}

const ENGLISH_REGIONS = [
  { value: 'en-US', label: '美式英語' },
  { value: 'en-GB', label: '英式英語' },
  { value: 'en-AU', label: '澳式英語' },
]

function loadBoolean(key, fallback) {
  const raw = localStorage.getItem(key)
  if (raw == null) return fallback
  return raw === 'true'
}

function loadNumber(key, fallback) {
  const raw = localStorage.getItem(key)
  if (raw == null) return fallback
  const value = Number(raw)
  return Number.isFinite(value) ? value : fallback
}

function loadString(key, fallback) {
  return localStorage.getItem(key) || fallback
}

export default function SpeechSettingsPanel({ activeTrack = 'japanese' }) {
  const [open, setOpen] = useState(false)
  const [femalePreferred, setFemalePreferred] = useState(() => loadBoolean(STORAGE_KEYS.femalePreferred, true))
  const [rateJa, setRateJa] = useState(() => loadNumber(STORAGE_KEYS.rateJa, 0.82))
  const [rateEn, setRateEn] = useState(() => loadNumber(STORAGE_KEYS.rateEn, 0.88))
  const [englishRegion, setEnglishRegion] = useState(() => loadString(STORAGE_KEYS.englishRegion, 'en-US'))

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.femalePreferred, String(femalePreferred)) }, [femalePreferred])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.rateJa, String(rateJa)) }, [rateJa])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.rateEn, String(rateEn)) }, [rateEn])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.englishRegion, englishRegion) }, [englishRegion])

  const regionLabel = ENGLISH_REGIONS.find(r => r.value === englishRegion)?.label || englishRegion
  const isEnglish = activeTrack === 'english'

  return (
    <section className="speech-settings">
      <div className="speech-settings__bar">
        <button className="speech-settings__toggle" onClick={() => setOpen((v) => !v)}>
          {open ? '收起語音設定' : '語音設定'}
        </button>
        <div className="speech-settings__summary">
          <span>{femalePreferred ? '女聲優先' : '任意聲音'}</span>
          {isEnglish
            ? <span>語速 {rateEn.toFixed(2)} · {regionLabel}</span>
            : <span>語速 {rateJa.toFixed(2)}</span>
          }
        </div>
      </div>

      {open && (
        <div className="speech-settings__panel">
          <label className="speech-settings__option">
            <input
              type="checkbox"
              checked={femalePreferred}
              onChange={(e) => setFemalePreferred(e.target.checked)}
            />
            <span>優先使用女聲（如有）</span>
          </label>

          {isEnglish ? (
            <>
              <label className="speech-settings__slider">
                <span>英文語速</span>
                <input
                  type="range"
                  min="0.75"
                  max="1.1"
                  step="0.05"
                  value={rateEn}
                  onChange={(e) => setRateEn(Number(e.target.value))}
                />
                <strong>{rateEn.toFixed(2)}</strong>
              </label>

              <div className="speech-settings__region">
                <span>英文腔調</span>
                <div className="speech-settings__region-options">
                  {ENGLISH_REGIONS.map((r) => (
                    <button
                      key={r.value}
                      className={`speech-settings__region-btn ${englishRegion === r.value ? 'is-active' : ''}`}
                      onClick={() => setEnglishRegion(r.value)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <label className="speech-settings__slider">
              <span>日文語速</span>
              <input
                type="range"
                min="0.6"
                max="1.0"
                step="0.02"
                value={rateJa}
                onChange={(e) => setRateJa(Number(e.target.value))}
              />
              <strong>{rateJa.toFixed(2)}</strong>
            </label>
          )}
        </div>
      )}
    </section>
  )
}
