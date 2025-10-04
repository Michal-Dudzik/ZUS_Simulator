import { createClient } from '@supabase/supabase-js'
import { env, hasSupabaseConfig } from '../config/env.js'

export const SUPABASE_AUTH_STORAGE_KEY = 'web-template-auth'

let client = null

if (!hasSupabaseConfig) {
  console.warn('Supabase credentials are not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable authentication.')
} else {
  client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: SUPABASE_AUTH_STORAGE_KEY,
    },
  })
}

export const supabase = client
export const isSupabaseConfigured = hasSupabaseConfig
