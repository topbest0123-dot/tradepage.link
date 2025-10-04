export default function Home(){
  return (
    <section>
      <h1>Welcome to TradePage</h1>
      <p>Create a simple public page with your name, trade, city, services, prices, and <b>Tap to Call / WhatsApp</b> buttons.</p>
      <ol>
        <li><a href="/signin">Sign in</a> with your email (magic link)</li>
        <li>Go to <a href="/dashboard">Dashboard</a> and choose your public link (slug), e.g. <code>handyman001</code></li>
        <li>Share: <code>/handyman001</code></li>
      </ol>
    </section>
  );
}
