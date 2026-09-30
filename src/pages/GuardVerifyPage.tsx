// GuardVerifyPage.tsx — Security guard only: full-screen QR scan + manual code.
// No sidebar, no bottom nav (AppShell skips those for security role).
import { useTranslation } from 'react-i18next';

export default function GuardVerifyPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-6 px-6 animate-fade-in">
      <span className="text-6xl">📲</span>
      <h1 className="text-2xl font-bold text-white text-center">{t('gatepass.scanQR')}</h1>
      <button
        id="guard-scan-btn"
        className="w-full max-w-xs rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/40 transition-transform active:scale-95"
      >
        {t('gatepass.scanQR')}
      </button>
      <p className="text-xs text-gray-500">Gate-pass QR verification — Phase 4</p>
    </div>
  );
}
