import { useState } from 'react'
import { fallbackPhrases } from '../data/phrases'
import { speak } from '../utils/speech'
import FuriganaText from './FuriganaText'
import './DailyPhrase.css'

const STARTER_PHRASES = fallbackPhrases.filter(p => p.starter)
const STORAGE_KEY = 'daily-phrase-dates'

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function dateHash(dateStr, length) {
  let h = 0
  for (let i = 0; i < dateStr.length; i++) h = (h * 31 + dateStr.charCodeAt(i)) >>> 0
  return h % length
}

function computeStreak(dates, today) {
  const set = new Set(dates)
  if (!set.has(today)) return 0
  let streak = 0
  let cur = new Date(today + 'T12:00:00')
  while (true) {
    const s = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`
    if (!set.has(s)) break
    streak++
    cur.setDate(cur.getDate() - 1)
  }
  return streak
}

export default function DailyPhrase({ savedPhraseIds = [], readingMode = 'furigana', onExplore }) {
  const [dates, setDates] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
  })
  const [open, setOpen] = useState(false)

  const today = getTodayStr()
  const doneToday = dates.includes(today)
  const streak = computeStreak(dates, today)

  let pool = STARTER_PHRASES
  if (savedPhraseIds.length > 0) {
    const saved = fallbackPhrases.filter(p =>
      savedPhraseIds.includes(p.id) || savedPhraseIds.includes(String(p.id))
    )
    if (saved.length > 0) pool = saved
  }
  const phrase = pool[dateHash(today, pool.length)]

  const markDone = () => {
    if (doneToday) return
    const next = [...dates, today]
    setDates(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setOpen(false)
  }

  if (!phrase) return null

  // Completed state — compact bar
  if (doneToday) {
    return (
      <div className="daily-phrase daily-phrase--done daily-phrase--compact">
        <span className="daily-phrase__done-mark">✓</span>
        <span className="daily-phrase__done-text">
          今日任務完成
          {streak >= 2 && <span className="daily-phrase__streak"> · 連續 {streak} 天</span>}
        </span>
        <button className="daily-phrase__explore-btn" onClick={onExplore}>
          繼續探索 ↓
        </button>
      </div>
    )
  }

  // Idle state — start button
  if (!open) {
    return (
      <div className="daily-phrase daily-phrase--idle">
        <div className="daily-phrase__idle-left">
          <span className="daily-phrase__label">今日任務</span>
          {streak > 0 && <span className="daily-phrase__streak">連續 {streak} 天</span>}
          <p className="daily-phrase__tagline">每天開啟一句，就是學習的開始</p>
        </div>
        <button className="daily-phrase__start-btn" onClick={() => setOpen(true)}>
          開始今日學習 →
        </button>
      </div>
    )
  }

  // Open state — phrase + done button
  return (
    <div className="daily-phrase daily-phrase--open">
      <div className="daily-phrase__header">
        <div className="daily-phrase__header-left">
          <span className="daily-phrase__label">今日任務</span>
          {streak > 0 && <span className="daily-phrase__streak">連續 {streak} 天</span>}
        </div>
        <button className="daily-phrase__close" onClick={() => setOpen(false)} aria-label="關閉">×</button>
      </div>

      <div className="daily-phrase__body">
        <button className="daily-phrase__speak" onClick={() => speak(phrase.phrase_ja)} title="朗讀">
          🔊
        </button>
        <div className="daily-phrase__text">
          <p className="daily-phrase__ja">
            <FuriganaText text={phrase.phrase_ja} reading={phrase.reading} mode={readingMode} />
          </p>
          <p className="daily-phrase__zh">{phrase.meaning_zh}</p>
          {phrase.context && <p className="daily-phrase__ctx">{phrase.context}</p>}
          {phrase.example && (
            <p className="daily-phrase__example">
              <FuriganaText text={phrase.example} reading={phrase.example_reading} mode={readingMode} />
            </p>
          )}
        </div>
      </div>

      <div className="daily-phrase__footer">
        <button className="daily-phrase__done-btn" onClick={markDone}>
          今天學完了
        </button>
        <span className="daily-phrase__hint">完成後可繼續探索網站內容</span>
      </div>
    </div>
  )
}
