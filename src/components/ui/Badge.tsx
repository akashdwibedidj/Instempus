// Badge.tsx — RoleBadge and StatusPill.
// Colour maps match UI_DESIGN.md spec. All text via t(). No Supabase imports.
import { useTranslation } from 'react-i18next';
import { ROLE_COLORS } from '@/config/navigation';
import type { Role } from '@/constants/roles';

// ─── StatusPill ───────────────────────────────────────────────────────────────
type AppStatus   = 'submitted' | 'under_review' | 'approved' | 'declined' | 'escalated' | 'cancelled';
type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type BadgeStatus = AppStatus | IssueStatus;

const STATUS_COLORS: Record<BadgeStatus, string> = {
  submitted:    'bg-gray-500/20   text-gray-300   border-gray-500/40',
  under_review: 'bg-blue-500/20   text-blue-300   border-blue-500/40',
  approved:     'bg-green-500/20  text-green-300  border-green-500/40',
  declined:     'bg-red-500/20    text-red-300    border-red-500/40',
  escalated:    'bg-amber-500/20  text-amber-300  border-amber-500/40',
  cancelled:    'bg-gray-500/15   text-gray-400   border-gray-500/30',
  open:         'bg-blue-500/20   text-blue-300   border-blue-500/40',
  in_progress:  'bg-violet-500/20 text-violet-300 border-violet-500/40',
  resolved:     'bg-green-500/20  text-green-300  border-green-500/40',
  closed:       'bg-gray-500/20   text-gray-300   border-gray-500/40',
};

const APP_STATUSES = new Set<string>(['submitted','under_review','approved','declined','escalated','cancelled']);

interface StatusPillProps {
  status: BadgeStatus;
  className?: string;
}

export function StatusPill({ status, className = '' }: StatusPillProps) {
  const { t } = useTranslation();
  const ns = APP_STATUSES.has(status) ? 'applications' : 'issues';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_COLORS[status]} ${className}`}
    >
      {t(`${ns}.status.${status}`)}
    </span>
  );
}

// ─── RoleBadge ────────────────────────────────────────────────────────────────
interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${ROLE_COLORS[role]} ${className}`}
    >
      {t(`roles.${role}`)}
    </span>
  );
}
