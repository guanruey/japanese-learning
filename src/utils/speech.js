const FEMALE_HINTS = [
  'female', 'woman', 'girl',
  'samantha', 'victoria', 'karen', 'moira', 'allison', 'ava', 'susan',
  'zira', 'aria', 'sonya', 'kyoko', 'tessa', 'jenny', 'sonia', 'nathalie',
]

const STORAGE_KEYS = {
  femalePreferred: 'speech-female-preferred',
  rateJa: 'speech-rate-ja',
  rateEn: 'speech-rate-en',
  englishRegion: 'speech-english-region',
}

// Eagerly trigger voice loading so they're ready by first button click
if ('speechSynthesis' in window) {
  const prime = () => {
    window.speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = prime
  }
  prime()
}

function getSpeechPreferences() {
  const femalePreferredRaw = localStorage.getItem(STORAGE_KEYS.femalePreferred)
  const rateJaRaw = localStorage.getItem(STORAGE_KEYS.rateJa)
  const rateEnRaw = localStorage.getItem(STORAGE_KEYS.rateEn)
  const englishRegion = localStorage.getItem(STORAGE_KEYS.englishRegion) || 'en-US'

  const femalePreferred = femalePreferredRaw == null ? true : femalePreferredRaw === 'true'
  const rateJa = Number.isFinite(Number(rateJaRaw)) ? Number(rateJaRaw) : 0.82
  const rateEn = Number.isFinite(Number(rateEnRaw)) ? Number(rateEnRaw) : 0.88

  return { femalePreferred, rateJa, rateEn, englishRegion }
}

function scoreVoice(voice, lang, femalePreferred, englishRegion) {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase()
  const voiceLang = (voice.lang || '').toLowerCase()
  let score = 0

  const isEnglish = lang.toLowerCase().startsWith('en')

  if (isEnglish) {
    // Prefer the chosen English region exactly
    const preferred = englishRegion.toLowerCase()
    if (voiceLang === preferred) score += 8
    else if (voiceLang.startsWith('en')) score += 4
  } else {
    if (voiceLang.startsWith(lang.toLowerCase().slice(0, 2))) score += 4
  }

  if (voice.default) score += 1

  if (femalePreferred && FEMALE_HINTS.some((hint) => name.includes(hint))) {
    score += 6
  }

  return score
}

function pickPreferredVoice(lang, femalePreferred, englishRegion) {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const langPrefix = lang.toLowerCase().slice(0, 2)
  const candidates = voices.filter((v) => (v.lang || '').toLowerCase().startsWith(langPrefix))

  if (!candidates.length) return null

  return [...candidates].sort(
    (a, b) => scoreVoice(b, lang, femalePreferred, englishRegion) - scoreVoice(a, lang, femalePreferred, englishRegion)
  )[0]
}

export const speak = (text, lang = 'ja-JP') => {
  if (!('speechSynthesis' in window)) {
    alert('您的瀏覽器不支援語音合成')
    return
  }

  // iOS: resume first if paused, then cancel only if actively speaking
  if (window.speechSynthesis.paused) window.speechSynthesis.resume()
  if (window.speechSynthesis.speaking) window.speechSynthesis.cancel()

  const preferences = getSpeechPreferences()
  const isJapanese = lang.toLowerCase().startsWith('ja')

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = isJapanese ? preferences.rateJa : preferences.rateEn
  utterance.pitch = isJapanese ? 1.05 : 1.0
  utterance.volume = 1

  // Set voice synchronously — iOS requires speak() to stay in the gesture callback chain
  const preferred = pickPreferredVoice(lang, preferences.femalePreferred, preferences.englishRegion)
  if (preferred) utterance.voice = preferred

  window.speechSynthesis.speak(utterance)
}

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

export { STORAGE_KEYS as SPEECH_STORAGE_KEYS }
