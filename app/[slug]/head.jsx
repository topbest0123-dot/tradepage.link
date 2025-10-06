// app/[slug]/head.jsx
import { createClient } from '@supabase/supabase-js';

export default async function Head({ params }) {
  const { slug } = params;

  // Server-side Supabase client using the public anon key is fine for public data
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

  const desc = data?.about?.trim()
    ? data.about.trim().slice(0, 160)
    : 'Your business in a link';

  // Build a public URL to the avatar in the `avatars` bucket
  const avatar =
    data?.avatar_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${encodeURIComponent(
          data.avatar_path
        )}`
      : `${base}/og-default.png`;

  return (
    <>
      <title>{title}</title>

      {/* Open Graph for the profile */}
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="TradePage" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={avatar} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={avatar} />
    </>
  );
}
