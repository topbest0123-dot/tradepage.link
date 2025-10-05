import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session cookie if needed
  await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const protectedRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/settings');

  if (protectedRoute) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/signin';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Optional: if signed in and visit home, send to dashboard
  if (pathname === '/') {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/settings/:path*', '/auth/callback'],
};
