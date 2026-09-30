-- 012_rls_users.sql — RLS policies for profiles and pre_registered_students
-- Append-only. Never edit this file; create a new migration for changes.

-- ─── profiles ─────────────────────────────────────────────────────────────────

-- Any authenticated user can read their own profile.
create policy "profiles: owner read"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Admin sees every profile.
create policy "profiles: admin read all"
  on public.profiles for select
  to authenticated
  using (public.current_user_role() = 'admin');

-- Principal sees every profile (read-only analytics).
create policy "profiles: principal read all"
  on public.profiles for select
  to authenticated
  using (public.current_user_role() = 'principal');

-- Teacher sees profiles of students enrolled in their slots.
-- (slot_assignments and student_enrollments live in 003; cross-table RLS is safe.)
create policy "profiles: teacher reads own-slot students"
  on public.profiles for select
  to authenticated
  using (
    public.current_user_role() = 'teacher'
    and exists (
      select 1
      from public.student_enrollments se
      join public.slot_assignments sa on sa.slot_id = se.slot_id
      where se.student_id = profiles.id
        and sa.teacher_id = auth.uid()
    )
  );

-- HOD sees all profiles in their department.
create policy "profiles: hod reads own-dept"
  on public.profiles for select
  to authenticated
  using (
    public.current_user_role() = 'hod'
    and dept_id = (
      select dept_id from public.profiles where id = auth.uid()
    )
  );

-- Warden sees profiles of students in their hostel.
create policy "profiles: warden reads own-hostel"
  on public.profiles for select
  to authenticated
  using (
    public.current_user_role() = 'warden'
    and hostel_id = (
      select hostel_id from public.profiles where id = auth.uid()
    )
  );

-- Owner can update their own non-sensitive fields.
create policy "profiles: owner update"
  on public.profiles for update
  to authenticated
  using  (id = auth.uid())
  with check (
    id = auth.uid()
    -- prevent self-elevation of role; role changes are admin-only
    and role = (select role from public.profiles where id = auth.uid())
  );

-- Admin can insert new profiles (e.g. staff created by invite flow).
create policy "profiles: admin insert"
  on public.profiles for insert
  to authenticated
  with check (public.current_user_role() = 'admin');

-- Admin can update any profile (including role changes).
create policy "profiles: admin update all"
  on public.profiles for update
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Admin can soft-delete (is_active = false); hard delete not permitted via RLS.
create policy "profiles: admin update is_active"
  on public.profiles for update
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── pre_registered_students ──────────────────────────────────────────────────

-- Students can check if their roll_no exists (needed during self-registration).
create policy "pre_registered: anon/student check roll_no"
  on public.pre_registered_students for select
  to authenticated, anon
  using (true);               -- read-only; sensitive data limited to roll_no + dept

-- Admin can insert / update pre-registration records.
create policy "pre_registered: admin write"
  on public.pre_registered_students for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');
