
// LanguagePicker.tsx — three-way language toggle (controlled).
import type { Language } from '@/app/sessionStore';

// Native names on purpose: each language is shown in its own script.
const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
];

interface LanguagePickerProps {
  value: Language;
  onChange: (language: Language) => void;
}

export function LanguagePicker({ value, onChange }: LanguagePickerProps) {
  return (
    <div role="radiogroup" className="grid grid-cols-3 gap-2">
      {LANGUAGES.map(({ code, label }) => {
        const active = code === value;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(code)}
            className={
              'rounded-xl border px-3 py-2 text-sm transition ' +
              (active
                ? 'border-indigo-400 bg-indigo-500/30 text-white'
                : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10')
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}