import { getDisplayReading } from '../utils/reading'

export default function FuriganaText({ text, reading, mode = 'furigana', className = '' }) {
  if (!text) return null

  const displayReading = getDisplayReading(reading, mode)

  if (mode === 'off' || !displayReading) {
    return <span className={className}>{text}</span>
  }

  if (mode === 'romaji') {
    return (
      <ruby className={className}>
        <rb>{text}</rb>
        <rt>{displayReading}</rt>
      </ruby>
    )
  }

  return (
    <ruby className={className}>
      <rb>{text}</rb>
      <rt>{displayReading}</rt>
    </ruby>
  )
}
