'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const router = useRouter()

  // form state
  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')
  const [trade, setTrade] = useState('')
  const [city, setCity] = useState('')

  // ui state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // prevent overwrites after user starts typing
  const [dirty, setDirty] = useState(false)

  // ---------- RESTORE ONCE (from localStorage, then DB if empty) ----------
  useEffect(() => {
    // 1) restore local drafts (does NOT overwrite if already typed)
    const saved = {
      slug: localStorage.getItem('draft_slug') || '',
      name: localStorage.getItem('draft_name') || '',
      trade: localStorage.getItem('draft_trade') || '',
      city: localStorage.getItem('draft_city') || '',
    }

    setSlug(prev => prev || saved.slug)
    setName(prev => prev || saved.name)
    setTrade(prev => prev || saved.trade)
    setCity(prev => prev || saved.city)

    // 2) restore once from DB (only if fields are still empty and user not typing)
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('pages')
        .select('slug,name,trade,city')
        .eq('owner', user.id)
        .single()

      if (!error && data && !dirty) {
        setSlug(prev => prev || data.slug || '')
        setName(prev => prev || data.name || '')
        setTrade(prev => prev || data.trade || '')
        setCity(prev => prev || data.city || '')
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run ONCE

  // ---------- AUTOSAVE DRAFTS WHILE TYPING ----------
  useEffect(() => {
    const id = setInterval(() => {
      localStorage.setItem('draft_slug', slug || '')
      localStorage.setItem('draft_name', name || '')
      localStorage.setItem('draft_trade', trade || '')
      localStorage.setItem('draft_city', city || '')
    }, 800)
    return () => clearInterval(id)
  }, [slug, name, trade, city])

  // also save when leaving / hiding the page, but NEVER reload/overwrite
  useEffect(() => {
    const saveNow = () => {
      localStorage.setItem('draft_slug', slug || '')
      localStorage.setItem('draft_name', name || '')
      localStorage.setItem('draft_trade', trade || '')
      localStorage.setItem('draft_city', city || '')
    }
    document.addEventListener('visibilitychange', saveNow)
    window.addEventListener('pagehide', saveNow)
    return () => {
      document.removeEventListener('visibilitychange', saveNow)
      window.removeEventListener('pagehide', saveNow)
    }
  }, [slug, name, trade, city])

  // ---------- SUBMIT ----------
  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      setError('Please sign in first.')
      router.push('/signin')
      return
    }

    // simple validation
    if (!(slug && name && trade && city)) {
      setLoading(false)
      setError('Please complete all fields.')
      return
    }

    const { data, error } = await supabase
      .from('pages')
      .insert([{ slug, name, trade, city }]) // owner set by DB default (auth.uid())
      .select()
      .single()

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // clear drafts after success
    localStorage.removeItem('draft_slug')
    localStorage.removeItem('draft_name')
    localStorage.removeItem('draft_trade')
    localStorage.removeItem('draft_city')
    setDirty(false)

    router.push(`/p/${data.slug}`)
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-4">
      <h2 className="text-2xl font-bold mb-4">Create your public page</h2>

      <form onSubmit={handleCreate} className="space-y-3">
        <input
          type="text"
          placeholder="your public link (slug)"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setDirty(true); }}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]"
        />
        <input
          type="text"
          placeholder="Business/Name"
          value={name}
          onChange={(e) => { setName(e.target.value); setDirty(true); }}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]"
        />
        <input
          type="text"
          placeholder="Trade"
          value={trade}
          onChange={(e) => { setTrade(e.target.value); setDirty(true); }}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => { setCity(e.target.value); setDirty(true); }}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? 'bg-blue-900 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Creating…' : 'Create'}
        </button>

        {error && <p className="text-red-400">{error}</p>}
      </form>
    </main>
  )
}
