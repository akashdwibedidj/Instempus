-- 010_config.sql — App configuration tables
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 001–009. No separate RLS file — policies are inline below.

-- ─── app_settings ─────────────────────────────────────────────────────────────
-- Key-value store for runtime config; admin updates via settings UI.
-- Examples: college_name, logo_url, escalation_timeout_hours, gatepass_validity_hours
create table if not exists public.app_settings (
  key         text primary key,
  value       jsonb not null,
  description text,
  updated_by  uuid references public.profiles(id) on delete set null,
  updated_at  timestamptz not null default now()
);

comment on table public.app_settings is
  'Runtime configuration key-value store; updated by admin via settings UI';

alter table public.app_settings enable row level security;

-- All authenticated users can read settings (needed by frontend feature flags etc.)
create policy "app_settings: authenticated read"
  on public.app_settings for select
  to authenticated
  using (true);

-- Only admin can write settings.
create policy "app_settings: admin write"
  on public.app_settings for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── role_permissions ─────────────────────────────────────────────────────────
-- Runtime permission map — read by the frontend to decide what UI to show.
-- Permissions are additive; absence of a row = permission denied.
create table if not exists public.role_permissions (
  role            text not null,
  permission_key  text not null,                -- e.g. 'applications.submit', 'notices.post'
  primary key (role, permission_key)
);

comment on table public.role_permissions is
  'Role → permission mapping; read by frontend for UI gating';

alter table public.role_permissions enable row level security;

-- All authenticated users can read the permission map.
create policy "role_permissions: authenticated read"
  on public.role_permissions for select
  to authenticated
  using (true);

-- Only admin can modify.
create policy "role_permissions: admin write"
  on public.role_permissions for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── notification_templates ───────────────────────────────────────────────────
-- Templates consumed by the notify Edge Function for push/in-app notifications.
do $$ begin
  create type public.notification_channel_enum as enum (
    'in_app',
    'push',
    'email'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.notification_templates (
  id            uuid primary key default gen_random_uuid(),
  event_type    text not null,                  -- matches events.event_type
  channel       public.notification_channel_enum not null,
  -- Template uses {{variable}} placeholders; filled by Edge Function at send time
  title_tmpl    text not null,
  body_tmpl     text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (event_type, channel)
);

comment on table public.notification_templates is
  'Templates for push/in-app/email notifications keyed by event_type + channel';

alter table public.notification_templates enable row level security;

-- All authenticated users can read active templates (frontend may render previews).
create policy "notif_templates: authenticated read"
  on public.notification_templates for select
  to authenticated
  using (is_active = true);

-- Admin manages templates.
create policy "notif_templates: admin write"
  on public.notification_templates for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── seed default settings ────────────────────────────────────────────────────
-- Safe to re-run: ON CONFLICT DO NOTHING.
insert into public.app_settings (key, value, description) values
  ('college_name',              '"Instempus College"',           'Display name of the college'),
  ('college_logo_url',          'null',                          'Storage URL of college logo'),
  ('escalation_timeout_hours',  '48',                            'Hours before an application auto-escalates'),
  ('gatepass_validity_hours',   '4',                             'Hours a gate pass QR remains valid'),
  ('similarity_threshold',      '0.7',                           'pg_trgm similarity score for duplicate issue detection'),
  ('max_upload_mb',             '5',                             'Max file upload size in MB'),
  ('academic_year_current',     '"2025-26"',                     'Active academic year string'),
  ('features',                  '{"chatbot":true,"payments":true,"attendance":true}', 'Feature flags')
on conflict (key) do nothing;

-- ─── seed default role_permissions ───────────────────────────────────────────
insert into public.role_permissions (role, permission_key) values
  -- student
  ('student', 'applications.submit'),
  ('student', 'applications.view_own'),
  ('student', 'issues.submit'),
  ('student', 'issues.upvote'),
  ('student', 'messaging.send'),
  ('student', 'payments.submit'),
  ('student', 'payments.view_own'),
  ('student', 'attendance.view_own'),
  -- teacher
  ('teacher', 'applications.approve'),
  ('teacher', 'notices.post'),
  ('teacher', 'messaging.send'),
  ('teacher', 'attendance.mark'),
  ('teacher', 'attendance.view_slot'),
  -- hod
  ('hod', 'applications.approve'),
  ('hod', 'notices.post'),
  ('hod', 'messaging.send'),
  ('hod', 'org.view_dept'),
  -- warden
  ('warden', 'applications.approve'),
  ('warden', 'issues.resolve'),
  ('warden', 'notices.post'),
  ('warden', 'messaging.send'),
  -- canteen
  ('canteen', 'issues.resolve'),
  ('canteen', 'notices.post'),
  -- accounts
  ('accounts', 'payments.verify'),
  ('accounts', 'payments.view_all'),
  -- security
  ('security', 'gatepass.verify'),
  -- principal
  ('principal', 'applications.view_all'),
  ('principal', 'analytics.view'),
  ('principal', 'notices.post'),
  -- admin
  ('admin', 'org.manage'),
  ('admin', 'users.manage'),
  ('admin', 'settings.manage'),
  ('admin', 'applications.manage'),
  ('admin', 'payments.manage'),
  ('admin', 'analytics.view')
on conflict (role, permission_key) do nothing;
