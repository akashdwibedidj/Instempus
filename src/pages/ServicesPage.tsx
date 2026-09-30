// ServicesPage.tsx — role-specific services dashboard (Phase 3 stub).
// Phase 4+ will fill tiles with real data per role.
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/app/sessionStore';

export default function ServicesPage() {
  const { t } = useTranslation();
  const role = useSessionStore((s) => s.role);

  return (
    <div className="space-y-4 px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold text-white">{t('nav.services')}</h1>
      <div className="glass-card flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-4xl">🗂</span>
        <p className="text-sm text-gray-400">{t('common.empty')}</p>
        <p className="text-xs text-gray-600 capitalize">
          {role} services — coming Phase 4+
        </p>
      </div>
    </div>
  );
}
