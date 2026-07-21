import React, { useState } from 'react'
import { RotateCw, Volume2, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react'
import FuriganaText from './FuriganaText'
import { calculateNextSRSState } from '../utils/srsAlgorithm'
import { upsertUserProgress } from '../supabase'

export default function FlashcardStudySession({ items = [], furiganaMode = 'furigana', onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  if (!items || items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center max-w-lg mx-auto shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <Sparkles className="w-12 h-12 text-indigo-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">太棒了！目前沒有待複習的卡片</h3>
        <p className="text-slate-500 text-sm">您的所有卡片皆處於記憶保留期間。您可以隨時在單字庫或文法頁面手動選擇卡片進行複習。</p>
        <button
          onClick={onFinish}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition"
        >
          返回儀表板
        </button>
      </div>
    )
  }

  const isFinished = currentIndex >= items.length
  const currentItem = items[currentIndex]

  if (isFinished) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center max-w-lg mx-auto shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">測驗完成！</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          您成功完成了今天 {completedCount} 張卡片的記憶測驗。持續累積學習天數吧！
        </p>
        <button
          onClick={onFinish}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition"
        >
          返回儀表板
        </button>
      </div>
    )
  }

  const speakJapanese = (text) => {
    if (!text || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/\[.*?\]/g, '')
    const u = new SpeechSynthesisUtterance(cleanText)
    u.lang = 'ja-JP'
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  }

  const handleRate = async (rating) => {
    const nextSRS = calculateNextSRSState({
      rating,
      repetitionCount: currentItem.repetition_count || 0,
      intervalDays: currentItem.interval_days || 0,
      easeFactor: currentItem.ease_factor || 2.5,
    })

    await upsertUserProgress({
      userId: 'local_user',
      itemId: currentItem.id,
      itemType: currentItem.kanji ? 'vocabulary' : 'grammar',
      intervalDays: nextSRS.intervalDays,
      easeFactor: nextSRS.easeFactor,
      repetitionCount: nextSRS.repetitionCount,
      nextReviewAt: nextSRS.nextReviewAt,
    })

    setIsFlipped(false)
    setCompletedCount((prev) => prev + 1)
    setCurrentIndex((prev) => prev + 1)
  }

  const mainJapanese = currentItem.kanji || currentItem.pattern || currentItem.japanese || ''
  const subJapanese = currentItem.reading || ''
  const meaning = currentItem.meaning_zh || currentItem.meaning || currentItem.meaning_en || ''
  const exampleJa = currentItem.example_ja || currentItem.example || ''
  const exampleZh = currentItem.example_zh || currentItem.example_meaning || ''

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
        <span>卡片測驗模式 (SRS)</span>
        <span>
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* Flashcard Area */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer bg-white dark:bg-slate-800 rounded-3xl min-h-[320px] p-8 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between items-center text-center relative overflow-hidden group"
      >
        <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-slate-400">
          <RotateCw className="w-4 h-4" />
          <span>點擊翻面</span>
        </div>

        <div className="my-auto space-y-4 w-full">
          {!isFlipped ? (
            /* Front of Card */
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                {currentItem.level || 'N5'}
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 font-jp tracking-wide">
                {mainJapanese}
              </div>
              {subJapanese && <p className="text-slate-400 text-sm font-mono">{subJapanese}</p>}
            </div>
          ) : (
            /* Back of Card */
            <div className="space-y-5 animate-fadeIn">
              <div className="flex justify-center items-center gap-2">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-jp">
                  <FuriganaText text={mainJapanese} mode={furiganaMode} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    speakJapanese(mainJapanese)
                  }}
                  className="p-2 rounded-full bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition"
                  title="發音"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{meaning}</div>

              {exampleJa && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-left space-y-1">
                  <p className="text-base font-medium text-slate-800 dark:text-slate-200 font-jp">
                    <FuriganaText text={exampleJa} mode={furiganaMode} />
                  </p>
                  {exampleZh && <p className="text-xs text-slate-500">{exampleZh}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating Bar (Visible when flipped) */}
      {isFlipped ? (
        <div className="grid grid-cols-4 gap-2 pt-2 animate-fadeIn">
          <button
            onClick={() => handleRate(1)}
            className="flex flex-col items-center py-3 px-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 font-bold text-xs border border-rose-200 dark:border-rose-800 transition"
          >
            <span>重來 (1)</span>
            <span className="text-[10px] font-normal text-rose-500">1天內</span>
          </button>

          <button
            onClick={() => handleRate(2)}
            className="flex flex-col items-center py-3 px-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-bold text-xs border border-amber-200 dark:border-amber-800 transition"
          >
            <span>吃力 (2)</span>
            <span className="text-[10px] font-normal text-amber-500">3天後</span>
          </button>

          <button
            onClick={() => handleRate(3)}
            className="flex flex-col items-center py-3 px-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition"
          >
            <span>良好 (3)</span>
            <span className="text-[10px] font-normal text-emerald-500">6天後</span>
          </button>

          <button
            onClick={() => handleRate(4)}
            className="flex flex-col items-center py-3 px-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition"
          >
            <span>簡單 (4)</span>
            <span className="text-[10px] font-normal text-indigo-500">12天後</span>
          </button>
        </div>
      ) : (
        <p className="text-center text-xs text-slate-400">請點擊卡片顯示解答後進行評分</p>
      )}
    </div>
  )
}
