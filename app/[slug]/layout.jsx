// app/[slug]/layout.jsx
// NOTE: no "use client" here – this must be a server file.

import { createClient } from '@supabase/supabase-js';

function getServerSupabase() {
  const url = process.env.https://ezwvavoikoirrvxujnfm.supabase.co;
  const key = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6d3Zhdm9pa29pcnJ2eHVqbmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0ODc3NzgsImV4cCI6MjA3NTA2Mzc3OH0.6F4rDAMNrBRivWSos88Emb39gBChQCd37YSyizm5bYk;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const supabase = getServerSupabase();
  const base =
    process.env.https://ezwvavoikoirrvxujnfm.supabase.co || 'https://www.tradepage.link';

  // fetch profile
  const { data: p } = await supabase
    .from('profiles')
    .select('slug,name,trade,city,avatar_path')
    .ilike('slug', slug)
    .maybeSingle();

  // fallback if not found
  if (!p) {
    return {
      title: 'TradePage — Your business in a link',
      openGraph: {
        type: 'website',
        url: `${base}/${slug}`,
        siteName: 'TradePage',
        title: 'TradePage — Your business in a link',
        description: 'Your business in a link',
        images: [`${base}/og-default.png`],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'TradePage — Your business in a link',
        description: 'Your business in a link',
        images: [`${base}/og-default.png`],
      },
    };
  }

  const title = (p.name || p.slug).trim();
  const subtitle = [p.trade, p.city].filter(Boolean).join(' • ') || 'Your business in a link';

  // turn storage path into a public URL if present
  let ogImage = `${base}/og-default.png`;
  if (p.avatar_path) {
    const { data } = getServerSupabase()
      .storage.from('avatars')
      .getPublicUrl(p.avatar_path);
    if (data?.publicUrl) ogImage = data.publicUrl;
  }

  return {
    title: `${title} — ${subtitle}`,
    openGraph: {
      type: 'profile',
      url: `${base}/${p.slug}`,
      siteName: 'TradePage',
      title: `${title} — ${subtitle}`,
      description: subtitle,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${subtitle}`,
      description: subtitle,
      images: [ogImage],
    },
  };
}

// Required wrapper for the route
export default function ProfileLayout({ children }) {
  return <>{children}</>;
}
