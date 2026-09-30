// useAuthListener.ts — mount ONCE (in providers.tsx). Keeps sessionStore in sync
// with Supabase auth: on every auth change it loads the profile and fills the store.
import { useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import i18n from '@/i18n';
import type { Role } from '@/constants/roles';
import { useSessionStore, toLanguage } from '@/app/sessionStore';
import { onAuthStateChange } from '../services/authService';
import { getProfile } from '../services/onboardingService';

export function useAuthListener(): void {
  useEffect(() => {
    let cancelled = false;
    let latest = 0; // ignore out-of-order async results

    const hydrate = async (user: User | null): Promise<void> => {
      const run = ++latest;
      const store = useSessionStore.getState();

      if (!user) {
        store.clear();
        return;
      }

      try {
        const profile = await getProfile(user.id);
        if (cancelled || run !== latest) return;

        if (!profile) {
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
        if (cancelled || run !== latest) return;
        console.error('[auth] failed to load profile', err);
        store.clear();
      }
    };

    const unsubscribe = onAuthStateChange((user) => {
      // Do NOT call Supabase inside this callback directly (can deadlock
      // supabase-js). Defer to the next tick.
      setTimeout(() => void hydrate(user), 0);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);
}