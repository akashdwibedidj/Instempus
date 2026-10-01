-- 004_applications.sql — Application engine tables
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 001, 002, 003.

-- ─── application_types ────────────────────────────────────────────────────────
-- Config table: each type (leave, hostel-leave, gate-pass, registration, etc.)
-- is data, not code — admin can add new types without a deploy.
create table if not exists public.application_types (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null unique,          -- 'Leave Application', 'Gate Pass', …
  slug                  text not null unique,          -- 'leave', 'gatepass', 'hostel_leave'
  form_schema           jsonb not null default '[]',   -- JSON Schema array for DynamicFormRenderer
  required_documents    jsonb not null default '[]',   -- list of doc labels student must upload
  target_approver_role  text not null,                 -- final approving role (for display)
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.application_types is
  'Config rows — one per type of application (leave, gate-pass, etc.)';

alter table public.application_types enable row level security;

create trigger application_types_updated_at
  before update on public.application_types
  for each row execute function public.set_updated_at();

-- ─── approval_steps ───────────────────────────────────────────────────────────
-- Ordered chain of approver roles for each application type.
-- step_order 1 = first reviewer, 2 = second, etc.
create table if not exists public.approval_steps (
  id                    uuid primary key default gen_random_uuid(),
  application_type_id   uuid not null
    references public.application_types(id) on delete cascade,
  step_order            smallint not null check (step_order >= 1),
  approver_role         text not null,                 -- 'teacher', 'hod', 'warden', 'principal'
  timeout_hours         integer not null default 48,   -- escalation trigger after N hours
  created_at            timestamptz not null default now(),
  unique (application_type_id, step_order)
);

comment on table public.approval_steps is
  'Ordered approval chain for an application type';

alter table public.approval_steps enable row level security;

-- ─── applications ─────────────────────────────────────────────────────────────
do $$ begin
  create type public.application_status_enum as enum (
    'submitted',
    'under_review',
    'approved',
    'declined',
    'escalated',
    'withdrawn'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.applications (
  id                uuid primary key default gen_random_uuid(),
  type_id           uuid not null
    references public.application_types(id) on delete restrict,
  submitter_id      uuid not null
    references public.profiles(id) on delete cascade,
  current_step      smallint not null default 1,       -- which approval_steps.step_order is active
  status            public.application_status_enum not null default 'submitted',
  unique_code       text not null unique
    default upper(substring(gen_random_uuid()::text, 1, 8)),  -- human-readable ref
  form_data         jsonb not null default '{}',        -- submitted form values
  signature_ref     text,                              -- storage path of signature image
  idempotency_key   text not null unique,              -- client-generated UUID to prevent doubles
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.applications is
  'One row per submitted application regardless of type';

alter table public.applications enable row level security;

create trigger applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- Index: approvers need to find applications at their step + role quickly.
create index if not exists idx_applications_status_step
  on public.applications (status, current_step);

create index if not exists idx_applications_submitter
  on public.applications (submitter_id);

-- ─── application_step_logs ────────────────────────────────────────────────────
do $$ begin
  create type public.step_decision_enum as enum (
    'approved',
    'declined',
    'escalated',
    'forwarded'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.application_step_logs (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null
    references public.applications(id) on delete cascade,
  step_id         uuid not null
    references public.approval_steps(id) on delete restrict,
  actor_id        uuid not null
    references public.profiles(id) on delete restrict,
  decision        public.step_decision_enum not null,
  reason          text,                               -- required when declining
  acted_at        timestamptz not null default now()
);

comment on table public.application_step_logs is
  'Immutable per-step audit trail for every application';

alter table public.application_step_logs enable row level security;

-- Index: fetch full timeline for one application quickly.
create index if not exists idx_step_logs_application
  on public.application_step_logs (application_id, acted_at);
