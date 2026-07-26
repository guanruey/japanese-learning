import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppShellStore = create(
  persist(
    (set, get) => {
      // Check legacy keys for initial migration
      const legacyOnboardingDone = localStorage.getItem('app_onboarding_done') === 'true'
      const legacyTab = localStorage.getItem('japanese-learning-active-tab') || 'dashboard'
      const legacyReadingMode = localStorage.getItem('japanese-learning-reading-guide') || 'furigana'

      return {
        activeTab: legacyTab,
        setActiveTab: (tab) => set({ activeTab: tab }),

        readingMode: legacyReadingMode,
        cycleReadingGuide: () => set((state) => {
          if (state.readingMode === 'furigana') return { readingMode: 'romaji' }
          if (state.readingMode === 'romaji') return { readingMode: 'off' }
          return { readingMode: 'furigana' }
        }),

        showOnboarding: !legacyOnboardingDone,
        completeOnboarding: () => {
          localStorage.setItem('app_onboarding_done', 'true') // Keep legacy sync just in case
          set({ showOnboarding: false })
        },

        dailyGoal: 100, // Default 100 XP (~5 mins)
        setDailyGoal: (xp) => set({ dailyGoal: xp }),
      }
    },
    {
      name: 'app-shell-storage', 
    }
  )
)
