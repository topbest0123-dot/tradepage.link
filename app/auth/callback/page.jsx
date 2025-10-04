'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      try {
        // A) implicit hash flow: #access_token & #refresh_token
        const hash = window.location.hash || ''
        if (hash.includes('access_token=')) {
          const p = new URLSearchParams(hash.slice(1))
          const access_token = p.get('access_token')
          const refresh_token = p.get('refresh_token')
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token })
            if (error) console.error('setSession error:', error.message)
          }
          window.history.replaceState({}, '', window.location.pathname)
        }

        // B) PKCE / code flow: ?code=...
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
          if (error) console.error('exchangeCodeForSession error:', error.message)
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
