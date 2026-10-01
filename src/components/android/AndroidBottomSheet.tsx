import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AndroidBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AndroidBottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: AndroidBottomSheetProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sheet Modal */}
      <div className="relative z-10 w-full max-w-xl mx-auto rounded-t-3xl bg-slate-900 border-t border-slate-700/80 shadow-2xl p-6 pb-8 transition-transform animate-in slide-in-from-bottom duration-300">
        {/* Android drag pill */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-600/70" />

        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
