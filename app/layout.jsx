import Script from 'next/script'

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
          <header style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  borderBottom: '1px solid #1e293b'
}}>
  <div style={{ fontWeight: '600', fontSize: '1.25rem' }}>
    <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>
      TradePage
    </a>
    <span style={{ color: '#94a3b8' }}> — Your business in a link</span>
  </div>

  <nav style={{ display: 'flex', gap: '1.5rem' }}>
    <a href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</a>
    {session ? (
      <>
        <a href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</a>
        <form action="/api/auth/signout" method="post" style={{ display: 'inline' }}>
          <button
            type="submit"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            Sign out
          </button>
        </form>
      </>
    ) : (
      <a href="/signin" style={{ color: '#94a3b8', textDecoration: 'none' }}>Sign in</a>
    )}
  </nav>
</header>

          <main style={{padding:'16px 0'}}>{children}</main>
          <footer style={{padding:'24px 0', borderTop:'1px solid #213a6b', opacity:.7}}>© {new Date().getFullYear()} TradePage</footer>
        </div>
      </body>
    </html>
  )
}
