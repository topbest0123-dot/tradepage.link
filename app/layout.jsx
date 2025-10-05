'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { supabase } from '@/lib/supabaseClient';

export const metadata = { title: 'TradePage', description: 'Your business in a link' };

export default function RootLayout({ children }) {
  const [session, setSession] = useState(null);

  // Load session + keep it in sync
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) setSession(data.session || null);
    };
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s || null);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await supabase.auth.signOut();
      window.location.href = '/'; // go home after signout
    } catch (err) {
      console.error('sign out error', err);
    }
  };

  return (
    <html lang="en">
      <body style={{fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Arial',padding:0,margin:0,background:'#0a0f14',color:'#eaf2ff'}}>

        {/* Keep: redirect hash fragment from Supabase magic link */}
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
          {/* TOP NAV */}
          <header style={{padding:'16px 0', borderBottom:'1px solid #213a6b', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
            <div>
              <b>TradePage</b> <span style={{opacity:.7}}>— Your business in a link</span>
            </div>

            <nav style={{display:'flex', alignItems:'center', gap:12}}>
              <a href="/" style={{color:'#b8ccff', textDecoration:'none'}}>Home</a>

              {session ? (
                <>
                  <a href="/dashboard" style={{color:'#b8ccff', textDecoration:'none'}}>Dashboard</a>
                  <button
                    onClick={handleSignOut}
                    style={{
                      marginLeft: 8,
                      background: 'none',
                      border: '1px solid #2f3c4f',
                      color: '#b8ccff',
                      borderRadius: 10,
                      padding: '6px 10px',
                      cursor: 'pointer'
                    }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <a href="/signin" style={{color:'#b8ccff', textDecoration:'none'}}>Sign in</a>
              )}
            </nav>
          </header>

          <main style={{padding:'16px 0'}}>{children}</main>
          <footer style={{padding:'24px 0', borderTop:'1px solid #213a6b', opacity:.7}}>© {new Date().getFullYear()} TradePage</footer>
        </div>
      </body>
    </html>
  );
}
