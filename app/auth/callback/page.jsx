'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      // If we don't have a session yet, exchange the `code` in the URL for one
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error('Auth exchange error:', error.message)
            // optional: show a toast / message
          }
        }
      }
      // Send the user to their dashboard either way
      router.replace('/dashboard')
    }
    run()
  }, [router])

  return <main style={{padding:24}}>Signing you in…</main>
}
