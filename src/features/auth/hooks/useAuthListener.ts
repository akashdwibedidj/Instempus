// useAuthListener.ts — mount ONCE in providers.tsx.
// Listens to Supabase auth state changes and keeps sessionStore in sync.
// No Supabase import here — all calls go through authService / onboardingService.
import { useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import i18n from '@/i18n';
import type { Role } from '@/constants/roles';
import { useSessionStore, toLanguage } from '@/app/sessionStore';
import { onAuthStateChange } from '../services/authService';
import { getProfile } from '../services/onboardingService';

async function hydrate(
  user: User | null,
  signal: { cancelled: boolean },
): Promise<void> {
  const store = useSessionStore.getState();

  if (!user) {
    if (!signal.cancelled) store.clear();
    return;
  }

  try {
    const profile = await getProfile(user.id);
    if (signal.cancelled) return;

    if (!profile || !profile.onboarded_at) {
      store.setNeedsOnboarding(user.id);
      return;
    }

    const language = toLanguage(profile.language_pref);
    store.setAuthenticated({
      userId: user.id,
      role: profile.role as Role,
      name: profile.name,
      language,
    });
    void i18n.changeLanguage(language);
  } catch (err) {
    if (signal.cancelled) return;
    console.error('[auth] failed to load profile', err);
    store.clear();
  }
}

export function useAuthListener(): void {
  useEffect(() => {
    const signal = { cancelled: false };

    // Defer Supabase call out of the auth callback to avoid deadlocks.
    const unsubscribe = onAuthStateChange((user) => {
      setTimeout(() => void hydrate(user, signal), 0);
    });

    return () => {
      signal.cancelled = true;
      unsubscribe();
    };
  }, []);
}
