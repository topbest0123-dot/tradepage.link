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

    // get current session once
    supabase.auth.getSession().then(({ data }) => {
      if (!ignore) setSession(data.session ?? null);
    });

    // listen for changes
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
  <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    {!session ? (
      <>
        {pathname !== '/signin' && (
          <Link
            href="/signin"
            style={{ textDecoration: 'underline', color: '#fff' }}
          >
            Sign in
          </Link>
        )}
      </>
    ) : (
      <>
        <Link
          href="/dashboard"
          style={{ textDecoration: 'underline', color: '#fff' }}
        >
          Dashboard
        </Link>
        <button
          onClick={signOut}
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
);
