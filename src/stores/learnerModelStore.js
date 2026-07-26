import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLearnerModelStore = create(
  persist(
    (set, get) => ({
      // weaknessScores maps skill_key to a score (0-100)
      // Higher score = weaker (more mistakes)
      weaknessScores: {},
      
      // weaknessStats tracks sample sizes for the new Weakness Analysis v1
      weaknessStats: {},

      // Log a mistake to increment weakness
      logMistake: (skillKey) => set((state) => {
        if (!skillKey) return state
        const currentScore = state.weaknessScores[skillKey] || 0
        const currentStats = state.weaknessStats[skillKey] || { occurrences: 0, recentSuccesses: 0 }
        // Cap at 100, increment by 15 per mistake
        const newScore = Math.min(100, currentScore + 15)
        return {
          weaknessScores: {
            ...state.weaknessScores,
            [skillKey]: newScore
          },
          weaknessStats: {
            ...state.weaknessStats,
            [skillKey]: {
              occurrences: currentStats.occurrences + 1,
              recentSuccesses: 0 // Reset streak on mistake
            }
          }
        }
      }),

      // Log a success to decrease weakness
      logSuccess: (skillKey) => set((state) => {
        if (!skillKey) return state
        const currentScore = state.weaknessScores[skillKey] || 0
        const currentStats = state.weaknessStats[skillKey] || { occurrences: 0, recentSuccesses: 0 }
        
        // Decrease by 5 per success, min 0
        const newScore = Math.max(0, currentScore - 5)
        return {
          weaknessScores: {
            ...state.weaknessScores,
            [skillKey]: newScore
          },
          weaknessStats: {
            ...state.weaknessStats,
            [skillKey]: {
              ...currentStats,
              recentSuccesses: currentStats.recentSuccesses + 1 // Increase streak
            }
          }
        }
      }),
      
      // Get categorized weaknesses
      getCategorizedWeaknesses: () => {
        const scores = get().weaknessScores;
        const categories = {
          critical: [], // 70-100
          priority: [], // 50-69
          needsWork: [], // 30-49
          stable: []    // 0-29
        }
        
        Object.entries(scores).forEach(([key, score]) => {
          if (score >= 70) categories.critical.push({ key, score })
          else if (score >= 50) categories.priority.push({ key, score })
          else if (score >= 30) categories.needsWork.push({ key, score })
          else categories.stable.push({ key, score })
        })
        
        return categories
      }
    }),
    {
      name: 'learner-model-storage',
    }
  )
)
