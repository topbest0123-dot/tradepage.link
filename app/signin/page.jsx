'use client'

import { useState } from 'react'
import { supabase } from '@/supabaseClient'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setMsg('')
    setErr('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    setLoading(false)
    if (error) setErr(error.message)
    else setMsg('Magic link sent! Check your inbox.')
  }

  return (
    <main style={{maxWidth:420, margin:'80px auto', padding:16}}>
      <h1 style={{fontSize:24, fontWeight:700, marginBottom:12}}>Sign in</h1>
      <form onSubmit={handleSignIn} style={{display:'grid', gap:12}}>
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
          style={{padding:10, border:'1px solid #1b2333', borderRadius:8, background:'#0a0f1a', color:'#eaf1ff'}}
        />
        <button
          type="submit"
          disabled={loading || !email}
          style={{padding:'10px 14px', borderRadius:8, background: loading ? '#1c3a6a' : '#2563eb', color:'#fff'}}
        >
          {loading ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      {msg && <p style={{color:'#8be28e', marginTop:10}}>{msg}</p>}
      {err && <p style={{color:'#ff6b6b', marginTop:10}}>{err}</p>}
    </main>
  )
}
