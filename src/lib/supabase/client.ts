'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import { supabaseAnonKey, supabaseUrl } from './config'

// Create a single supabase client for the entire client-side application
export const createClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
