'use client'
import { useEffect, useMemo, useState } from 'react'
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
        .select('slug,name,trade,city,phone,whatsapp,about,areas,services,prices,hours')
        .ilike('slug', slug)
        .maybeSingle()
      if (error) console.error(error)
      if (!data) setNotFound(true); else setP(data)
    }
    load()
  }, [slug])

  const areas = useMemo(() =>
    (p?.areas || '').split(',').map(s => s.trim()).filter(Boolean), [p]
  )
  const services = useMemo(() =>
    (p?.services || '').split('\n').map(s => s.trim()).filter(Boolean), [p]
  )
  const priceLines = useMemo(() =>
    (p?.prices || '').split('\n').map(s => s.trim()).filter(Boolean), [p]
  )

  if (notFound) return <div style={pageWrap}><p>This page doesn’t exist yet.</p></div>
  if (!p) return <div style={pageWrap}><p>Loading…</p></div>

  const callHref = p.phone ? `tel:${p.phone.replace(/\s+/g,'')}` : null
  const waHref  = p.whatsapp ? `https://wa.me/${p.whatsapp.replace(/\D/g,'')}` : null

  return (
    <div style={pageWrap}>
      {/* HEADER CARD */}
      <div style={headerCard}>
        <div style={headerLeft}>
          <div style={logoDot}>★</div>
          <div>
            <div style={headerName}>{p.name || p.slug}</div>
            <div style={headerSub}>{[p.trade, p.city].filter(Boolean).join(' • ')}</div>
          </div>
        </div>

        <div style={ctaRow}>
          {callHref && <a href={callHref} style={{...btn, ...btnPrimary}}>Call</a>}
          {waHref &&  <a href={waHref}  style={btn}>WhatsApp</a>}
        </div>
      </div>

      {/* GRID */}
      <div style={grid2}>
        {/* About = text only */}
       <Card title="About">
  <p style={{
    marginTop: 0,
    marginBottom: 0,
    whiteSpace: 'pre-wrap',     // ✅ preserves line breaks
    wordWrap: 'break-word',     // ✅ wraps long words properly
    overflowWrap: 'break-word', // ✅ ensures text stays inside box
    lineHeight: 1.5,            // ✅ better readability
  }}>
    {p.about && p.about.trim().length > 0
      ? p.about
      : (services[0]
          ? `${services[0]}. Reliable, friendly and affordable. Free quotes, no hidden fees.`
          : 'Reliable, friendly and affordable. Free quotes, no hidden fees.')
    }
  </p>
</Card>


        {/* Prices */}
        <Card title="Prices">
          <ul style={listReset}>
            {priceLines.length===0 && <li style={{opacity:.7}}>Please ask for a quote.</li>}
            {priceLines.map((ln,i)=>(
              <li key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <span style={tag}>from</span>
                <span>{ln}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* NEW: Areas / Zones in its own card */}
        <Card title="Areas we cover">
          {areas.length>0 ? (
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {areas.map((a,i)=> <span key={i} style={areaPill}>{a}</span>)}
            </div>
          ) : (
            <div style={{opacity:.7}}>No areas listed yet.</div>
          )}
        </Card>

        {/* Services */}
        <Card title="Services">
          <ul style={ulBullets}>
            {services.length===0 && <li style={{opacity:.7}}>No services listed yet.</li>}
            {services.map((s,i)=> <li key={i}>{s}</li>)}
          </ul>
        </Card>

        {/* Hours */}
        <Card title="Hours">
          <div style={{opacity:.9}}>{p.hours || 'Mon–Sat 08:00–18:00'}</div>
        </Card>

        {/* Gallery */}
        <Card title="Gallery" wide>
          <div style={galleryGrid}>
            <div style={galleryItem}><div style={imgPlaceholder}>work photo</div></div>
            <div style={galleryItem}><div style={imgPlaceholder}>work photo</div></div>
            <div style={galleryItem}>
              <img
                src="https://images.unsplash.com/photo-1581091870673-1e7e1c1a5b1d?q=80&w=1200&auto=format&fit=crop"
                alt="work"
                style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:14}}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ---------- Components ---------- */
function Card({ title, wide=false, children }){
  return (
    <section style={{...card, gridColumn: wide ? '1 / -1' : 'auto'}}>
      {title && <h2 style={h2}>{title}</h2>}
      {children}
    </section>
  )
}

/* ---------- Styles ---------- */
const pageWrap = { maxWidth: 980, margin: '28px auto', padding: '0 16px 48px', color: '#eaf2ff' }

const headerCard = {
  display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
  padding:'16px 18px', borderRadius:16, border:'1px solid #183153',
  background:'linear-gradient(180deg,#0f213a,#0b1524)', marginBottom:20
}
const headerLeft = { display:'flex', alignItems:'center', gap:12 }
const logoDot = {
  width:48,height:48,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',
  background:'#63d3e0',color:'#0a0f1c',fontWeight:800,fontSize:20
}
const headerName = { fontWeight:800,fontSize:22,lineHeight:'24px' }
const headerSub = { opacity:.75,fontSize:14,marginTop:4 }
const ctaRow = { display:'flex',gap:10,flexWrap:'wrap' }

const btn = { padding:'10px 16px',borderRadius:12,border:'1px solid #2f3c4f',background:'#1f2937',color:'#ffffff',textDecoration:'none',fontWeight:700 }
const btnPrimary = { background:'linear-gradient(135deg,#66e0b9,#8ab4ff)',color:'#08101e',border:'1px solid #2d4e82' }

const h2 = { margin:'0 0 10px 0',fontSize:18 }
const card = { padding:16,borderRadius:16,border:'1px solid #183153',background:'linear-gradient(180deg,#0f213a,#0b1524)' }
const grid2 = { display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:16 }

const areaPill = { padding:'6px 10px',borderRadius:999,border:'1px solid #27406e',background:'#0c1a2e',fontSize:13 }
const tag = { fontSize:12,padding:'2px 8px',borderRadius:999,border:'1px solid #27406e',background:'#0c1a2e',color:'#b8ccff' }
const ulBullets = { margin:0,paddingLeft:20,display:'grid',gap:6 }
const listReset = { margin:0,padding:0,listStyle:'none' }

const galleryGrid = { display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16 }
const galleryItem = { height:220,borderRadius:14,border:'1px solid #27406e',background:'#0b1627',overflow:'hidden' }
const imgPlaceholder = { width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',opacity:.75 }
