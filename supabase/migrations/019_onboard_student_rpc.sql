create or replace function public.onboard_student(
  p_roll_no text, p_name text, p_phone text default null, p_language text default 'en'
) returns public.profiles
language plpgsql security definer set search_path = public as $$
declare
  reg public.pre_registered_students;
  result public.profiles;
begin
  if auth.uid() is null then raise exception 'NOT_AUTHENTICATED'; end if;

  select * into reg from public.pre_registered_students
   where roll_no = upper(trim(p_roll_no)) for update;
  if not found then raise exception 'ROLL_NOT_FOUND'; end if;
  if reg.used then raise exception 'ROLL_ALREADY_USED'; end if;

  insert into public.profiles
    (id, role, name, phone, roll_no, dept_id, language_pref, onboarded_at)
  values
    (auth.uid(), 'student', trim(p_name), p_phone, reg.roll_no, reg.dept_id,
     coalesce(p_language, 'en'), now())
  on conflict (id) do nothing
  returning * into result;
  if not found then raise exception 'ALREADY_ONBOARDED'; end if;

  update public.pre_registered_students set used = true where id = reg.id;
  return result;
end $$;

revoke execute on function public.onboard_student from public, anon;
grant execute on function public.onboard_student to authenticated;