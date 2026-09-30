import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/app/sessionStore';
import { ROUTES } from '@/constants/routes';
import { StudentOnboardForm } from '@/features/auth/components/StudentOnboardForm';
import { StaffOnboardForm } from '@/features/auth/components/StaffOnboardForm';
import { getProfile } from '@/features/auth/services/onboardingService';

type Mode = 'loading' | 'student' | 'staff';

export default function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const status = useSessionStore((s) => s.status);
  const userId = useSessionStore((s) => s.userId);
  const [mode, setMode] = useState<Mode>('loading');

  // If user becomes authenticated (onboarding completed), go home.
  useEffect(() => {
    if (status === 'authenticated') void navigate(ROUTES.HOME, { replace: true });
    if (status === 'unauthenticated') void navigate(ROUTES.LOGIN, { replace: true });
  }, [status, navigate]);

  // Determine student vs staff by checking if a profile row already exists.
  useEffect(() => {
    if (!userId) return;
    void getProfile(userId).then((profile) => {
      // Profile exists but no onboarded_at → staff first login
      // No profile at all → student signup
      setMode(profile ? 'staff' : 'student');
    });
  }, [userId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">{t('app.name')}</h1>
          <p className="mt-1 text-sm text-gray-400">{t('auth.onboard')}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          {mode === 'loading' && (
            <p className="text-center text-sm text-gray-400">{t('common.loading')}</p>
          )}
          {mode === 'student' && <StudentOnboardForm />}
          {mode === 'staff'   && <StaffOnboardForm />}

          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={async () => {
                const { logout } = await import('@/features/auth/services/authService');
                await logout();
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors underline"
            >
              Sign out / Back to Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
