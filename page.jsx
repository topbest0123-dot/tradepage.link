import { supabase } from '@/lib/supabaseClient'
export const revalidate = 60

export default async function Page({ params }) {
  const { slug } = params
  const { data } = await supabase
    .from('pages')
    .select('name,trade,city,phone,whatsapp,email,about,areas,hours,services,prices,gallery')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) return <main style={{padding:24}}>Not found</main>

  const tel = (data.phone||'').replace(/\s+/g,'')
  const wa = (data.whatsapp||'').replace(/\D/g,'')
  const areas = (data.areas||'').split(',').map(s=>s.trim()).filter(Boolean)
  const services = (data.services||'').split('\n').map(s=>s.trim()).filter(Boolean)
  const prices = (data.prices||'').split('\n').map(s=>s.trim()).filter(Boolean)
  const gallery = Array.isArray(data.gallery) ? data.gallery : []

  return (
    <main style={{padding:24}}>
      <section style={{border:'1px solid #213a6b', borderRadius:16, padding:16, background:'linear-gradient(180deg,#0f1830,#0b1326)'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10}}>
          <div>
            <h1 style={{margin:'0 0 6px'}}>{data.name}</h1>
            <div style={{opacity:.8}}>{data.trade} • {data.city}</div>
          </div>
          <div style={{display:'flex', gap:10}}>
            {data.phone && <a href={`tel:${tel}`} style={btn}>Call</a>}
            {data.whatsapp && <a href={`https://wa.me/${wa}`} style={btnGhost} target="_blank">WhatsApp</a>}
            {data.email && <a href={`mailto:${data.email}`} style={btnGhost}>Email</a>}
          </div>
        </div>
      </section>

      <div style={{height:12}} />

      <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div style={card}>
          <h3>About</h3>
          <p style={{opacity:.9}}>{data.about}</p>
          <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
            {areas.map((a,i)=>(<span key={i} style={badge}>{a}</span>))}
          </div>
        </div>
        <div style={card}>
          <h3>Prices</h3>
          <div>
            {prices.length ? prices.map((p,i)=>(<div key={i} style={{marginBottom:6}}><span style={badge}>from</span> {p}</div>)) : <p style={{opacity:.7}}>Ask for a free quote</p>}
          </div>
        </div>
      </section>

      <div style={{height:12}} />

      <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div style={card}>
          <h3>Services</h3>
          <div>
            {services.length ? services.map((s,i)=>(<div key={i}>• {s}</div>)) : <p style={{opacity:.7}}>Add your services</p>}
          </div>
        </div>
        <div style={card}>
          <h3>Hours & Contact</h3>
          <p style={{opacity:.8}}>{data.hours}</p>
          <p style={{opacity:.8, whiteSpace:'pre-wrap'}}>{[data.phone, data.email].filter(Boolean).join('\n')}</p>
        </div>
      </section>
    </main>
  )
}

const card = { border:'1px solid #213a6b', borderRadius:16, padding:16, background:'linear-gradient(180deg,#0f1830,#0b1326)' }
const badge = { display:'inline-block', padding:'4px 8px', borderRadius:999, border:'1px solid #223a6a', background:'#122448', color:'#b8ccff', fontSize:12, marginRight:6 }
const btn = { padding:'10px 14px', borderRadius:10, border:'1px solid #27406e', background:'linear-gradient(135deg,#66e0b9,#8ab4ff)', color:'#08101e', fontWeight:700, textDecoration:'none' }
const btnGhost = { padding:'10px 14px', borderRadius:10, border:'1px solid #27406e', background:'#0b1428', color:'#eaf2ff', fontWeight:700, textDecoration:'none' }
