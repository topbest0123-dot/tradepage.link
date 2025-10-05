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
      const { data, error } = await supabase
        .from('profiles')
        .select('slug,name,trade,city,phone,whatsapp,areas,services,prices,hours')
        .ilike('slug', slug)  // case-insensitive slug match
        .maybeSingle()
      if (error) console.error(error)
      if (!data) setNotFound(true); else setP(data)
    }
    load()
  }, [slug])

  if (notFound) return <p>This page doesn’t exist yet.</p>
  if (!p) return <p>Loading…</p>

  const callHref = p.phone ? `tel:${p.phone.replace(/\s+/g,'')}` : null
  const waHref = p.whatsapp ? `https://wa.me/${p.whatsapp.replace(/\D/g,'')}` : null
  const areas = (p.areas || '').split(',').map(s => s.trim()).filter(Boolean)
  const services = (p.services || '').split('\n').map(s => s.trim()).filter(Boolean)

  return (
    <section>
      <h1 style={{marginBottom:6}}>{p.name || p.slug}</h1>
      <div style={{opacity:.8, marginBottom:16}}>{[p.trade, p.city].filter(Boolean).join(' • ')}</div>

      <div style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:20}}>
        {callHref && <a href={callHref} style={btn}>Tap to Call</a>}
        {waHref && <a href={waHref} style={btn}>WhatsApp</a>}
      </div>

      {areas.length > 0 && (
        <div style={{marginBottom:16}}>
          <b>Areas covered:</b> {areas.join(', ')}
        </div>
      )}

      {services.length > 0 && (
        <div style={{marginBottom:16}}>
          <b>Services:</b>
          <ul style={{marginTop:8}}>
            {services.map((s,i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {p.prices && (
        <div style={{marginBottom:16}}>
          <b>Prices:</b>
          <pre style={pre}>{p.prices}</pre>
        </div>
      )}

      {p.hours && (
        <div style={{marginBottom:16}}>
          <b>Hours:</b> {p.hours}
        </div>
      )}

      <p style={{opacity:.6, marginTop:24}}>Share this link: <code>/{p.slug}</code></p>
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

const pre = {
  whiteSpace:'pre-wrap',
  background:'#0b1428',
  border:'1px solid #27406e',
  borderRadius:12,
  padding:12,
  marginTop:8
}
