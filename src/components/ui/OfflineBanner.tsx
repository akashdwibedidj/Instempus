// OfflineBanner.tsx — fixed banner shown when browser goes offline.
// Listens to window 'online' / 'offline' events. Slides in from top. No Supabase.
import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function OfflineBanner() {
  const { t } = useTranslation();
  const [offline, setOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const goOnline  = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="
        fixed inset-x-0 top-14 z-40 flex items-center justify-center gap-2
        border-b border-amber-500/30 bg-amber-500/15 py-2 backdrop-blur-md
        text-xs font-medium text-amber-300 animate-slide-down
        lg:left-64
      "
    >
      <WifiOff size={13} aria-hidden />
      <span>{t('common.offline')}</span>
    </div>
  );
}
