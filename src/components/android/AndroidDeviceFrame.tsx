import { useAppStore } from '../../services/store';
import { CleanBottomNav } from './CleanBottomNav';
import { StoryViewerModal } from '../story/StoryViewerModal';
import { HomeFeedScreen } from '../home/HomeFeedScreen';
import { MessagingScreen } from '../messaging/MessagingScreen';
import { ServicesScreen } from '../services/ServicesScreen';
import { IssuesBoardScreen } from '../issues/IssuesBoardScreen';
import { RoleProfileScreen } from '../profile/RoleProfileScreen';
import { EmergencyAlarmModal } from '../emergency/EmergencyAlarmModal';
import { InstitutionalLoginScreen } from '../auth/InstitutionalLoginScreen';
import { CampusAIChatModal } from '../ai/CampusAIChatModal';
import { Bot, Sparkles } from 'lucide-react';

export function AndroidDeviceFrame() {
  const {
    activeTab,
    isOffline,
    isAuthenticated,
    toggleAIChat,
  } = useAppStore();

  return (
    <div className="min-h-screen bg-black text-slate-100 flex justify-center select-none">
      {/* 
        Native Mobile Viewport:
        - Fills 100% of the screen on mobile devices / Capacitor webview
        - Respects real native phone status bar and gesture navigation
      */}
      <div className="w-full max-w-md min-h-screen bg-black flex flex-col justify-between relative shadow-2xl overflow-x-hidden">
        {/* Offline status banner (Only appears when network connection is severed) */}
        {isOffline && (
          <div className="bg-rose-700 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow z-30">
            <span>OFFLINE PROTOCOL ACTIVE • Working with local cached storage</span>
          </div>
        )}

        {/* Main App Content Viewport */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-20">
          {!isAuthenticated ? (
            <InstitutionalLoginScreen />
          ) : (
            <>
              {activeTab === 'home' && <HomeFeedScreen />}
              {activeTab === 'messages' && <MessagingScreen />}
              {activeTab === 'services' && <ServicesScreen />}
              {activeTab === 'issues' && <IssuesBoardScreen />}
              {activeTab === 'profile' && <RoleProfileScreen />}
            </>
          )}
        </main>

        {/* Floating Quick Campus AI Button (When authenticated) */}
        {isAuthenticated && (
          <button
            onClick={toggleAIChat}
            className="fixed bottom-20 right-4 z-40 h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all border border-white/20"
            title="Chat with Instempus Campus AI (Gemini 3.8)"
          >
            <Bot size={22} />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-black"></span>
            </span>
          </button>
        )}

        {/* Real App Bottom Navigation */}
        {isAuthenticated && (
          <div className="fixed bottom-0 w-full max-w-md bg-black border-t border-white/5 z-30 pb-safe">
            <CleanBottomNav />
          </div>
        )}
      </div>

      {/* Global Modals */}
      {isAuthenticated && <StoryViewerModal />}
      {isAuthenticated && <EmergencyAlarmModal />}
      {isAuthenticated && <CampusAIChatModal />}
    </div>
  );
}
