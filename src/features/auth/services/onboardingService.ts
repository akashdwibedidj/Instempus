// onboardingService.ts — profile reads/writes and pre-registration check.
// Only file (besides authService) that imports supabaseClient inside the auth feature.
import { supabase } from '@/lib/supabaseClient';

// ─── types ────────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  role: string;
  name: string;
  phone: string | null;
  roll_no: string | null;
  dept_id: string | null;
  hostel_id: string | null;
  language_pref: string;
  onboarded_at: string | null;
}

export interface StudentOnboardInput {
  rollNo: string;
  name: string;
  phone?: string;
  language: string;
}

export interface StaffOnboardInput {
  name: string;
  phone?: string;
  language: string;
}

// ─── functions ────────────────────────────────────────────────────────────────

/** Fetch profile row for an auth user. Returns null if not yet created (new student). */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, role, name, phone, roll_no, dept_id, hostel_id, language_pref, onboarded_at',
    )
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

/** Call the onboard_student security-definer RPC.
 *  Validates roll_no, inserts profile with role='student', marks pre_registration used. */
export async function completeStudentOnboarding(
  userId: string,
  input: StudentOnboardInput,
): Promise<Profile> {
  const { data, error } = await supabase.rpc('onboard_student', {
    p_user_id:  userId,
    p_roll_no:  input.rollNo,
    p_name:     input.name,
    p_phone:    input.phone ?? null,
    p_language: input.language,
  });
  if (error) throw error;
  return data as Profile;
}

/** Update an existing staff profile (admin pre-creates it; staff fills name/phone/language). */
export async function completeStaffOnboarding(
  userId: string,
  input: StaffOnboardInput,
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      name:          input.name,
      phone:         input.phone ?? null,
      language_pref: input.language,
      onboarded_at:  new Date().toISOString(),
    })
    .eq('id', userId)
    .select(
      'id, role, name, phone, roll_no, dept_id, hostel_id, language_pref, onboarded_at',
    )
    .single();
  if (error) throw error;
  return data as Profile;
}

/** Check that a roll number is in pre_registered_students and has not been used yet. */
export async function checkRollNumber(rollNo: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('pre_registered_students')
    .select('roll_no')
    .eq('roll_no', rollNo.trim().toUpperCase())
    .eq('used', false)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}
