-- 007_payments.sql — Fee catalogue and payment records
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 001, 002.

-- ─── fee_items ────────────────────────────────────────────────────────────────
-- Admin-managed catalogue of fees a student may owe.
create table if not exists public.fee_items (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,                -- 'Tuition Fee', 'Hostel Fee', 'Exam Fee'
  amount          numeric(12, 2) not null check (amount > 0),
  academic_year   text not null,                -- '2025-26'
  dept_id         uuid references public.departments(id) on delete set null,  -- null = all depts
  due_date        date,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.fee_items is
  'Admin-managed fee catalogue; dept_id null means applicable to all departments';

alter table public.fee_items enable row level security;

drop trigger if exists fee_items_updated_at on public.fee_items;
create trigger fee_items_updated_at
  before update on public.fee_items
  for each row execute function public.set_updated_at();

-- ─── payments ─────────────────────────────────────────────────────────────────
do $$ begin
  create type public.payment_status_enum as enum (
    'pending',      -- student submitted proof, awaiting verification
    'confirmed',    -- accounts staff verified
    'rejected'      -- proof rejected; student must re-upload
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.profiles(id) on delete cascade,
  fee_item_id       uuid not null references public.fee_items(id) on delete restrict,
  amount            numeric(12, 2) not null check (amount > 0),
  proof_ref         text,                         -- storage path of uploaded payment proof
  status            public.payment_status_enum not null default 'pending',
  verified_by       uuid references public.profiles(id) on delete set null,
  verified_at       timestamptz,
  rejection_reason  text,                         -- set when status = 'rejected'
  receipt_ref       text,                         -- storage path of generated receipt PDF
  idempotency_key   text not null unique,          -- prevents duplicate submissions
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  -- A student can pay a fee_item only once per academic_year (join fee_items for year)
  unique (student_id, fee_item_id)
);

comment on table public.payments is
  'Student payment records with proof upload and accounts verification';

alter table public.payments enable row level security;

drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

create index if not exists idx_payments_student
  on public.payments (student_id, status);

create index if not exists idx_payments_status
  on public.payments (status, created_at desc);
