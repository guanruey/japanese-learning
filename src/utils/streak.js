export function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function computeStreak(dates, today) {
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
