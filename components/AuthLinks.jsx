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
      <nav className="hdr-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!session ? (
          pathname !== '/signin' && (
            <Link href="/signin" className="hdr-link">
              {/* Force the text to be white regardless of :visited */}
              <span className="force-white">Sign in</span>
            </Link>
          )
        ) : (
          <>
            <Link href="/dashboard" className="hdr-link">
              {/* Force the text to be white regardless of :visited */}
              <span className="force-white">Dashboard</span>
            <
