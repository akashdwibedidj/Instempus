// LoginPage.tsx — login, with a toggle to the student sign-up step.
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/app/sessionStore';
import { ROUTES } from '@/constants/routes';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
    const { t } = useTranslation();
    const status = useSessionStore((s) => s.status);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    if (status === 'authenticated') return <Navigate to={ROUTES.HOME} replace />;
    if (status === 'needs_onboarding') return <Navigate to={ROUTES.ONBOARD} replace />;

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <h1 className="text-2xl font-bold text-white">{t('auth.welcome')}</h1>
                <p className="mb-6 mt-1 text-sm text-white/60">{t('auth.subtitle')}</p>

                <LoginForm mode={mode} />

                <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="mt-4 w-full text-center text-sm text-indigo-300 hover:text-indigo-200"
                >
                    {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}
                </button>
            </div>
        </main>
    );
}