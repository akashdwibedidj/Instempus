// featureRegistry.ts — single source of truth for all features + their route manifests
// Add one entry per feature; router.tsx and navigation.ts read this list.
import { lazy } from 'react';
import type { LazyExoticComponent, ComponentType } from 'react';
import { ALL_ROLES, type Role } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

export type { Role };

export interface RouteManifest {
  /** URL path (react-router format) */
  path: string;
  /** Lazy-loaded page component */
  component: LazyExoticComponent<ComponentType>;
  /** Roles that can access this route; empty = public */
  roles: Role[];
  /** Nav label i18n key */
  labelKey?: string;
  /** lucide-react icon name */
  icon?: string;
  /** Show in bottom nav / sidebar */
  showInNav?: boolean;
}

export interface FeatureManifest {
  id: string;
  routes: RouteManifest[];
}

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));

export const featureRegistry: FeatureManifest[] = [
  {
    id: 'auth',
    routes: [
      // Public: these pages redirect on their own based on session status.
      { path: ROUTES.LOGIN, component: LoginPage, roles: [] },
      { path: ROUTES.ONBOARD, component: OnboardingPage, roles: [] },
    ],
  },
  {
    // TEMPORARY placeholder until the real home feed (Phase 3+)
    id: 'home',
    routes: [
      {
        path: ROUTES.HOME,
        component: HomePage,
        roles: ALL_ROLES,
        labelKey: 'nav.home',
        icon: 'Home',
        showInNav: true,
      },
    ],
  },
];