-- 001_org.sql — Organisational structure tables
-- Append-only. Never edit this file; create a new migration for changes.

-- ─── extensions ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ─── streams ──────────────────────────────────────────────────────────────────
-- Top-level academic streams (B.Tech, MBA, MCA, …)
create table if not exists public.streams (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  code         text not null unique,          -- e.g. 'BTECH', 'MBA'
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.streams is 'Top-level academic streams (B.Tech, MBA, …)';
alter table public.streams enable row level security;

-- ─── departments ──────────────────────────────────────────────────────────────
-- Departments within a stream (CSE, ECE, ME, …)
create table if not exists public.departments (
  id           uuid primary key default gen_random_uuid(),
  stream_id    uuid not null references public.streams(id) on delete restrict,
  name         text not null,
  code         text not null,                 -- e.g. 'CSE', 'ECE'
  hod_id       uuid,                          -- references profiles(id); set after Phase 2
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (stream_id, code)
);

comment on table public.departments is 'Academic departments within a stream';
alter table public.departments enable row level security;

-- ─── section_slots ────────────────────────────────────────────────────────────
-- A slot = one section of a year in a dept for an academic year
-- Independent entity; teachers and students are linked in 003_slots_enrollments
create table if not exists public.section_slots (
  id             uuid primary key default gen_random_uuid(),
  dept_id        uuid not null references public.departments(id) on delete restrict,
  year           smallint not null check (year between 1 and 6),   -- 1–4 UG, 1–2 PG
  section        char(1) not null check (section ~ '^[A-Z]$'),     -- A, B, C …
  academic_year  text not null,                                     -- '2025-26'
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (dept_id, year, section, academic_year)
);

comment on table public.section_slots is
  'One row per section-year combination for an academic year';
alter table public.section_slots enable row level security;

-- ─── hostels ──────────────────────────────────────────────────────────────────
do $$ begin
  create type public.hostel_type_enum as enum ('boys', 'girls', 'co-ed');
exception when duplicate_object then null;
end $$;

create table if not exists public.hostels (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  type         public.hostel_type_enum not null,
  warden_id    uuid,                          -- references profiles(id); set after Phase 2
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.hostels is 'On-campus hostels';
alter table public.hostels enable row level security;

-- ─── canteens ─────────────────────────────────────────────────────────────────
create table if not exists public.canteens (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  location     text not null,
  manager_id   uuid,                          -- references profiles(id); set after Phase 2
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.canteens is 'On-campus canteens / food outlets';
alter table public.canteens enable row level security;

-- ─── auto-update updated_at ───────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists streams_updated_at on public.streams;
create trigger streams_updated_at
  before update on public.streams
  for each row execute function public.set_updated_at();

drop trigger if exists departments_updated_at on public.departments;
create trigger departments_updated_at
  before update on public.departments
  for each row execute function public.set_updated_at();

drop trigger if exists section_slots_updated_at on public.section_slots;
create trigger section_slots_updated_at
  before update on public.section_slots
  for each row execute function public.set_updated_at();

drop trigger if exists hostels_updated_at on public.hostels;
create trigger hostels_updated_at
  before update on public.hostels
  for each row execute function public.set_updated_at();

drop trigger if exists canteens_updated_at on public.canteens;
create trigger canteens_updated_at
  before update on public.canteens
  for each row execute function public.set_updated_at();

