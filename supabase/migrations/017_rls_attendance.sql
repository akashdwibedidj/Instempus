-- 017_rls_attendance.sql — RLS policies for attendance tables
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 008_attendance.sql.

-- ─── attendance_sessions ──────────────────────────────────────────────────────

-- Teacher sees sessions they created.
create policy "att_sessions: teacher read own"
  on public.attendance_sessions for select
  to authenticated
  using (created_by = auth.uid());

-- Teacher creates sessions for slots assigned to them.
create policy "att_sessions: teacher insert"
  on public.attendance_sessions for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.current_user_role() = 'teacher'
    and exists (
      select 1 from public.slot_assignments sa
      where sa.slot_id = attendance_sessions.slot_id
        and sa.teacher_id = auth.uid()
    )
  );

-- Teacher closes (updates closed_at) their own sessions.
create policy "att_sessions: teacher close"
  on public.attendance_sessions for update
  to authenticated
  using (
    created_by = auth.uid()
    and public.current_user_role() = 'teacher'
  )
  with check (created_by = auth.uid());

-- Students see sessions for slots they are enrolled in.
create policy "att_sessions: student read enrolled"
  on public.attendance_sessions for select
  to authenticated
  using (
    public.current_user_role() = 'student'
    and exists (
      select 1 from public.student_enrollments se
      where se.slot_id = attendance_sessions.slot_id
        and se.student_id = auth.uid()
        and se.status = 'active'
    )
  );

-- HOD sees all sessions in their department.
create policy "att_sessions: hod read dept"
  on public.attendance_sessions for select
  to authenticated
  using (
    public.current_user_role() = 'hod'
    and exists (
      select 1
      from public.section_slots ss
      join public.departments d on d.id = ss.dept_id
      join public.profiles p on p.dept_id = d.id and p.id = auth.uid()
      where ss.id = attendance_sessions.slot_id
    )
  );

-- Admin and principal see all sessions.
create policy "att_sessions: admin read all"
  on public.attendance_sessions for select
  to authenticated
  using (public.current_user_role() in ('admin', 'principal'));

-- ─── attendance_records ───────────────────────────────────────────────────────

-- Student sees their own attendance records only.
create policy "att_records: student read own"
  on public.attendance_records for select
  to authenticated
  using (
    student_id = auth.uid()
    and public.current_user_role() = 'student'
  );

-- Teacher reads records for sessions they created.
create policy "att_records: teacher read own sessions"
  on public.attendance_records for select
  to authenticated
  using (
    public.current_user_role() = 'teacher'
    and exists (
      select 1 from public.attendance_sessions s
      where s.id = attendance_records.session_id
        and s.created_by = auth.uid()
    )
  );

-- Teacher inserts/updates records for their open sessions.
create policy "att_records: teacher mark"
  on public.attendance_records for insert
  to authenticated
  with check (
    marked_by = auth.uid()
    and public.current_user_role() = 'teacher'
    and exists (
      select 1 from public.attendance_sessions s
      where s.id = attendance_records.session_id
        and s.created_by = auth.uid()
        and s.closed_at is null      -- session must still be open
    )
  );

create policy "att_records: teacher update open session"
  on public.attendance_records for update
  to authenticated
  using (
    public.current_user_role() = 'teacher'
    and exists (
      select 1 from public.attendance_sessions s
      where s.id = attendance_records.session_id
        and s.created_by = auth.uid()
        and s.closed_at is null
    )
  )
  with check (true);

-- HOD reads all records in their department.
create policy "att_records: hod read dept"
  on public.attendance_records for select
  to authenticated
  using (
    public.current_user_role() = 'hod'
    and exists (
      select 1
      from public.attendance_sessions s
      join public.section_slots ss on ss.id = s.slot_id
      join public.departments d on d.id = ss.dept_id
      join public.profiles p on p.dept_id = d.id and p.id = auth.uid()
      where s.id = attendance_records.session_id
    )
  );

-- Admin and principal see all records.
create policy "att_records: admin read all"
  on public.attendance_records for select
  to authenticated
  using (public.current_user_role() in ('admin', 'principal'));
