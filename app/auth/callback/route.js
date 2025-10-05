import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  const supabase = createRouteHandlerClient({ cookies });

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const url = new URL('/', request.url);
    url.searchParams.set('auth', 'failed');
    return NextResponse.redirect(url);
  }

  // Optional: if you want to route new users to onboarding, check profile here
  // const { data: { user } } = await supabase.auth.getUser();
  // const { data: profile } = await supabase.from('profiles').select('id').single();
  // const target = profile ? '/dashboard' : '/onboarding';

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
