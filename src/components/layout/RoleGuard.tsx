// RoleGuard.tsx — wraps a route; redirects based on session status and role.
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Role } from '@/constants/roles';
import { useSessionStore } from '@/app/sessionStore';
import { ROUTES } from '@/constants/routes';

interface RoleGuardProps {
  /** Roles allowed to see the route. Empty array = any signed-in user. */
  roles: Role[];
  children: ReactNode;
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { t } = useTranslation();
  const status = useSessionStore((s) => s.status);
  const role = useSessionStore((s) => s.role);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-400">
        {t('common.loading')}
      </div>
    );
  }
  if (status === 'unauthenticated') return <Navigate to={ROUTES.LOGIN} replace />;
  if (status === 'needs_onboarding') return <Navigate to={ROUTES.ONBOARD} replace />;

  if (roles.length > 0 && (!role || !roles.includes(role))) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return <>{children}</>;
}