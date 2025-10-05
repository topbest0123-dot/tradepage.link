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

  return (
    <>
      <nav className="hdr-nav">
        {!session ? (
          pathname !== '/signin' && (
            <Link href="/signin" className="hdr-link">Sign in</Link>
          )
        ) : (
          <>
            {/* Button that looks like a link → never “visited”, always white */}
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="linklike"
            >
              <span>Dashboard</span>
            </button>

            <button onClick={signOut} className="hdr-btn">
              Sign out
            </button>
          </>
        )}
      </nav>

      <style jsx>{`
        .hdr-nav { display: flex; align-items: center; gap: 12px; }

        .hdr-link {
          color: #fff;
          text-decoration: underline;
          font-weight: 600;
        }
        .hdr-link:hover,
        .hdr-link:focus-visible { text-decoration: underline; outline: none; }

        /* Dashboard button that looks like a link and is ALWAYS white */
        .linklike {
          background: transparent;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          color: #fff;                /* stays white */
          text-decoration: underline; /* looks like a link */
          font: inherit;
          font-weight: 600;
        }
        .linklike > span { color: #fff; }  /* extra safety */

        .hdr-btn {
          color: #fff;
          background: transparent;
          border: 1px solid #213a6b;
          padding: 6px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .hdr-btn:hover,
        .hdr-btn:focus-visible { background: #13233b; outline: none; }
      `}</style>
    </>
  );
}
