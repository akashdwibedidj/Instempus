// router.tsx — builds react-router routes from featureRegistry
import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { ROUTES } from '@/constants/routes';
import { featureRegistry } from './featureRegistry';

const Fallback = () => (
  <div className="flex h-screen items-center justify-center text-sm text-gray-400">
    Loading…
  </div>
);

function buildRouter() {
  const children = featureRegistry.flatMap((f) =>
    f.routes.map(({ path, component: Page, roles }) => ({
      path,
      element: (
        <Suspense fallback={<Fallback />}>
          {roles.length > 0 ? (
            <RoleGuard roles={roles}>
              <Page />
            </RoleGuard>
          ) : (
            <Page />
          )}
        </Suspense>
      ),
    })),
  );

  return createBrowserRouter([
    {
      path: ROUTES.ROOT,
      element: <Navigate to={ROUTES.HOME} replace />,
    },
    ...children,
    {
      path: '*',
      element: <div className="p-8 text-center text-gray-500">404 — Page not found</div>,
    },
  ]);
}

const router = buildRouter();

export function AppRouter() {
  return <RouterProvider router={router} />;
}