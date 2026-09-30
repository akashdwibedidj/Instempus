// AppShell.tsx — mobile-first authenticated layout (Instagram style).
// Mobile: TopBar (fixed top) + scrollable content + BottomNav (fixed bottom).
// Desktop lg+: DesktopSidebar (fixed left) + TopBar offset + content column.
// No Supabase imports. Create-sheet state lives here.
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/app/sessionStore';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './Sidebar';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

export function AppShell() {
  const { t } = useTranslation();
  const role = useSessionStore((s) => s.role);
  const [createOpen, setCreateOpen] = useState(false);
  const isSecurity = role === 'security';

  return (
    <div className="flex min-h-screen bg-surface text-white">
      {/* Desktop sidebar — lg+ only; not shown for security */}
      {!isSecurity && <DesktopSidebar onCreatePress={() => setCreateOpen(true)} />}

      {/* Main content column */}
      <div className={`flex min-w-0 flex-1 flex-col ${!isSecurity ? 'lg:ml-64' : ''}`}>
        <TopBar notifCount={0} />
        <OfflineBanner />

        {/* Scrollable page content */}
        <main
          id="app-main-content"
          className={`flex-1 pt-14 ${!isSecurity ? 'pb-[58px] lg:pb-4' : 'pb-4'}`}
        >
          {/* Instagram-style centred column: full-width on mobile, capped on desktop */}
          <div className="mx-auto w-full max-w-xl lg:py-4">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom nav (hidden lg+, hidden for security) */}
        {!isSecurity && <BottomNav onCreatePress={() => setCreateOpen(true)} />}
      </div>

      {/* ── Create bottom sheet ── */}
      {createOpen && (
        <>
          <div
            role="presentation"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setCreateOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-white/10 bg-surface-card px-6 pb-10 pt-4 animate-slide-up">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">{t('nav.create')}</h2>
              <button
                id="create-sheet-close"
                aria-label={t('common.close')}
                onClick={() => setCreateOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 py-6">
              Create actions coming in Phase 3, Task 3…
            </p>
          </div>
        </>
      )}
    </div>
  );
}
