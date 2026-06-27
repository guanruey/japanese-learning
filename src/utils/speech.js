const FEMALE_HINTS = [
  'female',
  'woman',
  'girl',
  'samantha',
  'victoria',
  'karen',
  'moira',
  'allison',
  'ava',
  'susan',
  'zira',
  'aria',
  'sonya',
  'kyoko',
]

const STORAGE_KEYS = {
  femalePreferred: 'speech-female-preferred',
  rate: 'speech-rate',
}

function getSpeechPreferences() {
  const femalePreferredRaw = localStorage.getItem(STORAGE_KEYS.femalePreferred)
  const rateRaw = localStorage.getItem(STORAGE_KEYS.rate)
  const femalePreferred = femalePreferredRaw == null ? true : femalePreferredRaw === 'true'
  const parsedRate = Number(rateRaw)
  const rate = Number.isFinite(parsedRate) ? parsedRate : 0.9

  return { femalePreferred, rate }
}

function scoreVoice(voice, lang, femalePreferred) {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase()
  let score = 0

  if (voice.lang?.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2))) {
    score += 4
  }

  if (voice.default) {
    score += 1
  }

  if (femalePreferred && FEMALE_HINTS.some((hint) => name.includes(hint))) {
    score += 8
  }

  return score
}

function pickPreferredVoice(lang, femalePreferred) {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  return [...voices]
    .filter((voice) => voice.lang?.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2)))
    .sort((a, b) => scoreVoice(b, lang, femalePreferred) - scoreVoice(a, lang, femalePreferred))[0] || null
}

export const speak = (text, lang = 'ja-JP') => {
  if (!('speechSynthesis' in window)) {
    alert('您的瀏覽器不支援語音合成')
    return
  }

  window.speechSynthesis.cancel()

  const preferences = getSpeechPreferences()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = preferences.rate
  utterance.pitch = 1.08
  utterance.volume = 1

  const applyVoice = () => {
    const preferredVoice = pickPreferredVoice(lang, preferences.femalePreferred)
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }
    window.speechSynthesis.speak(utterance)
  }

  if (!window.speechSynthesis.getVoices().length) {
    window.speechSynthesis.onvoiceschanged = () => {
      applyVoice()
      window.speechSynthesis.onvoiceschanged = null
    }
    return
  }

  applyVoice()
}

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
