// BottomNav.tsx — Instagram-style 5-tab bottom nav bar.
// Centre tab is a ➕ action button (no route). Hidden on lg+ (desktop sidebar takes over).
// No Supabase imports. Role from sessionStore.
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { useSessionStore } from '@/app/sessionStore';
import { getTabsForRole } from '@/config/navigation';
import type { LucideProps } from 'lucide-react';

type LucideIconName = keyof typeof Icons;

function NavIcon({ name, size, strokeWidth }: { name: string; size: number; strokeWidth?: number }) {
  const Icon = Icons[name as LucideIconName] as React.FC<LucideProps> | undefined;
  return Icon ? <Icon size={size} strokeWidth={strokeWidth ?? 1.75} /> : null;
}

interface Props {
  onCreatePress: () => void;
}

export function BottomNav({ onCreatePress }: Props) {
  const { t } = useTranslation();
  const role = useSessionStore((s) => s.role);
  const tabs = getTabsForRole(role);

  if (tabs.length === 0) return null; // security — no tabs

  return (
    <nav
      id="app-bottom-nav"
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-30 flex h-[58px] items-stretch border-t border-white/10 bg-surface/95 backdrop-blur-xl bottom-nav-safe lg:hidden"
    >
      {tabs.map((tab) => {
        /* ── Centre action button (➕) ── */
        if (tab.isAction) {
          return (
            <button
              key={tab.id}
              id="bottom-nav-create"
              aria-label={t(tab.labelKey)}
              onClick={onCreatePress}
              className="flex flex-1 items-center justify-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg shadow-brand-500/40 transition-transform duration-150 active:scale-90">
                <NavIcon name={tab.icon} size={22} strokeWidth={2.5} />
              </span>
            </button>
          );
        }

        /* ── Regular tab ── */
        return (
          <NavLink
            key={tab.id}
            to={tab.path!}
            id={`bottom-nav-${tab.id}`}
            end={tab.id === 'home'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-[3px] text-[10px] font-medium transition-colors duration-150 ${
                isActive ? 'text-white' : 'text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <NavIcon name={tab.icon} size={23} strokeWidth={isActive ? 2.4 : 1.6} />
                <span>{t(tab.labelKey)}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
