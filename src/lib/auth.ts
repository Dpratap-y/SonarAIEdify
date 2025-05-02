import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getSession() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getUserDetails() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: userDetails } = await supabase.from('users').select('*').eq('id', user.id).single()

  return userDetails
}

export async function requireAuth() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
