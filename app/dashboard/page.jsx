'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);
  const [form, setForm] = useState({ slug:'', name:'', trade:'', city:'', phone:'', whatsapp:'', email:'', about:'', areas:'', hours:'', services:'', prices:'' });
  const [msg, setMsg] = useState('');

  useEffect(()=>{ supabase.auth.getUser().then(({data})=>{ setUser(data?.user||null); setLoading(false); }); },[]);
  useEffect(()=> supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null)).data.subscription.unsubscribe,[]);
  useEffect(()=>{
    if(!user) return;
    supabase.from('pages').select('*').eq('owner', user.id).limit(1).single().then(({data})=>{
      if(data){ setPage(data); setForm(f=>({ ...f, ...data })); }
    });
  },[user]);

  const createPage = async ()=>{
    if(!user) return; setMsg('');
    const slug = (form.slug||'').trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
    if(!slug){ setMsg('Choose a public link (slug)'); return; }
    const { data, error } = await supabase.from('pages').insert({ owner: user.id, slug, name: form.name, trade: form.trade, city: form.city }).select().single();
    setMsg(error ? error.message : 'Created!');
    if(!error) setPage(data);
  };

  const save = async ()=>{
    if(!page) return; setMsg('');
    const { error } = await supabase.from('pages').update({
      name: form.name, trade: form.trade, city: form.city, phone: form.phone, whatsapp: form.whatsapp, email: form.email,
      about: form.about, areas: form.areas, hours: form.hours, services: form.services, prices: form.prices
    }).eq('id', page.id);
    setMsg(error ? error.message : 'Saved ✔');
  };

  if(loading) return <p>Loading…</p>;
  if(!user) return <section><p>Please <a href="/signin">sign in</a> first.</p></section>;

  const inputStyle = { padding:10, borderRadius:10, border:'1px solid #27406e', background:'#0b1428', color:'#eaf2ff', width:'100%', marginBottom:8 };
  const btnStyle = { padding:'10px 14px', borderRadius:10, border:'1px solid #27406e', background:'linear-gradient(135deg,#66e0b9,#8ab4ff)', color:'#08101e', fontWeight:700 };

  return (
    <section>
      <h2>Dashboard</h2>
      {!page ? (
        <div>
          <h3>Create your public page</h3>
          <input placeholder="your public link (slug), e.g. handyman001" value={form.slug} onChange={e=>setForm({...form, slug:e.target.value})} style={inputStyle}/>
          <input placeholder="Business/Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={inputStyle}/>
          <input placeholder="Trade" value={form.trade} onChange={e=>setForm({...form, trade:e.target.value})} style={inputStyle}/>
          <input placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} style={inputStyle}/>
          <button onClick={createPage} style={btnStyle}>Create</button>
          <p style={{opacity:.8}}>{msg}</p>
        </div>
      ) : (
        <div>
          <h3>Edit your page</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <div>
              <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={inputStyle}/>
              <input placeholder="Trade" value={form.trade} onChange={e=>setForm({...form, trade:e.target.value})} style={inputStyle}/>
              <input placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} style={inputStyle}/>
              <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} style={inputStyle}/>
              <input placeholder="WhatsApp" value={form.whatsapp} onChange={e=>setForm({...form, whatsapp:e.target.value})} style={inputStyle}/>
              <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} style={inputStyle}/>
              <input placeholder="Hours (e.g. Mon–Sat 8:00–18:00)" value={form.hours} onChange={e=>setForm({...form, hours:e.target.value})} style={inputStyle}/>
            </div>
            <div>
              <textarea placeholder="About" value={form.about} onChange={e=>setForm({...form, about:e.target.value})} style={{...inputStyle, minHeight:88}}/>
              <textarea placeholder="Areas (comma separated)" value={form.areas} onChange={e=>setForm({...form, areas:e.target.value})} style={{...inputStyle, minHeight:64}}/>
              <textarea placeholder="Services (one per line)" value={form.services} onChange={e=>setForm({...form, services:e.target.value})} style={{...inputStyle, minHeight:88}}/>
              <textarea placeholder="Prices (one per line)" value={form.prices} onChange={e=>setForm({...form, prices:e.target.value})} style={{...inputStyle, minHeight:88}}/>
            </div>
          </div>
          <div style={{height:8}} />
          <button onClick={save} style={btnStyle}>Save</button>
          <p style={{opacity:.8}}>{msg}</p>
          <p>Public link: <a target="_blank" href={`/${page.slug}`} style={{color:'#b8ccff'}}>/{page.slug}</a></p>
        </div>
      )}
    </section>
  );
}

