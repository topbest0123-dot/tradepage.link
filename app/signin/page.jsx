'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })

    if (error) {
      console.error(error)
      setError(error.message)
    } else {
      setMessage('✅ Check your inbox for the login link.')
    }
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-4">
      <h2 className="text-2xl font-bold mb-4">Sign in or create an account</h2>
      <form onSubmit={handleSignIn} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Send Magic Link
        </button>
      </form>
      {message && <p className="text-green-400 mt-3">{message}</p>}
      {error && <p className="text-red-400 mt-3">{error}</p>}
    </main>
  )
}
