// MessagesPage.tsx — DM + group chats (Phase 3 stub; real chat in Phase 6).
import { useTranslation } from 'react-i18next';

export default function MessagesPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold text-white">{t('nav.messages')}</h1>
      <div className="glass-card flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-4xl">💬</span>
        <p className="text-sm text-gray-400">{t('common.empty')}</p>
        <p className="text-xs text-gray-600">DMs &amp; group chats — coming Phase 6</p>
      </div>
    </div>
  );
}
