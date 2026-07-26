import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// PRD Defined Achievement Definitions
export const ACHIEVEMENTS = [
  {
    id: 'first_blood',
    title: '第一滴血',
    description: '完成首次有效學習循環',
    icon: '🩸',
    tier: 'global',
    target: 1
  },
  {
    id: 'talkative',
    title: '開口說話',
    description: '首次完成語音比對或角色扮演',
    icon: '🗣️',
    tier: 'language',
    target: 1
  },
  {
    id: 'n5_start',
    title: 'N5 啟航',
    description: '通過第一個課程節點',
    icon: '⛵',
    tier: 'track',
    target: 1
  },
  {
    id: 'perfect_session',
    title: '完美主義',
    description: '以 0 失誤完成一堂課',
    icon: '✨',
    tier: 'global',
    target: 1
  }
]

export const useAchievementStore = create(
  persist(
    (set, get) => ({
      unlockedBadges: [],      // Array of unlocked achievement IDs
      progress: {},            // Tracks progress toward targets { 'first_blood': 1 }
      newUnlocksQueue: [],     // Queue of newly unlocked badges to show in Toast UI

      // Internal helper to handle unlocks
      _checkUnlock: (id) => {
        const state = get()
        if (state.unlockedBadges.includes(id)) return false // Already unlocked
        
        const def = ACHIEVEMENTS.find(a => a.id === id)
        const currentProgress = state.progress[id] || 0
        
        if (currentProgress >= def.target) {
          set(s => ({
            unlockedBadges: [...s.unlockedBadges, id],
            newUnlocksQueue: [...s.newUnlocksQueue, def]
          }))
          return true
        }
        return false
      },

      // Action: increment progress for a specific achievement
      incrementProgress: (id, amount = 1) => {
        set(state => ({
          progress: {
            ...state.progress,
            [id]: (state.progress[id] || 0) + amount
          }
        }))
        get()._checkUnlock(id)
      },

      // Action: force unlock an achievement instantly
      unlockAchievement: (id) => {
        set(state => ({
          progress: {
            ...state.progress,
            [id]: ACHIEVEMENTS.find(a => a.id === id)?.target || 1
          }
        }))
        get()._checkUnlock(id)
      },

      // Action: pop the oldest new unlock from the queue (called by Toast UI)
      popNewUnlock: () => {
        const state = get()
        if (state.newUnlocksQueue.length === 0) return null
        const first = state.newUnlocksQueue[0]
        set(s => ({
          newUnlocksQueue: s.newUnlocksQueue.slice(1)
        }))
        return first
      }
    }),
    {
      name: 'achievement-storage',
    }
  )
)
