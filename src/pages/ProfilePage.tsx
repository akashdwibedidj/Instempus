// ProfilePage.tsx — user profile: avatar, role info, posts grid, logout.
// Phase 3 stub. Real data (enrollments, hostel, posts) in Phase 6+.
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSessionStore } from '@/app/sessionStore';
import { ROLE_COLORS } from '@/config/navigation';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { name, role, logout, isLoggingOut } = useAuth();
  const language = useSessionStore((s) => s.language);
  const badgeColor = role ? ROLE_COLORS[role] : '';

  return (
    <div className="animate-fade-in">
      {/* ── Header ── */}
      <div className="px-4 pb-6 pt-6">
        {/* Avatar + info */}
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-brand-500/30 bg-brand-500/10 text-3xl">
            👤
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-white">{name ?? '—'}</p>
            {role && (
              <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeColor}`}>
                {t(`roles.${role}`)}
              </span>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {t('auth.language')}: <span className="text-gray-300 uppercase">{language}</span>
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          id="profile-logout"
          onClick={() => void logout()}
          disabled={isLoggingOut}
          className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          {isLoggingOut ? t('common.loading') : t('nav.logout')}
        </button>
      </div>

      {/* ── Posts / Applications tabs (placeholder) ── */}
      <div className="border-t border-white/10">
        <div className="glass-card mx-4 mt-4 flex flex-col items-center gap-3 py-14 text-center">
          <span className="text-3xl">📷</span>
          <p className="text-sm text-gray-400">Posts &amp; applications coming Phase 6+</p>
        </div>
      </div>
    </div>
  );
}
