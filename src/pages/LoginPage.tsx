// LoginPage.tsx — public page; redirects to /home if already authenticated.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/app/sessionStore';
import { ROUTES } from '@/constants/routes';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { LanguagePicker } from '@/features/auth/components/LanguagePicker';
import i18n from '@/i18n';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const status   = useSessionStore((s) => s.status);
  const language = useSessionStore((s) => s.language);

  useEffect(() => {
    if (status === 'authenticated') void navigate(ROUTES.HOME, { replace: true });
    if (status === 'needs_onboarding') void navigate(ROUTES.ONBOARD, { replace: true });
  }, [status, navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">{t('app.name')}</h1>
          <p className="mt-1 text-sm text-gray-400">{t('auth.subtitle')}</p>
        </div>

        {/* Language selector at top of login (before user picks language in onboarding) */}
        <LanguagePicker
          value={language}
          onChange={(lang) => void i18n.changeLanguage(lang)}
        />

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold text-white">{t('auth.welcome')}</h2>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
