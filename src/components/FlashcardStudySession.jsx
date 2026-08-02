import React, { useState, useEffect, useCallback } from 'react'
import { RotateCw, Volume2, CheckCircle2, Sparkles, Keyboard } from 'lucide-react'
import FuriganaText from './FuriganaText'
import { calculateNextStability, calculateNextDifficulty, calculateRetrievability } from '../utils/fsrsEngine'
import { upsertUserProgress } from '../supabase'
import { speak } from '../utils/speech'
import { useAppShellStore } from '../stores/appShellStore'
import { trackLearningEvent } from '../services/eventTracker'

const triggerHaptic = (pattern = 15) => {
  if ('vibrate' in navigator) {
    try { navigator.vibrate(pattern) } catch {}
  }
}

export default function FlashcardStudySession({ items = [], onFinish }) {
  const { readingMode: furiganaMode } = useAppShellStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const [touchStartX, setTouchStartX] = useState(null)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const isFinished = items && items.length > 0 && currentIndex >= items.length
  const currentItem = items && items.length > 0 ? items[currentIndex] : null

  const speakJapanese = useCallback((text) => {
    if (!text) return
    const cleanText = text.replace(/\[.*?\]/g, '')
    speak(cleanText, 'ja-JP')
  }, [])

  const handleRate = useCallback(async (rating) => {
    if (!currentItem) return
    triggerHaptic(rating === 1 ? [30, 40] : [20])
    const currentS = currentItem.fsrs_stability || 2.0
    const currentD = currentItem.fsrs_difficulty || 5.0
    const currentRep = currentItem.repetition_count || 0
    
    let elapsedDays = 0
    if (currentItem.last_reviewed_at) {
        elapsedDays = (new Date() - new Date(currentItem.last_reviewed_at)) / (1000 * 60 * 60 * 24)
    }
    const currentR = elapsedDays > 0 ? calculateRetrievability(elapsedDays, currentS) : 0

    const nextS = calculateNextStability(currentS, currentD, currentR, rating)
    const nextD = calculateNextDifficulty(currentD, rating)
    const nextRep = currentRep + 1

    const nextReviewDate = new Date()
    // 提早複習機制: 如果 rating 是 1 (Again)，1 天後複習，否則依照 Stability 天數
    const intervalDays = rating === 1 ? 1 : nextS
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays)

    await upsertUserProgress({
      userId: 'local_user',
      wordId: currentItem.id,
      stability: nextS,
      difficulty: nextD,
      retrievability: currentR,
      state: 'Learning',
      lastReview: new Date().toISOString(),
      due: nextReviewDate.toISOString(),
      reps: nextRep,
      lapses: rating === 1 ? (currentItem.lapses || 0) + 1 : (currentItem.lapses || 0)
    })

    // MVP Event Tracking
    trackLearningEvent({
      eventType: 'review.item_rated',
      sourceSurface: 'FlashcardStudySession',
      memoryItemRefs: [currentItem.id],
      evidenceStrength: 'strong',
      outcome: rating === 1 ? 'failure' : 'success',
      payload: {
        rating: rating,
        is_correct: rating > 1,
        previous_fsrs_state: {
          stability: currentS,
          difficulty: currentD,
          retrievability: currentR
        }
      }
    });

    trackLearningEvent({
      eventType: 'memory.state_updated',
      sourceSurface: 'FlashcardStudySession',
      memoryItemRefs: [currentItem.id],
      evidenceStrength: 'verified',
      payload: {
        new_stability: nextS,
        new_difficulty: nextD,
        reps: nextRep
      }
    });

    setIsFlipped(false)
    setSwipeOffset(0)
    setCompletedCount((prev) => prev + 1)
    setCurrentIndex((prev) => prev + 1)
  }, [currentItem])

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (touchStartX === null) return
    const diff = e.touches[0].clientX - touchStartX
    setSwipeOffset(diff)
  }

  const handleTouchEnd = () => {
    if (swipeOffset > 80 && isFlipped) {
      // Right Swipe -> Good (3)
      handleRate(3)
    } else if (swipeOffset < -80 && isFlipped) {
      // Left Swipe -> Again (1)
      handleRate(1)
    }
    setTouchStartX(null)
    setSwipeOffset(0)
  }

  const mainJapanese = currentItem?.kanji || currentItem?.pattern || currentItem?.japanese || ''

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing inside input / textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setIsFlipped((prev) => !prev)
      } else if ((e.key === 'r' || e.key === 'R') && mainJapanese) {
        e.preventDefault()
        speakJapanese(mainJapanese)
      } else if (isFlipped && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault()
        handleRate(Number(e.key))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFlipped, mainJapanese, handleRate, speakJapanese])

  if (!items || items.length === 0) {
    return (
      <div className="bg-[var(--surface)] rounded-3xl p-10 text-center max-w-lg mx-auto shadow-sm border border-[var(--border)] space-y-4">
        <Sparkles className="w-12 h-12 text-[var(--primary)] mx-auto" />
        <h3 className="text-xl font-bold text-[var(--ink)]">太棒了！目前沒有待複習的卡片</h3>
        <p className="text-[var(--ink-2)] text-sm">您的所有卡片皆處於記憶保留期間。您可以隨時在單字庫或文法頁面手動選擇卡片進行複習。</p>
        <button
          onClick={onFinish}
          className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-xl font-bold text-sm shadow-md transition"
        >
          返回儀表板
        </button>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="bg-[var(--surface)] rounded-3xl p-10 text-center max-w-lg mx-auto shadow-sm border border-[var(--border)] space-y-4 animate-fadeIn">
        <div className="relative inline-block">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
          <Sparkles className="w-6 h-6 text-[#D97706] absolute -top-1 -right-1 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold text-[var(--ink)]">🎉 測驗完成！</h3>
        <p className="text-[var(--ink-2)] text-sm">
          您成功完成了今天 <span className="font-extrabold text-[var(--primary)]">{completedCount}</span> 張卡片的記憶測驗。持續累積學習天數吧！
        </p>
        <button
          onClick={onFinish}
          className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-xl font-bold text-sm shadow-md transition hover:scale-105 active:scale-95"
        >
          返回儀表板
        </button>
      </div>
    )
  }

  const subJapanese = currentItem.reading || ''
  const meaning = currentItem.meaning_zh || currentItem.meaning || currentItem.meaning_en || ''
  const exampleJa = currentItem.example_ja || currentItem.example || ''
  const exampleZh = currentItem.example_zh || currentItem.example_meaning || ''

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex justify-between items-center text-sm font-semibold text-[var(--ink-2)]">
        <div className="flex items-center gap-2">
          <span>卡片測驗模式 (SRS)</span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--badge-bg)] text-xs font-normal text-[var(--ink-3)]">
            <Keyboard className="w-3 h-3" /> Space / 1-4
          </span>
        </div>
        <span>
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--primary)] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* 3D Perspective Flashcard Container with Swipe Gestures */}
      <div
        className="perspective-1000 w-full min-h-[340px] touch-pan-y relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe Stamp Indicators */}
        {swipeOffset > 40 && (
          <div className="absolute top-6 right-6 z-50 px-4 py-2 rounded-2xl bg-emerald-500 text-white font-black text-lg shadow-xl transform rotate-12 border-2 border-white animate-bounce pointer-events-none">
            正解 GOOD 👍
          </div>
        )}
        {swipeOffset < -40 && (
          <div className="absolute top-6 left-6 z-50 px-4 py-2 rounded-2xl bg-rose-500 text-white font-black text-lg shadow-xl transform -rotate-12 border-2 border-white animate-bounce pointer-events-none">
            復習 AGAIN 🔄
          </div>
        )}

        <div
          onClick={() => {
            if (Math.abs(swipeOffset) < 10) {
              triggerHaptic(10)
              setIsFlipped(!isFlipped)
            }
          }}
          style={{
            transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.05}deg) ${isFlipped ? 'rotateY(180deg)' : ''}`,
            transition: swipeOffset === 0 ? 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
          }}
          className="cursor-pointer transform-style-3d relative min-h-[340px] w-full rounded-3xl"
        >
          {/* Front of Card */}
          <div className="card-pop absolute inset-0 backface-hidden p-8 flex flex-col justify-between items-center text-center">
            <div className="w-full flex justify-between items-center text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full badge-jlpt-n5 font-black">
                  {currentItem.level || 'N5'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-white ${
                  currentItem.kanji ? 'bg-cyan-500' : 'bg-indigo-600'
                }`}>
                  {currentItem.kanji ? '語彙 Vocabulary' : '文法 Grammar'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[var(--badge-bg)] px-2.5 py-1 rounded-lg">
                <RotateCw className="w-3.5 h-3.5" />
                <span>點擊 / Space 翻面</span>
              </div>
            </div>

            <div className="my-auto space-y-3 w-full">
              <div className="text-4xl sm:text-5xl font-black text-[var(--ink)] font-jp tracking-wide">
                {mainJapanese}
              </div>
              {subJapanese && <p className="text-[var(--ink-3)] text-sm font-mono">{subJapanese}</p>}
            </div>

            <p className="text-xs text-[var(--ink-3)] font-semibold">解答隱藏中，請翻面或向左右劃動評分</p>
          </div>

          {/* Back of Card */}
          <div className="card-pop absolute inset-0 backface-hidden rotate-y-180 p-6 sm:p-8 flex flex-col justify-between items-center text-center overflow-y-auto">
            <div className="w-full flex justify-between items-center text-xs font-semibold text-slate-400">
              <span className="px-3 py-1 rounded-full bg-[#D97706]/10 text-[#D97706] font-extrabold border border-[#D97706]/20">
                解答與詳解範例
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  speakJapanese(mainJapanese)
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] hover:scale-105 transition font-bold"
                title="按 [R] 鍵播放語音"
              >
                <Volume2 className="w-4 h-4" />
                <span>發音 [R]</span>
              </button>
            </div>

            <div className="my-auto space-y-4 w-full">
              <div className="text-2xl font-bold text-[var(--ink)] font-jp">
                <FuriganaText text={mainJapanese} mode={furiganaMode} />
              </div>

              <div className="text-xl font-extrabold text-[var(--primary)]">{meaning}</div>

              {exampleJa && (
                <div className="p-3.5 rounded-2xl bg-[var(--canvas)] text-left space-y-1 border border-[var(--border)]">
                  <p className="text-sm sm:text-base font-medium text-[var(--ink)] font-jp">
                    <FuriganaText text={exampleJa} mode={furiganaMode} />
                  </p>
                  {exampleZh && <p className="text-xs text-[var(--ink-2)]">{exampleZh}</p>}
                </div>
              )}
            </div>

            <p className="text-xs text-[var(--ink-3)]">請依據您的記憶熟悉度選擇下方評分 (或按鍵盤 1-4)</p>
          </div>
        </div>
      </div>

      {/* Rating Bar (Visible when flipped) */}
      {isFlipped ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 animate-fadeIn">
          <button
            onClick={() => handleRate(1)}
            className="h-12 rounded-xl bg-rose-500/10 text-rose-700 border border-rose-200 flex flex-col items-center justify-center transition active:scale-95 hover:bg-rose-500/20"
          >
            <span className="text-xs font-bold">重來 [1]</span>
            <span className="text-[10px] opacity-75">1天內</span>
          </button>

          <button
            onClick={() => handleRate(2)}
            className="h-12 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-200 flex flex-col items-center justify-center transition active:scale-95 hover:bg-amber-500/20"
          >
            <span className="text-xs font-bold">吃力 [2]</span>
            <span className="text-[10px] opacity-75">1天後</span>
          </button>

          <button
            onClick={() => handleRate(3)}
            className="h-12 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-200 flex flex-col items-center justify-center transition active:scale-95 hover:bg-emerald-500/20"
          >
            <span className="text-xs font-bold">良好 [3]</span>
            <span className="text-[10px] opacity-75">6天後</span>
          </button>

          <button
            onClick={() => handleRate(4)}
            className="h-12 rounded-xl bg-teal-500/10 text-teal-700 border border-teal-200 flex flex-col items-center justify-center transition active:scale-95 hover:bg-teal-500/20"
          >
            <span className="text-xs font-bold">簡單 [4]</span>
            <span className="text-[10px] opacity-75">12天後</span>
          </button>
        </div>
      ) : (
        <div className="text-center text-xs text-[var(--ink-2)] py-3 border border-dashed border-[var(--border)] rounded-xl bg-[var(--surface-2)]">
          💡 按按鈕或按 <kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono text-[10px]">Space</kbd> 翻頁解答
        </div>
      )}
    </div>
  )
}

