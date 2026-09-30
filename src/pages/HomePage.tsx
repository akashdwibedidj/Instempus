// HomePage.tsx — placeholder home feed rendered inside AppShell.
// Phase 3 Task 3 will replace this with the real notices feed + dashboard widgets.
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function HomePage() {
  const { t } = useTranslation();
  const { name, role } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="glass-card p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">
          {t(`roles.${role ?? 'student'}`)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">
          {t('auth.welcome')}, {name ?? '—'}
        </h1>
        <p className="mt-1 text-sm text-gray-400">{t('auth.subtitle')}</p>
      </div>

      {/* Placeholder feed */}
      <div className="glass-card flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-4xl">🏫</span>
        <p className="text-sm text-gray-400">{t('notices.empty')}</p>
        <p className="text-xs text-gray-600">(Notices feed coming in Phase 3, Task 3)</p>
      </div>
    </div>
  );
}
