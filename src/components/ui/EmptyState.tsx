// EmptyState.tsx — empty list/screen with emoji, title, subtitle, optional action.
// Caller passes pre-translated strings. No Supabase imports.
import type { ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  emoji?:       string;
  title:        string;
  subtitle?:    string;
  actionLabel?: string;
  onAction?:    () => void;
  children?:    ReactNode;
  className?:   string;
}

export function EmptyState({
  emoji = '📭',
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
  className = '',
}: Props) {
  return (
    <div
      className={`flex flex-col items-center gap-4 px-6 py-16 text-center animate-fade-in ${className}`}
    >
      <span className="text-5xl" role="img" aria-hidden>
        {emoji}
      </span>

      <div className="space-y-1">
        <p className="text-base font-semibold text-white">{title}</p>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>

      {children}

      {actionLabel && onAction && (
        <Button variant="secondary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
