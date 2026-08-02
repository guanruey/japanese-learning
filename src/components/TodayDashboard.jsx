import React, { useState, useEffect } from 'react'
import { ArrowRight, Flame, PlayCircle, RotateCw, Sparkles, BookOpen, Mic, ChevronDown, Zap } from 'lucide-react'
import { useLocale } from '../context/LocaleContext'
import { useLearnerModelStore } from '../stores/learnerModelStore'
import { trackLearningEvent } from '../services/eventTracker'
import { generateTodayRecommendations } from '../services/todayEngine'
import { useHaptics } from '../hooks/useHaptics'
import { motion } from 'framer-motion'

/**
 * TodayDashboard — 重設計版
 * 核心原則（Meta AI UX 研究）：
 * 1. 1 個核心任務 → 單一主要 CTA
 * 2. 3 秒說人話 → 標題直接說 App 能幫你做什麼
 * 3. 給回饋感 → 震動 + 動畫
 */
export default function TodayDashboard({
  onStartLesson,
  onSkipToReview,
  streakDays = 5,
  srsDueCount = 0,
  vocabData = [],
  grammarData = []
}) {
  const { targetLang } = useLocale()
  const isJapanese = targetLang === 'ja'
  const { weaknessScores, weaknessStats } = useLearnerModelStore()
  const { hapticSelection, hapticSuccess } = useHaptics()

  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)
  const [isTipsOpen, setIsTipsOpen] = useState(false)

  const safeWeaknessScores = weaknessScores || {};
  const safeWeaknessStats = weaknessStats || {};

  // Safely get a random item from grammarData
  const randomGrammar = (grammarData && grammarData.length > 0) 
    ? grammarData[Math.floor(Math.random() * grammarData.length)] 
    : null;

  // Find highest weakness
  const highestWeakness = Object.entries(safeWeaknessScores).reduce((acc, [key, val]) => {
    return val > acc.score ? { key, score: val } : acc;
  }, { key: null, score: 0 });

  // --- Today Engine (AI 決策引擎) ---
  let userGoal = 'travel';
  try {
    userGoal = localStorage.getItem('app_user_goal') || 'travel';
  } catch (e) {
    console.warn('localStorage read error:', e);
  }
  
  const recommendations = React.useMemo(() => {
    return generateTodayRecommendations({
      srsDueCount,
      weaknessScores: safeWeaknessScores,
      weaknessStats: safeWeaknessStats,
      userGoal,
      isJapanese,
      randomGrammar
    });
  }, [srsDueCount, safeWeaknessScores, safeWeaknessStats, userGoal, isJapanese, randomGrammar]);

  const primary = recommendations.find(r => r.slot === 'primary');
  const secondary = recommendations.find(r => r.slot === 'secondary');
  const optional = recommendations.find(r => r.slot === 'optional');

  useEffect(() => {
    if (!primary) return;
    // MVP Event Tracking
    trackLearningEvent({
      eventType: 'today.recommendation_generated',
      sourceSurface: 'TodayDashboard',
      evidenceStrength: 'observational',
      payload: {
        recommendations: recommendations.map(r => ({
          id: r.recommendation_id,
          slot: r.slot,
          type: r.type,
          priority_score: r.priority_score,
          reason_codes: r.reason_codes
        }))
      }
    });
  }, [primary]);

  function handleAction(rec) {
    if (!rec) return;
    hapticSelection();
    
    // MVP Event Tracking
    trackLearningEvent({
      eventType: 'today.recommendation_completed',
      sourceSurface: 'TodayDashboard',
      evidenceStrength: 'observational',
      payload: {
        recommendation_id: rec.recommendation_id,
        action_taken: rec.action,
        type: rec.type
      }
    });

    if (rec.action === 'review') {
      onSkipToReview?.()
    } else {
      onStartLesson?.(rec.action)
    }
  }

  function handleReview() {
    hapticSelection();
    onSkipToReview?.()
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center max-w-[420px] mx-auto w-full animate-fadeIn py-6 px-4 gap-4 pb-24">
      {/* Tagline */}
      <div className="w-full text-left mb-2">
        <h1 className="text-2xl font-bold text-[var(--ink)] leading-snug tracking-tight">
          {isJapanese ? '今日導航 · 學習焦點' : 'Daily Focus & Practice'}
        </h1>
        <p className="text-xs text-[var(--ink-3)] mt-1 font-medium">
          {isJapanese ? '每日精準處方與 FSRS 認知記憶排程' : 'Prescriptive micro-practice & spaced repetition'}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-3 w-full">
        
        {/* Main Hero Card (Spans 2 columns) */}
        {primary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="col-span-2 theme-card p-6 flex flex-col gap-4 relative overflow-hidden cursor-pointer hover:shadow-[var(--shadow-card)] border border-[var(--border)]"
            onClick={() => handleAction(primary)}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--primary)] bg-[var(--primary-light)] px-3 py-1 rounded-full">
                {primary.context}
              </span>
              <span className="text-xl opacity-90">{primary.emoji}</span>
            </div>

            <div className="flex flex-col gap-1.5 z-10">
              <p className="text-xl font-bold text-[var(--ink)] leading-tight tracking-tight">
                {primary.title}
              </p>
              {primary.romaji && (
                <p className="text-xs text-[var(--ink-2)] font-mono">{primary.romaji}</p>
              )}
              {primary.translation && (
                <p className="text-xs font-medium text-[var(--ink-3)] mt-0.5">{primary.translation}</p>
              )}
              <p className="text-xs text-[var(--ink-2)] mt-2 bg-[var(--surface-2)] p-3 rounded-xl border border-[var(--border)] font-medium leading-relaxed">
                {primary.reason_text}
              </p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); handleAction(primary); }}
              className="w-full mt-2 h-12 rounded-xl bg-[var(--primary)] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              {primary.action === 'review' ? <RotateCw className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{primary.estimated_minutes} 分鐘 • 開始練習</span>
            </button>
          </motion.div>
        )}

        {/* Small Bento 1: Streak */}
        <motion.div 
          whileTap={{ scale: 0.97 }}
          className="theme-card p-5 flex flex-col justify-center items-center gap-2 aspect-square border border-[var(--border)] hover:shadow-[var(--shadow-lifted)] transition-all cursor-default"
        >
           <div className="w-12 h-12 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-1">
             <Flame className="w-6 h-6 text-[#D97706]" />
           </div>
           <span className="text-2xl font-black text-[var(--ink)] tracking-tight">{streakDays}</span>
           <span className="text-[10px] font-extrabold text-[var(--ink-3)] uppercase tracking-widest">Day Streak</span>
        </motion.div>

        {/* Small Bento 2: FSRS Reviews */}
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={handleReview} 
          className="theme-card p-5 flex flex-col justify-center items-center gap-2 aspect-square cursor-pointer group border border-[var(--border)] hover:border-rose-200 hover:shadow-[var(--shadow-lifted)] transition-all"
        >
           <div className="relative w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-1">
             <RotateCw className="w-6 h-6 text-rose-500 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
           </div>
           <span className="text-2xl font-black text-[var(--ink)] tracking-tight">{srsDueCount}</span>
           <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest text-center leading-tight">
             Reviews Due <br/>
             <span className="text-[8px] opacity-80">(~{Math.max(1, Math.ceil(srsDueCount * 0.3))} min)</span>
           </span>
        </motion.button>

        {/* Secondary Recommendations Area */}
        <div className="col-span-2 flex flex-col gap-3 mt-2">
          {secondary && (
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(secondary)} 
              className="w-full theme-card p-4 flex items-center gap-4 text-left border border-[var(--border)] hover:shadow-[var(--shadow-lifted)] transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${secondary.color}-500/10`}>
                <span className="text-2xl">{secondary.emoji}</span>
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] font-extrabold text-[var(--ink-3)] uppercase tracking-wider mb-0.5">{secondary.context}</span>
                <span className="text-sm font-black text-[var(--ink)] leading-snug">{secondary.title}</span>
                <span className="text-xs font-semibold text-[var(--ink-3)] line-clamp-1">{secondary.reason_text}</span>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-[var(--primary)] text-xs font-extrabold">
                {secondary.estimated_minutes} min <ArrowRight className="w-3.5 h-3.5"/>
              </div>
            </motion.button>
          )}

          {optional && (
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(optional)} 
              className="w-full theme-card p-4 flex items-center gap-4 text-left border border-[var(--border)] hover:shadow-[var(--shadow-lifted)] transition-all opacity-90 hover:opacity-100"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${optional.color}-500/10`}>
                <span className="text-2xl">{optional.emoji}</span>
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] font-extrabold text-[var(--ink-3)] uppercase tracking-wider mb-0.5">{optional.context}</span>
                <span className="text-sm font-black text-[var(--ink)] leading-snug">{optional.title}</span>
                <span className="text-xs font-semibold text-[var(--ink-3)] line-clamp-1">{optional.reason_text}</span>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-[var(--ink-3)] text-xs font-extrabold">
                {optional.estimated_minutes} min <ArrowRight className="w-3.5 h-3.5"/>
              </div>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
