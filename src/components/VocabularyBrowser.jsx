import React, { useState, useEffect, useMemo } from 'react'
import { Search, Bookmark, Volume2, Sparkles, Filter, Tag, Lock, ChevronDown } from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'
import { supabase } from '../supabase'
import { speak } from '../utils/speech'
import { vocabularyReadings } from '../data/generatedReadings'
import FuriganaText from './FuriganaText'

const POS_LABELS = {
  noun: '名詞',
  verb: '動詞',
  'i-adjective': 'い形容詞',
  'na-adjective': 'な形容詞',
  adverb: '副詞',
  particle: '助詞',
  expression: '慣用句',
  conjunction: '連接詞',
  counter: '量詞',
}

function mergeVocabularyReadings(rows = []) {
  return rows.map((row) => {
    const fallback = vocabularyReadings[row.id] || {}
    return {
      ...row,
      example_reading: row.example_reading || fallback.example_reading || null,
    }
  })
}

export default function VocabularyBrowser({
  initialLevel = 'all',
  initialPos = 'all',
  readingMode = 'furigana',
  savedIds = [],
  onToggleSave,
}) {
  const { isPro, openPaywall } = useSubscription()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterPos, setFilterPos] = useState('all')
  const [filterTag, setFilterTag] = useState('all')
  const [isListOpen, setIsListOpen] = useState(false)


  useEffect(() => {
    loadVocabulary()
  }, [])

  useEffect(() => {
    setFilterLevel(initialLevel || 'all')
  }, [initialLevel])

  useEffect(() => {
    setFilterPos(initialPos || 'all')
  }, [initialPos])

  const loadVocabulary = async () => {
    try {
      const { data: rows, error } = await supabase.from('vocabulary').select('*').order('level, id')
      if (error) throw error
      setData(mergeVocabularyReadings(rows || []))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let result = data
    if (filterLevel !== 'all') result = result.filter((v) => v.level === filterLevel)
    if (filterPos !== 'all') result = result.filter((v) => v.pos === filterPos)
    if (filterTag !== 'all') {
      result = result.filter((v) => (v.theme_tags || []).includes(filterTag) || (v.meaning_zh || '').includes(filterTag))
    }
    if (searchTerm) {
      const t = searchTerm.toLowerCase()
      result = result.filter(
        (v) =>
          (v.kanji || '').toLowerCase().includes(t) ||
          (v.reading || '').includes(searchTerm) ||
          (v.meaning_zh || '').includes(searchTerm) ||
          (v.meaning_en || '').toLowerCase().includes(t) ||
          (v.example_reading || '').includes(searchTerm)
      )
    }
    return result
  }, [data, searchTerm, filterLevel, filterPos, filterTag])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Sparkles className="w-8 h-8 text-[var(--primary)] animate-spin" />
        <p className="text-sm font-semibold text-[var(--ink-3)]">正在獲取核心單字庫...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Search and Filter Panel */}
      <div className="bg-[var(--surface)] rounded-2xl p-4 sm:p-6 shadow-sm border border-[var(--border)] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-3)]" />
          <input
            type="text"
            placeholder="搜尋單字（假名、漢字或中文意義）"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Theme and Level Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Tag className="w-4 h-4 text-[var(--ink-3)] hidden sm:block" />
          {['all', '飲食', '交通', '時間', '動物', '顏色'].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${ filterTag === tag ? 'bg-purple-600 text-white shadow-sm' : 'bg-[var(--surface-2)] text-[var(--ink-2)] hover:bg-[var(--surface-3)]' }`}
            >
              {tag === 'all' ? '全部主題' : tag}
            </button>
          ))}
          <div className="h-4 w-px bg-[var(--surface-3)] mx-1" />
          {['all', 'N5', 'N4', 'N3', 'N2'].map((lvl) => {
            const isLocked = !isPro && lvl !== 'all' && lvl !== 'N5'
            return (
              <button
                key={lvl}
                onClick={() => {
                  if (isLocked) {
                    openPaywall()
                  } else {
                    setFilterLevel(lvl)
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 flex items-center gap-1.5 ${ filterLevel === lvl ? 'bg-[var(--primary)] text-white shadow-sm' : isLocked ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900/60' : 'bg-[var(--surface-2)] text-[var(--ink-2)] hover:bg-[var(--surface-3)]' }`}
              >
                {lvl === 'all' ? '全部級別' : lvl}
                {isLocked && <Lock size={12} className="text-amber-400" />}
              </button>
            )
          })}
        </div>
      </div>


      {/* Results Header */}
      <div className="flex justify-between items-center px-1 text-xs font-medium text-[var(--ink-3)]">
        <span>共有 {filtered.length} 個相關單字</span>
        <span>提示：點擊右側喇叭按鈕可聆聽日籍語音發音</span>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-[var(--surface)] rounded-2xl p-12 text-center border border-[var(--border)] text-[var(--ink-3)] space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-[var(--ink-3)]" />
            <p className="font-semibold">未找到匹配的單字</p>
          </div>
        ) : (
          filtered.slice(0, isListOpen ? filtered.length : 3).map((vocab) => {
            const isSaved = savedIds.includes(vocab.id)
            return (
              <div
                key={vocab.id}
                className="apple-card p-6 flex flex-col justify-between space-y-4"
              >
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${ vocab.level === 'N5' ? 'badge-jlpt-n5' : vocab.level === 'N4' ? 'badge-jlpt-n4' : vocab.level === 'N3' ? 'badge-jlpt-n3' : vocab.level === 'N2' ? 'badge-jlpt-n2' : 'badge-jlpt-n1' }`}
                      >
                        {vocab.level}
                      </span>

                      {vocab.pos && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--surface-2)] text-[var(--ink-2)]">
                          {POS_LABELS[vocab.pos] || vocab.pos}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleSave && onToggleSave(vocab.id)}
                      className={`p-2 rounded-xl transition ${ isSaved ? 'text-amber-500 bg-amber-50 ' : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]' }`}
                    >
                      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Giant Main Word */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div>
                      <div className="text-3xl sm:text-4xl font-black font-jp text-[var(--ink)] tracking-tight">
                        <FuriganaText text={vocab.japanese || vocab.word} mode={readingMode} />
                      </div>
                      <p className="text-lg font-bold text-[var(--primary)] mt-1">
                        {vocab.meaning}
                      </p>
                    </div>

                    <button
                      onClick={() => speak(vocab.japanese || vocab.word)}
                      className="w-12 h-12 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25 active:scale-95 transition"
                      title="朗讀發音"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Example Sentence */}
                {vocab.example_ja && (
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-[var(--border)] space-y-1 text-xs">
                    <p className="font-bold font-jp text-[var(--ink)]">
                      <FuriganaText text={vocab.example_ja} reading={vocab.example_reading} mode={readingMode} />
                    </p>
                    {vocab.example_zh && <p className="text-[var(--ink-3)] font-medium">{vocab.example_zh}</p>}
                  </div>
                )}
              </div>
            )
          })
        )}

      </div>
      {filtered.length > 3 && (
        <button
          onClick={() => setIsListOpen(!isListOpen)}
          className="w-full flex items-center justify-center gap-2 py-4 mt-2 text-[var(--ink-2)] bg-[var(--surface)] border border-[var(--border)] rounded-xl transition-all"
        >
          <span className="font-bold">{isListOpen ? '收起單字' : `顯示更多單字 (${filtered.length - 3})`}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isListOpen ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  )
}
