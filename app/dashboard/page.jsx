'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard(){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => { await supabase.auth.signOut() }

  if (loading) return <p>Loading…</p>
  if (!user) return <p>Please <a href="/signin">sign in</a> first.</p>

  return (
    <section>
      <h2>Dashboard</h2>
      <p>You are signed in as <b>{user.email}</b></p>
      <button onClick={signOut} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #27406e'}}>Sign out</button>
    </section>
  )
}
