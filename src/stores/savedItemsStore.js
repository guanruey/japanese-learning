import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function toggleStoredId(current = [], id) {
  const safeArr = Array.isArray(current) ? current : []
  return safeArr.includes(id) ? safeArr.filter((item) => item !== id) : [...safeArr, id]
}

export const useSavedItemsStore = create(
  persist(
    (set) => ({
      savedGrammarIds: [],
      savedVocabularyIds: [],
      savedPhraseIds: [],
      savedEnglishExpressionIds: [],
      savedEnglishVocabIds: [],

      toggleGrammarSaved: (id) => set((state) => ({ 
        savedGrammarIds: toggleStoredId(state.savedGrammarIds, id) 
      })),
      toggleVocabularySaved: (id) => set((state) => ({ 
        savedVocabularyIds: toggleStoredId(state.savedVocabularyIds, id) 
      })),
      togglePhraseSaved: (id) => set((state) => ({ 
        savedPhraseIds: toggleStoredId(state.savedPhraseIds, id) 
      })),
      toggleEnglishExpressionSaved: (id) => set((state) => ({ 
        savedEnglishExpressionIds: toggleStoredId(state.savedEnglishExpressionIds, id) 
      })),
      toggleEnglishVocabSaved: (id) => set((state) => ({ 
        savedEnglishVocabIds: toggleStoredId(state.savedEnglishVocabIds, id) 
      })),
    }),
    {
      name: 'saved-items-storage',
      // Automatic migration from old legacy keys on first load could be added,
      // but Zustand persist makes managing this super easy moving forward.
    }
  )
)
