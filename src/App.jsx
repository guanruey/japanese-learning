import { useState, useEffect } from 'react'
import { supabase, fetchDueReviews } from './supabase'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import FlashcardStudySession from './components/FlashcardStudySession'
import GrammarBrowser from './components/GrammarBrowser'
import VocabularyBrowser from './components/VocabularyBrowser'
import PhrasesLibrary from './components/PhrasesLibrary'
import EnglishLearningHub from './components/EnglishLearningHub'
import ProtectedContentStudio from './components/ProtectedContentStudio'
import ScenarioStudio from './components/ScenarioStudio'
import SpeechSettingsPanel from './components/SpeechSettingsPanel'
import CheckInBoard from './components/CheckInBoard'
import SavedReview from './components/SavedReview'
import { grammarReadings } from './data/generatedReadings'
import { grammarOverrides } from './data/grammarOverrides'
import { ENGLISH_TABS, englishExpressions, englishModuleSummaries, englishOverviewCards, englishReadingPassages, englishVocabularySets, englishWritingPoints } from './data/englishContent'
import './App.css'

const STORAGE_KEYS = {
  theme: 'theme',
  activeTrack: 'language-learning-active-track',
  japaneseTab: 'japanese-learning-active-tab',
  englishTab: 'english-learning-active-tab',
  readingGuide: 'japanese-learning-reading-guide',
  grammarSaved: 'japanese-learning-saved-grammar',
  vocabularySaved: 'japanese-learning-saved-vocabulary',
  phrasesSaved: 'japanese-learning-saved-phrases',
  englishExpressionsSaved: 'english-saved-expressions',
  englishVocabSaved: 'english-saved-vocabulary',
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
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem(STORAGE_KEYS.japaneseTab) || 'dashboard')
  const [activeEnglishTab, setActiveEnglishTab] = useState(() => localStorage.getItem(STORAGE_KEYS.englishTab) || 'expressions')
  const [grammarData, setGrammarData] = useState([])
  const [vocabData, setVocabData] = useState([])
  const [srsDueItems, setSrsDueItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('light')
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem(STORAGE_KEYS.readingGuide) || 'furigana')
  const [savedGrammarIds, setSavedGrammarIds] = useState(() => loadStoredValue(STORAGE_KEYS.grammarSaved, []))
  const [savedVocabularyIds, setSavedVocabularyIds] = useState(() => loadStoredValue(STORAGE_KEYS.vocabularySaved, []))
  const [savedPhraseIds, setSavedPhraseIds] = useState(() => loadStoredValue(STORAGE_KEYS.phrasesSaved, []))
  const [savedEnglishExpressionIds, setSavedEnglishExpressionIds] = useState(() => loadStoredValue(STORAGE_KEYS.englishExpressionsSaved, []))
  const [savedEnglishVocabIds, setSavedEnglishVocabIds] = useState(() => loadStoredValue(STORAGE_KEYS.englishVocabSaved, []))

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [{ data: gRows }, { data: vRows }, dueProgress] = await Promise.all([
        supabase.from('grammar').select('*').order('level, id'),
        supabase.from('vocabulary').select('*').order('level, id'),
        fetchDueReviews('local_user'),
      ])
      
      const mergedGrammar = mergeGrammarReadings(gRows || [])
      setGrammarData(mergedGrammar)
      setVocabData(vRows || [])

      // Map due progress items to full vocab/grammar objects
      const vocabMap = new Map((vRows || []).map((v) => [v.id, v]))
      const grammarMap = new Map(mergedGrammar.map((g) => [g.id, g]))

      const dueItems = (dueProgress || [])
        .map((p) => {
          const rawItem = p.item_type === 'vocabulary' ? vocabMap.get(p.item_id) : grammarMap.get(p.item_id)
          return rawItem ? { ...rawItem, ...p } : null
        })
        .filter(Boolean)

      setSrsDueItems(dueItems)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeTrack, activeTrack)
  }, [activeTrack])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.japaneseTab, activeTab)
  }, [activeTab])

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

  const toggleGrammarSaved = (id) => setSavedGrammarIds((c) => toggleStoredId(c, id))
  const toggleVocabularySaved = (id) => setSavedVocabularyIds((c) => toggleStoredId(c, id))
  const togglePhraseSaved = (id) => setSavedPhraseIds((c) => toggleStoredId(c, id))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex">
      {/* Navigation Sidebar & Bottom Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        dueCount={srsDueItems.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}

        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTrack(activeTrack === 'japanese' ? 'english' : 'japanese')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            >
              切換賽道：{activeTrack === 'japanese' ? '日本語学習' : 'English Lab'}
            </button>

            <button
              onClick={cycleReadingGuide}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition"
            >
              發音標註：{readingMode === 'furigana' ? 'ふりがな' : readingMode === 'romaji' ? 'ローマ字' : 'OFF'}
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            JLPT N5 / N4 互動學習平台
          </div>
        </header>

        <SpeechSettingsPanel activeTrack={activeTrack} />

        {/* Dynamic Main Body */}
        <main className="flex-1 p-4 sm:p-8">
          {loading && (
            <div className="text-center py-20 text-slate-400 text-sm font-semibold animate-pulse">
              載入學習資源中...
            </div>
          )}

          {!loading && activeTrack === 'japanese' && (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  grammarList={grammarData}
                  vocabList={vocabData}
                  onNavigate={setActiveTab}
                  dueCount={srsDueItems.length}
                  furiganaMode={readingMode}
                />
              )}

              {activeTab === 'grammar' && (
                <GrammarBrowser
                  data={grammarData}
                  readingMode={readingMode}
                  savedIds={savedGrammarIds}
                  onToggleSave={toggleGrammarSaved}
                />
              )}

              {activeTab === 'vocabulary' && (
                <VocabularyBrowser
                  readingMode={readingMode}
                  savedIds={savedVocabularyIds}
                  onToggleSave={toggleVocabularySaved}
                />
              )}

              {activeTab === 'phrases' && (
                <PhrasesLibrary
                  readingMode={readingMode}
                  savedIds={savedPhraseIds}
                  onToggleSave={togglePhraseSaved}
                />
              )}

              {activeTab === 'srs' && (
                <FlashcardStudySession
                  items={srsDueItems.length > 0 ? srsDueItems : vocabData.slice(0, 10)}
                  furiganaMode={readingMode}
                  onFinish={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'saved' && (
                <SavedReview
                  grammarData={grammarData}
                  savedGrammarIds={savedGrammarIds}
                  savedVocabularyIds={savedVocabularyIds}
                  savedPhraseIds={savedPhraseIds}
                  readingMode={readingMode}
                  onToggleGrammarSave={toggleGrammarSaved}
                  onToggleVocabSave={toggleVocabularySaved}
                  onTogglePhraseSave={togglePhraseSaved}
                  englishExpressionsData={englishExpressions}
                  englishVocabData={englishVocabularySets}
                  savedEnglishExpressionIds={savedEnglishExpressionIds}
                  savedEnglishVocabIds={savedEnglishVocabIds}
                />
              )}
            </>
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
              onSelectTab={setActiveEnglishTab}
              savedExpressionIds={savedEnglishExpressionIds}
              savedVocabIds={savedEnglishVocabIds}
            />
          )}
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-8 text-center text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-500">日語學習平台 · JLPT N5 / N4 Pro</p>
          <p>© 2025-2026 Grant, K. J. Huang, Ph.D. 黃冠叡. 版權所有。</p>
        </footer>
      </div>
    </div>
  )
}

