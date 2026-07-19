import { useState } from 'react'
import { fallbackPhrases } from '../data/phrases'
import { speak } from '../utils/speech'
import { getTodayStr, computeStreak } from '../utils/streak'
import FuriganaText from './FuriganaText'
import './CheckInBoard.css'

const PROGRESS_KEY = 'checkin-board-progress-v1'
const DATES_KEY = 'checkin-board-dates-v1'
const STEPS = ['單字／唸讀', '跟讀', '實戰造句']
const DOT_WINDOW_DAYS = 30

const CATEGORIES = (() => {
  const order = []
  const map = {}
  fallbackPhrases.forEach((p) => {
    if (!map[p.category]) {
      map[p.category] = []
      order.push(p.category)
    }
    map[p.category].push(p)
  })
  return order.map((category) => ({ category, phrases: map[category] }))
})()

const TOTAL_STEPS = fallbackPhrases.length * STEPS.length

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}
  } catch {
    return {}
  }
}

function loadDates() {
  try {
    return JSON.parse(localStorage.getItem(DATES_KEY)) || []
  } catch {
    return []
  }
}

function lastNDays(n) {
  const days = []
  const cur = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(cur)
    d.setDate(cur.getDate() - i)
    days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  }
  return days
}

export default function CheckInBoard({ readingMode = 'furigana' }) {
  const [progress, setProgress] = useState(loadProgress)
  const [dates, setDates] = useState(loadDates)

  const today = getTodayStr()
  const streak = computeStreak(dates, today)
  const completedSteps = Object.values(progress).reduce(
    (sum, steps) => sum + steps.filter(Boolean).length,
    0
  )
  const percent = Math.round((completedSteps / TOTAL_STEPS) * 100)
  const dotDays = lastNDays(DOT_WINDOW_DAYS)
  const dateSet = new Set(dates)

  const toggleStep = (phraseId, stepIndex) => {
    setProgress((current) => {
      const currentSteps = current[phraseId] || [false, false, false]
      const nextSteps = currentSteps.map((v, i) => (i === stepIndex ? !v : v))
      const next = { ...current, [phraseId]: nextSteps }
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next))
      return next
    })

    if (!dateSet.has(today)) {
      const nextDates = [...dates, today]
      setDates(nextDates)
      localStorage.setItem(DATES_KEY, JSON.stringify(nextDates))
    }
  }

  const scrollToCategory = (category) => {
    document.getElementById(`checkin-category-${category}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="checkin-board">
      <div className="checkin-board__summary">
        <div className="checkin-board__stat">
          <span className="checkin-board__stat-label">連續天數</span>
          <span className="checkin-board__stat-value">🔥 {streak}</span>
        </div>
        <div className="checkin-board__stat">
          <span className="checkin-board__stat-label">總進度</span>
          <span className="checkin-board__stat-value">{percent}%</span>
          <span className="checkin-board__stat-sub">{completedSteps} / {TOTAL_STEPS}</span>
        </div>
        <div className="checkin-board__progress-bar">
          <div className="checkin-board__progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="checkin-board__dots">
        <span className="checkin-board__dots-label">最近 {DOT_WINDOW_DAYS} 天</span>
        <div className="checkin-board__dots-grid">
          {dotDays.map((d) => (
            <span
              key={d}
              className={`checkin-board__dot ${dateSet.has(d) ? 'checkin-board__dot--active' : ''} ${d === today ? 'checkin-board__dot--today' : ''}`}
              title={d}
            />
          ))}
        </div>
      </div>

      <div className="checkin-board__categories">
        {CATEGORIES.map(({ category, phrases }) => {
          const catCompleted = phrases.reduce(
            (sum, p) => sum + (progress[p.id] || []).filter(Boolean).length,
            0
          )
          const catTotal = phrases.length * STEPS.length
          return (
            <button
              key={category}
              className="checkin-board__cat-card"
              onClick={() => scrollToCategory(category)}
            >
              <span className="checkin-board__cat-title">{category}</span>
              <span className="checkin-board__cat-progress">{catCompleted} / {catTotal}</span>
            </button>
          )
        })}
      </div>

      {CATEGORIES.map(({ category, phrases }) => (
        <section key={category} id={`checkin-category-${category}`} className="checkin-board__section">
          <h3 className="checkin-board__section-title">{category}</h3>
          <div className="checkin-board__cards">
            {phrases.map((phrase) => {
              const steps = progress[phrase.id] || [false, false, false]
              return (
                <div key={phrase.id} className="checkin-board__card">
                  <div className="checkin-board__card-header">
                    <button className="checkin-board__speak" onClick={() => speak(phrase.phrase_ja)} title="朗讀">
                      🔊
                    </button>
                    <div className="checkin-board__card-text">
                      <p className="checkin-board__ja">
                        <FuriganaText text={phrase.phrase_ja} reading={phrase.reading} mode={readingMode} />
                      </p>
                      <p className="checkin-board__zh">{phrase.meaning_zh}</p>
                      {phrase.example && (
                        <p className="checkin-board__example">
                          <FuriganaText text={phrase.example} reading={phrase.example_reading} mode={readingMode} />
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="checkin-board__steps">
                    {STEPS.map((label, i) => (
                      <label key={label} className="checkin-board__step">
                        <input
                          type="checkbox"
                          checked={steps[i]}
                          onChange={() => toggleStep(phrase.id, i)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
