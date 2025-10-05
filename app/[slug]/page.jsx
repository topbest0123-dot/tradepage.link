'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function PublicPage(){
  const { slug } = useParams()
  const [p, setP] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name, trade, city, phone, whatsapp, slug')
        .ilike('slug', slug)  // case-insensitive
        .maybeSingle()
      if (!data) setNotFound(true); else setP(data)
    }
    load()
  }, [slug])

  if (notFound) return <p>This page doesn’t exist yet.</p>
  if (!p) return <p>Loading…</p>

  const callHref = p.phone ? `tel:${p.phone.replace(/\s+/g,'')}` : null
  const waHref = p.whatsapp ? `https://wa.me/${p.whatsapp.replace(/\D/g,'')}` : null

  return (
    <section>
      <h1 style={{marginBottom:6}}>{p.name || p.slug}</h1>
      <div style={{opacity:.8, marginBottom:16}}>{[p.trade, p.city].filter(Boolean).join(' • ')}</div>

      <div style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:20}}>
        {callHref && <a href={callHref} style={btn}>Tap to Call</a>}
        {waHref && <a href={waHref} style={btn}>WhatsApp</a>}
      </div>

      <p style={{opacity:.75}}>Share this link: <code>/{p.slug}</code></p>
    </section>
  )
}

const btn = {
  padding:'10px 14px',
  borderRadius:12,
  border:'1px solid #27406e',
  background:'linear-gradient(135deg,#66e0b9,#8ab4ff)',
  color:'#08101e',
  fontWeight:700,
  textDecoration:'none'
}
