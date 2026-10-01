import { useAppStore } from '../../services/store';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNavBar } from './AndroidNavBar';
import { CleanBottomNav } from './CleanBottomNav';
import { StoryViewerModal } from '../story/StoryViewerModal';
import { HomeFeedScreen } from '../home/HomeFeedScreen';
import { MessagingScreen } from '../messaging/MessagingScreen';
import { ServicesScreen } from '../services/ServicesScreen';
import { IssuesBoardScreen } from '../issues/IssuesBoardScreen';
import { RoleProfileScreen } from '../profile/RoleProfileScreen';
import { EmergencyAlarmModal } from '../emergency/EmergencyAlarmModal';
import { InstitutionalLoginScreen } from '../auth/InstitutionalLoginScreen';

export function AndroidDeviceFrame() {
  const {
    activeTab,
    isOffline,
    isAuthenticated,
  } = useAppStore();

  return (
    <div className="min-h-screen bg-black text-slate-100 flex justify-center select-none">
      {/* 
        Native Mobile Container:
        - Fills 100% screen on mobile devices / Capacitor webview
        - Centers cleanly on desktop / tablet browsers
      */}
      <div className="w-full max-w-md min-h-screen bg-black flex flex-col justify-between relative shadow-2xl overflow-x-hidden">
        {/* Offline status banner */}
        {isOffline && (
          <div className="bg-rose-700 text-white text-[11px] font-bold py-1 px-4 text-center flex items-center justify-center gap-2 shadow z-30">
            <span>OFFLINE PROTOCOL ACTIVE • Operating via local cached storage</span>
          </div>
        )}

        {/* Top Status Bar (Time, WiFi, Battery) */}
        <AndroidStatusBar />

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-3 pt-1 pb-16">
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

        {/* Bottom Navigation & Gesture Pill (Active when authenticated) */}
        {isAuthenticated && (
          <div className="fixed bottom-0 w-full max-w-md bg-black z-30">
            <CleanBottomNav />
            <AndroidNavBar />
          </div>
        )}
      </div>

      {/* Global Modals */}
      {isAuthenticated && <StoryViewerModal />}
      {isAuthenticated && <EmergencyAlarmModal />}
    </div>
  );
}
