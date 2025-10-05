'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const router = useRouter()

  // form states
  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')
  const [trade, setTrade] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // restore saved data from localStorage (once)
  useEffect(() => {
    const saved = {
      slug: localStorage.getItem('draft_slug') || '',
      name: localStorage.getItem('draft_name') || '',
      trade: localStorage.getItem('draft_trade') || '',
      city: localStorage.getItem('draft_city') || '',
    }
    setSlug(saved.slug)
    setName(saved.name)
    setTrade(saved.trade)
    setCity(saved.city)
  }, [])

  // auto-save while typing
  useEffect(() => {
    const id = setInterval(() => {
      localStorage.setItem('draft_slug', slug)
      localStorage.setItem('draft_name', name)
      localStorage.setItem('draft_trade', trade)
      localStorage.setItem('draft_city', city)
    }, 1000)
    return () => clearInterval(id)
  }, [slug, name, trade, city])

  // handle create button
  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      router.push('/signin')
      return
    }

    if (!slug || !name || !trade || !city) {
      setError('Please fill in all fields.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('pages')
      .insert([{ slug, name, trade, city }])
      .select()
      .single()

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // clear drafts
    localStorage.removeItem('draft_slug')
    localStorage.removeItem('draft_name')
    localStorage.removeItem('draft_trade')
    localStorage.removeItem('draft_city')

    router.push(`/p/${data.slug}`)
  }

  return (
    <main style={{
      maxWidth: '720px',
      margin: '80px auto',
      padding: '20px',
      color: '#eaf1ff'
    }}>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        Create your public page
      </h2>

      <form onSubmit={handleCreate}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="your public link (slug)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: '#0a0f1a',
              border: '1px solid #1b2333',
              color: '#eaf1ff'
            }}
          />

          <input
            type="text"
            placeholder="Business/Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: '#0a0f1a',
              border: '1px solid #1b2333',
              color: '#eaf1ff'
            }}
          />

          <input
            type="text"
            placeholder="Trade"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: '#0a0f1a',
              border: '1px solid #1b2333',
              color: '#eaf1ff'
            }}
          />

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: '#0a0f1a',
              border: '1px solid #1b2333',
              color: '#eaf1ff'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: loading ? '#1c3a6a' : '#2563eb',
              color: '#fff',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s ease'
            }}
          >
            {loading ? 'Creating…' : 'Create'}
          </button>

          {error && (
            <p style={{
              color: '#ff6b6b',
              marginTop: '10px',
              textAlign: 'center'
            }}>
              {error}
            </p>
          )}
        </div>
      </form>
    </main>
  )
}
