'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      try {
        // Case A: implicit hash flow (#access_token & #refresh_token)
        const hash = window.location.hash || ''
        if (hash.includes('access_token=')) {
          const params = new URLSearchParams(hash.slice(1))
          const access_token = params.get('access_token')
          const refresh_token = params.get('refresh_token')
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token })
            if (error) console.error('setSession error:', error.message)
          }
          // Clean URL (remove hash)
          window.history.replaceState({}, '', window.location.pathname)
        }

        // Case B: code flow (?code=...) — handle too, just in case
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
          if (error) console.error('exchangeCodeForSession error:', error.message)
          // Clean URL (remove params)
          window.history.replaceState({}, '', window.location.pathname)
        }
      } catch (e) {
        console.error('Auth callback unexpected error:', e)
      } finally {
        router.replace('/dashboard')
      }
    }
    run()
  }, [router])

  return <main style={{ padding: 24 }}>Signing you in…</main>
}
