'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const go = async () => {
      await supabase.auth.getSession()
      router.replace('/dashboard')
    }
    go()
  }, [router])

  return <main style={{maxWidth:420, margin:'80px auto'}}>Signing you in…</main>
}
