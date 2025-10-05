'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const handleSignIn = async (e) => {
    e.preventDefault()
    setMsg(''); setErr('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })

    if (error) setErr(error.message)
    else setMsg('Magic link sent. Check your inbox.')
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-4">
      <h2 className="text-2xl font-bold mb-4">Sign in</h2>
      <form onSubmit={handleSignIn} className="space-y-3">
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]"
        />
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
          Send magic link
        </button>
      </form>
      {msg && <p className="text-green-400 mt-3">{msg}</p>}
      {err && <p className="text-red-400 mt-3">{err}</p>}
    </main>
  )
}
