// HomePage.tsx — placeholder home feed (Phase 3 will replace with real notices feed).
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function HomePage() {
  const { t } = useTranslation();
  const { name, role, logout, isLoggingOut } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-3xl font-bold text-white">{t('app.name')}</h1>
        <p className="text-gray-400">
          {t('auth.welcome')}, <span className="text-violet-400 font-semibold">{name}</span>
        </p>
        <p className="text-sm text-gray-500 uppercase tracking-widest">
          {role ?? '—'}
        </p>
        <button
          id="home-logout"
          onClick={() => void logout()}
          disabled={isLoggingOut}
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 transition-colors"
        >
          {isLoggingOut ? t('common.loading') : t('auth.logout')}
        </button>
      </div>
    </main>
  );
}
