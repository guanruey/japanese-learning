import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import GrammarBrowser from './components/GrammarBrowser'
import VocabularyBrowser from './components/VocabularyBrowser'
import { grammarReadings } from './data/generatedReadings'
import { grammarOverrides } from './data/grammarOverrides'
import PhrasesLibrary from './components/PhrasesLibrary'
import './App.css'

const STORAGE_KEYS = {
  theme: 'theme',
  activeTab: 'japanese-learning-active-tab',
  readingGuide: 'japanese-learning-reading-guide',
  grammarSaved: 'japanese-learning-saved-grammar',
  vocabularySaved: 'japanese-learning-saved-vocabulary',
  phrasesSaved: 'japanese-learning-saved-phrases',
}

const TAB_LABELS = {
  grammar: '文法',
  vocabulary: '語彙',
  phrases: '会話フレーズ',
}

function loadStoredValue(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function toggleStoredId(current, id) {
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
}

function mergeGrammarReadings(rows = []) {
  return rows.map((row) => {
    const fallback = grammarReadings[row.id] || {}
    const override = grammarOverrides[row.id] || {}
    return {
      ...row,
      ...override,
      reading: override.reading || row.reading || fallback.reading || null,
      example_reading: override.example_reading || row.example_reading || fallback.example_reading || null,
    }
  })
}

export default function App() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem(STORAGE_KEYS.activeTab) || 'grammar')
  const [grammarData, setGrammarData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('light')
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem(STORAGE_KEYS.readingGuide) || 'furigana')
  const [grammarFilter, setGrammarFilter] = useState('all')
  const [vocabularyFilter, setVocabularyFilter] = useState({ level: 'all', pos: 'all' })
  const [phraseFilter, setPhraseFilter] = useState('全部')
  const [savedGrammarIds, setSavedGrammarIds] = useState(() => loadStoredValue(STORAGE_KEYS.grammarSaved, []))
  const [savedVocabularyIds, setSavedVocabularyIds] = useState(() => loadStoredValue(STORAGE_KEYS.vocabularySaved, []))
  const [savedPhraseIds, setSavedPhraseIds] = useState(() => loadStoredValue(STORAGE_KEYS.phrasesSaved, []))

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    loadGrammarData()
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const cycleReadingGuide = () => {
    setReadingMode((current) => {
      if (current === 'furigana') return 'romaji'
      if (current === 'romaji') return 'off'
      return 'furigana'
    })
  }

  const loadGrammarData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('grammar')
        .select('*')
        .order('level, id')

      if (error) throw error
      setGrammarData(mergeGrammarReadings(data || []))
    } catch (error) {
      console.error('Error loading grammar:', error)
      // 使用本地備用資料
      setGrammarData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeTab, activeTab)
  }, [activeTab])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.readingGuide, readingMode)
  }, [readingMode])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.grammarSaved, JSON.stringify(savedGrammarIds))
  }, [savedGrammarIds])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.vocabularySaved, JSON.stringify(savedVocabularyIds))
  }, [savedVocabularyIds])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.phrasesSaved, JSON.stringify(savedPhraseIds))
  }, [savedPhraseIds])

  const savedCount = savedGrammarIds.length + savedVocabularyIds.length + savedPhraseIds.length
  const continueLabel = TAB_LABELS[activeTab] || '學習'

  const openQuickStart = (tab, config = {}) => {
    setActiveTab(tab)
    if (config.grammarLevel) setGrammarFilter(config.grammarLevel)
    if (config.vocabularyLevel || config.vocabularyPos) {
      setVocabularyFilter({
        level: config.vocabularyLevel || 'all',
        pos: config.vocabularyPos || 'all',
      })
    }
    if (config.phraseCategory) setPhraseFilter(config.phraseCategory)
  }

  const toggleGrammarSaved = (id) => {
    setSavedGrammarIds((current) => toggleStoredId(current, id))
  }

  const toggleVocabularySaved = (id) => {
    setSavedVocabularyIds((current) => toggleStoredId(current, id))
  }

  const togglePhraseSaved = (id) => {
    setSavedPhraseIds((current) => toggleStoredId(current, id))
  }

  return (
    <div className="app">
      <header className="app-header">
        <button className="theme-toggle" onClick={toggleTheme} title="テーマ切り替え">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="header-content">
          <h1>📚 日本語学習プラットフォーム</h1>
          <p>JLPT N5 / N4 の文法・語彙・会話を、毎回ちょっとずつ積み上げるための学習サイト</p>
          <div className="header-subline">
            <span>今日の入口: {continueLabel}</span>
            <span>保存済み: {savedCount} 件</span>
            <span>前回の続き: {continueLabel}</span>
          </div>
          <div className="header-actions">
            <button className="cta-button cta-button--primary" onClick={() => openQuickStart('grammar', { grammarLevel: 'N5' })}>
              今日 10 分で文法
            </button>
            <button className="cta-button" onClick={() => openQuickStart('vocabulary', { vocabularyLevel: 'N5', vocabularyPos: 'noun' })}>
              語彙から始める
            </button>
            <button className="cta-button" onClick={() => openQuickStart('phrases', { phraseCategory: '問候' })}>
              会話フレーズを練習
            </button>
            <button className="cta-button" onClick={cycleReadingGuide}>
              読み方 {readingMode === 'furigana' ? 'ふりがな' : readingMode === 'romaji' ? 'ローマ字' : 'OFF'}
            </button>
          </div>
        </div>
      </header>

      <section className="study-launch">
        <article className="study-launch__card study-launch__card--primary">
          <p className="study-launch__eyebrow">今日のおすすめ</p>
          <h2>まずは N5 の文法から 3 件だけ見てみる</h2>
          <p>最初から全部覚えなくて大丈夫です。1 セクションだけ見て、例文を 1 つ読むところから始めましょう。</p>
          <button className="study-launch__button" onClick={() => openQuickStart('grammar', { grammarLevel: 'N5' })}>
            文法へ
          </button>
        </article>
        <article className="study-launch__card">
          <p className="study-launch__eyebrow">前回の続き</p>
          <h2>{continueLabel} を開く</h2>
          <p>前回見ていた分野をそのまま開けます。学習を「毎回ゼロから」にしないのが続けるコツです。</p>
          <button
            className="study-launch__button"
            onClick={() =>
              openQuickStart(activeTab, {
                grammarLevel: grammarFilter,
                vocabularyLevel: vocabularyFilter.level,
                vocabularyPos: vocabularyFilter.pos,
                phraseCategory: phraseFilter,
              })
            }
          >
            続ける
          </button>
        </article>
        <article className="study-launch__card">
          <p className="study-launch__eyebrow">保存した項目</p>
          <h2>{savedCount} 件を復習候補に保存済み</h2>
          <p>気になった文法・語彙・フレーズを保存しておくと、次回はそこから復習できます。</p>
          <button className="study-launch__button" onClick={() => setActiveTab('grammar')}>
            保存しながら読む
          </button>
        </article>
      </section>

      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'grammar' ? 'active' : ''}`}
          onClick={() => setActiveTab('grammar')}
        >
          📝 文法
        </button>
        <button
          className={`tab-btn ${activeTab === 'vocabulary' ? 'active' : ''}`}
          onClick={() => setActiveTab('vocabulary')}
        >
          📖 語彙
        </button>
        <button
          className={`tab-btn ${activeTab === 'phrases' ? 'active' : ''}`}
          onClick={() => setActiveTab('phrases')}
        >
          💬 会話フレーズ
        </button>
      </nav>

      <main className="app-main">
        {loading && <div className="loading">読み込み中...</div>}

        {!loading && activeTab === 'grammar' && (
          <GrammarBrowser
            data={grammarData}
            initialLevel={grammarFilter}
            readingMode={readingMode}
            savedIds={savedGrammarIds}
            onToggleSave={toggleGrammarSaved}
          />
        )}

        {!loading && activeTab === 'vocabulary' && (
          <VocabularyBrowser
            initialLevel={vocabularyFilter.level}
            initialPos={vocabularyFilter.pos}
            readingMode={readingMode}
            savedIds={savedVocabularyIds}
            onToggleSave={toggleVocabularySaved}
          />
        )}

        {!loading && activeTab === 'phrases' && (
          <PhrasesLibrary
            initialCategory={phraseFilter}
            readingMode={readingMode}
            savedIds={savedPhraseIds}
            onToggleSave={togglePhraseSaved}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>💡 会話学習に最適化 | 深く、速く、効率よく</p>
        <p className="author-info">
          作者：<strong>Grant, K. J. Huang, Ph.D. 黃冠叡</strong>
          {' '}
          <a href="mailto:guanruey@gmail.com">📧 聯絡</a>
        </p>
        <p className="copyright">
          © 2025-2026 日本語学習プラットフォーム. All rights reserved.
          <br />
          版權所有，保留所有權利。此網站內容可免費用於學習，禁止未經授權的商業或其他使用。
        </p>
      </footer>
    </div>
  )
}
