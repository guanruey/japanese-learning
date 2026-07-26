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
export async function fetchDueReviews(userId) {
  if (!userId) return []
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .lte('due', nowIso)

  if (error) {
    console.warn('[Supabase] Error fetching due SRS reviews:', error)
    return []
  }
  return data || []
}

/**
 * Insert newly extracted vocabulary from AI directly into the vocabulary table
 * and optionally initialize their user_progress (FSRS) to 0.
 */
export async function insertVocabulary(wordsArray, userId) {
  if (!wordsArray || wordsArray.length === 0) return;

  const records = wordsArray.map(w => ({
    word: w.word,
    reading: w.reading || '',
    meaning: w.meaning || '',
    level: 'N5', // default extracted level
    category: 'AI_Extracted'
  }));

  try {
    // 1. Insert into vocabulary (Supabase will return inserted rows with IDs if we select())
    const { data, error } = await supabase
      .from('vocabulary')
      .insert(records)
      .select('id');

    if (error) {
      console.error('Error inserting extracted vocab:', error);
      return;
    }

    // 2. Automatically hydrate them into FSRS progress for the user
    if (data && data.length > 0 && userId) {
      const progressRecords = data.map(item => ({
        user_id: userId,
        item_type: 'vocabulary',
        item_id: item.id,
        stability: 1.0, // Initial FSRS stability
        difficulty: 5.0, // Initial FSRS difficulty
        reps: 0,
        lapses: 0,
        state: 0, // 0 = New
        last_review: new Date().toISOString(),
        due: new Date().toISOString()
      }));

      await supabase.from('user_progress').upsert(progressRecords);
    }
  } catch (err) {
    console.error('insertVocabulary exception:', err);
  }
}

/**
 * SRS: Update or insert progress for a single item
 */
export async function upsertUserProgress({
  userId,
  wordId,
  stability,
  difficulty,
  retrievability,
  state,
  lastReview,
  due,
  reps,
  lapses
}) {
  const { data, error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      word_id: wordId,
      stability: stability,
      difficulty: difficulty,
      retrievability: retrievability,
      state: state,
      last_review: lastReview,
      due: due,
      reps: reps,
      lapses: lapses,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,word_id' }
  )

  if (error) {
    console.warn('[Supabase] Error upserting SRS progress:', error)
  }
  return { data, error }
}

