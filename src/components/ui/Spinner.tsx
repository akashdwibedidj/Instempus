// Spinner.tsx — accessible loading spinner. Use for small inline areas.
// For whole-screen loading use fullPage=true. For lists, prefer Skeleton.
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type SpinnerSize = 'sm' | 'md' | 'lg';

const PX: Record<SpinnerSize, number> = { sm: 14, md: 22, lg: 34 };

interface Props {
  size?:     SpinnerSize;
  label?:    string;   // overrides t('common.loading')
  fullPage?: boolean;
  className?: string;
}

export function Spinner({ size = 'md', label, fullPage, className = '' }: Props) {
  const { t } = useTranslation();
  const text = label ?? t('common.loading');

  const inner = (
    <div role="status" aria-label={text} className={`flex flex-col items-center gap-2 ${className}`}>
      <Loader2 size={PX[size]} className="animate-spin text-brand-400" />
      {size !== 'sm' && (
        <span className="text-xs text-gray-500">{text}</span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {inner}
      </div>
    );
  }

  return inner;
}
