-- 015_rls_messages.sql — RLS policies for messaging tables
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 006_groups_messages.sql.

-- ─── helper: is user a member of a group? ─────────────────────────────────────
-- Covers both explicit (custom/event) and auto-derived groups.
create or replace function public.is_group_member(p_group_id uuid, p_user_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    -- Explicit custom/event membership
    select 1 from public.group_members
    where group_id = p_group_id and user_id = p_user_id

    union all

    -- Auto section group: user enrolled in the slot
    select 1
    from public.groups g
    join public.section_slots ss on ss.id = g.scope_ref
    join public.student_enrollments se on se.slot_id = ss.id
    where g.id = p_group_id
      and g.auto_derived_from = 'section_slot'
      and se.student_id = p_user_id
      and se.status = 'active'

    union all

    -- Auto section group: teacher assigned to the slot
    select 1
    from public.groups g
    join public.slot_assignments sa on sa.slot_id = g.scope_ref
    where g.id = p_group_id
      and g.auto_derived_from = 'section_slot'
      and sa.teacher_id = p_user_id

    union all

    -- Auto hostel group: student/warden in that hostel
    select 1
    from public.groups g
    join public.profiles p on p.hostel_id = g.scope_ref
    where g.id = p_group_id
      and g.auto_derived_from = 'hostel'
      and p.id = p_user_id
  );
$$;

-- ─── groups ───────────────────────────────────────────────────────────────────

-- Members can read groups they belong to.
create policy "groups: member read"
  on public.groups for select
  to authenticated
  using (
    public.is_group_member(id, auth.uid())
    or public.current_user_role() in ('admin', 'principal')
  );

-- Admin can create/update groups.
create policy "groups: admin write"
  on public.groups for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Teachers can create custom groups.
create policy "groups: teacher insert custom"
  on public.groups for insert
  to authenticated
  with check (
    public.current_user_role() = 'teacher'
    and type in ('custom', 'event')
    and created_by = auth.uid()
  );

-- ─── group_members ────────────────────────────────────────────────────────────

-- Members see the member list of groups they belong to.
create policy "group_members: member read"
  on public.group_members for select
  to authenticated
  using (public.is_group_member(group_id, auth.uid()));

-- Group admin or app admin can add/remove members.
create policy "group_members: group_admin write"
  on public.group_members for all
  to authenticated
  using (
    public.current_user_role() = 'admin'
    or exists (
      select 1 from public.group_members gm
      where gm.group_id = group_members.group_id
        and gm.user_id = auth.uid()
        and gm.role = 'admin'
    )
  )
  with check (true);

-- ─── dm_threads ───────────────────────────────────────────────────────────────

-- Each participant can read their own threads.
create policy "dm_threads: participant read"
  on public.dm_threads for select
  to authenticated
  using (participant_a = auth.uid() or participant_b = auth.uid());

-- Any authenticated user can start a DM thread.
create policy "dm_threads: authenticated insert"
  on public.dm_threads for insert
  to authenticated
  with check (
    (participant_a = auth.uid() or participant_b = auth.uid())
    and participant_a < participant_b    -- enforce canonical ordering
  );

-- ─── messages ─────────────────────────────────────────────────────────────────

-- Group messages: visible to group members only.
create policy "messages: group member read"
  on public.messages for select
  to authenticated
  using (
    group_id is not null
    and public.is_group_member(group_id, auth.uid())
  );

-- DM messages: visible to thread participants only.
create policy "messages: dm participant read"
  on public.messages for select
  to authenticated
  using (
    dm_thread_id is not null
    and exists (
      select 1 from public.dm_threads t
      where t.id = messages.dm_thread_id
        and (t.participant_a = auth.uid() or t.participant_b = auth.uid())
    )
  );

-- Admin sees all messages.
create policy "messages: admin read all"
  on public.messages for select
  to authenticated
  using (public.current_user_role() = 'admin');

-- Members can send messages to groups they belong to.
create policy "messages: group member insert"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and (
      (group_id is not null and public.is_group_member(group_id, auth.uid()))
      or
      (dm_thread_id is not null and exists (
        select 1 from public.dm_threads t
        where t.id = dm_thread_id
          and (t.participant_a = auth.uid() or t.participant_b = auth.uid())
      ))
    )
    -- Only teacher/HOD/admin can post notices
    and (is_notice = false or public.current_user_role() in ('teacher', 'hod', 'admin', 'principal', 'warden'))
  );

-- Sender can soft-delete their own message (set body to null, keep row for audit).
create policy "messages: sender delete"
  on public.messages for delete
  to authenticated
  using (sender_id = auth.uid());

-- ─── notice_reads ─────────────────────────────────────────────────────────────

-- Users can read their own notice_read records.
create policy "notice_reads: owner read"
  on public.notice_reads for select
  to authenticated
  using (user_id = auth.uid());

-- Users insert their own read receipt.
create policy "notice_reads: owner insert"
  on public.notice_reads for insert
  to authenticated
  with check (user_id = auth.uid());

-- Users can update their own action_taken flag.
create policy "notice_reads: owner update"
  on public.notice_reads for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Admin sees all read receipts (for notice tracking dashboard).
create policy "notice_reads: admin read all"
  on public.notice_reads for select
  to authenticated
  using (public.current_user_role() in ('admin', 'principal'));
