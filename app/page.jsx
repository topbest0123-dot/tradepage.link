export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '80px auto', padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>TradePage</h1>
      <p style={{ opacity: 0.9, marginBottom: 16 }}>
        Create a simple public page with your name, trade, city, services, prices, and <b>Tap to Call / WhatsApp</b> buttons.
      </p>

      <section style={{ lineHeight: 1.6 }}>
        <ol>
          <li><a href="/signin">Sign in</a> with your email (magic link)</li>
          <li>
            Go to <a href="/dashboard">Dashboard</a> and choose your public link (slug), e.g. <code>handyman001</code>
          </li>
          <li>Share: <code>/handyman001</code></li>
        </ol>
      </section>
    </main>
  );
}
