-- Run this in the Supabase SQL editor to set up the Peloton.

create table if not exists public.bikes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  signature text,
  frame_type text not null check (frame_type in ('commuter', 'vintage', 'gravel', 'road')),
  wheel_type text not null check (wheel_type in ('classic', 'aero', 'deep')),
  paint text not null,
  accent_color text not null,
  decal text not null check (decal in ('none', 'stripes', 'checker', 'dots'))
);

alter table public.bikes enable row level security;

create policy "Anyone can view the peloton"
  on public.bikes for select using (true);

create policy "Anyone can join the peloton"
  on public.bikes for insert with check (true);
