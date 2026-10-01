-- 002_users.sql — User profiles and pre-registration list
-- Append-only. Never edit this file; create a new migration for changes.

-- ─── role enum ────────────────────────────────────────────────────────────────
create type if not exists public.user_role_enum as enum (
  'student',
  'teacher',
  'hod',
  'principal',
  'admin',
  'warden',
  'canteen',
  'accounts',
  'security'
);

-- ─── profiles ─────────────────────────────────────────────────────────────────
-- Extends auth.users (1-to-1, id = auth.uid()).
-- Created automatically on first login via trigger (Phase 2 auth hook).
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  role            public.user_role_enum not null default 'student',
  name            text not null,
  phone           text,
  roll_no         text,                         -- students only; must match pre_registered_students
  dept_id         uuid references public.departments(id) on delete set null,
  hostel_id       uuid references public.hostels(id) on delete set null,
  language_pref   text not null default 'en' check (language_pref in ('en', 'hi', 'or')),
  avatar_url      text,
  is_active       boolean not null default true,
  onboarded_at    timestamptz,                  -- set once onboarding form is submitted
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.profiles is
  'One row per Supabase auth user; extends auth.users with app-level fields';

alter table public.profiles enable row level security;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─── back-fill FK stubs from 001_org.sql ──────────────────────────────────────
-- Now that profiles exists we can enforce the loose FK references.
alter table public.departments
  add constraint fk_departments_hod
  foreign key (hod_id) references public.profiles(id) on delete set null
  not valid;                                    -- not valid = skip existing null rows

alter table public.hostels
  add constraint fk_hostels_warden
  foreign key (warden_id) references public.profiles(id) on delete set null
  not valid;

alter table public.canteens
  add constraint fk_canteens_manager
  foreign key (manager_id) references public.profiles(id) on delete set null
  not valid;

-- ─── pre_registered_students ──────────────────────────────────────────────────
-- Seeded by admin; a student can self-register only if their roll_no appears here.
create table if not exists public.pre_registered_students (
  id              uuid primary key default gen_random_uuid(),
  roll_no         text not null unique,
  dept_id         uuid not null references public.departments(id) on delete restrict,
  year            smallint not null check (year between 1 and 6),
  section         char(1) not null check (section ~ '^[A-Z]$'),
  academic_year   text not null,                -- '2025-26'
  used            boolean not null default false,  -- flipped true when student registers
  created_at      timestamptz not null default now()
);

comment on table public.pre_registered_students is
  'Allowed roll numbers; students can only sign up if their roll_no is here';

alter table public.pre_registered_students enable row level security;

-- ─── JWT role claim hook (shell) ──────────────────────────────────────────────
-- This function is called by Supabase Auth as a custom access token hook.
-- It injects user_role into the JWT so RLS policies can use auth.jwt()->>'user_role'
-- without querying profiles on every request.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql stable security definer
set search_path = public
as $$
declare
  claims    jsonb;
  user_role text;
begin
  select role::text into user_role
  from public.profiles
  where id = (event->>'user_id')::uuid;

  claims := event->'claims';
  if user_role is not null then
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  end if;

  return jsonb_set(event, '{claims}', claims);
end;
$$;

grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
