-- 018_rls_audit.sql — RLS policies for events and audit_logs
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 009_audit_events.sql.

-- ─── events ───────────────────────────────────────────────────────────────────
-- The events table is written only by DB triggers (security definer functions).
-- Application code never inserts directly.

-- Admin can read events (for debugging / monitoring dashboard).
create policy "events: admin read"
  on public.events for select
  to authenticated
  using (public.current_user_role() = 'admin');

-- No direct inserts/updates from app layer — triggers use security definer.
-- No explicit insert policy needed; security definer bypasses RLS.

-- ─── audit_logs ───────────────────────────────────────────────────────────────
-- Audit logs are read-only from the app layer.
-- Writes are ONLY from the write_audit_log() security definer trigger.

-- Admin reads all audit logs.
create policy "audit_logs: admin read all"
  on public.audit_logs for select
  to authenticated
  using (public.current_user_role() = 'admin');

-- Principal reads all audit logs (read-only oversight).
create policy "audit_logs: principal read all"
  on public.audit_logs for select
  to authenticated
  using (public.current_user_role() = 'principal');

-- Users can read audit entries where they were the actor (their own action history).
create policy "audit_logs: actor read own"
  on public.audit_logs for select
  to authenticated
  using (actor_id = auth.uid());

-- Absolutely no direct inserts, updates, or deletes from app layer.
-- (write_audit_log is security definer so it bypasses RLS when writing.)
