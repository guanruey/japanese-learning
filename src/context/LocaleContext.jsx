import React, { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEYS = {
  nativeLang: 'language-learning-native-lang',
  targetLang: 'language-learning-target-lang',
}

// UI Interface Translations
export const UI_TRANSLATIONS = {
  zh: {
    appName: '多語系學習平台',
    nativeLangLabel: '我的母語',
    targetLangLabel: '我想學習',
    zhLang: '繁體中文',
    jaLang: '日本語',
    enLang: 'English',
    dashboard: '儀表板',
    grammar: '文法學習',
    vocabulary: '核心單字',
    phrases: '生活片語',
    srs: '卡片測驗',
    saved: '我的收藏',
    proMember: 'VIP 會員',
    upgradePro: '升級 VIP',
    dailyPhrase: '每日一言',
    dueForReview: '待複習',
    startQuiz: '開始測驗',
    browseGrammar: '瀏覽文法庫',
    exploreVocab: '探索單字庫',
  },
  ja: {
    appName: '多言語学習プラットフォーム',
    nativeLangLabel: '母国語',
    targetLangLabel: '学習目標',
    zhLang: '中國語 (Chinese)',
    jaLang: '日本語 (Japanese)',
    enLang: '英語 (English)',
    dashboard: 'ダッシュボード',
    grammar: '文法学習',
    vocabulary: '核心単語',
    phrases: '日常会話',
    srs: 'カードテスト',
    saved: 'お気に入り',
    proMember: 'VIP 会員',
    upgradePro: 'VIPにアップグレード',
    dailyPhrase: '本日の名言',
    dueForReview: '復習対象',
    startQuiz: 'テストを開始',
    browseGrammar: '文法を閲覧',
    exploreVocab: '単語を探索',
  },
  en: {
    appName: 'Polyglot Learning Hub',
    nativeLangLabel: 'Native Language',
    targetLangLabel: 'I Want to Learn',
    zhLang: 'Chinese (中文)',
    jaLang: 'Japanese (日本語)',
    enLang: 'English',
    dashboard: 'Dashboard',
    grammar: 'Grammar',
    vocabulary: 'Vocabulary',
    phrases: 'Phrases',
    srs: 'Flashcards',
    saved: 'Saved Items',
    proMember: 'VIP Member',
    upgradePro: 'Upgrade VIP',
    dailyPhrase: 'Daily Phrase',
    dueForReview: 'Due',
    startQuiz: 'Start Flashcards',
    browseGrammar: 'Browse Grammar',
    exploreVocab: 'Explore Vocab',
  }
}

const LocaleContext = createContext({
  nativeLang: 'zh',
  setNativeLang: () => {},
  targetLang: 'ja',
  setTargetLang: () => {},
  availableTargetLangs: ['ja', 'en'],
  t: (key) => key,
})

export function LocaleProvider({ children }) {
  const [nativeLang, setNativeLangState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.nativeLang) || 'zh'
  })

  const [targetLang, setTargetLangState] = useState(() => {
    const savedTarget = localStorage.getItem(STORAGE_KEYS.targetLang) || 'ja'
    const savedNative = localStorage.getItem(STORAGE_KEYS.nativeLang) || 'zh'
    return savedTarget === savedNative ? (savedNative === 'zh' ? 'ja' : 'zh') : savedTarget
  })

  // Synchronous setNativeLang that prevents invalid targetLang states
  const setNativeLang = (newNative) => {
    setNativeLangState(newNative)
    localStorage.setItem(STORAGE_KEYS.nativeLang, newNative)
    if (targetLang === newNative) {
      const validTarget = newNative === 'zh' ? 'ja' : newNative === 'ja' ? 'en' : 'zh'
      setTargetLangState(validTarget)
      localStorage.setItem(STORAGE_KEYS.targetLang, validTarget)
    }
  }

  const setTargetLang = (newTarget) => {
    setTargetLangState(newTarget)
    localStorage.setItem(STORAGE_KEYS.targetLang, newTarget)
  }

  // Available target languages based on native language (for quick select)
  const availableTargetLangs = nativeLang === 'zh'
    ? ['ja', 'en', 'fr', 'ko']
    : nativeLang === 'ja'
    ? ['zh', 'en', 'fr', 'ko']
    : ['zh', 'ja', 'fr', 'ko']

  // Translation helper
  const t = (key) => {
    const dict = UI_TRANSLATIONS[nativeLang] || UI_TRANSLATIONS.zh
    return dict[key] || key
  }

  return (
    <LocaleContext.Provider
      value={{
        nativeLang,
        setNativeLang,
        targetLang,
        setTargetLang,
        availableTargetLangs,
        t,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
