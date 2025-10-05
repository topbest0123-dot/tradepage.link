'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthLinks() {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let ignore = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!ignore) setSession(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });

    return () => {
      ignore = true;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

// ...imports & hooks stay the same

return (
  <>
    <nav className="hdr-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {!session ? (
        pathname !== '/signin' && (
          <Link href="/signin" className="hdr-link">
            Sign in
          </Link>
        )
      ) : (
        <>
          {/* DASHBOARD: button that looks like a link, forces white */}
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="linklike"
          >
            Dashboard
          </button>

          <button
            onClick={signOut}
            className="hdr-btn"
            style={{
              background: 'transparent',
              border: '1px solid #213a6b',
              padding: '6px 10px',
              borderRadius: 8,
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            Sign out
          </button>
        </>
      )}
    </nav>

    <style jsx>{`
      .hdr-link {
        color: #fff;
        text-decoration: underline;
        font-weight: 600;
      }
      /* “Dashboard” button styled as a link, permanently white */
      .linklike {
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        color: #fff;            /* stays white, not affected by :visited */
        text-decoration: underline;
        font: inherit;
        font-weight: 600;
      }
      .linklike:hover,
      .hdr-link:hover {
        text-decoration: underline;
      }
      .hdr-btn:hover,
      .hdr-btn:focus-visible {
        background: #13233b;
        outline: none;
      }
    `}</style>
  </>
);
