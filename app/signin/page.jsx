'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
export default function SignIn(){
  const [email, setEmail] = useState(''), [sent, setSent] = useState(false), [error, setError] = useState('')
  const send = async () => { setError(''); const { error } = await supabase.auth.signInWithOtp({ email }); error ? setError(error.message) : setSent(true) }
  return (
    <section>
      <h2>Sign in</h2>
      {sent ? <p>Check your email for the magic link.</p> : (
        <div>
          <input placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}
                 style={{padding:10,borderRadius:10,border:'1px solid #27406e',background:'#0b1428',color:'#eaf2ff',width:'100%',maxWidth:380}}/>
          <div style={{height:8}} />
          <button onClick={send} style={{padding:'10px 14px',borderRadius:10,border:'1px solid #27406e',
                  background:'linear-gradient(135deg,#66e0b9,#8ab4ff)',color:'#08101e',fontWeight:700}}>
            Send Magic Link
          </button>
          {error && <p style={{color:'#ff9797'}}>{error}</p>}
        </div>
      )}
      <p style={{opacity:.7, marginTop:10}}>After signing in, go to your <a href="/dashboard">Dashboard</a>.</p>
    </section>
  )
}
