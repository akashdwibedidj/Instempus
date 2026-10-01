-- 006_groups_messages.sql — Messaging, groups, DMs, notices
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 001, 002, 003.

-- ─── groups ───────────────────────────────────────────────────────────────────
do $$ begin
  create type public.group_type_enum as enum (
    'section',    -- auto: one per section_slot
    'hostel',     -- auto: one per hostel
    'year',       -- auto: one per dept+year
    'custom',     -- admin/teacher created
    'event'       -- time-limited event group
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.groups (
  id                uuid primary key default gen_random_uuid(),
  type              public.group_type_enum not null,
  name              text not null,
  description       text,
  -- For auto-derived groups, scope_ref links to the source entity (slot_id, hostel_id, etc.)
  auto_derived_from text,                         -- 'section_slot', 'hostel', 'dept_year'
  scope_ref         uuid,                         -- foreign key to the source entity
  created_by        uuid references public.profiles(id) on delete set null,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.groups is
  'Chat groups — auto-derived (section/hostel/year) or manually created';

alter table public.groups enable row level security;

drop trigger if exists groups_updated_at on public.groups;
create trigger groups_updated_at
  before update on public.groups
  for each row execute function public.set_updated_at();

-- ─── group_members ────────────────────────────────────────────────────────────
-- Explicit membership rows for custom/event groups only.
-- Auto-derived groups (section/hostel/year) resolve membership via views (Phase 7).
create table if not exists public.group_members (
  group_id    uuid not null references public.groups(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        text not null default 'member'   -- 'member' | 'admin'
    check (role in ('member', 'admin')),
  joined_at   timestamptz not null default now(),
  primary key (group_id, user_id)
);

comment on table public.group_members is
  'Explicit membership for custom/event groups; auto groups use views';

alter table public.group_members enable row level security;

create index if not exists idx_group_members_user
  on public.group_members (user_id);

-- ─── dm_threads ───────────────────────────────────────────────────────────────
-- One row per unique pair of users; participant_a < participant_b (by UUID text).
create table if not exists public.dm_threads (
  id              uuid primary key default gen_random_uuid(),
  participant_a   uuid not null references public.profiles(id) on delete cascade,
  participant_b   uuid not null references public.profiles(id) on delete cascade,
  created_at      timestamptz not null default now(),
  -- Enforce exactly one thread per pair regardless of order
  unique (participant_a, participant_b),
  check (participant_a < participant_b)
);

comment on table public.dm_threads is 'One-to-one DM thread between two users';
alter table public.dm_threads enable row level security;

create index if not exists idx_dm_threads_participants
  on public.dm_threads (participant_a, participant_b);

-- ─── messages ─────────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id                uuid primary key default gen_random_uuid(),
  -- Exactly one of group_id or dm_thread_id must be set
  group_id          uuid references public.groups(id) on delete cascade,
  dm_thread_id      uuid references public.dm_threads(id) on delete cascade,
  sender_id         uuid not null references public.profiles(id) on delete cascade,
  body              text,
  attachment_ref    text,                       -- storage path (image/file)
  idempotency_key   text not null unique,       -- client UUID for offline outbox dedup
  sent_at           timestamptz not null default now(),
  delivered_at      timestamptz,
  read_at           timestamptz,                -- last read time (DM only; groups use separate table)
  is_notice         boolean not null default false,  -- true = teacher/HOD broadcast notice
  created_at        timestamptz not null default now(),
  -- Must belong to exactly one thread type
  check (
    (group_id is not null and dm_thread_id is null)
    or
    (group_id is null and dm_thread_id is not null)
  ),
  check (body is not null or attachment_ref is not null)
);

comment on table public.messages is
  'All messages — group chat and DMs; notices flagged with is_notice=true';

alter table public.messages enable row level security;

create index if not exists idx_messages_group
  on public.messages (group_id, sent_at desc);

create index if not exists idx_messages_dm
  on public.messages (dm_thread_id, sent_at desc);

create index if not exists idx_messages_sender
  on public.messages (sender_id);

-- ─── notice_reads ─────────────────────────────────────────────────────────────
-- Tracks per-user read + action status for notice messages.
create table if not exists public.notice_reads (
  notice_id      uuid not null references public.messages(id) on delete cascade,
  user_id        uuid not null references public.profiles(id) on delete cascade,
  read_at        timestamptz not null default now(),
  action_taken   boolean not null default false,  -- user clicked "acknowledge" / RSVP
  primary key (notice_id, user_id)
);

comment on table public.notice_reads is
  'Per-user read and acknowledgment tracking for notice messages';

alter table public.notice_reads enable row level security;

create index if not exists idx_notice_reads_user
  on public.notice_reads (user_id);
