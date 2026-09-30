// navigation.ts — 5-tab Instagram-style nav config + role badge colours.
// No JSX. Imported by BottomNav, DesktopSidebar, AppShell.
import type { Role } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

export interface TabItem {
  id: string;
  labelKey: string;     // i18n key
  icon: string;         // lucide-react icon name
  path?: string;        // undefined = action-only (no route)
  isAction?: boolean;   // true = centre ➕ button
}

// ─── Base 5 tabs (Student / Teacher / HOD / Warden / Canteen / Accounts) ────
const BASE_TABS: TabItem[] = [
  { id: 'home',     labelKey: 'nav.home',     icon: 'Home',          path: ROUTES.HOME },
  { id: 'messages', labelKey: 'nav.messages', icon: 'MessageSquare', path: ROUTES.MESSAGES },
  { id: 'create',   labelKey: 'nav.create',   icon: 'Plus',          isAction: true },
  { id: 'services', labelKey: 'nav.services', icon: 'Grid2x2',       path: ROUTES.SERVICES },
  { id: 'profile',  labelKey: 'nav.profile',  icon: 'User',          path: ROUTES.PROFILE },
];

// Admin: Services → Admin panel
const ADMIN_TABS: TabItem[] = BASE_TABS.map((t) =>
  t.id === 'services'
    ? { ...t, id: 'admin', labelKey: 'nav.admin', icon: 'LayoutDashboard', path: ROUTES.ADMIN }
    : t,
);

// Principal: Services → Analytics Dashboard
const PRINCIPAL_TABS: TabItem[] = BASE_TABS.map((t) =>
  t.id === 'services'
    ? { ...t, id: 'dashboard', labelKey: 'nav.dashboard', icon: 'BarChart2', path: ROUTES.PRINCIPAL_DASHBOARD }
    : t,
);

// Security: no tabs (single full-screen GuardVerify page)
const SECURITY_TABS: TabItem[] = [];

export function getTabsForRole(role: Role | null): TabItem[] {
  switch (role) {
    case 'admin':     return ADMIN_TABS;
    case 'principal': return PRINCIPAL_TABS;
    case 'security':  return SECURITY_TABS;
    default:          return BASE_TABS;
  }
}

// ─── Role badge colour tokens (border + bg + text) ─────────────────────────
export const ROLE_COLORS: Record<Role, string> = {
  student:   'bg-blue-500/20   text-blue-300   border-blue-500/40',
  teacher:   'bg-green-500/20  text-green-300  border-green-500/40',
  hod:       'bg-purple-500/20 text-purple-300 border-purple-500/40',
  warden:    'bg-orange-500/20 text-orange-300 border-orange-500/40',
  canteen:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  accounts:  'bg-teal-500/20   text-teal-300   border-teal-500/40',
  security:  'bg-gray-500/20   text-gray-300   border-gray-500/40',
  admin:     'bg-red-500/20    text-red-300    border-red-500/40',
  principal: 'bg-amber-500/20  text-amber-300  border-amber-500/40',
};
