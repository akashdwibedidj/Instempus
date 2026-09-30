// Modal.tsx — glassmorphic dialog: backdrop, title, close btn, children, footer.
// Closes on Escape key and backdrop click. No Supabase imports.
import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ModalWidth = 'sm' | 'md' | 'lg';

const MAX_W: Record<ModalWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

interface Props {
  open:      boolean;
  onClose:   () => void;
  title?:    string;
  footer?:   ReactNode;
  maxWidth?: ModalWidth;
  children:  ReactNode;
}

export function Modal({ open, onClose, title, footer, maxWidth = 'md', children }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4 pb-4 sm:pb-0"
    >
      {/* Backdrop */}
      <div
        role="presentation"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative w-full ${MAX_W[maxWidth]} glass-card p-0 animate-slide-up`}>
        {title && (
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <button
              id="modal-close"
              aria-label={t('common.close')}
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        )}

        <div className="p-5">{children}</div>

        {footer && (
          <div className="border-t border-white/10 px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
