import { useQuery } from '@tanstack/react-query'
import { fetchDueReviews } from '../supabase'
import { useAuth } from '../context/AuthContext'
import { useGrammarQuery } from './useGrammarQuery'
import { useVocabularyQuery } from './useVocabularyQuery'

export function useDueReviewsQuery() {
  const { user } = useAuth()
  const { data: grammarData } = useGrammarQuery()
  const { data: vocabData } = useVocabularyQuery()

  return useQuery({
    queryKey: ['dueReviews', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      
      const dueProgress = await fetchDueReviews(user.id)
      
      const vocabMap = new Map((vocabData || []).map((v) => [v.id, v]))
      const grammarMap = new Map((grammarData || []).map((g) => [g.id, g]))

      const dueItems = (dueProgress || [])
        .map((p) => {
          const rawItem = p.item_type === 'vocabulary' ? vocabMap.get(p.item_id) : grammarMap.get(p.item_id)
          return rawItem ? { ...rawItem, ...p } : null
        })
        .filter(Boolean)

      return dueItems
    },
    // Only run this query if user exists AND we have successfully fetched vocab and grammar
    enabled: !!user?.id && !!grammarData && !!vocabData,
    staleTime: 1000 * 60 * 5, // Due items change frequently, check every 5 minutes
    refetchOnWindowFocus: true,
  })
}
