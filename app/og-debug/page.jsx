// Server Component (no "use client")
export const metadata = {
  title: 'OG Debug',
  description: 'Debugging Open Graph',
  openGraph: {
    type: 'website',
    url: '/og-debug',
    siteName: 'TradePage',
    title: 'OG Debug',
    description: 'Debugging Open Graph',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'OG' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OG Debug',
    images: ['/og-default.png'],
  },
};

export default function Page() {
  return <p>OG debug page</p>;
}
