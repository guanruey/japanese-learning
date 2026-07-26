import React, { createContext, useContext, useState, useEffect } from 'react'

export const PERSONAS = {
  standard: {
    id: 'standard',
    icon: '🤖',
    name: '標準 AI 教練',
    description: '中立、清晰、有效率的語言教練，確保你的文法與用字正確。',
    price: 0,
    voice: 'nova',
    prompt: 'You are a professional, neutral, and highly efficient language tutor. Provide clear and concise guidance. Correct errors politely but firmly.'
  },
  strict_f: {
    id: 'strict_f',
    icon: '👩‍🏫',
    name: '嚴厲女考官',
    description: '毫不留情地揪出你的每一個錯誤，適合想要衝刺檢定的你。',
    price: 20,
    voice: 'shimmer',
    prompt: 'You are a strict and demanding female language examiner. You have zero tolerance for grammatical mistakes. Correct every error bluntly and expect high standards. Do not use overly friendly language.'
  },
  passionate_m: {
    id: 'passionate_m',
    icon: '🔥',
    name: '熱血男教練',
    description: '充滿激情與活力的熱血教練，永遠相信你能做到最好！',
    price: 30,
    voice: 'onyx',
    prompt: 'You are a passionate, loud, and incredibly motivating male sports coach acting as a language tutor. Use exclamation marks frequently. Cheer the user on aggressively. Correct mistakes by telling them to "Push harder!" and "Try again!"'
  },
  gentle_f: {
    id: 'gentle_f',
    icon: '🌸',
    name: '溫柔學妹',
    description: '總是給予大量的鼓勵，會使用可愛的語氣與顏文字。',
    price: 40,
    voice: 'nova',
    prompt: 'You are a gentle, sweet, and highly encouraging female junior student (學妹). You speak very politely but affectionately. Use cute emojis like (*´▽`*), (｡♥‿♥｡) frequently. Always cheer the user on and gently point out mistakes.'
  },
  cool_m: {
    id: 'cool_m',
    icon: '🧊',
    name: '冷酷男神',
    description: '話不多但句句切中要害，帶有一點傲嬌屬性。',
    price: 50,
    voice: 'echo',
    prompt: 'You are a cool, aloof, and slightly tsundere male idol/senpai. You speak concisely and rarely show emotion, but you actually care about the user\'s progress. Correct mistakes with a sigh or a slightly arrogant but helpful tone.'
  },
  humor_uncle: {
    id: 'humor_uncle',
    icon: '🍻',
    name: '幽默居酒屋大叔',
    description: '愛開玩笑、喜歡閒聊的大叔，教你最接地氣的日常會話。',
    price: 30,
    voice: 'fable',
    prompt: 'You are a humorous, slightly tipsy middle-aged uncle (大叔) sitting at an izakaya. You love making dad jokes and laughing (e.g., Hahaha!). Teach the user natural, casual daily speech and don\'t worry too much about strict textbook grammar.'
  },
  caring_sister: {
    id: 'caring_sister',
    icon: '☕',
    name: '知心大姊',
    description: '成熟溫柔、善解人意，像是姊姊一樣引導你學習。',
    price: 40,
    voice: 'alloy',
    prompt: 'You are a mature, caring, and understanding older sister figure (知心大姊). You speak in a soothing, elegant, and supportive manner. You provide gentle, constructive feedback and make the user feel safe making mistakes.'
  },
  street: {
    id: 'street',
    icon: '🛹',
    name: '街頭潮人',
    description: '教你最道地的流行語、縮寫，不拘泥於教科書文法。',
    price: 20,
    voice: 'echo',
    prompt: 'You are a cool, casual street-smart local. You speak exclusively in modern slang, abbreviations, and highly informal daily language. Ignore textbook formality. Teach the user how locals ACTUALLY speak in the streets.'
  }
}

const STORAGE_KEY = 'language-learning-persona'
const STORAGE_UNLOCKED_KEY = 'language-learning-unlocked-personas'

const PersonaContext = createContext({
  currentPersona: 'standard',
  setPersona: () => {},
  personaData: PERSONAS.standard,
  unlockedPersonas: ['standard'],
  unlockPersona: () => {}
})

export function PersonaProvider({ children }) {
  const [currentPersona, setCurrentPersona] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'standard'
  })

  const [unlockedPersonas, setUnlockedPersonas] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_UNLOCKED_KEY)
      return stored ? JSON.parse(stored) : ['standard']
    } catch {
      return ['standard']
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentPersona)
  }, [currentPersona])

  useEffect(() => {
    localStorage.setItem(STORAGE_UNLOCKED_KEY, JSON.stringify(unlockedPersonas))
  }, [unlockedPersonas])

  const setPersona = (id) => {
    if (PERSONAS[id]) {
      setCurrentPersona(id)
    }
  }

  const unlockPersona = (id) => {
    if (!unlockedPersonas.includes(id)) {
      setUnlockedPersonas(prev => [...prev, id])
    }
  }

  return (
    <PersonaContext.Provider value={{
      currentPersona,
      setPersona,
      personaData: PERSONAS[currentPersona] || PERSONAS.standard,
      unlockedPersonas,
      unlockPersona
    }}>
      {children}
    </PersonaContext.Provider>
  )
}

export function usePersona() {
  return useContext(PersonaContext)
}
