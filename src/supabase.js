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
