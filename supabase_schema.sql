-- Run this in Supabase SQL Editor

create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  created_at timestamptz default now()
);

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  owner uuid references profiles(id) on delete cascade,
  slug text unique not null,
  name text,
  trade text,
  city text,
  phone text,
  whatsapp text,
  email text,
  about text,
  areas text,
  hours text,
  services text,
  prices text,
  gallery jsonb default '[]'::jsonb,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
alter table pages enable row level security;

create policy "profile_select_own" on profiles
for select to authenticated using (id = auth.uid());

create policy "profile_upsert_own" on profiles
for insert with check (id = auth.uid());

create policy "profile_update_own" on profiles
for update using (id = auth.uid()) with check (id = auth.uid());

create policy "pages_public_read" on pages
for select to anon using (published = true);

create policy "pages_owner_read" on pages
for select to authenticated using (owner = auth.uid());

create policy "pages_owner_ins" on pages
for insert to authenticated with check (owner = auth.uid());

create policy "pages_owner_upd" on pages
for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid());

create policy "pages_owner_del" on pages
for delete to authenticated using (owner = auth.uid());
