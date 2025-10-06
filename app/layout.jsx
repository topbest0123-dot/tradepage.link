// app/layout.jsx
import AuthLinks from '@/components/AuthLinks';
import './globals.css';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tradepage.link';
const OG_IMAGE = new URL('/og-default.png', SITE_URL).toString();

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TradePage',
    template: '%s — TradePage',
  },
  description: 'Your business in a link',
  openGraph: {
    type: 'website',
    url: '/', // resolved against metadataBase
    siteName: 'TradePage',
    title: 'TradePage — Your business in a link',
    description: 'Your business in a link',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'TradePage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradePage',
    description: 'Your business in a link',
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Hard fallback so tags show in plain view-source, too */}
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TradePage" />
        <meta property="og:title" content="TradePage — Your business in a link" />
        <meta property="og:description" content="Your business in a link" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TradePage" />
        <meta name="twitter:description" content="Your business in a link" />
        <meta name="twitter:image" content={OG_IMAGE} />
        {/* tiny probe to confirm head injection */}
        <meta property="og:sentinel" content="1" />
      </head>

      <body
        style={{
          fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,Arial',
          padding: 0,
          margin: 0,
          background: '#0a0f14',
          color: '#eaf2ff',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
          <header
            style={{
              padding: '16px 0',
              borderBottom: '1px solid #213a6b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <b>TradePage</b>{' '}
              <span style={{ opacity: 0.7 }}>— Your business in a link</span>
            </div>
            <AuthLinks />
          </header>

          <main style={{ paddingTop: 16 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
