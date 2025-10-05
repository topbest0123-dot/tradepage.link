'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    (async () => {
      await supabase.auth.getSession() // establishes session
      router.replace('/dashboard')
    })()
  }, [router])

  return <main className="max-w-md mx-auto mt-20 p-4">Signing you in…</main>
}
