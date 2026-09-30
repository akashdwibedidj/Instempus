// RoleGuard.tsx — renders children only if the current role has access.
// Redirects to /login if unauthenticated, /onboard if needs onboarding,
// or shows 403 if role not allowed.
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSessionStore } from '@/app/sessionStore';
import { ROUTES } from '@/constants/routes';
import type { Role } from '@/constants/roles';

interface Props {
  roles: Role[];        // empty array = any authenticated user
  children: ReactNode;
}

export function RoleGuard({ roles, children }: Props) {
  const status = useSessionStore((s) => s.status);
  const role   = useSessionStore((s) => s.role);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (status === 'needs_onboarding') {
    return <Navigate to={ROUTES.ONBOARD} replace />;
  }

  if (roles.length > 0 && role && !roles.includes(role)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 text-gray-400">
        <span className="text-4xl">🚫</span>
        <p className="text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
