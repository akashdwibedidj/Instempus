// Button.tsx — design-system button: variants, sizes, loading, icon slots.
// No Supabase imports. Children are pre-translated by caller.
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

const VARIANT: Record<Variant, string> = {
  primary:   'bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-md shadow-brand-500/25 hover:opacity-90',
  secondary: 'border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]',
  ghost:     'text-gray-400 hover:bg-white/[0.07] hover:text-white',
  danger:    'border border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/25',
};

const SIZE: Record<Size, string> = {
  sm: 'h-8  px-3 text-xs  gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm  gap-2   rounded-xl',
  lg: 'h-12 px-6 text-base gap-2   rounded-2xl',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   Variant;
  size?:      Size;
  loading?:   boolean;
  fullWidth?: boolean;
  leftIcon?:  ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', loading, fullWidth, leftIcon, rightIcon,
    children, disabled, className = '', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled ?? loading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-150 active:scale-[0.97]
        disabled:pointer-events-none disabled:opacity-50
        ${VARIANT[variant]} ${SIZE[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...rest}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
