// app/head.jsx
export default function Head() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.tradepage.link";

  const title = "TradePage — Your business in a link";
  const desc = "Your business in a link";
  const img = `${base}/og-default.png`; // make sure /public/og-default.png exists

  return (
    <>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={desc} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TradePage" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={base} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </>
  );
}
