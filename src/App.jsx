import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import GrammarBrowser from './components/GrammarBrowser'
import VocabularyBrowser from './components/VocabularyBrowser'
import PhrasesLibrary from './components/PhrasesLibrary'
import EnglishLearningHub from './components/EnglishLearningHub'
import ProtectedContentStudio from './components/ProtectedContentStudio'
import ScenarioStudio from './components/ScenarioStudio'
import SpeechSettingsPanel from './components/SpeechSettingsPanel'
import DailyPhrase from './components/DailyPhrase'
import SiteMap from './components/SiteMap'
import { grammarReadings } from './data/generatedReadings'
import { grammarOverrides } from './data/grammarOverrides'
import { ENGLISH_TABS, englishExpressions, englishModuleSummaries, englishOverviewCards, englishReadingPassages, englishVocabularySets, englishWritingPoints } from './data/englishContent'
import './App.css'

const STORAGE_KEYS = {
  theme: 'theme',
  activeTrack: 'language-learning-active-track',
  japaneseTab: 'japanese-learning-active-tab',
  englishTab: 'english-learning-active-tab',
  scenarioLanguage: 'scenario-learning-language',
  scenarioCategory: 'scenario-learning-category',
  readingGuide: 'japanese-learning-reading-guide',
  grammarSaved: 'japanese-learning-saved-grammar',
  vocabularySaved: 'japanese-learning-saved-vocabulary',
  phrasesSaved: 'japanese-learning-saved-phrases',
}

