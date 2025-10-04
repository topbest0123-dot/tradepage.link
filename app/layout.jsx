export const metadata = { title: 'TradePage', description: 'Your business in a link' };

import AuthHandler from './AuthHandler'   // ⬅️ NEW

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Arial', padding:0, margin:0, background:'#0a0f14', color:'#eaf2ff'}}>
        <AuthHandler />                    // ⬅️ NEW (runs on every page)
        <div style={{maxWidth:900, margin:'0 auto', padding:16}}>
          <header style={{padding:'16px 0', borderBottom:'1px solid #213a6b'}}>
            <b>TradePage</b> <span style={{opacity:.7}}>— Your business in a link</span>
            <span style={{float:'right'}}>
              <a href="/" style={{color:'#b8ccff', textDecoration:'none', marginRight:12}}>Home</a>
              <a href="/signin" style={{color:'#b8ccff', textDecoration:'none', marginRight:12}}>Sign in</a>
              <a href="/dashboard" style={{color:'#b8ccff', textDecoration:'none'}}>Dashboard</a>
            </span>
          </header>
          <main style={{padding:'16px 0'}}>{children}</main>
          <footer style={{padding:'24px 0', borderTop:'1px solid #213a6b', opacity:.7}}>© {new Date().getFullYear()} TradePage</footer>
        </div>
      </body>
    </html>
  );
}
