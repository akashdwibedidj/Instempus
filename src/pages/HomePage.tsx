// HomePage.tsx — TEMPORARY placeholder so the auth flow can be tested.
// Replaced by the real home feed in Phase 3.
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';

export default function HomePage() {
    const { t } = useTranslation();
    const { name, role, logout, isLoggingOut } = useAuth();

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
            <div className="w-full max-w-sm space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl backdrop-blur-xl">
                <h1 className="text-2xl font-bold text-white">{t('nav.home')}</h1>
                <p className="text-white/80">{name}</p>
                {role && <p className="text-sm text-indigo-300">{t(`roles.${role}`)}</p>}
                <button
                    type="button"
                    disabled={isLoggingOut}
                    onClick={() => void logout().catch(() => undefined)}
                    className="w-full rounded-xl border border-white/20 px-4 py-3 text-white hover:bg-white/10 disabled:opacity-50"
                >
                    {t('nav.logout')}
                </button>
            </div>
        </main>
    );
}