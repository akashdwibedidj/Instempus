// featureRegistry.ts — single source of truth for all feature route manifests.
import { lazy } from 'react';
import type { Role } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

export interface RouteManifest {
  path: string;
  component: ReturnType<typeof lazy>;
  roles: Role[];   // empty = any authenticated user
  labelKey?: string;
  icon?: string;
  showInNav?: boolean;
}

export interface FeatureManifest {
  id: string;
  routes: RouteManifest[];
}

// ─── Auth (public) ────────────────────────────────────────────────────────────
const authManifest: FeatureManifest = {
  id: 'auth',
  routes: [
    { path: ROUTES.LOGIN,  component: lazy(() => import('@/pages/LoginPage')),     roles: [] },
    { path: ROUTES.ONBOARD, component: lazy(() => import('@/pages/OnboardingPage')), roles: [] },
  ],
};

// ─── Home feed (all authenticated) ───────────────────────────────────────────
const homeManifest: FeatureManifest = {
  id: 'home',
  routes: [{
    path: ROUTES.HOME,
    component: lazy(() => import('@/pages/HomePage')),
    roles: [], labelKey: 'nav.home', icon: 'Home', showInNav: true,
  }],
};

// ─── Messages ─────────────────────────────────────────────────────────────────
const messagesManifest: FeatureManifest = {
  id: 'messages',
  routes: [{
    path: ROUTES.MESSAGES,
    component: lazy(() => import('@/pages/MessagesPage')),
    roles: [], labelKey: 'nav.messages', icon: 'MessageSquare', showInNav: true,
  }],
};

// ─── Services (role dashboard) ────────────────────────────────────────────────
const servicesManifest: FeatureManifest = {
  id: 'services',
  routes: [{
    path: ROUTES.SERVICES,
    component: lazy(() => import('@/pages/ServicesPage')),
    roles: [], labelKey: 'nav.services', icon: 'Grid2x2', showInNav: true,
  }],
};

// ─── Profile ─────────────────────────────────────────────────────────────────
const profileManifest: FeatureManifest = {
  id: 'profile',
  routes: [{
    path: ROUTES.PROFILE,
    component: lazy(() => import('@/pages/ProfilePage')),
    roles: [], labelKey: 'nav.profile', icon: 'User', showInNav: true,
  }],
};

// ─── Security guard ───────────────────────────────────────────────────────────
const guardManifest: FeatureManifest = {
  id: 'guard',
  routes: [{
    path: ROUTES.GUARD_VERIFY,
    component: lazy(() => import('@/pages/GuardVerifyPage')),
    roles: ['security'],
  }],
};

export const featureRegistry: FeatureManifest[] = [
  authManifest,
  homeManifest,
  messagesManifest,
  servicesManifest,
  profileManifest,
  guardManifest,
  // Phase 4+: applications, issues, payments, attendance, admin…
];