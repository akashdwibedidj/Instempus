// Input.tsx — design-system text input: label, error, helper, icon slots.
// No Supabase imports. Labels/errors come pre-translated from caller.
import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?:     string;
  error?:     string;
  helper?:    string;
  leftIcon?:  ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, helper, leftIcon, rightIcon, id, className = '', ...rest },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-gray-400">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          className={`
            h-11 w-full rounded-xl border bg-white/[0.05] text-sm text-white
            placeholder:text-gray-600 outline-none transition-colors duration-150
            ${leftIcon  ? 'pl-9' : 'pl-3'}
            ${rightIcon ? 'pr-9' : 'pr-3'}
            ${error
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-brand-500/60'}
            ${className}
          `.trim()}
          {...rest}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {rightIcon}
          </span>
        )}
      </div>

      {error  && <p role="alert" className="text-xs text-red-400">{error}</p>}
      {!error && helper && <p className="text-xs text-gray-600">{helper}</p>}
    </div>
  );
});
