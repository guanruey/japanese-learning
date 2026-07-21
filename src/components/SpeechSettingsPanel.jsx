import React, { useEffect, useState } from 'react'
import { Volume2, Sliders, ChevronDown, ChevronUp } from 'lucide-react'

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
  const isEnglish = activeTrack === 'english'

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 mt-4 mb-2">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden text-xs">
        {/* Header Bar */}
        <div className="px-4 py-3 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{open ? '收起語音設定' : '語音發音設定'}</span>
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700">
              {femalePreferred ? '女聲優先' : '預設發音'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700">
              {isEnglish ? `語速 ${rateEn.toFixed(2)} · ${regionLabel}` : `語速 ${rateJa.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Collapsible Panel */}
        {open && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-4 bg-white dark:bg-slate-800">
            <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={femalePreferred}
                onChange={(e) => setFemalePreferred(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>優先使用女聲朗讀（若裝置支援）</span>
            </label>

            {isEnglish ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-medium w-16">英文語速</span>
                  <input
                    type="range"
                    min="0.75"
                    max="1.1"
                    step="0.05"
                    value={rateEn}
                    onChange={(e) => setRateEn(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-100 w-8">{rateEn.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-medium w-16">英文腔調</span>
                  <div className="flex gap-2">
                    {ENGLISH_REGIONS.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setEnglishRegion(r.value)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                          englishRegion === r.value
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-medium w-16">日文語速</span>
                <input
                  type="range"
                  min="0.6"
                  max="1.0"
                  step="0.02"
                  value={rateJa}
                  onChange={(e) => setRateJa(Number(e.target.value))}
                  className="flex-1 accent-indigo-600"
                />
                <span className="font-bold text-slate-800 dark:text-slate-100 w-8">{rateJa.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
