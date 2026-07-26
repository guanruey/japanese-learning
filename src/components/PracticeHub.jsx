import React, { useState } from 'react'
import { Sparkles, Headphones, Mic } from 'lucide-react'
import VocabularyBrowser from './VocabularyBrowser'
import GrammarBrowser from './GrammarBrowser'
import PhrasesLibrary from './PhrasesLibrary'
import { useSavedItemsStore } from '../stores/savedItemsStore'
import { useAppShellStore } from '../stores/appShellStore'
import PracticeSession from './PracticeSession'

export default function PracticeHub({
  vocabData = [],
  grammarData = [],
}) {
  const { readingMode, setActiveTab } = useAppShellStore()
  const { 
    savedVocabularyIds, toggleVocabularySaved,
    savedGrammarIds, toggleGrammarSaved,
    savedPhraseIds, togglePhraseSaved
  } = useSavedItemsStore()

  const [practiceMode, setPracticeMode] = useState('flashcards') // 'flashcards' | 'listening' | 'pronunciation'
  const [subType, setSubType] = useState('vocab') // 'vocab' | 'grammar' | 'phrases'
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionItems, setSessionItems] = useState([])

  const startPractice = () => {
    // randomly pick 10 items based on subType
    let pool = []
    if (subType === 'vocab') pool = vocabData || []
    if (subType === 'grammar') pool = grammarData || []
    if (subType === 'phrases') pool = [] // TODO: phrases data
    
    // shuffle and pick 10
    const shuffled = [...pool].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 10)
    
    if (selected.length === 0) {
      alert('目前沒有足夠的資料可以練習！')
      return
    }
    
    setSessionItems(selected)
    setIsSessionActive(true)
  }

  if (isSessionActive) {
    return (
      <PracticeSession 
        mode={practiceMode} 
        subType={subType} 
        items={sessionItems}
        onComplete={() => setIsSessionActive(false)}
        onExit={() => setIsSessionActive(false)}
      />
    )
  }

  return (
    <div className="min-h-full flex flex-col max-w-md mx-auto w-full gap-8 animate-fadeIn">
      {/* Quiet Premium 3-Mode Selector Card */}
      <div className="qp-card p-5 sm:p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="type-32 text-[var(--ink)] font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[var(--primary)]" />
            <span>鍛鍊中心</span>
          </h2>
          <p className="type-13 text-[#78716C]">專注單一技能，減壓高效率學習</p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => setPracticeMode('flashcards')}
            className={`min-h-[48px] rounded-2xl flex flex-col items-center justify-center gap-1 transition ${ practiceMode === 'flashcards' ? 'bg-[var(--primary)] text-white shadow-sm' : 'bg-[var(--input-bg)] text-[var(--ink-2)]' }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="type-13 font-bold">閃卡</span>
          </button>

          <button
            onClick={() => setPracticeMode('listening')}
            className={`min-h-[48px] rounded-2xl flex flex-col items-center justify-center gap-1 transition ${ practiceMode === 'listening' ? 'bg-[var(--primary)] text-white shadow-sm' : 'bg-[var(--input-bg)] text-[var(--ink-2)]' }`}
          >
            <Headphones className="w-5 h-5" />
            <span className="type-13 font-bold">聽力</span>
          </button>

          <button
            onClick={() => setPracticeMode('pronunciation')}
            className={`min-h-[48px] rounded-2xl flex flex-col items-center justify-center gap-1 transition ${ practiceMode === 'pronunciation' ? 'bg-[var(--primary)] text-white shadow-sm' : 'bg-[var(--input-bg)] text-[var(--ink-2)]' }`}
          >
            <Mic className="w-5 h-5" />
            <span className="type-13 font-bold">發音</span>
          </button>
        </div>

        {/* Sub-Category Pills */}
        <div className="flex items-center gap-2 pt-4">
          <button
            onClick={() => setSubType('vocab')}
            className={`min-h-[48px] px-5 rounded-full type-16 transition flex items-center justify-center ${ subType === 'vocab' ? 'bg-[var(--primary)] text-white font-bold shadow-sm' : 'bg-transparent text-[var(--ink-2)] font-bold' }`}
          >
            核心單字
          </button>
          <button
            onClick={() => setSubType('grammar')}
            className={`min-h-[48px] px-5 rounded-full type-16 transition flex items-center justify-center ${ subType === 'grammar' ? 'bg-[var(--primary)] text-white font-bold shadow-sm' : 'bg-transparent text-[var(--ink-2)] font-bold' }`}
          >
            文法句型
          </button>
          <button
            onClick={() => setSubType('phrases')}
            className={`min-h-[48px] px-5 rounded-full type-16 transition flex items-center justify-center ${ subType === 'phrases' ? 'bg-[var(--primary)] text-white font-bold shadow-sm' : 'bg-transparent text-[var(--ink-2)] font-bold' }`}
          >
            生活片語
          </button>
        </div>

        <button 
          onClick={startPractice}
          className="w-full mt-4 py-3.5 bg-[var(--primary)] text-white font-bold rounded-2xl hover:opacity-90 transition shadow-sm"
        >
          開始練習 (抽出 10 題)
        </button>
      </div>

      {/* Dynamic Content */}
      {subType === 'vocab' && (
        <VocabularyBrowser
          readingMode={readingMode}
          savedIds={savedVocabularyIds}
          onToggleSave={toggleVocabularySaved}
          onNavigate={setActiveTab}
        />
      )}

      {subType === 'grammar' && (
        <GrammarBrowser
          data={grammarData}
          readingMode={readingMode}
          savedIds={savedGrammarIds}
          onToggleSave={toggleGrammarSaved}
          onNavigate={setActiveTab}
        />
      )}

      {subType === 'phrases' && (
        <PhrasesLibrary
          readingMode={readingMode}
          savedIds={savedPhraseIds}
          onToggleSave={togglePhraseSaved}
          onNavigate={setActiveTab}
        />
      )}
    </div>
  )
}
