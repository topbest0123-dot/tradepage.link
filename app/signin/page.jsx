'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setErr('Enter a valid email.');
      return;
    }

    setSending(true);
    try {
      const origin =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin; // e.g. https://tradepage.link

      const { error } = await supabase.auth.signInWithOtp({
        email: clean,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      setMsg('Magic link sent. Check your inbox.');
    } catch (e) {
      setErr(e.message || 'Failed to send magic link.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 p-4">
      <h2 className="text-2xl font-bold mb-4">Sign in</h2>

      <form onSubmit={handleSignIn} className="space-y-3">
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-[#0a0f1a] border border-[#1b2333]"
          autoComplete="email"
          required
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          disabled={sending || !email}
        >
          {sending ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      {msg && <p className="text-green-400 mt-3">{msg}</p>}
      {err && <p className="text-red-400 mt-3">{err}</p>}
    </main>
  );
}
