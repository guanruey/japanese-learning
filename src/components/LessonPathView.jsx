import React from 'react'
import { PlayCircle, Lock, CheckCircle2, Flame, MapPin, Sparkles } from 'lucide-react'

export default function LessonPathView({
  onStartLesson,
  streakDays = 5,
  activeTrack = 'japanese',
}) {
  const isJapanese = activeTrack === 'japanese'

  const units = [
    {
      id: 1,
      title: isJapanese ? '問候與自我介紹' : 'Greetings & Intro',
      description: isJapanese ? '掌握核心招呼語與基礎自我介紹' : 'Master essential greetings',
      status: 'completed',
      nodeCount: 3,
      completedNodes: 3,
      level: isJapanese ? 'N5' : 'A1',
    },
    {
      id: 2,
      title: isJapanese ? '餐廳點餐與過敏溝通' : 'Dining & Requests',
      description: isJapanese ? '數字、量詞與餐廳點餐的實用對話' : 'Restaurant ordering & numbers',
      status: 'active',
      nodeCount: 4,
      completedNodes: 2,
      level: isJapanese ? 'N4' : 'A2',
    },
    {
      id: 3,
      title: isJapanese ? '交通指引與出遊' : 'Transport & Directions',
      description: isJapanese ? '搭乘電車、計程車與問路' : 'Directions and public transit',
      status: 'locked',
      nodeCount: 4,
      completedNodes: 0,
      level: isJapanese ? 'N3' : 'B1',
    },
  ]

  const activeUnit = units.find((u) => u.status === 'active') || units[0]
  const progress = Math.round((activeUnit.completedNodes / activeUnit.nodeCount) * 100)

  return (
    <div className="min-h-full flex flex-col max-w-md mx-auto w-full gap-6 animate-fadeIn pb-12">

      {/* ── 1. Top Streak & Level Row ── */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D97706]/10 border border-[#D97706]/20">
          <Flame className="w-4 h-4 text-[#D97706] fill-[#D97706] animate-pulse" />
          <span className="text-xs font-extrabold text-[#D97706]">
            {streakDays} 天連勝紀錄
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--primary)] bg-[var(--primary-light)] px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{activeUnit.level} 級核心地圖</span>
        </div>
      </div>

      {/* ── 2. Active Unit Hero Card (Duolingo Style) ── */}
      <div className="qp-card p-6 flex flex-col gap-5 bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-card)] border border-[var(--primary-dim)] relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[var(--primary-light)] blur-2xl pointer-events-none" />

        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--primary-light)] border border-[var(--primary-dim)] text-[var(--primary)] text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[var(--primary)]" />
              當前探索單元
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight">{activeUnit.title}</h2>
          <p className="text-xs text-[var(--ink-2)] font-medium leading-relaxed">{activeUnit.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2 relative z-10 mt-1">
          <div className="h-2.5 rounded-full bg-[var(--border)] overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-700 shadow-sm" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--ink-3)] font-semibold">
              已解鎖 {activeUnit.completedNodes} / {activeUnit.nodeCount} 課節
            </span>
            <span className="font-extrabold text-[var(--primary)]">
              {progress}%
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onStartLesson && onStartLesson('srs')}
          className="qp-btn w-full h-[52px] rounded-2xl bg-[var(--primary)] text-white font-extrabold text-base shadow-sm active:scale-[0.98] transition flex items-center justify-center gap-2 border border-[var(--primary-dim)] relative z-10"
        >
          <PlayCircle className="w-5 h-5 fill-white text-[var(--primary)]" />
          <span>繼續當前關卡</span>
        </button>
      </div>

      {/* ── 3. Interactive Learning Path Nodes ── */}
      <div className="flex flex-col gap-3">
        <span className="type-13 uppercase tracking-wider text-[#78716C] dark:text-slate-400 font-extrabold px-1">
          學習解鎖路線 (Learning Roadmap)
        </span>

        <div className="flex flex-col gap-3">
          {units.map((unit) => {
            const isCompleted = unit.status === 'completed'
            const isActive    = unit.status === 'active'
            const isLocked    = unit.status === 'locked'

            return (
              <div
                key={unit.id}
                className={`theme-card flex items-center p-4 gap-4 transition-all duration-200 ${
                  isLocked ? 'opacity-50 grayscale' : 'opacity-100 hover:scale-[1.01]'
                } ${
                  isActive 
                    ? 'border-2 border-[var(--primary)] shadow-lg bg-[var(--primary-light)]' 
                    : ''
                }`}
              >
                {/* Node Status Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-extrabold text-sm shadow-sm transition ${
                    isCompleted
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : isActive
                      ? 'bg-[var(--primary)] text-white shadow-md animate-pulse'
                      : 'bg-[var(--badge-bg)] text-[var(--ink-3)] border border-[var(--border)]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-slate-400" />
                  ) : (
                    <span className="text-lg">{unit.id}</span>
                  )}
                </div>

                {/* Node Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="type-16 font-extrabold text-[var(--ink)] truncate">
                      {unit.title}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : isActive
                          ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                          : 'bg-[var(--badge-bg)] text-[var(--ink-3)]'
                      }`}
                    >
                      {unit.level}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--ink-3)] font-medium truncate">
                    {unit.description}
                  </span>
                </div>

                {/* Active Action Button */}
                {isActive && (
                  <button
                    onClick={() => onStartLesson && onStartLesson('srs')}
                    className="px-3.5 py-2 rounded-xl theme-btn-primary flex-shrink-0"
                  >
                    挑戰
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
