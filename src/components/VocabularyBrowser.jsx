import React, { useState, useEffect, useMemo } from 'react'
import { Search, Bookmark, Volume2, Sparkles, Filter, Tag } from 'lucide-react'
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
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterPos, setFilterPos] = useState('all')

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
  }, [data, searchTerm, filterLevel, filterPos])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Sparkles className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">正在獲取核心單字庫...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Search and Filter Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋單字（假名、漢字或中文意義）"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {['all', 'N5', 'N4'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                filterLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {lvl === 'all' ? '全部級別' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center px-1 text-xs font-medium text-slate-500">
        <span>共有 {filtered.length} 個相關單字</span>
        <span>提示：點擊右側喇叭按鈕可聆聽日籍語音發音</span>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold">未找到匹配的單字</p>
          </div>
        ) : (
          filtered.map((vocab) => {
            const isSaved = savedIds.includes(vocab.id)
            return (
              <div
                key={vocab.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
              >
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                          vocab.level === 'N5'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {vocab.level}
                      </span>

                      {vocab.pos && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-xs font-semibold">
                          {POS_LABELS[vocab.pos] || vocab.pos}
                        </span>
                      )}

                      {vocab.pitch_accent && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-semibold">
                          音調 [{vocab.pitch_accent}]
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleSave?.(vocab.id)}
                      className={`p-2 rounded-xl transition ${
                        isSaved
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-400 hover:text-slate-700'
                      }`}
                      title={isSaved ? '已收藏' : '加入收藏'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Main Word & Reading */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <div className="text-2xl font-extrabold font-jp text-slate-900 dark:text-slate-100">
                        {vocab.kanji || vocab.reading}
                      </div>
                      {vocab.kanji && <div className="text-xs font-mono text-slate-400">{vocab.reading}</div>}
                    </div>

                    <button
                      onClick={() => speak(vocab.kanji || vocab.reading)}
                      className="p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:scale-105 transition shadow-sm"
                      title="朗讀發音"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Meanings */}
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {vocab.meaning_zh}
                    {vocab.meaning_en && (
                      <span className="text-xs font-normal text-slate-400 ml-2">({vocab.meaning_en})</span>
                    )}
                  </div>
                </div>

                {/* Example Sentence */}
                {vocab.example_ja && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                    <p className="font-medium font-jp text-slate-800 dark:text-slate-200">
                      <FuriganaText text={vocab.example_ja} reading={vocab.example_reading} mode={readingMode} />
                    </p>
                    {vocab.example_zh && <p className="text-slate-500">{vocab.example_zh}</p>}
                  </div>
                )}
              </div>
            )
          })
        )}

      </div>
    </div>
  )
}
