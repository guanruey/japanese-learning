import { useEffect, useState } from 'react'
import './SpeechSettingsPanel.css'

const STORAGE_KEYS = {
  femalePreferred: 'speech-female-preferred',
  rate: 'speech-rate',
}

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

export default function SpeechSettingsPanel() {
  const [open, setOpen] = useState(false)
  const [femalePreferred, setFemalePreferred] = useState(() => loadBoolean(STORAGE_KEYS.femalePreferred, true))
  const [rate, setRate] = useState(() => loadNumber(STORAGE_KEYS.rate, 0.9))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.femalePreferred, String(femalePreferred))
  }, [femalePreferred])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.rate, String(rate))
  }, [rate])

  return (
    <section className="speech-settings">
      <div className="speech-settings__bar">
        <button className="speech-settings__toggle" onClick={() => setOpen((value) => !value)}>
          {open ? 'Hide Speech Settings' : 'Speech Settings'}
        </button>
        <div className="speech-settings__summary">
          <span>{femalePreferred ? 'Female voice preferred' : 'Any available voice'}</span>
          <span>Rate {rate.toFixed(2)}</span>
        </div>
      </div>

      {open && (
        <div className="speech-settings__panel">
          <label className="speech-settings__option">
            <input
              type="checkbox"
              checked={femalePreferred}
              onChange={(event) => setFemalePreferred(event.target.checked)}
            />
            <span>Prefer female voice when available</span>
          </label>

          <label className="speech-settings__slider">
            <span>Speech rate</span>
            <input
              type="range"
              min="0.75"
              max="1.15"
              step="0.05"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
            <strong>{rate.toFixed(2)}</strong>
          </label>
        </div>
      )}
    </section>
  )
}
