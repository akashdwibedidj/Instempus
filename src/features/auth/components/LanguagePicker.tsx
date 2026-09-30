// LanguagePicker.tsx — three-button language selector (en / hi / or).
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
] as const;

interface Props {
  value: string;
  onChange: (lang: string) => void;
}

export function LanguagePicker({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-200">
        {t('auth.language')}
      </label>
      <div className="flex gap-2">
        {LANGS.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            id={`lang-${code}`}
            onClick={() => onChange(code)}
            className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
              value === code
                ? 'border-violet-500 bg-violet-600 text-white'
                : 'border-white/10 bg-white/5 text-gray-300 hover:border-violet-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
