'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const router = useRouter()

  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')
  const [trade, setTrade] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Restore once from localStorage
  useEffect(() => {
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
  }, [])

  // Auto-save drafts while typing
  useEffect(() => {
    const id = setInterval(() => {
      localStorage.setItem('draft_slug', slug || '')
      localStorage.setItem('draft_name', name || '')
      localStorage.setItem('draft_trade', trade || '')
      localStorage.setItem('draft_city', city || '')
    }, 800)
    return () => clearInterval(id)
  }, [slug, name, trade, city])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); router.push('/signin'); return }

    if (!(slug && name && trade && city)) {
      setLoading(false); setError('Please complete all fields.'); return
    }

    const { data, error } = await supabase
      .from('pages')
      .insert([{ slug, name, trade, city }]) // owner set by DEFAULT auth.uid()
      .select()
      .single()

    setLoading(false)
    if (error) { setError(error.message); return }

    // clear drafts
    localStorage.removeItem('draft_slug')
    localStorage.removeItem('draft_name')
    localStorage.removeItem('draft_trade')
    localStorage.removeItem('draft_city')

    router.push(`/p/${data.slug}`)
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-4">
      <h2 className="text-2xl font-bold mb-4">Create your public page</h2>

      <form onSubmit={handleCreate} className="space-y-3">
        <input type="text" placeholder="your public link (slug)"
          value={slug} onChange={(e)=>setSlug(e.target.value)}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]" />
        <input type="text" placeholder="Business/Name"
          value={name} onChange={(e)=>setName(e.target.value)}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]" />
        <input type="text" placeholder="Trade"
          value={trade} onChange={(e)=>setTrade(e.target.value)}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]" />
        <input type="text" placeholder="City"
          value={city} onChange={(e)=>setCity(e.target.value)}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]" />

        <button type="submit" disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-blue-900 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}>
          {loading ? 'Creating…' : 'Create'}
        </button>

        {error && <p className="text-red-400">{error}</p>}
      </form>
    </main>
  )
}
