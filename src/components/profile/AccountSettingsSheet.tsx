import { useAppStore } from '../../services/store';
import { AndroidBottomSheet } from '../android/AndroidBottomSheet';
import { Language } from '../../types';
import { LogOut, User, Building, Phone, Mail, MapPin, Globe, Shield, RefreshCw } from 'lucide-react';

export function AccountSettingsSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    currentUser,
    logout,
    language,
    setLanguage,
    isOffline,
    toggleOffline,
  } = useAppStore();

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <AndroidBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Institutional Account Settings"
      subtitle={`Authenticated as ${currentUser.name}`}
    >
      <div className="space-y-5 pt-2 text-sm select-none text-white">
        {/* User Details Matrix (No Bios, Institutional Identity) */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Official Identity Record
          </span>

          <div className="bg-[#121212] border border-white/5 rounded-2xl divide-y divide-white/5 shadow-sm overflow-hidden">
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-400">
                <User size={16} className="text-indigo-400" />
                <span className="text-xs font-medium">Full Name</span>
              </div>
              <span className="font-semibold text-white text-xs">{currentUser.name}</span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-400">
                <Shield size={16} className="text-indigo-400" />
                <span className="text-xs font-medium">Institutional Identifier</span>
              </div>
              <span className="font-mono font-bold text-white text-xs">
                {currentUser.rollNo || currentUser.employeeId}
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-400">
                <Building size={16} className="text-indigo-400" />
                <span className="text-xs font-medium">Department / Cell</span>
              </div>
              <span className="font-medium text-slate-200 text-xs text-right max-w-[200px] truncate">
                {currentUser.department}
              </span>
            </div>

            {currentUser.hostelBlock && (
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <MapPin size={16} className="text-indigo-400" />
                  <span className="text-xs font-medium">Campus Residence</span>
                </div>
                <span className="font-medium text-slate-200 text-xs">
                  {currentUser.hostelBlock} ({currentUser.roomNo})
                </span>
              </div>
            )}

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-400">
                <Phone size={16} className="text-indigo-400" />
                <span className="text-xs font-medium">Registered Contact</span>
              </div>
              <span className="font-mono text-slate-300 text-xs">{currentUser.phone}</span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-400">
                <Mail size={16} className="text-indigo-400" />
                <span className="text-xs font-medium">Official Email</span>
              </div>
              <span className="font-mono text-indigo-300 text-xs text-right max-w-[200px] truncate">
                {currentUser.email || `${currentUser.username}@bput.ac.in`}
              </span>
            </div>
          </div>
        </div>

        {/* System Language Preference */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            System Language
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'Hindi' },
              { id: 'or', label: 'Odia' },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id as Language)}
                className={`py-2 text-center text-xs rounded-xl font-semibold transition-colors ${
                  language === l.id
                    ? 'bg-white text-black font-bold shadow-xs'
                    : 'bg-[#141414] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offline Cache Simulator */}
        <div className="bg-[#121212] p-4 flex items-center justify-between border border-white/5 rounded-2xl shadow-sm">
          <div>
            <span className="font-semibold text-white text-sm block">Offline Persistence Mode</span>
            <span className="text-xs text-slate-400">IndexedDB local storage simulation</span>
          </div>
          <button
            onClick={toggleOffline}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              isOffline ? 'bg-rose-600 text-white' : 'bg-[#1e1e1e] text-slate-300'
            }`}
          >
            {isOffline ? 'Offline Active' : 'Online'}
          </button>
        </div>

        {/* PROMINENT LOG OUT BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors active:scale-95"
          >
            <LogOut size={16} />
            <span>Log Out of Instempus</span>
          </button>
          <span className="text-xs text-slate-500 font-mono text-center block mt-2">
            Terminates active session and returns to Institutional Login Screen.
          </span>
        </div>
      </div>
    </AndroidBottomSheet>
  );
}
