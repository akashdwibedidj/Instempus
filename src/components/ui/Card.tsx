// Card.tsx — glassmorphic surface card. Optional header / footer slots.
import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  header?:    ReactNode;
  footer?:    ReactNode;
  noPadding?: boolean;
}

export function Card({
  header,
  footer,
  noPadding,
  children,
  className = '',
  ...rest
}: Props) {
  return (
    <div className={`glass-card overflow-hidden ${className}`} {...rest}>
      {header && (
        <div className="border-b border-white/10 px-4 py-3">{header}</div>
      )}

      <div className={noPadding ? '' : 'p-4'}>{children}</div>

      {footer && (
        <div className="border-t border-white/10 px-4 py-3">{footer}</div>
      )}
    </div>
  );
}
