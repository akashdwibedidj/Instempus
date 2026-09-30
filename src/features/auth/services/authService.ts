// authService.ts — the ONLY file in the auth feature that imports supabaseClient.
// All Supabase auth operations live here; hooks and components never call supabase directly.
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export interface LoginInput {
  email: string;
  password: string;
}

/** Sign in with email + password. Throws AuthError on failure. */
export async function login(input: LoginInput): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  if (error) throw error;
  return data.user;
}

/** Create a new Supabase auth account (email + password).
 *  Email confirmation is typically disabled for demo; enable in Supabase Auth settings. */
export async function signUp(input: LoginInput): Promise<User | null> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });
  if (error) throw error;
  return data.user ?? null;
}

/** Sign out the current user and clear the Supabase session. */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Return the active session, or null if unauthenticated. */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/** Subscribe to auth state changes. Returns an unsubscribe function.
 *  Must be called exactly once — from useAuthListener, mounted in providers.tsx. */
export function onAuthStateChange(
  callback: (user: User | null) => void,
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}
