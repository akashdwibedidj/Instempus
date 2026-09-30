// TopBar.tsx — Instagram-style top bar: logo left, search + notification bell right.
// Fixed at top; no hamburger (desktop sidebar handles that at lg+). No Supabase imports.
import { useTranslation } from 'react-i18next';
import { Bell, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useSessionStore } from '@/app/sessionStore';

interface Props {
  notifCount?: number;
}

export function TopBar({ notifCount = 0 }: Props) {
  const { t } = useTranslation();
  const role = useSessionStore((s) => s.role);

  // Security guard: just show a plain bar without search/notif
  if (role === 'security') {
    return (
      <header
        id="app-topbar"
        className="fixed inset-x-0 top-0 z-30 flex h-14 items-center border-b border-white/10 bg-surface/90 px-4 backdrop-blur-md"
      >
        <span className="gradient-text text-xl font-bold tracking-tight select-none">
          {t('app.name')}
        </span>
      </header>
    );
  }

  return (
    <header
      id="app-topbar"
      className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-surface/90 px-4 backdrop-blur-md lg:left-64"
    >
      {/* App name / logo */}
      <span className="gradient-text text-xl font-bold tracking-tight select-none">
        {t('app.name')}
      </span>

      {/* Action icons */}
      <div className="flex items-center gap-0.5">
        <Link
          to={ROUTES.SEARCH}
          id="topbar-search"
          aria-label={t('common.search')}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 transition-colors"
        >
          <Search size={20} />
        </Link>

        <Link
          to={ROUTES.NOTIFICATIONS}
          id="topbar-notifications"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 transition-colors"
        >
          <Bell size={20} />
          {notifCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white animate-pulse-slow">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
