import React from 'react'
import { Flame, PlayCircle, BookOpen, Sparkles, Volume2, ArrowRight } from 'lucide-react'
import { speak } from '../utils/speech'
import FuriganaText from './FuriganaText'
import MemoryAnalyticsChart from './MemoryAnalyticsChart'

export default function Dashboard({
  grammarList = [],
  vocabList = [],
  onNavigate = () => {},
  streakDays = 5,
  dueCount = 0,
  furiganaMode = 'furigana',
}) {
  const n5GrammarCount = grammarList.filter((g) => g.level === 'N5').length || 60
  const n4GrammarCount = grammarList.filter((g) => g.level === 'N4').length || 50
  const totalVocabCount = vocabList.length || 430

  // Featured phrase of the day
  const dailyPhrase = {
    japanese: '今日[きょう]も 一生懸命[いっしょうけんめい] 頑張[がんば]りましょう！',
    meaning: '今天也一起努力加油吧！',
    romaji: 'Kyou mo isshoukenmei ganbarimashou!',
  }

  const speakPhrase = () => {
    speak('今日も一生懸命頑張りましょう！', 'ja-JP')
  }

  return (
    <div className="space-y-8 max-w-md mx-auto pb-24 pt-4 px-1">
      {/* Speak AI / Apple Single Hero Focus Card */}
      <div className="apple-card p-8 space-y-6 relative overflow-hidden">
        {/* Top Flame Streak Pill */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D97706]/10 text-[#D97706] font-extrabold type-body">
            <Flame className="w-4 h-4 text-[#D97706] fill-[#D97706] animate-pulse" />
            <span>連續 {streakDays} 天學習中</span>
          </div>

          {dueCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-[var(--danger)]/10 text-[var(--danger)] font-black type-body">
              {dueCount} 個待複習
            </span>
          )}
        </div>

        {/* Unified Apple Typography */}
        <div className="space-y-2">
          <h2 className="type-hero text-[var(--ink)]">
            今日學習目標
          </h2>
          <p className="type-title text-[var(--ink-2)]">
            用科學化 SRS 記憶法，輕鬆鞏固日語
          </p>
        </div>

        {/* Giant Single Action Button */}
        <button
          onClick={() => onNavigate('srs')}
          className="w-full h-15 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-dim)] text-white font-black text-base flex items-center justify-center gap-3 shadow-[var(--shadow-sm)] active:scale-95 transition-all"
        >
          <PlayCircle className="w-6 h-6 text-white" />
          <span>開始 5 分鐘學習測驗</span>
        </button>

        {/* 3 Clean Quick Navigation Pills */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <button
            onClick={() => onNavigate('grammar')}
            className="p-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] text-center transition"
          >
            <div className="text-xs font-black text-[var(--ink)]">N5 文法</div>
            <div className="text-[10px] font-bold text-[var(--ink-3)] mt-0.5">{n5GrammarCount} 句</div>
          </button>

          <button
            onClick={() => onNavigate('grammar')}
            className="p-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] text-center transition"
          >
            <div className="text-xs font-black text-[var(--ink)]">N4 文法</div>
            <div className="text-[10px] font-bold text-[var(--ink-3)] mt-0.5">{n4GrammarCount} 句</div>
          </button>

          <button
            onClick={() => onNavigate('vocabulary')}
            className="p-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] text-center transition"
          >
            <div className="text-xs font-black text-[var(--ink)]">核心單字</div>
            <div className="text-[10px] font-bold text-[var(--ink-3)] mt-0.5">{totalVocabCount} 字</div>
          </button>
        </div>
      </div>

      {/* Daily Phrase Card - Minimalist Glass Card */}
      <div className="apple-card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--primary)] font-extrabold text-xs">
            <Sparkles className="w-4 h-4 fill-[var(--primary)]" />
            <span>每日日語一言</span>
          </div>
          <button
            onClick={speakPhrase}
            className="w-10 h-10 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center hover:scale-105 active:scale-95 transition"
            title="發音播放"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="text-2xl sm:text-3xl font-black font-jp text-[var(--ink)] leading-snug">
          <FuriganaText text={dailyPhrase.japanese} mode={furiganaMode} />
        </div>
        <p className="text-[var(--ink-2)] text-sm font-bold">{dailyPhrase.meaning}</p>
      </div>

      {/* Collapsible Advanced SRS Analytics */}
      <details className="group border border-[var(--border)] rounded-2xl bg-[var(--surface)] shadow-xs overflow-hidden transition">
        <summary className="px-5 py-3.5 flex items-center justify-between font-bold text-xs text-[var(--ink-2)] cursor-pointer select-none">
          <span>📊 查看詳細記憶數據與預測</span>
          <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="p-3 border-t border-[var(--border)]">
          <MemoryAnalyticsChart vocabList={vocabList} grammarList={grammarList} dueCount={dueCount} />
        </div>
      </details>
    </div>
  )
}
