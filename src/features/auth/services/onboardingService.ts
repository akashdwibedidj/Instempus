// features/auth/services/onboardingService.ts
// Handles post-signup onboarding: roll-number validation + profile creation.
// Rule: no Supabase imports in components — this is the only onboarding data boundary.

import { supabase } from '@/lib/supabaseClient';
import { AppError, toAppError } from '@/lib/errors';
import type { Database } from '@/types/database';

type ProfileRow    = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

export interface StudentOnboardPayload {
  userId: string;
  rollNo: string;
  name: string;
  phone?: string;
  languagePref?: 'en' | 'hi' | 'or';
}

export interface StaffOnboardPayload {
  userId: string;
  name: string;
  role: ProfileRow['role'];
  deptId?: string;
  phone?: string;
  languagePref?: 'en' | 'hi' | 'or';
}

/**
 * Validates that a roll number exists in pre_registered_students
 * and has not yet been used. Throws AppError if invalid.
 */
export async function validateRollNo(rollNo: string): Promise<{
  deptId: string;
  year: number;
  section: string;
  academicYear: string;
}> {
  const { data, error } = await supabase
    .from('pre_registered_students')
    .select('dept_id, year, section, academic_year, used')
    .eq('roll_no', rollNo.trim().toUpperCase())
    .single();

  if (error || !data) {
    throw new AppError('NOT_FOUND', 'Roll number not found. Contact your admin.');
  }
  if (data.used) {
    throw new AppError('CONFLICT', 'This roll number is already registered.');
  }
  return {
    deptId:       data.dept_id,
    year:         data.year,
    section:      data.section,
    academicYear: data.academic_year,
  };
}

/**
 * Creates or updates the profile for a student after signup.
 * Also marks the roll number as used.
 */
export async function onboardStudent(payload: StudentOnboardPayload): Promise<ProfileRow> {
  // Validate roll number first
  const reg = await validateRollNo(payload.rollNo);

  const insert: ProfileInsert = {
    id:            payload.userId,
    role:          'student',
    name:          payload.name.trim(),
    roll_no:       payload.rollNo.trim().toUpperCase(),
    phone:         payload.phone ?? null,
    dept_id:       reg.deptId,
    language_pref: payload.languagePref ?? 'en',
    onboarded_at:  new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(insert, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw toAppError(error);
  if (!data) throw new AppError('SERVER', 'Profile creation failed.');
  return data;
}

/**
 * Creates or updates the profile for a staff member (admin-initiated).
 * Role must not be 'student' — use onboardStudent for students.
 */
export async function onboardStaff(payload: StaffOnboardPayload): Promise<ProfileRow> {
  if (payload.role === 'student') {
    throw new AppError('VALIDATION', 'Use onboardStudent() for students.');
  }

  const insert: ProfileInsert = {
    id:            payload.userId,
    role:          payload.role,
    name:          payload.name.trim(),
    phone:         payload.phone ?? null,
    dept_id:       payload.deptId ?? null,
    language_pref: payload.languagePref ?? 'en',
    onboarded_at:  new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(insert, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw toAppError(error);
  if (!data) throw new AppError('SERVER', 'Profile creation failed.');
  return data;
}

/** Fetches the profile for the current user (post-login). Returns null if not onboarded yet. */
export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw toAppError(error);
  return data;
}
