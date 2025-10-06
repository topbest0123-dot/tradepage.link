// app/og-probe/page.jsx  (SERVER component – no "use client")
export const metadata = {
  title: 'OG PROBE — TradePage',
  description: 'Probe page should render OG/Twitter tags',
  openGraph: {
    type: 'website',
    url: '/og-probe',
    siteName: 'TradePage',
    title: 'OG PROBE — TradePage',
    description: 'Probe page should render OG/Twitter tags',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Probe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OG PROBE — TradePage',
    description: 'Probe page should render OG/Twitter tags',
    images: ['/og-default.png'],
  },
};

export default function OGProbe() {
  return (
    <div style={{ padding: 24, color: '#eaf2ff' }}>
      <h1>OG Probe</h1>
      <p>If OG is wired, you’ll see meta tags in view-source for this page.</p>
    </div>
  );
}
