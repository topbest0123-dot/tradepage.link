'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      try {
        // Try to exchange *the full current URL* for a session (handles all params)
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) {
          console.error('Auth exchange error:', error.message)
        }
      } catch (e) {
        console.error('Unexpected auth error:', e)
      } finally {
        // Whether it succeeded or not, send user to dashboard (UI will reflect session)
        router.replace('/dashboard')
      }
    }
    run()
  }, [router])

  return <main style={{ padding: 24 }}>Signing you in…</main>
}
