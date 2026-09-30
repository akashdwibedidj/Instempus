-- 013_rls_applications.sql — RLS policies for application engine tables
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 004_applications.sql.

-- ─── application_types ────────────────────────────────────────────────────────
-- All authenticated users can read active types (to show the submit form).
create policy "app_types: authenticated read"
  on public.application_types for select
  to authenticated
  using (is_active = true);

-- Admin sees all (including inactive).
create policy "app_types: admin read all"
  on public.application_types for select
  to authenticated
  using (public.current_user_role() = 'admin');

create policy "app_types: admin write"
  on public.application_types for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── approval_steps ───────────────────────────────────────────────────────────
create policy "approval_steps: authenticated read"
  on public.approval_steps for select
  to authenticated
  using (true);

create policy "approval_steps: admin write"
  on public.approval_steps for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── applications ─────────────────────────────────────────────────────────────

-- Submitter sees their own applications.
create policy "applications: submitter read"
  on public.applications for select
  to authenticated
  using (submitter_id = auth.uid());

-- Submitter can create (insert).
create policy "applications: submitter insert"
  on public.applications for insert
  to authenticated
  with check (submitter_id = auth.uid());

-- Submitter can withdraw (update status to 'withdrawn') only while still 'submitted'.
create policy "applications: submitter withdraw"
  on public.applications for update
  to authenticated
  using (
    submitter_id = auth.uid()
    and status = 'submitted'
  )
  with check (
    submitter_id = auth.uid()
    and status = 'withdrawn'
  );

-- Approvers (teacher/hod/warden/principal) see applications at their step.
create policy "applications: approver read own queue"
  on public.applications for select
  to authenticated
  using (
    public.current_user_role() in ('teacher', 'hod', 'warden', 'principal')
    and status in ('submitted', 'under_review', 'escalated')
    and exists (
      select 1
      from public.approval_steps aps
      where aps.application_type_id = applications.type_id
        and aps.step_order = applications.current_step
        and aps.approver_role = public.current_user_role()
    )
  );

-- Approvers can advance/decline an application (update status + current_step).
create policy "applications: approver update"
  on public.applications for update
  to authenticated
  using (
    public.current_user_role() in ('teacher', 'hod', 'warden', 'principal')
    and status in ('submitted', 'under_review', 'escalated')
    and exists (
      select 1
      from public.approval_steps aps
      where aps.application_type_id = applications.type_id
        and aps.step_order = applications.current_step
        and aps.approver_role = public.current_user_role()
    )
  )
  with check (true);

-- Security can read gate-pass applications only (to verify at gate).
create policy "applications: security read gatepass"
  on public.applications for select
  to authenticated
  using (
    public.current_user_role() = 'security'
    and type_id = (
      select id from public.application_types where slug = 'gatepass' limit 1
    )
  );

-- Admin and principal see everything.
create policy "applications: admin read all"
  on public.applications for select
  to authenticated
  using (public.current_user_role() in ('admin', 'principal'));

create policy "applications: admin update all"
  on public.applications for update
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── application_step_logs ────────────────────────────────────────────────────

-- Submitter can read the audit trail for their own application.
create policy "step_logs: submitter read"
  on public.application_step_logs for select
  to authenticated
  using (
    exists (
      select 1 from public.applications a
      where a.id = application_step_logs.application_id
        and a.submitter_id = auth.uid()
    )
  );

-- Approver can read logs for applications they acted on.
create policy "step_logs: actor read"
  on public.application_step_logs for select
  to authenticated
  using (actor_id = auth.uid());

-- Only the workflow engine (security definer function in Phase 4) inserts logs.
-- Direct inserts allowed only by admin for manual correction.
create policy "step_logs: admin insert"
  on public.application_step_logs for insert
  to authenticated
  with check (public.current_user_role() = 'admin');

-- Admin and principal read all logs.
create policy "step_logs: admin read all"
  on public.application_step_logs for select
  to authenticated
  using (public.current_user_role() in ('admin', 'principal'));

-- No updates or deletes — logs are immutable.
