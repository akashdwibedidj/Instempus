-- 003_slots_enrollments.sql — Teacher-slot bindings, student enrollments, hostel rooms/assignments
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 001_org.sql and 002_users.sql.

-- ─── slot_assignments ─────────────────────────────────────────────────────────
-- Binds a teacher to a section_slot for an academic year.
-- One slot can have multiple teachers (e.g. lab + lecture split).
create table if not exists public.slot_assignments (
  id              uuid primary key default gen_random_uuid(),
  slot_id         uuid not null references public.section_slots(id) on delete cascade,
  teacher_id      uuid not null references public.profiles(id) on delete cascade,
  academic_year   text not null,               -- '2025-26'
  subject         text,                        -- optional: subject name for this assignment
  created_at      timestamptz not null default now(),
  unique (slot_id, teacher_id, academic_year)
);

comment on table public.slot_assignments is
  'Teacher assigned to a section_slot for a given academic year';

alter table public.slot_assignments enable row level security;

-- ─── student_enrollments ──────────────────────────────────────────────────────
-- Binds a student to a section_slot for an academic year.
do $$ begin
  create type public.enrollment_status_enum as enum (
    'active',
    'backlog',
    'detained',
    'graduated',
    'transferred'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.student_enrollments (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references public.profiles(id) on delete cascade,
  slot_id         uuid not null references public.section_slots(id) on delete cascade,
  academic_year   text not null,
  status          public.enrollment_status_enum not null default 'active',
  enrolled_at     timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (student_id, slot_id, academic_year)
);

comment on table public.student_enrollments is
  'Student enrolled in a section_slot for a given academic year';

alter table public.student_enrollments enable row level security;

drop trigger if exists student_enrollments_updated_at on public.student_enrollments;
create trigger student_enrollments_updated_at
  before update on public.student_enrollments
  for each row execute function public.set_updated_at();

-- ─── hostel_rooms ─────────────────────────────────────────────────────────────
create table if not exists public.hostel_rooms (
  id           uuid primary key default gen_random_uuid(),
  hostel_id    uuid not null references public.hostels(id) on delete cascade,
  floor        smallint not null check (floor >= 0),
  room_no      text not null,
  capacity     smallint not null default 2 check (capacity > 0),
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  unique (hostel_id, room_no)
);

comment on table public.hostel_rooms is 'Individual rooms within a hostel';
alter table public.hostel_rooms enable row level security;

-- ─── hostel_assignments ───────────────────────────────────────────────────────
-- Assigns a student to a room for an academic year.
create table if not exists public.hostel_assignments (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references public.profiles(id) on delete cascade,
  room_id         uuid not null references public.hostel_rooms(id) on delete restrict,
  academic_year   text not null,
  warden_id       uuid references public.profiles(id) on delete set null,
  assigned_at     timestamptz not null default now(),
  vacated_at      timestamptz,                 -- null = currently assigned
  unique (student_id, academic_year)           -- one room per student per year
);

comment on table public.hostel_assignments is
  'Student assigned to a hostel room for an academic year';

alter table public.hostel_assignments enable row level security;

-- ─── now add FK constraint back to profiles.roll_no check ─────────────────────
-- Enforce: a student can only enroll if their roll_no is in pre_registered_students
-- Done as a DB function + trigger rather than a FK (roll_no is not a PK).
create or replace function public.check_student_pre_registered()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_roll_no text;
begin
  select roll_no into v_roll_no from public.profiles where id = new.student_id;
  if not exists (
    select 1 from public.pre_registered_students
    where roll_no = v_roll_no and not used
  ) then
    raise exception 'Student roll_no % is not pre-registered or already used', v_roll_no;
  end if;
  -- mark as used
  update public.pre_registered_students set used = true where roll_no = v_roll_no;
  return new;
end;
$$;

-- Trigger fires only on first (active) enrollment creation.
drop trigger if exists enforce_pre_registration on public.student_enrollments;
create trigger enforce_pre_registration
  before insert on public.student_enrollments
  for each row
  when (new.status = 'active')
  execute function public.check_student_pre_registered();
