import React, { useState, useMemo, useEffect } from 'react'
import { Search, Bookmark, Volume2, ChevronDown, ChevronUp, Sparkles, Filter, Lock } from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'
import FuriganaText from './FuriganaText'
import { speak } from '../utils/speech'

export default function GrammarBrowser({
  data = [],
  initialLevel = 'all',
  readingMode = 'furigana',
  savedIds = [],
  onToggleSave,
}) {
  const { isPro, openPaywall } = useSubscription()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [isListOpen, setIsListOpen] = useState(false)

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
      <div className="bg-[var(--surface)] rounded-2xl p-4 sm:p-6 shadow-sm border border-[var(--border)] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-3)]" />
          <input
            type="text"
            placeholder="搜尋文法（例如：～ます、～ている、因為...）"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--ink)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-[var(--ink-3)] hidden sm:block" />
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 flex items-center gap-1.5 ${
                  filterLevel === lvl
                    ? 'bg-[var(--primary)] text-[var(--surface)] shadow-sm'
                    : isLocked
                    ? 'bg-[var(--badge-bg)] text-[var(--ink-3)]'
                    : 'bg-[var(--surface-2)] text-[var(--ink-2)] hover:text-[var(--ink)]'
                }`}
              >
                {lvl === 'all' ? '全部級別' : lvl}
                {isLocked && <Lock size={12} className="text-amber-400" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex justify-between items-center px-1 text-xs font-medium text-[var(--ink-2)]">
        <span>已為您找到 {filtered.length} 個文法句型</span>
        <span>提示：點擊卡片可展開解說與常見錯誤說明</span>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[var(--surface)] rounded-2xl p-12 text-center border border-[var(--border)] text-[var(--ink-3)] space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-[var(--ink-3)]" />
            <p className="font-semibold">找不到符合條件的文法句型</p>
            <p className="text-xs">請試著變更搜尋關鍵字或選擇其他 JLPT 級別</p>
          </div>
        ) : (
          filtered.slice(0, isListOpen ? filtered.length : 3).map((grammar) => {
            const isSaved = savedIds.includes(grammar.id)
            const isExpanded = expandedId === grammar.id

            return (
              <div
                key={grammar.id}
                className="card-pop transition overflow-hidden"
              >
                {/* Main Header & Meaning */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black ${
                            grammar.level === 'N5'
                              ? 'badge-jlpt-n5'
                              : grammar.level === 'N4'
                              ? 'badge-jlpt-n4'
                              : grammar.level === 'N3'
                              ? 'badge-jlpt-n3'
                              : grammar.level === 'N2'
                              ? 'badge-jlpt-n2'
                              : 'badge-jlpt-n1'
                          }`}
                        >
                          {grammar.level}
                        </span>
                        <span className="text-xs text-[var(--ink-3)] font-mono">#{grammar.id}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-jp text-[var(--ink)] pt-1">
                        <FuriganaText text={grammar.pattern} reading={grammar.reading} mode={readingMode} />
                      </h3>
                    </div>

                    <button
                      onClick={() => onToggleSave?.(grammar.id)}
                      className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold ${
                        isSaved
                          ? 'bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-dim)]'
                          : 'bg-[var(--surface-2)] text-[var(--ink-2)] hover:text-[var(--ink)]'
                      }`}
                      title={isSaved ? '已收藏' : '加入收藏'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[var(--primary)] text-[var(--primary)]' : ''}`} />
                      <span className="hidden sm:inline">{isSaved ? '已收藏' : '收藏'}</span>
                    </button>
                  </div>

                  {/* Meanings */}
                  <div className="flex flex-wrap gap-2 text-sm">
                    <div className="px-3 py-1 rounded-xl bg-[var(--badge-bg)]">
                      <span className="text-[var(--ink-3)] font-medium mr-1 text-xs">中文：</span>
                      <span className="font-bold text-[var(--ink)]">{grammar.meaning_zh}</span>
                    </div>

                    {grammar.meaning_en && (
                      <div className="px-3 py-1 rounded-xl bg-[var(--badge-bg)] text-[var(--ink-2)] text-xs">
                        <span className="text-[var(--ink-3)] font-medium mr-1">EN:</span>
                        <span>{grammar.meaning_en}</span>
                      </div>
                    )}
                  </div>

                  {/* Primary Example Sentence */}
                  {grammar.example_ja && (
                    <div className="p-4 rounded-xl bg-[var(--surface-2)] flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-base font-medium font-jp text-[var(--ink)]">
                          <FuriganaText
                            text={grammar.example_ja}
                            reading={grammar.example_reading}
                            mode={readingMode}
                          />
                        </p>
                        {grammar.example_zh && (
                          <p className="text-xs text-[var(--ink-2)]">{grammar.example_zh}</p>
                        )}
                      </div>

                      <button
                        onClick={() => speak(grammar.example_ja)}
                        className="p-2 rounded-lg bg-[var(--surface)] shadow-sm text-[var(--ink-2)] hover:text-[var(--primary)] hover:scale-105 transition flex-shrink-0"
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
                  className="w-full py-2 px-5 bg-[var(--surface-2)] text-[var(--ink-2)] hover:text-[var(--primary)] border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold transition"
                >
                  <span>{isExpanded ? '收起詳細說明與解析' : '展開觀看詳細文法說明與解說'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Expanded Content Drawer */}
                {isExpanded && (
                  <div className="p-5 bg-[var(--surface)] border-t border-[var(--border)] space-y-4 text-xs">
                    {grammar.explanation && (
                      <div className="space-y-1">
                        <h4 className="font-bold text-[var(--primary)] uppercase tracking-wide">
                          文法接續與解說
                        </h4>
                        <p className="text-[var(--ink)] leading-relaxed font-sans">
                          {grammar.explanation}
                        </p>
                      </div>
                    )}

                    {grammar.common_mistakes && grammar.common_mistakes.length > 0 && (
                      <div className="p-4 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/20 space-y-2">
                        <h4 className="font-extrabold text-[#DC2626] uppercase tracking-wide flex items-center gap-1.5 text-xs">
                          <span>⚠️ Babbel 學習盲點雷達：常見易錯處</span>
                        </h4>
                        <ul className="list-disc list-inside text-[#DC2626] font-medium space-y-1">
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
      {filtered.length > 3 && (
        <button
          onClick={() => setIsListOpen(!isListOpen)}
          className="w-full flex items-center justify-center gap-2 py-4 mt-2 text-[var(--ink-2)] bg-[var(--surface)] border border-[var(--border)] rounded-xl transition-all"
        >
          <span className="font-bold">{isListOpen ? '收起文法' : `顯示更多文法 (${filtered.length - 3})`}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isListOpen ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  )
}
