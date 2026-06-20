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
      }
    },
  }
}

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : createFallbackSupabaseClient()
