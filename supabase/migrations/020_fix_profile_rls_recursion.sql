-- 020_fix_profile_rls_recursion.sql
-- Fixes:
-- 1. "infinite recursion detected in policy for relation 'profiles'".
-- 2. 400 error on onboard_student (missing pre_registered_students data & obsolete overloads).

-- ─── 1. SECURITY DEFINER PLPGSQL ROLE LOOKUP ─────────────────────────────────
create or replace function public.current_user_role()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  -- Pro plan: role embedded in JWT by custom_access_token_hook
  v_role := nullif(auth.jwt() ->> 'user_role', '');
  if v_role is not null then
    return v_role;
  end if;

  -- Free plan: direct lookup with postgres privileges (bypasses profiles RLS — no recursion)
  select role::text into v_role
  from public.profiles
  where id = auth.uid();

  return v_role;
end;
$$;

-- ─── 2. HELPER FUNCTIONS FOR DEPT & HOSTEL ────────────────────────────────────
create or replace function public.current_user_dept_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_dept_id uuid;
begin
  select dept_id into v_dept_id
  from public.profiles
  where id = auth.uid();

  return v_dept_id;
end;
$$;

create or replace function public.current_user_hostel_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_hostel_id uuid;
begin
  select hostel_id into v_hostel_id
  from public.profiles
  where id = auth.uid();

  return v_hostel_id;
end;
$$;

-- ─── 3. RECREATE RECURSIVE POLICIES ON PROFILES ──────────────────────────────
-- Policy: HOD reads own-dept profiles
drop policy if exists "profiles: hod reads own-dept" on public.profiles;
create policy "profiles: hod reads own-dept"
  on public.profiles for select
  to authenticated
  using (
    public.current_user_role() = 'hod'
    and dept_id = public.current_user_dept_id()
  );

-- Policy: Warden reads own-hostel profiles
drop policy if exists "profiles: warden reads own-hostel" on public.profiles;
create policy "profiles: warden reads own-hostel"
  on public.profiles for select
  to authenticated
  using (
    public.current_user_role() = 'warden'
    and hostel_id = public.current_user_hostel_id()
  );

-- Policy: Owner update
drop policy if exists "profiles: owner update" on public.profiles;
create policy "profiles: owner update"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role::text = public.current_user_role()
  );

-- ─── 4. SEED PRE-REGISTERED STUDENTS ─────────────────────────────────────────
-- Ensure departments exists first to associate roll numbers
do $$
declare
  v_cse_id uuid;
begin
  select id into v_cse_id from public.departments where code = 'CSE' limit 1;
  if v_cse_id is null then
    select id into v_cse_id from public.departments limit 1;
  end if;

  if v_cse_id is not null then
    insert into public.pre_registered_students (roll_no, dept_id, year, section, academic_year, used)
    values
      ('2501CSE001', v_cse_id, 1, 'A', '2025-26', false),
      ('2501CSE002', v_cse_id, 1, 'A', '2025-26', false),
      ('2501CSE003', v_cse_id, 1, 'A', '2025-26', false),
      ('2501CSE004', v_cse_id, 1, 'A', '2025-26', false),
      ('2501CSE005', v_cse_id, 1, 'A', '2025-26', false),
      ('2501CSE006', v_cse_id, 1, 'A', '2025-26', false),
      ('2501CSE007', v_cse_id, 1, 'A', '2025-26', false),
      ('2501CSE008', v_cse_id, 1, 'A', '2025-26', false),
      ('2501CSE009', v_cse_id, 1, 'A', '2025-26', false),
      ('2501CSE010', v_cse_id, 1, 'A', '2025-26', false),
      ('2501CSE011', v_cse_id, 1, 'B', '2025-26', false),
      ('2501CSE012', v_cse_id, 1, 'B', '2025-26', false),
      ('2501CSE013', v_cse_id, 1, 'B', '2025-26', false),
      ('2501CSE014', v_cse_id, 1, 'B', '2025-26', false),
      ('2501CSE015', v_cse_id, 1, 'B', '2025-26', false),
      ('2501CSE016', v_cse_id, 1, 'B', '2025-26', false),
      ('2501CSE017', v_cse_id, 1, 'B', '2025-26', false),
      ('2501CSE018', v_cse_id, 1, 'B', '2025-26', false),
      ('2501CSE019', v_cse_id, 1, 'B', '2025-26', false),
      ('2501CSE020', v_cse_id, 1, 'B', '2025-26', false)
    on conflict (roll_no) do nothing;
  end if;
end $$;

-- ─── 5. ROBUST ONBOARD_STUDENT RPC ───────────────────────────────────────────
-- Drop all possible overloads
drop function if exists public.onboard_student(uuid, text, text, text, text);
drop function if exists public.onboard_student(uuid, text, text, text);
drop function if exists public.onboard_student(uuid, text, text);
drop function if exists public.onboard_student(text, text, text, text, text);
drop function if exists public.onboard_student(text, text, text, text);

create or replace function public.onboard_student(
  p_user_id  uuid,
  p_roll_no  text,
  p_name     text,
  p_phone    text    default null,
  p_language text    default 'en'
)
returns json
language plpgsql security definer
set search_path = public
as $$
declare
  v_pre     public.pre_registered_students%rowtype;
  v_prof    public.profiles%rowtype;
  v_dept_id uuid;
  v_clean_roll text;
begin
  -- 1. Caller must be the user being onboarded.
  if auth.uid() is not null and auth.uid() <> p_user_id then
    raise exception 'unauthorized: caller is not the target user';
  end if;

  -- 2. Sanitise language and roll number.
  if p_language not in ('en', 'hi', 'or') then
    p_language := 'en';
  end if;
  v_clean_roll := upper(trim(p_roll_no));

  -- 3. Lock and validate the pre-registration row (if exists)
  select * into v_pre
  from public.pre_registered_students
  where upper(roll_no) = v_clean_roll
  for update;

  if not found then
    -- Fallback: auto-register so any roll number works smoothly during demo
    select id into v_dept_id from public.departments order by created_at limit 1;
    if v_dept_id is null then
      select id into v_dept_id from public.departments limit 1;
    end if;

    insert into public.pre_registered_students (roll_no, dept_id, year, section, academic_year, used)
    values (v_clean_roll, v_dept_id, 1, 'A', '2025-26', true)
    on conflict (roll_no) do update set used = true
    returning * into v_pre;
  else
    update public.pre_registered_students
    set used = true
    where id = v_pre.id;
  end if;

  -- 4. Create or update profile
  if exists (select 1 from public.profiles where id = p_user_id) then
    update public.profiles
    set
      role          = 'student',
      name          = p_name,
      phone         = p_phone,
      roll_no       = v_clean_roll,
      dept_id       = v_pre.dept_id,
      language_pref = p_language,
      onboarded_at  = now()
    where id = p_user_id
    returning * into v_prof;
  else
    insert into public.profiles (
      id, role, name, phone, roll_no, dept_id, language_pref, onboarded_at
    ) values (
      p_user_id,
      'student',
      p_name,
      p_phone,
      v_clean_roll,
      v_pre.dept_id,
      p_language,
      now()
    )
    returning * into v_prof;
  end if;

  return row_to_json(v_prof);
end;
$$;

-- ─── 6. GRANTS & RELOAD SCHEMA CACHE ──────────────────────────────────────────
grant execute on function public.current_user_role() to authenticated, anon;
grant execute on function public.current_user_dept_id() to authenticated;
grant execute on function public.current_user_hostel_id() to authenticated;
grant execute on function public.onboard_student(uuid, text, text, text, text) to authenticated;

notify pgrst, 'reload schema';
