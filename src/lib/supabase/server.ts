import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/database.types'
import { supabaseAnonKey, supabaseUrl } from './config'

// Create a server-side Supabase client for Server Components
export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map(({ name, value }) => ({ name, value }))
      },
      setAll() {
        // No-op in server components, cookies are read-only
      },
    },
  })
}
