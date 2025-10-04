'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

// 🧠 Keep form data if tab is switched or refreshed
// 1) RESTORE ONCE (only when the component mounts)
useEffect(() => {
  const saved = {
    slug: localStorage.getItem('draft_slug') || '',
    name: localStorage.getItem('draft_name') || '',
    trade: localStorage.getItem('draft_trade') || '',
    city: localStorage.getItem('draft_city') || '',
  };

  setSlug((prev) => prev || saved.slug);
  setName((prev) => prev || saved.name);
  setTrade((prev) => prev || saved.trade);
  setCity((prev) => prev || saved.city);
}, []); // 👈 empty deps: runs once

// 2) SAVE WHILE TYPING (runs when values change)
useEffect(() => {
  const id = setInterval(() => {
    localStorage.setItem('draft_slug', slug || '');
    localStorage.setItem('draft_name', name || '');
    localStorage.setItem('draft_trade', trade || '');
    localStorage.setItem('draft_city', city || '');
  }, 1000); // adjust if you like

  return () => clearInterval(id);
}, [slug, name, trade, city]);
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useEffect } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')
  const [trade, setTrade] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false);
    // 🧠 Keep form data if tab is switched or refreshed
  useEffect(() => {
    const saved = {
      slug: localStorage.getItem('draft_slug') || '',
      name: localStorage.getItem('draft_name') || '',
      trade: localStorage.getItem('draft_trade') || '',
      city: localStorage.getItem('draft_city') || '',
    }

    // restore previous drafts
    setSlug(prev => prev || saved.slug)
    setName(prev => prev || saved.name)
    setTrade(prev => prev || saved.trade)
    setCity(prev => prev || saved.city)


    // save every few seconds while typing
    const handleBeforeUnload = () => {
      localStorage.setItem('draft_slug', slug)
      localStorage.setItem('draft_name', name)
      localStorage.setItem('draft_trade', trade)
      localStorage.setItem('draft_city', city)
    }

    const interval = setInterval(handleBeforeUnload, 2000)
    return () => clearInterval(interval)
  }, [slug, name, trade, city])



  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 1️⃣ Check if logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Please sign in first.')
      setLoading(false)
      return
    }

    // 2️⃣ Insert new page (no owner — DB fills it automatically)
    const { data, error } = await supabase
      .from('pages')
      .insert([{ slug, name, trade, city }])
      .select()
      .single()

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      // clear saved drafts after successful creation
localStorage.removeItem('draft_slug')
localStorage.removeItem('draft_name')
localStorage.removeItem('draft_trade')
localStorage.removeItem('draft_city')

      router.push(`/p/${data.slug}`)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
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
          onChange={(e) => { setCity(e.target.value); setDirty(true); }}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => { setCity(e.target.value); setDirty(true); }
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>

      {error && <p className="text-red-400 mt-3">{error}</p>}
    </div>
  )
}
