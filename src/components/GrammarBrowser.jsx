import React, { useState, useMemo, useEffect } from 'react'
import { Search, Bookmark, Volume2, ChevronDown, ChevronUp, Sparkles, Filter } from 'lucide-react'
import FuriganaText from './FuriganaText'
import { speak } from '../utils/speech'

export default function GrammarBrowser({
  data = [],
  initialLevel = 'all',
  readingMode = 'furigana',
  savedIds = [],
  onToggleSave,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    setFilterLevel(initialLevel || 'all')
  }, [initialLevel])

  const filtered = useMemo(() => {
    let result = data || []

    if (filterLevel !== 'all') {
      result = result.filter((g) => g.level === filterLevel)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (g) =>
          (g.pattern || '').toLowerCase().includes(term) ||
          (g.reading || '').toLowerCase().includes(term) ||
          (g.meaning_zh || '').toLowerCase().includes(term) ||
          (g.example_ja || '').includes(searchTerm) ||
          (g.example_reading || '').includes(searchTerm)
      )
    }

    return result
  }, [data, searchTerm, filterLevel])

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋文法（例如：～ます、～ている、因為...）"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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

      {/* Results Meta Info */}
      <div className="flex justify-between items-center px-1 text-xs font-medium text-slate-500">
        <span>已為您找到 {filtered.length} 個文法句型</span>
        <span>提示：點擊卡片可展開解說與常見錯誤說明</span>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold">找不到符合條件的文法句型</p>
            <p className="text-xs">請試著變更搜尋關鍵字或選擇其他 JLPT 級別</p>
          </div>
        ) : (
          filtered.map((grammar) => {
            const isSaved = savedIds.includes(grammar.id)
            const isExpanded = expandedId === grammar.id

            return (
              <div
                key={grammar.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Main Header & Meaning */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                            grammar.level === 'N5'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          }`}
                        >
                          {grammar.level}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">#{grammar.id}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-jp text-slate-900 dark:text-slate-100 pt-1">
                        <FuriganaText text={grammar.pattern} reading={grammar.reading} mode={readingMode} />
                      </h3>
                    </div>

                    <button
                      onClick={() => onToggleSave?.(grammar.id)}
                      className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold ${
                        isSaved
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                      title={isSaved ? '已收藏' : '加入收藏'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span className="hidden sm:inline">{isSaved ? '已收藏' : '收藏'}</span>
                    </button>
                  </div>

                  {/* Meanings */}
                  <div className="flex flex-wrap gap-2 text-sm">
                    <div className="px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 font-medium mr-1 text-xs">中文：</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{grammar.meaning_zh}</span>
                    </div>

                    {grammar.meaning_en && (
                      <div className="px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                        <span className="text-slate-400 font-medium mr-1">EN:</span>
                        <span>{grammar.meaning_en}</span>
                      </div>
                    )}
                  </div>

                  {/* Primary Example Sentence */}
                  {grammar.example_ja && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-base font-medium font-jp text-slate-800 dark:text-slate-200">
                          <FuriganaText
                            text={grammar.example_ja}
                            reading={grammar.example_reading}
                            mode={readingMode}
                          />
                        </p>
                        {grammar.example_zh && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">{grammar.example_zh}</p>
                        )}
                      </div>

                      <button
                        onClick={() => speak(grammar.example_ja)}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 transition flex-shrink-0"
                        title="發音"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Expand / Collapse Details Bar */}
                <button
                  onClick={() => toggleExpand(grammar.id)}
                  className="w-full py-2 px-5 bg-slate-50/80 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  <span>{isExpanded ? '收起詳細說明與解析' : '展開觀看詳細文法說明與解說'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Expanded Content Drawer */}
                {isExpanded && (
                  <div className="p-5 bg-indigo-50/30 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-700 space-y-4 text-xs">
                    {grammar.explanation && (
                      <div className="space-y-1">
                        <h4 className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
                          文法接續與解說
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          {grammar.explanation}
                        </p>
                      </div>
                    )}

                    {grammar.common_mistakes && grammar.common_mistakes.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-indigo-100/50 dark:border-slate-800">
                        <h4 className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                          常見學習盲點與易錯處
                        </h4>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                          {grammar.common_mistakes.map((mistake, idx) => (
                            <li key={idx}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
