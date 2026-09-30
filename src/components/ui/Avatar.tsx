// Avatar.tsx — circular avatar: image or initials fallback, optional role dot.
// No Supabase imports. ROLE_COLORS from navigation config.
import type { ImgHTMLAttributes } from 'react';
import { ROLE_COLORS } from '@/config/navigation';
import type { Role } from '@/constants/roles';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, { ring: string; text: string; dot: string }> = {
  xs: { ring: 'h-6  w-6',  text: 'text-[9px]', dot: 'h-2   w-2'   },
  sm: { ring: 'h-8  w-8',  text: 'text-xs',    dot: 'h-2.5 w-2.5' },
  md: { ring: 'h-10 w-10', text: 'text-sm',    dot: 'h-3   w-3'   },
  lg: { ring: 'h-14 w-14', text: 'text-base',  dot: 'h-3.5 w-3.5' },
  xl: { ring: 'h-20 w-20', text: 'text-xl',    dot: 'h-4   w-4'   },
};

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  name:  string;
  src?:  string | null;
  size?: AvatarSize;
  role?: Role;
}

export function Avatar({ name, src, size = 'md', role, className = '' }: Props) {
  const s = SIZE_MAP[size];

  return (
    <div className={`relative shrink-0 ${s.ring} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        <div
          aria-label={name}
          className={`flex h-full w-full items-center justify-center rounded-full bg-brand-500/20 font-semibold text-brand-300 ${s.text}`}
        >
          {initials(name)}
        </div>
      )}

      {/* Role colour dot */}
      {role && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-surface ${s.dot} ${ROLE_COLORS[role].split(' ')[0]}`}
        />
      )}
    </div>
  );
}
