// app/[slug]/layout.jsx
import { createClient } from '@supabase/supabase-js';

export async function generateMetadata({ params }) {
  const { slug } = params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );

  const { data } = await supabase
    .from('profiles')
    .select('slug,name,trade,city,about,avatar_path')
    .ilike('slug', slug)
    .maybeSingle();

  const base =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tradepage.link';
  const url = `${base}/${slug}`;

  const title = data
    ? `${data.name || data.slug} — ${[data.trade, data.city]
        .filter(Boolean)
        .join(' • ')}`
    : 'TradePage — Your business in a link';

  const description = data?.about?.trim()
    ? data.about.trim().slice(0, 160)
    : 'Your business in a link';

  const image =
    data?.avatar_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${encodeURIComponent(
          data.avatar_path
        )}`
      : `${base}/og-default.png`;

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      url,
      siteName: 'TradePage',
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default function ProfileLayout({ children }) {
  // Just render the client page inside
  return children;
}
