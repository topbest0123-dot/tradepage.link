// app/[slug]/layout.jsx  (SERVER component)
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function generateMetadata({ params }) {
  const { slug } = params;
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tradepage.link';

  // fetch public profile
  const { data: p } = await supabase
    .from('profiles')
    .select('name,trade,city,about,avatar_path,slug')
    .ilike('slug', slug)
    .maybeSingle();

  const url = `${base}/${encodeURIComponent(slug)}`;
  const fallbackImage = `${base}/og-default.png`;

  if (!p) {
    return {
      title: 'TradePage',
      description: 'Your business in a link',
      alternates: { canonical: url },
      openGraph: {
        type: 'website',
        url,
        siteName: 'TradePage',
        title: 'TradePage',
        description: 'Your business in a link',
        images: [fallbackImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'TradePage',
        description: 'Your business in a link',
        images: [fallbackImage],
      },
    };
  }

  const title = p.name || slug;
  const description =
    [p.trade, p.city].filter(Boolean).join(' • ') || 'Your business in a link';

  // build public URL for avatar if present
  let imageUrl = fallbackImage;
  if (p.avatar_path) {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(p.avatar_path);
    if (data?.publicUrl) imageUrl = data.publicUrl;
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'TradePage',
      title,
      description,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function SlugLayout({ children }) {
  return <>{children}</>;
}
