// app/[slug]/head.jsx
import { createClient } from "@supabase/supabase-js";

export default async function Head({ params }) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.tradepage.link";

  // Supabase (public anon is fine for reads)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Fetch profile by slug
  const { data: p } = await supabase
    .from("profiles")
    .select("slug,name,trade,city,avatar_path")
    .ilike("slug", params.slug)
    .maybeSingle();

  const name = p?.name || params.slug;
  const sub = [p?.trade, p?.city].filter(Boolean).join(" • ");

  const title = sub ? `${name} — ${sub}` : name;
  const desc = sub || "Public profile on TradePage";
  const url = `${base}/${encodeURIComponent(params.slug)}`;

  // Build avatar URL (fallback to default)
  const avatarUrl = p?.avatar_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${encodeURIComponent(
        p.avatar_path
      )}`
    : `${base}/og-default.png`;

  return (
    <>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={desc} />

      {/* Open Graph */}
      <meta property="og:type" content="profile" />
      <meta property="og:site_name" content="TradePage" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={avatarUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={avatarUrl} />
    </>
  );
}
