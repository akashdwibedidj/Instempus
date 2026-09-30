// formStyles.ts — shared Tailwind class strings for the auth forms.
// Temporary: the Phase 3 UI kit (Input/Button) will replace these.

export const inputClass =
  'w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white ' +
  'placeholder-white/40 backdrop-blur focus:border-indigo-400 focus:outline-none ' +
  'focus:ring-2 focus:ring-indigo-400/50';

export const labelClass = 'mb-1 block text-sm text-white/70';

export const errorClass = 'mt-1 text-xs text-red-300';

export const formErrorClass =
  'rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200';

export const primaryButtonClass =
  'w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 ' +
  'font-semibold text-white shadow-lg transition hover:opacity-90 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';