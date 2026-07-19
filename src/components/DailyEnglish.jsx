import { useState } from 'react'
import { englishExpressions } from '../data/englishContent'
import { speak } from '../utils/speech'
import './DailyEnglish.css'

const STORAGE_KEY = 'daily-english-dates'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function computeStreak(dates) {
  const sorted = [...new Set(dates)].sort().reverse()
  if (!sorted.length) return 0
  let streak = 0
  let check = todayStr()
  for (const d of sorted) {
    if (d === check) {
      streak++
      const prev = new Date(check)
      prev.setDate(prev.getDate() - 1)
      check = prev.toISOString().slice(0, 10)
    } else {
      break
    }
  }
  return streak
}

function pickByDate(pool) {
  const today = todayStr()
  let h = 0
  for (let i = 0; i < today.length; i++) {
    h = (h * 31 + today.charCodeAt(i)) >>> 0
  }
  return pool[h % pool.length]
}

export default function DailyEnglish() {
  const [open, setOpen] = useState(false)
  const [dates, setDates] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
    catch { return [] }
  })

  const today = todayStr()
  const doneToday = dates.includes(today)
  const streak = computeStreak(dates)
  const expression = pickByDate(englishExpressions)

  const markDone = () => {
    if (doneToday) return
    const next = [...dates, today]
    setDates(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  if (doneToday) {
    return (
      <div className="daily-english daily-english--compact">
        <span className="daily-english__done-mark">✓</span>
        <span className="daily-english__done-text">
          今日英文學習完成 · {streak > 1 ? `連續 ${streak} 天` : '開始累積連續天數'}
        </span>
      </div>
    )
  }

  if (!open) {
    return (
      <div className="daily-english daily-english--idle">
        <div className="daily-english__idle-left">
          <span className="daily-english__label">今日 English</span>
          {streak > 0 && <span className="daily-english__streak">連續 {streak} 天</span>}
          <p className="daily-english__tagline">每天一個句型，一分鐘掌握精準英文表達</p>
        </div>
        <button className="daily-english__start-btn" onClick={() => setOpen(true)}>
          開始今日學習 →
        </button>
      </div>
    )
  }

  return (
    <div className="daily-english daily-english--open">
      <div className="daily-english__header">
        <div className="daily-english__header-left">
          <span className="daily-english__label">今日 English</span>
          {streak > 0 && <span className="daily-english__streak">連續 {streak} 天</span>}
        </div>
        <button className="daily-english__close" onClick={() => setOpen(false)}>✕</button>
      </div>

      <div className="daily-english__meta">
        <span className="daily-english__category">{expression.category}</span>
        <span className="daily-english__register">{expression.register}</span>
      </div>

      <div className="daily-english__body">
        <button
          className="daily-english__speak"
          onClick={() => speak(expression.exampleSentence, 'en-US')}
          title="Play pronunciation"
          aria-label="Play pronunciation"
        >
          🔊
        </button>
        <div className="daily-english__text">
          <p className="daily-english__pattern">{expression.pattern}</p>
          <p className="daily-english__explanation">{expression.explanationZh}</p>
          <p className="daily-english__example">{expression.exampleSentence}</p>
          <p className="daily-english__example-zh">{expression.exampleZh}</p>
        </div>
      </div>

      {expression.commonErrors?.length > 0 && (
        <div className="daily-english__errors">
          <span className="daily-english__errors-label">常見錯誤</span>
          <ul>
            {expression.commonErrors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="daily-english__footer">
        <button className="daily-english__done-btn" onClick={markDone}>
          ✓ 學完了
        </button>
        <span className="daily-english__hint">標記完成後繼續探索 English Lab</span>
      </div>
    </div>
  )
}
