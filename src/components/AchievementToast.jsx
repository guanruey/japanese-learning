import React, { useEffect, useState } from 'react'
import { Award, X } from 'lucide-react'
import { useAchievementStore } from '../stores/achievementStore'

export default function AchievementToast() {
  const popNewUnlock = useAchievementStore(state => state.popNewUnlock)
  const queueLength = useAchievementStore(state => state.newUnlocksQueue.length)
  const [currentBadge, setCurrentBadge] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // If not currently showing a badge, check the queue
    if (!isVisible && queueLength > 0) {
      const nextBadge = popNewUnlock()
      if (nextBadge) {
        setCurrentBadge(nextBadge)
        setIsVisible(true)
        
        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
          setIsVisible(false)
        }, 5000)
        return () => clearTimeout(timer)
      }
    }
  }, [isVisible, queueLength, popNewUnlock])

  if (!currentBadge) return null

  return (
    <div 
      className={`fixed top-safe pt-4 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-sm transition-all duration-500 ease-spring ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] shadow-2xl rounded-3xl p-4 flex items-center gap-4 relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        
        <div className="w-14 h-14 bg-amber-100 border-2 border-amber-300 rounded-full flex items-center justify-center text-3xl shrink-0 shadow-inner">
          {currentBadge.icon}
        </div>
        
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-1.5 text-amber-600 font-extrabold text-[10px] uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            成就解鎖
          </div>
          <h3 className="font-black text-[var(--ink)] text-lg leading-tight mt-0.5">{currentBadge.title}</h3>
          <p className="text-xs font-bold text-[var(--ink-3)] mt-0.5">{currentBadge.description}</p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1.5 text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--input-bg)] rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
