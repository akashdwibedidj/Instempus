-- 005_issues.sql — Issue board tables (hostel/canteen complaints)
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 001, 002, 003.

-- ─── issue_categories ─────────────────────────────────────────────────────────
-- Config table: admin-managed categories scoped to hostel or canteen.
do $$ begin
  create type public.issue_scope_enum as enum ('hostel', 'canteen');
exception when duplicate_object then null;
end $$;

create table if not exists public.issue_categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  scope_type    public.issue_scope_enum not null,
  dept_routing  text,                        -- optional: route to specific dept (e.g. 'maintenance')
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

comment on table public.issue_categories is
  'Admin-managed complaint categories scoped to hostel or canteen';

alter table public.issue_categories enable row level security;

-- ─── complaints ───────────────────────────────────────────────────────────────
do $$ begin
  create type public.complaint_status_enum as enum (
    'open',
    'in_progress',
    'resolved',
    'dismissed'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.complaints (
  id                uuid primary key default gen_random_uuid(),
  submitter_id      uuid not null references public.profiles(id) on delete cascade,
  category_id       uuid not null references public.issue_categories(id) on delete restrict,
  scope_type        public.issue_scope_enum not null,
  scope_id          uuid not null,            -- hostel_id or canteen_id (polymorphic by scope_type)
  title             text not null,
  body              text not null,
  photo_ref         text,                     -- storage path of optional photo
  status            public.complaint_status_enum not null default 'open',
  duplicate_of_id   uuid references public.complaints(id) on delete set null,
  affected_count    integer not null default 1 check (affected_count >= 1),
  idempotency_key   text not null unique,     -- client UUID to prevent double-submit
  resolved_by       uuid references public.profiles(id) on delete set null,
  resolved_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.complaints is
  'Hostel or canteen complaint; supports duplicate linking and upvote aggregation';

alter table public.complaints enable row level security;

drop trigger if exists complaints_updated_at on public.complaints;
create trigger complaints_updated_at
  before update on public.complaints
  for each row execute function public.set_updated_at();

-- Fast lookup: warden/canteen manager queue by scope + status.
create index if not exists idx_complaints_scope
  on public.complaints (scope_type, scope_id, status);

create index if not exists idx_complaints_submitter
  on public.complaints (submitter_id);

-- ─── issue_comments ───────────────────────────────────────────────────────────
create table if not exists public.issue_comments (
  id              uuid primary key default gen_random_uuid(),
  complaint_id    uuid not null references public.complaints(id) on delete cascade,
  author_id       uuid not null references public.profiles(id) on delete cascade,
  body            text not null,
  created_at      timestamptz not null default now()
);

comment on table public.issue_comments is 'Threaded comments on a complaint';
alter table public.issue_comments enable row level security;

create index if not exists idx_issue_comments_complaint
  on public.issue_comments (complaint_id, created_at);

-- ─── issue_upvotes ────────────────────────────────────────────────────────────
-- "I'm facing this too" — one per user per complaint.
create table if not exists public.issue_upvotes (
  id              uuid primary key default gen_random_uuid(),
  complaint_id    uuid not null references public.complaints(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  created_at      timestamptz not null default now(),
  unique (complaint_id, user_id)
);

comment on table public.issue_upvotes is
  'One upvote per user per complaint — "I am facing this too"';

alter table public.issue_upvotes enable row level security;
