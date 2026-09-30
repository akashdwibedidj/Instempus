// OnboardingPage.tsx — profile setup for a signed-in user with no profile yet.
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/app/sessionStore';
import { ROUTES } from '@/constants/routes';
import { StudentOnboardForm, StaffOnboardForm } from '@/features/auth';

type Kind = 'student' | 'staff';

export default function OnboardingPage() {
    const { t } = useTranslation();
    const status = useSessionStore((s) => s.status);
    const [kind, setKind] = useState<Kind>('student');

    if (status === 'loading') {
        return (
            <div className="flex h-screen items-center justify-center text-sm text-gray-400">
                {t('common.loading')}
            </div>
        );
    }
    if (status === 'unauthenticated') return <Navigate to={ROUTES.LOGIN} replace />;
    if (status === 'authenticated') return <Navigate to={ROUTES.HOME} replace />;

    const tabClass = (active: boolean): string =>
        'flex-1 rounded-xl px-3 py-2 text-sm transition ' +
        (active ? 'bg-indigo-500/40 text-white' : 'text-white/60 hover:bg-white/10');

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <h1 className="mb-4 text-2xl font-bold text-white">{t('auth.onboard')}</h1>

                <div className="mb-5 flex gap-2 rounded-2xl bg-white/5 p-1">
                    <button type="button" className={tabClass(kind === 'student')} onClick={() => setKind('student')}>
                        {t('roles.student')}
                    </button>
                    <button type="button" className={tabClass(kind === 'staff')} onClick={() => setKind('staff')}>
                        {t('auth.staff')}
                    </button>
                </div>

                {kind === 'student' ? <StudentOnboardForm /> : <StaffOnboardForm />}
            </div>
        </main>
    );
}