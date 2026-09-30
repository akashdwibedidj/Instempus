// router.tsx — builds react-router routes from featureRegistry.
// Auth routes (login, onboard) bypass AppShell.
// All other authenticated routes are nested inside AppShell as a layout route.
import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { ROUTES } from '@/constants/routes';
import { featureRegistry } from './featureRegistry';
import type { RouteManifest } from './featureRegistry';

// Routes that render without the AppShell chrome
const PUBLIC_PATH_SET = new Set<string>([ROUTES.LOGIN, ROUTES.ONBOARD]);

const Fallback = () => (
  <div className="flex h-screen items-center justify-center text-sm text-gray-400">
    Loading…
  </div>
);

function buildElement(r: RouteManifest) {
  const Page = r.component;
  const page = r.roles.length > 0
    ? <RoleGuard roles={r.roles}><Page /></RoleGuard>
    : <Page />;
  return <Suspense fallback={<Fallback />}>{page}</Suspense>;
}

function buildRouter() {
  const allRoutes = featureRegistry.flatMap((f) => f.routes);
  const publicRoutes = allRoutes.filter((r) => PUBLIC_PATH_SET.has(r.path));
  const shellRoutes  = allRoutes.filter((r) => !PUBLIC_PATH_SET.has(r.path));

  return createBrowserRouter([
    { path: ROUTES.ROOT, element: <Navigate to={ROUTES.LOGIN} replace /> },

    // Public — no AppShell
    ...publicRoutes.map((r) => ({ path: r.path, element: buildElement(r) })),

    // Authenticated — wrapped in AppShell layout
    {
      element: <AppShell />,
      children: shellRoutes.map((r) => ({ path: r.path, element: buildElement(r) })),
    },

    // Convenience redirects for stub routes not yet in featureRegistry
    { path: ROUTES.SEARCH,        element: <Navigate to={ROUTES.HOME} replace /> },
    { path: ROUTES.NOTIFICATIONS, element: <Navigate to={ROUTES.HOME} replace /> },

    {
      path: '*',
      element: (
        <div className="flex h-screen items-center justify-center text-gray-500">
          404 — Page not found
        </div>
      ),
    },
  ]);
}

const router = buildRouter();

export function AppRouter() {
  return <RouterProvider router={router} />;
}