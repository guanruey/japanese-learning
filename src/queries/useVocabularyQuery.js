import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase'

export function useVocabularyQuery() {
  return useQuery({
    queryKey: ['vocabulary'],
    queryFn: async () => {
      // NOTE: This fetches all vocabulary. 
      // As the database grows, this should be paginated or lazy loaded.
      const { data, error } = await supabase.from('vocabulary').select('*').order('level, id')
      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60 * 60, // Vocabulary rarely changes, cache for an hour
    refetchOnWindowFocus: false,
  })
}
