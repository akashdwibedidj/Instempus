// featureRegistry.ts — single source of truth for all feature route manifests.
import { lazy } from 'react';
import type { Role } from '@/constants/roles';

export interface RouteManifest {
  path: string;
  component: ReturnType<typeof lazy>;
  roles: Role[];   // empty = any authenticated user allowed
  labelKey?: string;
  icon?: string;
  showInNav?: boolean;
}

export interface FeatureManifest {
  id: string;
  routes: RouteManifest[];
}

// ─── auth feature routes (public) ────────────────────────────────────────────
const authManifest: FeatureManifest = {
  id: 'auth',
  routes: [
    {
      path: '/login',
      component: lazy(() => import('@/pages/LoginPage')),
      roles: [],       // public
    },
    {
      path: '/onboard',
      component: lazy(() => import('@/pages/OnboardingPage')),
      roles: [],       // public — guard logic is inside the page
    },
  ],
};

// ─── home (all authenticated roles) ──────────────────────────────────────────
const homeManifest: FeatureManifest = {
  id: 'home',
  routes: [
    {
      path: '/home',
      component: lazy(() => import('@/pages/HomePage')),
      roles: [],       // any authenticated user (RoleGuard handles redirect)
      labelKey: 'nav.home',
      icon: 'Home',
      showInNav: true,
    },
  ],
};

export const featureRegistry: FeatureManifest[] = [
  authManifest,
  homeManifest,
  // Phase 3+: each feature's index.ts pushes its manifest here.
];