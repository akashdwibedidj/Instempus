-- 009_audit_events.sql — Audit log and event bus tables with DB triggers
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 001–008.

-- ─── events ───────────────────────────────────────────────────────────────────
-- Lightweight event bus: DB triggers publish here; Edge Functions subscribe.
create table if not exists public.events (
  id              uuid primary key default gen_random_uuid(),
  source_service  text not null,               -- 'applications', 'issues', 'payments', …
  event_type      text not null,               -- 'application.submitted', 'payment.confirmed', …
  entity_id       uuid,                        -- ID of the affected row
  payload         jsonb not null default '{}', -- snapshot/context for the consumer
  processed       boolean not null default false,
  created_at      timestamptz not null default now()
);

comment on table public.events is
  'Internal event bus — populated by DB triggers, consumed by Edge Functions';

alter table public.events enable row level security;

create index if not exists idx_events_unprocessed
  on public.events (processed, created_at)
  where processed = false;

create index if not exists idx_events_type
  on public.events (source_service, event_type, created_at desc);

-- ─── audit_logs ───────────────────────────────────────────────────────────────
-- Immutable append-only log; populated only by DB triggers (never by app code).
create table if not exists public.audit_logs (
  id              uuid primary key default gen_random_uuid(),
  actor_id        uuid references public.profiles(id) on delete set null,
  action          text not null,               -- 'INSERT', 'UPDATE', 'DELETE'
  target_entity   text not null,               -- table name
  target_id       uuid,                        -- PK of the affected row
  before_data     jsonb,                       -- row state before change (null for INSERT)
  after_data      jsonb,                       -- row state after change (null for DELETE)
  timestamp       timestamptz not null default now()
);

comment on table public.audit_logs is
  'Immutable audit trail — written only by DB triggers, never by application code';

alter table public.audit_logs enable row level security;

create index if not exists idx_audit_logs_entity
  on public.audit_logs (target_entity, target_id, timestamp desc);

create index if not exists idx_audit_logs_actor
  on public.audit_logs (actor_id, timestamp desc);

-- ─── generic audit trigger function ──────────────────────────────────────────
create or replace function public.write_audit_log()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (
    actor_id, action, target_entity, target_id, before_data, after_data
  ) values (
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(
      (case when tg_op = 'DELETE' then old.id else new.id end),
      null
    ),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end;
$$;

-- ─── generic event publisher function ────────────────────────────────────────
create or replace function public.publish_event(
  p_source  text,
  p_type    text,
  p_entity  uuid,
  p_payload jsonb default '{}'
)
returns void language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.events (source_service, event_type, entity_id, payload)
  values (p_source, p_type, p_entity, p_payload);
end;
$$;

-- ─── audit triggers on high-value tables ─────────────────────────────────────

-- applications
drop trigger if exists audit_applications on public.applications;
create trigger audit_applications
  after insert or update or delete on public.applications
  for each row execute function public.write_audit_log();

-- application_step_logs
drop trigger if exists audit_step_logs on public.application_step_logs;
create trigger audit_step_logs
  after insert on public.application_step_logs
  for each row execute function public.write_audit_log();

-- complaints
drop trigger if exists audit_complaints on public.complaints;
create trigger audit_complaints
  after insert or update on public.complaints
  for each row execute function public.write_audit_log();

-- payments
drop trigger if exists audit_payments on public.payments;
create trigger audit_payments
  after insert or update on public.payments
  for each row execute function public.write_audit_log();

-- profiles (role changes, is_active changes)
drop trigger if exists audit_profiles on public.profiles;
create trigger audit_profiles
  after update on public.profiles
  for each row
  when (old.role is distinct from new.role or old.is_active is distinct from new.is_active)
  execute function public.write_audit_log();

-- ─── event triggers for Edge Function consumers ───────────────────────────────

-- Publish event when an application is submitted or status changes.
create or replace function public.trg_application_event()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  perform public.publish_event(
    'applications',
    'application.' || lower(new.status::text),
    new.id,
    jsonb_build_object(
      'type_id',  new.type_id,
      'submitter_id', new.submitter_id,
      'current_step', new.current_step,
      'status', new.status
    )
  );
  return new;
end;
$$;

drop trigger if exists event_application_status on public.applications;
create trigger event_application_status
  after insert or update of status on public.applications
  for each row execute function public.trg_application_event();
