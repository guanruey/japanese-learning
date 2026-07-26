import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBuddyStore = create(
  persist(
    (set) => ({
      buddyId: null,
      buddyName: null,
      buddyStreak: 0,
      hasSentInvite: false,
      inviteCode: 'AI-SAAS-2026', // Mock code
      
      inviteBuddy: () => set({ hasSentInvite: true }),
      
      // Simulate buddy accepting after some time or action
      simulateBuddyAccept: () => set({ 
        buddyId: 'usr_mock_buddy_889', 
        buddyName: 'LanguageHacker_Taiwan',
        buddyStreak: 1
      }),
      
      removeBuddy: () => set({ 
        buddyId: null, 
        buddyName: null, 
        buddyStreak: 0, 
        hasSentInvite: false 
      })
    }),
    {
      name: 'buddy-storage'
    }
  )
)
