// app/head.jsx
export default function Head() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tradepage.link';

  return (
    <>
      {/* Basic */}
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <title>TradePage — Your business in a link</title>

      {/* Open Graph (default site-wide) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TradePage" />
      <meta
        property="og:title"
        content="TradePage — Your business in a link"
      />
      <meta
        property="og:description"
        content="Your business in a link"
      />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content="/og-default.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="TradePage" />
      <meta
        name="twitter:description"
        content="Your business in a link"
      />
      <meta name="twitter:image" content="/og-default.png" />
    </>
  );
}
