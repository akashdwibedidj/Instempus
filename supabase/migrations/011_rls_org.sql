-- 011_rls_org.sql — RLS policies for organisational structure tables
-- Rule: any authenticated user can read; only admin can write.
-- Append-only. Never edit this file; create a new migration for changes.

-- Helper: read the custom 'role' claim injected by the Supabase auth hook (Phase 2).
-- Falls back to reading profiles.role when JWT claim not yet populated.
-- We use a security-definer function so RLS policies stay simple.
create or replace function public.current_user_role()
returns text
language sql stable security definer
set search_path = public
as $$
  select coalesce(
    auth.jwt() ->> 'user_role',          -- custom claim set by Phase-2 hook
    (select role from public.profiles where id = auth.uid())
  );
$$;

-- ─── streams ──────────────────────────────────────────────────────────────────
create policy "streams: authenticated read"
  on public.streams for select
  to authenticated
  using (true);

create policy "streams: admin write"
  on public.streams for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── departments ──────────────────────────────────────────────────────────────
create policy "departments: authenticated read"
  on public.departments for select
  to authenticated
  using (true);

create policy "departments: admin write"
  on public.departments for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── section_slots ────────────────────────────────────────────────────────────
create policy "section_slots: authenticated read"
  on public.section_slots for select
  to authenticated
  using (true);

create policy "section_slots: admin write"
  on public.section_slots for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── hostels ──────────────────────────────────────────────────────────────────
create policy "hostels: authenticated read"
  on public.hostels for select
  to authenticated
  using (true);

create policy "hostels: admin write"
  on public.hostels for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── canteens ─────────────────────────────────────────────────────────────────
create policy "canteens: authenticated read"
  on public.canteens for select
  to authenticated
  using (true);

create policy "canteens: admin write"
  on public.canteens for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');
