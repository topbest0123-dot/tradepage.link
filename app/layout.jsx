'use client'
import Script from 'next/script'
import NavAuth from '@/components/NavAuth'

export const metadata = { title: 'TradePage', description: 'Your business in a link' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Arial',padding:0,margin:0,background:'#0a0f14',color:'#eaf2ff'}}>
        <Script id="supabase-hash-redirect" strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `
(function(){
  try {
    if (window.location.hash && window.location.hash.indexOf('access_token=') !== -1) {
      window.location.replace('/auth/callback' + window.location.hash);
    }
  } catch (e) { console.error('hash redirect error', e); }
})();
`}} />
        <div style={{maxWidth:900, margin:'0 auto', padding:16}}>
          <header style={{padding:'16px 0', borderBottom:'1px solid #213a6b', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
            <div>
              <b>TradePage</b> <span style={{opacity:.7}}>— Your business in a link</span>
            </div>
            <nav style={{display:'flex', alignItems:'center', gap:12}}>
