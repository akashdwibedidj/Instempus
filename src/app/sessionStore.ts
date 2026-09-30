// sessionStore.ts — Zustand store: single source of truth for the active session.
// Imported by hooks only; components never import this directly.
import { create } from 'zustand';
import type { Role } from '@/constants/roles';

export type Language = 'en' | 'hi' | 'or';
export type SessionStatus =
  | 'loading'          // initial: checking Supabase session
  | 'unauthenticated'  // no session
  | 'needs_onboarding' // session exists but no profile row yet
  | 'authenticated';   // session + profile loaded

export function toLanguage(raw: string | null | undefined): Language {
  if (raw === 'hi' || raw === 'or') return raw;
  return 'en';
}

interface AuthenticatedPayload {
  userId: string;
  role: Role;
  name: string;
  language: Language;
}

interface SessionState {
  status: SessionStatus;
  userId: string | null;
  role: Role | null;
  name: string | null;
  language: Language;

  setAuthenticated: (p: AuthenticatedPayload) => void;
  setNeedsOnboarding: (userId: string) => void;
  setLoading: () => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: 'loading',
  userId: null,
  role: null,
  name: null,
  language: 'en',

  setAuthenticated: ({ userId, role, name, language }) =>
    set({ status: 'authenticated', userId, role, name, language }),

  setNeedsOnboarding: (userId) =>
    set({ status: 'needs_onboarding', userId, role: null, name: null }),

  setLoading: () =>
    set({ status: 'loading' }),

  clear: () =>
    set({ status: 'unauthenticated', userId: null, role: null, name: null }),
}));
