'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard(){
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    slug: '', name: '', trade: '', city: '',
    phone: '', whatsapp: '',
    areas: '', services: '', prices: '', hours: ''
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/signin'); return }
      setUser(user)
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (error) console.error(error)
      if (data) setForm({
        slug: data.slug ?? '', name: data.name ?? '', trade: data.trade ?? '', city: data.city ?? '',
        phone: data.phone ?? '', whatsapp: data.whatsapp ?? '',
        areas: data.areas ?? '', services: data.services ?? '', prices: data.prices ?? '', hours: data.hours ?? ''
      })
      setLoading(false)
    }
    load()
  }, [router])

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const save = async () => {
    setMsg('')
    const slug = form.slug.trim().toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g,'-')
    if (!slug) { setMsg('Please choose a slug.'); return }
    const row = {
      id: user.id,
      ...form,
      slug,
      updated_at: new Date().toISOString()
    }
    const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'id' })
    setMsg(error ? error.message : 'Saved!')
  }

  const signOut = async () => { await supabase.auth.signOut(); router.replace('/') }

  if (loading) return <p>Loading…</p>

  const publicUrl = form.slug ? `https://www.tradepage.link/${form.slug.toLowerCase()}` : null

  const input = (label, name, placeholder='') => (
    <label style={{display:'block', marginBottom:12}}>
      <div style={{opacity:.8, marginBottom:6}}>{label}</div>
      <input
        name={name}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        style={{padding:12, width:'100%', maxWidth:520, borderRadius:12, border:'1px solid #27406e', background:'#0b1428', color:'#eaf2ff'}}
      />
    </label>
  )

  const textarea = (label, name, placeholder='') => (
    <label style={{display:'block', marginBottom:12}}>
      <div style={{opacity:.8, marginBottom:6}}>{label}</div>
      <textarea
        name={name}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        style={{padding:12, width:'100%', maxWidth:520, borderRadius:12, border:'1px solid #27406e', background:'#0b1428', color:'#eaf2ff'}}
      />
    </label>
  )

  return (
    <section>
      <h2>Dashboard</h2>
      <p style={{opacity:.8, marginBottom:16}}>Signed in as <b>{user.email}</b></p>

      {input('Public link (slug)', 'slug', 'e.g. handyman001')}
      {input('Business name', 'name', 'e.g. Pro Cleaners')}
      {input('Trade', 'trade', 'e.g. House Cleaning')}
      {input('City', 'city', 'e.g. London')}
      {input('Phone (tap to call)', 'phone', 'e.g. +44 7700 900123')}
      {input('WhatsApp number', 'whatsapp', 'e.g. +44 7700 900123')}

      {textarea('Areas (comma separated)', 'areas', 'e.g. Camden, Islington, Hackney')}
      {textarea('Services (one per line)', 'services', 'e.g.\nRegular clean\nDeep clean\nEnd of tenancy')}
      {textarea('Prices (free text)', 'prices', 'e.g.\nRegular clean: £18/hr\nDeep clean: from £120')}
      {textarea('Hours', 'hours', 'e.g. Mon–Fri 8:00–18:00')}

      <button onClick={save}
        style={{padding:'10px 14px', borderRadius:12, border:'1px solid #27406e',
                background:'linear-gradient(135deg,#66e0b9,#8ab4ff)', color:'#08101e',
                fontWeight:700, marginRight:12}}>
        Save
      </button>
      <button onClick={signOut} style={{padding:'10px 14px', borderRadius:12, border:'1px solid #27406e'}}>Sign out</button>

      {msg && <p style={{marginTop:10}}>{msg}</p>}
      {publicUrl && (
        <p style={{marginTop:14}}>
          Public page: <a href={`/${form.slug.toLowerCase()}`} style={{color:'#b8ccff'}}>{publicUrl}</a>
        </p>
      )}
    </section>
  )
}
