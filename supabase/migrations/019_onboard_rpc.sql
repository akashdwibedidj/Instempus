-- 019_onboard_rpc.sql — Security-definer RPC for student self-onboarding
-- Allows a student to create their own profile safely:
--   1. Caller must be the user they are onboarding.
--   2. roll_no must exist in pre_registered_students (and be unused).
--   3. Profile is inserted with role = 'student' (hardcoded — client cannot elevate).
--   4. pre_registered_students.used is set to true atomically.
-- Run AFTER 002_users.sql and 003_slots_enrollments.sql.

-- Drop ALL existing overloads to avoid "function name not unique" error.
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
  v_pre   public.pre_registered_students%rowtype;
  v_prof  public.profiles%rowtype;
begin
  -- 1. Caller must be the user being onboarded.
  if auth.uid() <> p_user_id then
    raise exception 'unauthorized: caller is not the target user';
  end if;

  -- 2. Sanitise language.
  if p_language not in ('en', 'hi', 'or') then
    p_language := 'en';
  end if;

  -- 3. Lock and validate the pre-registration row.
  select * into v_pre
  from public.pre_registered_students
  where roll_no = p_roll_no and not used
  for update;

  if not found then
    raise exception 'roll_no % is not pre-registered or has already been used', p_roll_no;
  end if;

  -- 4. Prevent duplicate profiles.
  if exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'profile already exists for this user';
  end if;

  -- 5. Create profile with hardcoded role = student.
  insert into public.profiles (
    id, role, name, phone, roll_no, dept_id, language_pref, onboarded_at
  ) values (
    p_user_id,
    'student',
    p_name,
    p_phone,
    p_roll_no,
    v_pre.dept_id,
    p_language,
    now()
  )
  returning * into v_prof;

  -- 6. Mark roll_no as consumed.
  update public.pre_registered_students
  set used = true
  where roll_no = p_roll_no;

  return row_to_json(v_prof);
end;
$$;

-- Grant execute to authenticated users only (full arg list avoids ambiguity).
grant execute on function public.onboard_student(uuid, text, text, text, text) to authenticated;
revoke execute on function public.onboard_student(uuid, text, text, text, text) from anon;
