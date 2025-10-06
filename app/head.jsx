// app/head.jsx
export default function Head() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tradepage.link';

  return (
    <>
      <title>TradePage</title>
      <meta name="description" content="Your business in a link" />

      {/* Open Graph */}
      <meta property="og:site_name" content="TradePage" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={base} />
      <meta property="og:title" content="TradePage — Your business in a link" />
      <meta
        property="og:description"
        content="Your business in a link"
      />
      <meta property="og:image" content={`${base}/og-default.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="TradePage — Your business in a link" />
      <meta
        name="twitter:description"
        content="Your business in a link"
      />
      <meta name="twitter:image" content={`${base}/og-default.png`} />
    </>
  );
}
