import React from 'react'
import { Flame, Trophy, PlayCircle, BookOpen, Sparkles, Volume2, ArrowRight } from 'lucide-react'
import FuriganaText from './FuriganaText'

export default function Dashboard({
  grammarList = [],
  vocabList = [],
  onNavigate,
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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance('今日も一生懸命頑張りましょう！')
      u.lang = 'ja-JP'
      u.rate = 0.9
      window.speechSynthesis.speak(u)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
            <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>連續學習 {streakDays} 天</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            おかえりなさい！準備好開始今天的日語學習了嗎？
          </h2>

          <p className="text-indigo-100 text-sm max-w-xl">
            掌握 JLPT N5 與 N4 的核心文法與實用單字，透過科學化 SRS 間隔記憶法打造持久記憶。
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('srs')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-slate-50 transition transform active:scale-95"
            >
              <PlayCircle className="w-5 h-5 text-indigo-600" />
              <span>開始卡片測驗 {dueCount > 0 ? `(${dueCount} 待複習)` : ''}</span>
            </button>
            <button
              onClick={() => onNavigate('grammar')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md transition border border-white/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>瀏覽文法庫</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Phrase Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>每日日語一言</span>
          </div>
          <button
            onClick={speakPhrase}
            className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title="發音播放"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xl sm:text-2xl font-bold font-jp text-slate-800 dark:text-slate-100">
          <FuriganaText text={dailyPhrase.japanese} mode={furiganaMode} />
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">{dailyPhrase.meaning}</p>
        <p className="text-xs text-slate-400 font-mono">{dailyPhrase.romaji}</p>
      </div>

      {/* Curriculum Progress Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">學習進度概覽</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* N5 Progress Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:border-indigo-300 transition">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
                JLPT N5
              </span>
              <Trophy className="w-5 h-5 text-emerald-500" />
            </div>

            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{n5GrammarCount} 句型</div>
              <p className="text-xs text-slate-500 mt-1">涵蓋基礎助詞、動詞變化與日常句構</p>
            </div>

            <button
              onClick={() => onNavigate('grammar')}
              className="w-full flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-700"
            >
              <span>查看 N5 文法句型</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* N4 Progress Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:border-indigo-300 transition">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
                JLPT N4
              </span>
              <Trophy className="w-5 h-5 text-blue-500" />
            </div>

            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{n4GrammarCount} 句型</div>
              <p className="text-xs text-slate-500 mt-1">進階條件句、授受動詞與被動使役</p>
            </div>

            <button
              onClick={() => onNavigate('grammar')}
              className="w-full flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-700"
            >
              <span>查看 N4 文法句型</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Vocab Summary Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:border-indigo-300 transition">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-bold">
                核心字彙
              </span>
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>

            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalVocabCount}+ 單字</div>
              <p className="text-xs text-slate-500 mt-1">附日語重音標記、音檔播放與搭配詞</p>
            </div>

            <button
              onClick={() => onNavigate('vocabulary')}
              className="w-full flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-700"
            >
              <span>探索單字庫</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
