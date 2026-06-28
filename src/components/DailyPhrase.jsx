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

export default function DailyPhrase({ savedPhraseIds = [], readingMode = 'furigana' }) {
  const [dates, setDates] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
  })

  const today = getTodayStr()
  const doneToday = dates.includes(today)
  const streak = computeStreak(dates, today)

  // Prefer saved phrases; fall back to starter phrases
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
  }

  if (!phrase) return null

  return (
    <div className={`daily-phrase${doneToday ? ' daily-phrase--done' : ''}`}>
      <div className="daily-phrase__header">
        <span className="daily-phrase__label">今日一句</span>
        {streak > 0 && <span className="daily-phrase__streak">連續 {streak} 天</span>}
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
        </div>
      </div>

      <div className="daily-phrase__footer">
        <button
          className={`daily-phrase__btn${doneToday ? ' is-done' : ''}`}
          onClick={markDone}
          disabled={doneToday}
        >
          {doneToday ? '✓ 今天學完了' : '今天學完了'}
        </button>
        {doneToday && (
          <span className="daily-phrase__note">
            {streak >= 2 ? `連續 ${streak} 天，繼續保持！` : '第一天打卡，明天繼續。'}
          </span>
        )}
      </div>
    </div>
  )
}
