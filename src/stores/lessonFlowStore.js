import { create } from 'zustand'
import { addXP, addDailyXP, updateStreak, getTotalXP, getStreakDays } from '../data/lessonData'

export const useLessonFlowStore = create((set) => ({
  activeLesson: null,
  lessonResult: null,

  startLesson: (node) => {
    if (!node || !node.questions || node.questions.length === 0) return
    set({ activeLesson: node, lessonResult: null })
  },

  completeLesson: (xpEarned) => {
    addXP(xpEarned)
    addDailyXP(xpEarned)
    const newStreak = updateStreak()
    set({
      activeLesson: null,
      lessonResult: {
        xpEarned,
        streakDays: newStreak,
        totalXP: getTotalXP(),
      }
    })
  },

  exitLesson: () => set({ activeLesson: null, lessonResult: null }),
  clearLessonResult: () => set({ lessonResult: null }),
}))
