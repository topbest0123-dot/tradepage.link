import Link from 'next/link';
import AuthLinks from '@/components/AuthLinks';

export const metadata = {
  title: 'TradePage',
  description: 'Your business in a link',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
        <style jsx global>{`
  header a,
  header a:link,
  header a:visited,
  header a:hover,
  header a:active,
  header a:focus-visible {
    color: #fff !important;
  }
`}</style>

      </body>
    </html>
  );
}
