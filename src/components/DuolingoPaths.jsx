import React, { useState, memo } from 'react'
import {
  Lock, CheckCircle2, Star, Flame, Zap,
  ChevronRight, PlayCircle, BookOpen, Mic,
  Trophy, Shield
} from 'lucide-react'
import { SECTIONS, getDailyXP, getTotalXP, getStreakDays, DAILY_XP_GOAL, JLPT_COLORS } from '../data/lessonData'

/**
 * DuolingoPaths — Duolingo 風格線性學習路徑地圖
 * 
 * 視覺設計：
 * - 垂直滾動路徑
 * - 圓形關卡節點（完成=實色、當前=動態、鎖定=灰色）
 * - 蛇形交替左右排列
 * - 章節標題橫幅
 * - 頂部 XP / 連勝 / 每日目標
 */
export default function DuolingoPaths({ onStartLesson }) {
  const [expandedUnit, setExpandedUnit] = useState(null)
  const dailyXP = getDailyXP()
  const totalXP = getTotalXP()
  const streakDays = getStreakDays()
  const dailyProgress = Math.min((dailyXP / DAILY_XP_GOAL) * 100, 100)

  // Find current active node
  let activeNodeFound = false

  return (
    <div className="min-h-full flex flex-col max-w-sm mx-auto w-full animate-fadeIn">

      {/* ── TOP STATS BAR ── */}
      <div className="sticky top-[64px] md:top-0 z-10 bg-[var(--nav-bg)] border-b border-[var(--nav-border)] backdrop-blur-md px-4 py-3 flex items-center gap-3">
        {/* Streak */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#D97706]/10 border border-[#D97706]/20">
          <Flame className="w-4 h-4 text-[#D97706] fill-[#D97706]" />
          <span className="text-xs font-extrabold text-[#D97706]">{streakDays}</span>
        </div>

        {/* Daily XP Progress */}
        <div className="flex-1 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--primary)] shrink-0" />
          <div className="flex-1 h-2.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-700"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[var(--ink-3)] w-10 text-right">
            {dailyXP}/{DAILY_XP_GOAL}
          </span>
        </div>

        {/* Total XP */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[var(--primary-light)] border border-[var(--primary-dim)]">
          <Star className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span className="text-xs font-extrabold text-[var(--primary)]">{totalXP} XP</span>
        </div>
      </div>

      {/* ── LEARNING PATH ── */}
      <div className="flex flex-col py-6 px-4 gap-0">
        {SECTIONS.map((section) => (
          <div key={section.id}>
            {/* Section Banner */}
            <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 border border-[var(--border)] bg-[var(--primary-light)]">
              <span className="text-3xl">{section.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[var(--ink)] text-sm">{section.title}</h3>
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-full border"
                    style={{
                      background: JLPT_COLORS[section.level]?.bg || 'var(--badge-bg)',
                      color: JLPT_COLORS[section.level]?.text || 'var(--ink-2)',
                      borderColor: JLPT_COLORS[section.level]?.border || 'var(--border)',
                    }}
                  >
                    {section.level}
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-3)] font-medium">{section.subtitle}</p>
              </div>
            </div>

            {/* Units and Nodes */}
            {section.units.map((unit) => (
              <div key={unit.id} className="mb-8">
                {/* Unit label */}
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-xl">{unit.emoji}</span>
                  <div>
                    <p className="text-xs font-extrabold text-[var(--ink-2)] uppercase tracking-wider">{unit.title}</p>
                  </div>
                  {unit.status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                  )}
                </div>

                {/* Nodes — snake path */}
                <NodePath
                  nodes={unit.nodes}
                  unitStatus={unit.status}
                  onStartLesson={onStartLesson}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Bottom padding */}
        <div className="h-20" />
      </div>
    </div>
  )
}

/**
 * NodePath — renders nodes in a Duolingo-style snake path
 */
const NodePath = memo(function NodePath({ nodes, unitStatus, onStartLesson }) {
  // Zigzag positions: center, right, center, left, center...
  const positions = ['center', 'right', 'center', 'left', 'center', 'right', 'center']

  return (
    <div className="flex flex-col items-center gap-3">
      {nodes.map((node, i) => {
        const pos = positions[i % positions.length]
        const isActive = node.status === 'active'
        const isDone   = node.status === 'completed'
        const isLocked = node.status === 'locked' || unitStatus === 'locked'
        const isReview = node.type === 'review'

        const marginClass =
          pos === 'left'   ? 'mr-20' :
          pos === 'right'  ? 'ml-20' : ''

        return (
          <div key={node.id} className={`relative flex flex-col items-center ${marginClass}`}>
            {/* Connector line above (not for first node) */}
            {i > 0 && (
              <div
                className="w-1 h-6 mb-2 rounded-full"
                style={{ background: isDone ? 'var(--primary)' : 'var(--border)' }}
              />
            )}

            {/* The Node Button */}
            <NodeButton
              node={node}
              isActive={isActive}
              isDone={isDone}
              isLocked={isLocked}
              isReview={isReview}
              onStartLesson={onStartLesson}
            />
          </div>
        )
      })}
    </div>
  )
})

/**
 * NodeButton — Individual lesson node
 */
const NodeButton = memo(function NodeButton({ node, isActive, isDone, isLocked, isReview, onStartLesson }) {
  const size = isReview ? 'w-24 h-24' : 'w-[90px] h-[90px]'

  const NodeIcon = isReview
    ? Trophy
    : node.type === 'grammar'
    ? BookOpen
    : node.type === 'speak'
    ? Mic
    : Star

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => !isLocked && onStartLesson?.(node)}
        disabled={isLocked}
        className={`${size} rounded-full flex flex-col items-center justify-center relative transition-all duration-200 
          ${isLocked ? 'cursor-not-allowed' : 'active:scale-95 cursor-pointer'}
          ${isActive ? 'ring-4 ring-[var(--primary)]/30 ring-offset-2 ring-offset-[var(--canvas)]' : ''}
        `}
        style={{
          background: isDone
            ? 'var(--primary)'
            : isActive
            ? 'var(--primary)'
            : 'var(--surface-2)',
          boxShadow: isDone || isActive
            ? 'var(--shadow-sm)'
            : '0 2px 8px rgba(0,0,0,0.08)',
          border: isLocked
            ? '3px solid var(--border)'
            : isDone || isActive
            ? '3px solid transparent'
            : '3px solid var(--primary-dim)',
        }}
      >
        {isDone ? (
          <CheckCircle2 className="w-10 h-10 text-white" />
        ) : isLocked ? (
          <Lock className="w-8 h-8 text-[var(--ink-3)]" />
        ) : (
          <NodeIcon
            className="w-8 h-8"
            style={{ color: isActive ? '#fff' : 'var(--primary)' }}
          />
        )}

        {/* Active pulse animation */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: 'var(--primary)' }}
          />
        )}
      </button>

      {/* Label below node */}
      <div className="text-center max-w-[100px]">
        <p className={`text-sm font-bold leading-tight ${
          isDone ? 'text-[var(--ink-3)]' :
          isActive ? 'text-[var(--primary)] font-black' :
          'text-[var(--ink-3)]'
        }`}>
          {node.title}
        </p>
        {isActive && (
          <span className="text-[10px] font-black text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded-full mt-1 inline-block">
            開始
          </span>
        )}
        {node.xpReward && !isLocked && (
          <span className="text-[9px] text-[var(--ink-3)] font-medium block">
            +{node.xpReward} XP
          </span>
        )}
      </div>

      {/* START CTA for active node */}
      {isActive && (
        <button
          onClick={() => !isLocked && onStartLesson?.(node)}
          className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--primary)] text-white text-xs font-extrabold shadow-sm transition active:scale-95"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          開始學習
        </button>
      )}
    </div>
  )
})
