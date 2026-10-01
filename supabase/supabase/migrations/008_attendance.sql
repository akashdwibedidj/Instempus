-- 008_attendance.sql — Attendance sessions and per-student records
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 001, 002, 003.

-- ─── attendance_sessions ──────────────────────────────────────────────────────
-- One row per class session (teacher opens a session for a slot on a date).
create table if not exists public.attendance_sessions (
  id            uuid primary key default gen_random_uuid(),
  slot_id       uuid not null references public.section_slots(id) on delete cascade,
  date          date not null,
  subject       text,                           -- optional subject label
  created_by    uuid not null references public.profiles(id) on delete restrict,
  closed_at     timestamptz,                    -- null = session still open for marking
  created_at    timestamptz not null default now(),
  unique (slot_id, date, subject)               -- one session per slot+date+subject
);

comment on table public.attendance_sessions is
  'One attendance session per class; teacher opens it, marks records, then closes it';

alter table public.attendance_sessions enable row level security;

create index if not exists idx_attendance_sessions_slot
  on public.attendance_sessions (slot_id, date desc);

-- ─── attendance_records ───────────────────────────────────────────────────────
do $$ begin
  create type public.attendance_status_enum as enum (
    'present',
    'absent',
    'late'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.attendance_records (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references public.attendance_sessions(id) on delete cascade,
  student_id    uuid not null references public.profiles(id) on delete cascade,
  status        public.attendance_status_enum not null default 'absent',
  marked_by     uuid references public.profiles(id) on delete set null,
  marked_at     timestamptz not null default now(),
  note          text,                           -- optional remark (e.g. 'medical leave')
  unique (session_id, student_id)
);

comment on table public.attendance_records is
  'Per-student attendance status for one session';

alter table public.attendance_records enable row level security;

create index if not exists idx_attendance_records_session
  on public.attendance_records (session_id);

create index if not exists idx_attendance_records_student
  on public.attendance_records (student_id, marked_at desc);