const JAPANESE_TAB_LABELS = {
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
  const [activeTrack, setActiveTrack] = useState(() => localStorage.getItem(STORAGE_KEYS.activeTrack) || 'japanese')
  const [activeJapaneseTab, setActiveJapaneseTab] = useState(() => localStorage.getItem(STORAGE_KEYS.japaneseTab) || 'grammar')
  const [activeEnglishTab, setActiveEnglishTab] = useState(() => localStorage.getItem(STORAGE_KEYS.englishTab) || 'expressions')
  const [scenarioLanguage, setScenarioLanguage] = useState(() => localStorage.getItem(STORAGE_KEYS.scenarioLanguage) || 'japanese')
  const [scenarioCategory, setScenarioCategory] = useState(() => localStorage.getItem(STORAGE_KEYS.scenarioCategory) || 'daily')
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
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    loadGrammarData()
  }, [])

  const loadGrammarData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('grammar').select('*').order('level, id')
      if (error) throw error
      setGrammarData(mergeGrammarReadings(data || []))
    } catch (error) {
      console.error('Error loading grammar:', error)
      setGrammarData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeTrack, activeTrack)
  }, [activeTrack])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.japaneseTab, activeJapaneseTab)
  }, [activeJapaneseTab])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.englishTab, activeEnglishTab)
  }, [activeEnglishTab])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.scenarioLanguage, scenarioLanguage)
  }, [scenarioLanguage])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.scenarioCategory, scenarioCategory)
  }, [scenarioCategory])

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

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem(STORAGE_KEYS.theme, newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const cycleReadingGuide = () => {
    setReadingMode((current) => {
      if (current === 'furigana') return 'romaji'
      if (current === 'romaji') return 'off'
      return 'furigana'
    })
  }

  const openJapaneseQuickStart = (tab, config = {}) => {
    setActiveTrack('japanese')
    setActiveJapaneseTab(tab)
    if (config.grammarLevel) setGrammarFilter(config.grammarLevel)
    if (config.vocabularyLevel || config.vocabularyPos) {
      setVocabularyFilter({
        level: config.vocabularyLevel || 'all',
        pos: config.vocabularyPos || 'all',
      })
    }
    if (config.phraseCategory) setPhraseFilter(config.phraseCategory)
  }

  const openEnglishModule = (tab) => {
    setActiveTrack('english')
    setActiveEnglishTab(tab)
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

  const savedCount = savedGrammarIds.length + savedVocabularyIds.length + savedPhraseIds.length
  const continueLabel = JAPANESE_TAB_LABELS[activeJapaneseTab] || '學習'

  return (
    <div className={`app ${activeTrack === 'english' ? 'app--english' : ''}`}>
      <header className="app-header">
        <button className="theme-toggle" onClick={toggleTheme} title="Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="header-content">
          <div className="track-switch">
            <button
              className={`track-switch__button ${activeTrack === 'japanese' ? 'active' : ''}`}
              onClick={() => setActiveTrack('japanese')}
            >
              日本語學習
            </button>
            <button
              className={`track-switch__button ${activeTrack === 'english' ? 'active' : ''}`}
              onClick={() => setActiveTrack('english')}
            >
              English Lab
            </button>
            <button
              className={`track-switch__button ${activeTrack === 'studio' ? 'active' : ''}`}
              onClick={() => setActiveTrack('studio')}
            >
              Content Studio
            </button>
            <button
              className={`track-switch__button ${activeTrack === 'scenario' ? 'active' : ''}`}
              onClick={() => setActiveTrack('scenario')}
            >
              Scenario Studio
            </button>
          </div>

          {activeTrack === 'japanese' ? (
            <>
              <h1>日本語学習プラットフォーム</h1>
              <p>JLPT N5 / N4 の文法・語彙・会話を、毎回ちょっとずつ積み上げるための学習サイト</p>
              <div className="header-subline">
                <span>今日の入口: {continueLabel}</span>
                <span>保存済み: {savedCount} 件</span>
                <span>前回の続き: {continueLabel}</span>
              </div>
              <div className="header-actions">
                <button className="cta-button cta-button--primary" onClick={() => openJapaneseQuickStart('grammar', { grammarLevel: 'N5' })}>
                  今日 10 分で文法
                </button>
                <button className="cta-button" onClick={() => openJapaneseQuickStart('vocabulary', { vocabularyLevel: 'N5', vocabularyPos: 'noun' })}>
                  語彙から始める
                </button>
                <button className="cta-button" onClick={() => openJapaneseQuickStart('phrases', { phraseCategory: '問候' })}>
                  会話フレーズを練習
                </button>
                <button className="cta-button" onClick={cycleReadingGuide}>
                  読み方 {readingMode === 'furigana' ? 'ふりがな' : readingMode === 'romaji' ? 'ローマ字' : 'OFF'}
                </button>
              </div>
            </>
          ) : activeTrack === 'english' ? (
            <>
              <h1>English Lab</h1>
              <p>Upper-intermediate English training for precise vocabulary, mature expression, close reading, and stronger writing.</p>
              <div className="header-subline">
                <span>Target: GEPT 中高級</span>
                <span>Focus: Nuance, structure, and revision</span>
                <span>Current module: {ENGLISH_TABS[activeEnglishTab]}</span>
              </div>
              <div className="header-actions">
                <button className="cta-button cta-button--primary" onClick={() => openEnglishModule('expressions')}>
                  Start With Expressions
                </button>
                <button className="cta-button" onClick={() => openEnglishModule('writing')}>
                  Train Writing Upgrade
                </button>
                <button className="cta-button" onClick={() => openEnglishModule('vocabulary')}>
                  Review Collocations
                </button>
                <button className="cta-button" onClick={() => openEnglishModule('reading')}>
                  Open Reading Track
                </button>
              </div>
            </>
          ) : activeTrack === 'studio' ? (
            <>
              <h1>Content Studio</h1>
              <p>Upload source material, normalize it, and turn it into lesson-ready content for both Japanese and English modules.</p>
              <div className="header-subline">
                <span>Input: JSON, CSV, TXT, MD</span>
                <span>Output: normalized course content</span>
                <span>Works for both Japanese and English</span>
              </div>
              <div className="header-actions">
                <button className="cta-button cta-button--primary" onClick={() => setActiveTrack('studio')}>
                  Open Upload Studio
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Scenario Studio</h1>
              <p>Train real-world missions such as restaurants, stations, hotels, and service encounters through task flow, branch replies, and repair points.</p>
              <div className="header-subline">
                <span>Mode: task-based learning</span>
                <span>Language: {scenarioLanguage === 'japanese' ? '日本語' : 'English'}</span>
                <span>Category: {scenarioCategory === 'daily' ? '常用場景' : '公司商務'}</span>
              </div>
              <div className="header-actions">
                <button className={`cta-button ${scenarioLanguage === 'japanese' ? 'cta-button--primary' : ''}`} onClick={() => setScenarioLanguage('japanese')}>
                  日本語情境
                </button>
                <button className={`cta-button ${scenarioLanguage === 'english' ? 'cta-button--primary' : ''}`} onClick={() => setScenarioLanguage('english')}>
                  English Scenarios
                </button>
                <button className={`cta-button ${scenarioCategory === 'daily' ? 'cta-button--primary' : ''}`} onClick={() => setScenarioCategory('daily')}>
                  常用場景
                </button>
                <button className={`cta-button ${scenarioCategory === 'business' ? 'cta-button--primary' : ''}`} onClick={() => setScenarioCategory('business')}>
                  公司商務
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <SpeechSettingsPanel />

      {activeTrack === 'japanese' ? (
        <>
          <DailyPhrase
            savedPhraseIds={savedPhraseIds}
            readingMode={readingMode}
            onExplore={() => document.getElementById('sitemap-anchor')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <div id="sitemap-anchor">
            <SiteMap
              onNavigate={(track, tab) => {
                setActiveTrack(track)
                if (track === 'japanese' && tab) setActiveJapaneseTab(tab)
                if (track === 'english' && tab) setActiveEnglishTab(tab)
                setTimeout(() => document.querySelector('.app-main')?.scrollIntoView({ behavior: 'smooth' }), 50)
              }}
            />
          </div>

          <nav className="tab-navigation">
            <button
              className={`tab-btn ${activeJapaneseTab === 'grammar' ? 'active' : ''}`}
              onClick={() => setActiveJapaneseTab('grammar')}
            >
              文法
            </button>
            <button
              className={`tab-btn ${activeJapaneseTab === 'vocabulary' ? 'active' : ''}`}
              onClick={() => setActiveJapaneseTab('vocabulary')}
            >
              語彙
            </button>
            <button
              className={`tab-btn ${activeJapaneseTab === 'phrases' ? 'active' : ''}`}
              onClick={() => setActiveJapaneseTab('phrases')}
            >
              会話フレーズ
            </button>
          </nav>
        </>
      ) : null}

      <main className="app-main">
        {loading && activeTrack === 'japanese' && <div className="loading">読み込み中...</div>}

        {!loading && activeTrack === 'japanese' && activeJapaneseTab === 'grammar' && (
          <GrammarBrowser
            data={grammarData}
            initialLevel={grammarFilter}
            readingMode={readingMode}
            savedIds={savedGrammarIds}
            onToggleSave={toggleGrammarSaved}
          />
        )}

        {!loading && activeTrack === 'japanese' && activeJapaneseTab === 'vocabulary' && (
          <VocabularyBrowser
            initialLevel={vocabularyFilter.level}
            initialPos={vocabularyFilter.pos}
            readingMode={readingMode}
            savedIds={savedVocabularyIds}
            onToggleSave={toggleVocabularySaved}
          />
        )}

        {!loading && activeTrack === 'japanese' && activeJapaneseTab === 'phrases' && (
          <PhrasesLibrary
            initialCategory={phraseFilter}
            readingMode={readingMode}
            savedIds={savedPhraseIds}
            onToggleSave={togglePhraseSaved}
          />
        )}

        {activeTrack === 'english' && (
          <EnglishLearningHub
            activeTab={activeEnglishTab}
            tabs={ENGLISH_TABS}
            expressionsData={englishExpressions}
            readingData={englishReadingPassages}
            vocabularyData={englishVocabularySets}
            writingData={englishWritingPoints}
            overviewCards={englishOverviewCards}
            moduleSummaries={englishModuleSummaries}
            onSelectTab={openEnglishModule}
          />
        )}

        {activeTrack === 'studio' && <ProtectedContentStudio />}

        {activeTrack === 'scenario' && (
          <ScenarioStudio
            language={scenarioLanguage}
            activeCategory={scenarioCategory}
            onLanguageChange={setScenarioLanguage}
            onCategoryChange={setScenarioCategory}
          />
        )}
      </main>

      <footer className="app-footer">
        <p className="footer-platform">語言學習平台</p>
        <p>{activeTrack === 'english' ? '英文中高級訓練 | 精準詞彙、成熟表達、閱讀理解、寫作升級' : activeTrack === 'studio' ? '內容製作工作室 | 課程素材整理與正規化' : activeTrack === 'scenario' ? '任務式情境學習 | 餐廳、車站、飯店、商務等真實場景' : '日語學習 | 文法・語彙・會話，每次一點點累積'}</p>
        <p className="author-info">
          作者：<strong>Grant, K. J. Huang, Ph.D. 黃冠叡</strong>{' '}
          <a href="mailto:guanruey@gmail.com">聯絡</a>
        </p>
        <p className="copyright">
          © 2025-2026 語言學習平台。版權所有，保留所有權利。
          <br />
          此網站內容可免費用於學習，禁止未經授權的商業或其他使用。
        </p>
      </footer>
    </div>
  )
}
