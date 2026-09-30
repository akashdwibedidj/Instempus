// Route path constants — import from here, never hardcode paths in components
export const ROUTES = {
  ROOT:      '/',
  LOGIN:     '/login',
  ONBOARD:   '/onboard',

  // Home (notices feed)
  HOME:      '/home',

  // Applications
  APPLICATIONS:        '/applications',
  APPLICATION_NEW:     '/applications/new',
  APPLICATION_DETAIL:  '/applications/:id',
  APPROVAL_QUEUE:      '/approvals',

  // Gate pass
  GATEPASS:       '/gatepass',
  GATEPASS_NEW:   '/gatepass/new',
  GUARD_VERIFY:   '/guard/verify',

  // Issues
  ISSUE_BOARD:    '/issues',
  ISSUE_DETAIL:   '/issues/:id',
  WARDEN_QUEUE:   '/warden/queue',

  // Messaging / DM
  MESSAGES:       '/messages',
  DM_THREAD:      '/messages/dm/:threadId',
  GROUP_CHAT:     '/messages/group/:groupId',

  // Attendance
  ATTENDANCE:     '/attendance',

  // Payments
  PAYMENTS:       '/payments',

  // Admin
  ADMIN:                '/admin',
  ADMIN_DASHBOARD:      '/admin/dashboard',
  ADMIN_USERS:          '/admin/users',
  ADMIN_ORG:            '/admin/org',
  ADMIN_SETTINGS:       '/admin/settings',
  ADMIN_AUDIT:          '/admin/audit',

  // Principal
  PRINCIPAL_DASHBOARD:  '/principal',

  // Chatbot
  CHATBOT:        '/chatbot',

  // Phase 3 — Instagram nav
  PROFILE:        '/profile',
  SERVICES:       '/services',
  SEARCH:         '/search',
  NOTIFICATIONS:  '/notifications',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
