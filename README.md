# TradePage — Next.js + Supabase Starter (Simple + Secure)

This gives you:
- Public pages by slug: `https://YOUR_DOMAIN.com/handyman001`
- Magic link sign-in (no passwords)
- Dashboard to create/edit your page
- Secure database with Row-Level Security
- Fast hosting on Vercel

---

## 0) What you need
- A GitHub account
- A Vercel account
- A Supabase project (EU region)
- A domain (optional now)

---

## 1) Supabase setup (10 minutes)

1. Create a project at https://supabase.com/ (EU region)
2. In **Settings → API**, copy your **Project URL** and **Anon Key**
3. In **Auth → Providers**, enable **Email** (Magic Link)
4. In **SQL Editor**, paste and run the contents of `supabase_schema.sql`

Optional (for photos later): create a Storage bucket called `gallery` (public read, authenticated write).

---

## 2) Deploy to Vercel (10 minutes)

1. Create a new GitHub repo and upload these files
2. Go to https://vercel.com → **Add New Project** → import your GitHub repo
3. When prompted, add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
4. Click **Deploy**

You can always redeploy after changes.

---

## 3) Try it

- Open `/signin` → enter your email → click the magic link you get
- Go to `/dashboard` → choose your **slug** (e.g. `handyman001`) and fill details
- Open `https://YOUR_DOMAIN.com/handyman001`

---

## 4) Domain (optional now)
- In Vercel → Project → **Settings → Domains** → add your domain (e.g., `www.tradepage.link`)
- Follow the DNS steps Vercel shows (A record for apex, CNAME for `www`)
- SSL is automatic

---

## 5) Notes
- All data is protected by Row-Level Security; each user can only access their own rows.
- Public pages only read rows where `published = true`.

---

## 6) Where are the main files?

- `app/[slug]/page.jsx` → public pages
- `app/signin/page.jsx` → magic link sign-in
- `app/dashboard/page.jsx` → create/edit your page
- `lib/supabaseClient.js` → client to talk to Supabase
- `supabase_schema.sql` → database structure and security policies

---

## 7) Next steps (optional)
- Add image uploads to Supabase Storage for a gallery
- Add multiple pages per user (if you want agencies)
- Add rate limiting or captcha to sign-up to reduce spam
