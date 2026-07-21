import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function createFallbackSupabaseClient() {
  return {
    from() {
      return {
        select() {
          return {
            order() {
              return Promise.resolve({ data: [], error: null })
            },
          }
        },
        upsert() {
          return Promise.resolve({
            data: null,
            error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.'),
          })
        },
      }
    },
  }
}

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : createFallbackSupabaseClient()

/**
 * Fetch vocabulary with optional level filter and pagination range
 */
export async function fetchVocabularyPaginated({ level, page = 0, pageSize = 50 } = {}) {
  const from = page * pageSize
  const to = from + pageSize - 1

  let query = supabase.from('vocabulary').select('*', { count: 'exact' })
  if (level && level !== 'ALL') {
    query = query.eq('level', level)
  }

  const { data, count, error } = await query.order('id', { ascending: true }).range(from, to)

  if (error) {
    console.warn('[Supabase] Error fetching paginated vocabulary:', error)
    return { data: [], count: 0, error }
  }
  return { data: data || [], count: count || 0, error: null }
}

/**
 * Fetch grammar rules with optional level filter and pagination range
 */
export async function fetchGrammarPaginated({ level, page = 0, pageSize = 50 } = {}) {
  const from = page * pageSize
  const to = from + pageSize - 1

  let query = supabase.from('grammar').select('*', { count: 'exact' })
  if (level && level !== 'ALL') {
    query = query.eq('level', level)
  }

  const { data, count, error } = await query.order('id', { ascending: true }).range(from, to)

  if (error) {
    console.warn('[Supabase] Error fetching paginated grammar:', error)
    return { data: [], count: 0, error }
  }
  return { data: data || [], count: count || 0, error: null }
}

/**
 * SRS: Fetch due reviews for a given user
 */
export async function fetchDueReviews(userId = 'local_user') {
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .lte('next_review_at', nowIso)

  if (error) {
    console.warn('[Supabase] Error fetching due SRS reviews:', error)
    return []
  }
  return data || []
}

/**
 * SRS: Update or insert progress for a single item
 */
export async function upsertUserProgress({
  userId = 'local_user',
  itemId,
  itemType,
  intervalDays,
  easeFactor,
  repetitionCount,
  nextReviewAt,
}) {
  const { data, error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      item_id: itemId,
      item_type: itemType,
      interval_days: intervalDays,
      ease_factor: easeFactor,
      repetition_count: repetitionCount,
      next_review_at: nextReviewAt,
      last_reviewed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,item_id,item_type' }
  )

  if (error) {
    console.warn('[Supabase] Error upserting SRS progress:', error)
  }
  return { data, error }
}

