import React, { useEffect, useState } from 'react'
import { Volume2, Sliders, ChevronDown, ChevronUp } from 'lucide-react'
import { useLocale } from '../context/LocaleContext'

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

export default function SpeechSettingsPanel() {
  const { targetLang } = useLocale()
  const [open, setOpen] = useState(false)
  const [femalePreferred, setFemalePreferred] = useState(() => loadBoolean(STORAGE_KEYS.femalePreferred, true))
  const [rateJa, setRateJa] = useState(() => loadNumber(STORAGE_KEYS.rateJa, 0.82))
  const [rateEn, setRateEn] = useState(() => loadNumber(STORAGE_KEYS.rateEn, 0.88))
  const [englishRegion, setEnglishRegion] = useState(() => loadString(STORAGE_KEYS.englishRegion, 'en-US'))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.femalePreferred, String(femalePreferred))
  }, [femalePreferred])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.rateJa, String(rateJa))
  }, [rateJa])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.rateEn, String(rateEn))
  }, [rateEn])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.englishRegion, englishRegion)
  }, [englishRegion])

  const regionLabel = ENGLISH_REGIONS.find((r) => r.value === englishRegion)?.label || englishRegion
  const isEnglish = targetLang === 'en'

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 mt-4 mb-2">
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden text-xs">
        {/* Header Bar */}
        <div className="px-4 py-3 flex items-center justify-between gap-3 bg-slate-50/50">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] font-bold hover:bg-[var(--primary-light)] transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{open ? '收起語音設定' : '語音發音設定'}</span>
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2 text-[var(--ink-3)] font-medium">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-2)]">
              {femalePreferred ? '女聲優先' : '預設發音'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-2)]">
              {isEnglish ? `語速 ${rateEn.toFixed(2)} · ${regionLabel}` : `語速 ${rateJa.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Collapsible Panel */}
        {open && (
          <div className="p-4 border-t border-[var(--border)] space-y-4 bg-[var(--surface)]">
            <label className="flex items-center gap-2 text-[var(--ink-2)] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={femalePreferred}
                onChange={(e) => setFemalePreferred(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-indigo-500"
              />
              <span>優先使用女聲朗讀（若裝置支援）</span>
            </label>

            {isEnglish ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--ink-3)] font-medium w-16">英文語速</span>
                  <input
                    type="range"
                    min="0.75"
                    max="1.1"
                    step="0.05"
                    value={rateEn}
                    onChange={(e) => setRateEn(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="font-bold text-[var(--ink)] w-8">{rateEn.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[var(--ink-3)] font-medium w-16">英文腔調</span>
                  <div className="flex gap-2">
                    {ENGLISH_REGIONS.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setEnglishRegion(r.value)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition ${ englishRegion === r.value ? 'bg-[var(--primary)] text-white shadow-sm' : 'bg-[var(--surface-2)] text-[var(--ink-2)] hover:bg-[var(--surface-3)]' }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-[var(--ink-3)] font-medium w-16">日文語速</span>
                <input
                  type="range"
                  min="0.6"
                  max="1.0"
                  step="0.02"
                  value={rateJa}
                  onChange={(e) => setRateJa(Number(e.target.value))}
                  className="flex-1 accent-indigo-600"
                />
                <span className="font-bold text-[var(--ink)] w-8">{rateJa.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
