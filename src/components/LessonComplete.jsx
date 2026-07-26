import React, { useEffect, useState } from 'react'
import { Star, Zap, Flame, ArrowRight, Home } from 'lucide-react'
import confetti from 'canvas-confetti'

/**
 * LessonComplete — Duolingo 風格課節結束慶祝畫面
 * Props:
 *   node      — 剛完成的關卡節點 { title, xpReward }
 *   xpEarned  — 實際賺到的 XP
 *   streakDays — 當前連勝天數
 *   totalXP   — 累計 XP
 *   onContinue — 繼續下一關
 *   onHome    — 回首頁
 */
export default function LessonComplete({
  node = {},
  xpEarned = 10,
  streakDays = 1,
  totalXP = 0,
  onContinue,
  onHome,
}) {
  const [showContent, setShowContent] = useState(false)
  const [countedXP, setCountedXP] = useState(0)

  // 🎉 Launch confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)

    // Confetti burst
    const end = Date.now() + 1200
    const colors = ['#7C3AED', '#4F46E5', '#0EA5E9', '#10B981', '#F59E0B']
    ;(function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()

    return () => clearTimeout(timer)
  }, [])

  // XP counter animation
  useEffect(() => {
    if (!showContent) return
    let current = 0
    const step = Math.ceil(xpEarned / 20)
    const timer = setInterval(() => {
      current = Math.min(current + step, xpEarned)
      setCountedXP(current)
      if (current >= xpEarned) clearInterval(timer)
    }, 40)
    return () => clearInterval(timer)
  }, [showContent, xpEarned])

  const stats = [
    {
      icon: <Zap className="w-5 h-5" />,
      label: '獲得 XP',
      value: `+${countedXP}`,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      icon: <Flame className="w-5 h-5" />,
      label: '連勝天數',
      value: `${streakDays} 天`,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: '累計 XP',
      value: totalXP.toLocaleString(),
      color: 'text-[var(--primary)]',
      bg: 'bg-[var(--primary-light)]',
      border: 'border-[var(--primary-dim)]',
    },
  ]

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--canvas)] flex flex-col items-center justify-between py-12 px-6 animate-fadeIn">
      {/* ── Top: Big celebration emoji ── */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <div
          className={`text-7xl transition-all duration-700 ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
        >
          🎉
        </div>
        <div className={`text-center transition-all duration-500 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-3xl font-black text-[var(--ink)] tracking-tight">
            太棒了！
          </h1>
          <p className="text-base text-[var(--ink-2)] font-medium mt-1.5">
            完成了「{node.title || '課節'}」
          </p>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div
        className={`w-full max-w-sm flex flex-col gap-3 transition-all duration-500 delay-300 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 ${s.bg} ${s.border}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`flex items-center gap-2.5 font-bold ${s.color}`}>
              {s.icon}
              <span className="text-sm text-[var(--ink-2)]">{s.label}</span>
            </div>
            <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* ── Bottom: Action Buttons ── */}
      <div
        className={`w-full max-w-sm flex flex-col gap-3 transition-all duration-500 delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {onContinue && (
          <button
            onClick={onContinue}
            className="w-full h-[58px] rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 transition active:scale-[0.97]"
            style={{ background: 'var(--hero-gradient)', boxShadow: '0 6px 20px var(--theme-glow)' }}
          >
            <span>繼續下一關</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={onHome}
          className="w-full h-[52px] rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition active:scale-[0.97] border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--ink-2)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          <Home className="w-4 h-4" />
          <span>回學習路徑</span>
        </button>
      </div>
    </div>
  )
}
