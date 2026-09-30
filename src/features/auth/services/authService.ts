// features/auth/services/authService.ts
// Handles Supabase Auth operations. Only this file (and supabaseClient) touch auth.
// No Supabase imports outside src/lib — this service is the single boundary.

import { supabase } from '@/lib/supabaseClient';
import { AppError, toAppError } from '@/lib/errors';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  session: Session;
}

/** Sign in with email + password. Throws AppError on failure. */
export async function login({ email, password }: AuthCredentials): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes('invalid')) {
      throw new AppError('UNAUTHORIZED', 'Invalid email or password.');
    }
    throw new AppError('SERVER', error.message, error.code ?? undefined);
  }
  if (!data.session || !data.user) {
    throw new AppError('SERVER', 'Login succeeded but no session returned.');
  }
  return { user: data.user, session: data.session };
}

/** Sign out the current user. */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw toAppError(error);
}

/** Returns the current active session, or null if not logged in. */
export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw toAppError(error);
  return data.session;
}

/** Returns the current user, or null. */
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

/**
 * Self-registration for students (email + password).
 * Staff are created via admin invite flow (Phase 8).
 * Throws AppError if the email already exists.
 */
export async function signUp({ email, password }: AuthCredentials): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes('already')) {
      throw new AppError('CONFLICT', 'An account with this email already exists.');
    }
    throw new AppError('SERVER', error.message, error.code ?? undefined);
  }
  if (!data.session || !data.user) {
    // Email confirmation required (Supabase setting)
    throw new AppError('VALIDATION', 'Please check your email to confirm your account.');
  }
  return { user: data.user, session: data.session };
}

/** Subscribe to auth state changes. Returns the unsubscribe function. */
export function onAuthStateChange(
  callback: (user: User | null) => void,
): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}
