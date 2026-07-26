import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase'
import { grammarReadings } from '../data/generatedReadings'
import { grammarOverrides } from '../data/grammarOverrides'

function mergeGrammarReadings(rows = []) {
  return rows.map((row) => {
    const fallback = grammarReadings[row.id] || {}
    const override = grammarOverrides[row.id] || {}
    return {
      ...row,
      ...override,
      reading: override.reading || row.reading || fallback.reading || null,
      example_reading: override.example_reading || row.example_reading || fallback.example_reading || null,
    }
  })
}

export function useGrammarQuery() {
  return useQuery({
    queryKey: ['grammar'],
    queryFn: async () => {
      const { data, error } = await supabase.from('grammar').select('*').order('level, id')
      if (error) throw error
      return mergeGrammarReadings(data || [])
    },
    staleTime: 1000 * 60 * 60, // Grammar rarely changes, cache for an hour
    refetchOnWindowFocus: false,
  })
}
