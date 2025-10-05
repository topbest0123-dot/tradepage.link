'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    slug: '',
    name: '',
    trade: '',
    city: '',
    phone: '',
    whatsapp: '',
    about: '',      // NEW
    areas: '',      // zones
    services: '',
    prices: '',
    hours: '',
  });

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/signin');
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('slug,name,trade,city,phone,whatsapp,about,areas,services,prices,hours')
        .eq('id', user.id)
        .maybeSingle();

      if (error) console.error(error);

      if (data) {
        setForm({
          slug: data.slug ?? '',
          name: data.name ?? '',
          trade: data.trade ?? '',
          city: data.city ?? '',
          phone: data.phone ?? '',
          whatsapp: data.whatsapp ?? '',
          about: data.about ?? '',
          areas: data.areas ?? '',
          services: data.services ?? '',
          prices: data.prices ?? '',
          hours: data.hours ?? '',
        });
      }

      setLoading(false);
    };

    load();
  }, [router]);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const save = async () => {
    setMsg('');

    const slug = (form.slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-') // keep alnum + '-'
      .replace(/-+/g, '-');

    if (!slug) {
      setMsg('Please choose a slug.');
      return;
    }

    // normalize services (allow user to paste with new lines, etc.)
    const normalizedServices = (form.services || '')
      .replace(/\n+/g, ',') // newlines -> commas
      .replace(/,+/g, ',') // collapse duplicate commas
      .trim();

    const row = {
      id: user.id,
      slug,
      name: form.name,
      trade: form.trade,
      city: form.city,
      phone: form.phone,
      whatsapp: form.whatsapp,
      about: form.about,
      areas: form.areas,
      services: normalizedServices,
      prices: form.prices,
      hours: form.hours,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(row, { onConflict: 'id' });

    setMsg(error ? error.message : 'Saved!');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  if (loading) return <p>Loading…</p>;

  const input = (label, name, placeholder = '') => (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ opacity: 0.8, marginBottom: 6 }}>{label}</div>
      <input
        name={name}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: 12,
          width: '100%',
          maxWidth: 520,
          borderRadius: 12,
          border: '1px solid #27406e',
          background: '#0b1428',
          color: '#eaf2ff',
        }}
      />
    </label>
  );

  const textarea = (label, name, placeholder = '') => (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ opacity: 0.8, marginBottom: 6 }}>{label}</div>
      <textarea
        name={name}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        style={{
          padding: 12,
          width: '100%',
          maxWidth: 520,
          borderRadius: 12,
          border: '1px solid #27406e',
          background: '#0b1428',
          color: '#eaf2ff',
        }}
      />
    </label>
  );

  return (
    <section>
      <h2>Dashboard</h2>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>
        Signed in as <b>{user.email}</b>
      </p>

      {input('Public link (slug)', 'slug', 'e.g. handyman001')}
      {input('Business name', 'name', 'e.g. Pro Cleaners')}
      {input('Trade', 'trade', 'e.g. House Cleaning')}
      {input('City', 'city', 'e.g. London')}
      {input('Phone (tap to call)', 'phone', 'e.g. +44 7700 900123')}
      {input('WhatsApp number', 'whatsapp', 'e.g. +44 7700 900123')}

      {/* NEW: About */}
      {textarea(
        'About (short description for your public page)',
        'about',
        'e.g. Reliable, friendly and affordable. Free quotes, no hidden fees.'
      )}

      {/* Zones / Areas */}
      {textarea(
        'Zones / Areas (comma separated)',
        'areas',
        'e.g. Camden, Islington, Hackney'
      )}

      {textarea(
        'Services (comma separated)',
        'services',
        'e.g. Regular clean, Deep clean, End of tenancy'
      )}
      {textarea(
        'Prices (free text, one per line optional)',
        'prices',
        'e.g.\nRegular clean: £18/hr\nDeep clean: from £120'
      )}
      {textarea(
        'Opening hours',
        'hours',
        'e.g. Mon–Fri 8:00–18:00'
      )}

      {/* Save button */}
      <button
        onClick={save}
        style={{
          padding: '10px 14px',
          borderRadius: 12,
          border: '1px solid #27406e',
          background: 'linear-gradient(135deg,#66e0b9,#8ab4ff)',
          color: '#08101e',
          fontWeight: 700,
          marginRight: 12,
        }}
      >
        Save
      </button>

      {/* Flash / Save message */}
      {Boolean(msg) && <p style={{ marginTop: 10 }}>{msg}</p>}
    </section>
  );
}
