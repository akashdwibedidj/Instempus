// Sidebar.tsx — desktop-only sidebar (≥ lg). Shows the same 5 tabs as BottomNav.
// Hidden on mobile/tablet via `hidden lg:flex`. No Supabase imports.
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { useSessionStore } from '@/app/sessionStore';
import { getTabsForRole } from '@/config/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { LucideProps } from 'lucide-react';

type LucideIconName = keyof typeof Icons;

function NavIcon({ name, size }: { name: string; size: number }) {
  const Icon = Icons[name as LucideIconName] as React.FC<LucideProps> | undefined;
  return Icon ? <Icon size={size} /> : null;
}

interface Props {
  onCreatePress: () => void;
}

export function DesktopSidebar({ onCreatePress }: Props) {
  const { t } = useTranslation();
  const role = useSessionStore((s) => s.role);
  const name = useSessionStore((s) => s.name);
  const { logout, isLoggingOut } = useAuth();
  const tabs = getTabsForRole(role);

  return (
    <aside
      id="app-sidebar"
      className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-surface/90 backdrop-blur-xl lg:flex"
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-white/10 px-6">
        <span className="gradient-text text-xl font-bold tracking-tight">{t('app.name')}</span>
      </div>

      {/* Role badge */}
      {role && (
        <div className="mx-4 mt-4 rounded-xl bg-brand-500/10 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">
            {t(`roles.${role}`)}
          </p>
          {name && <p className="mt-0.5 truncate text-sm text-white/80">{name}</p>}
        </div>
      )}

      {/* 5 tabs */}
      <nav className="mt-4 flex-1 overflow-y-auto px-3" aria-label="Main navigation">
        <ul className="space-y-1">
          {tabs.map((tab) =>
            tab.isAction ? (
              <li key={tab.id}>
                <button
                  id="sidebar-create"
                  onClick={onCreatePress}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  <NavIcon name={tab.icon} size={18} />
                  <span>{t(tab.labelKey)}</span>
                </button>
              </li>
            ) : (
              <li key={tab.id}>
                <NavLink
                  to={tab.path!}
                  id={`sidebar-${tab.id}`}
                  end={tab.id === 'home'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-500/20 text-brand-300'
                        : 'text-gray-400 hover:bg-white/[0.08] hover:text-white'
                    }`
                  }
                >
                  <NavIcon name={tab.icon} size={18} />
                  <span>{t(tab.labelKey)}</span>
                </NavLink>
              </li>
            ),
          )}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          id="sidebar-logout"
          onClick={() => void logout()}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-50"
        >
          <NavIcon name="LogOut" size={18} />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}

/** @deprecated Use DesktopSidebar. Kept for any stale imports. */
export { DesktopSidebar as Sidebar, DesktopSidebar as SidebarContent };
