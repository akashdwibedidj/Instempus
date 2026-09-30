// Skeleton.tsx — shimmer placeholder for loading states (prefer over Spinner for lists).
// No Supabase imports. No i18n (purely visual).
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  lines?:   number;   // stacked text-line skeletons
  circle?:  boolean;  // round avatar shape
  height?:  string;   // Tailwind height class, e.g. 'h-4'
  width?:   string;   // Tailwind width class, e.g. 'w-1/2'
}

function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`}
      aria-hidden
    />
  );
}

export function Skeleton({
  lines,
  circle,
  height = 'h-4',
  width  = 'w-full',
  className = '',
}: Props) {
  if (circle) {
    return <Shimmer className={`${height} aspect-square rounded-full ${className}`} />;
  }

  if (lines && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <Shimmer
            key={i}
            className={`${height} ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
          />
        ))}
      </div>
    );
  }

  return <Shimmer className={`${height} ${width} ${className}`} />;
}
