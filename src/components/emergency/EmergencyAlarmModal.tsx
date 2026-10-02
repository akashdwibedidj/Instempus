import { useEffect } from 'react';
import { useAppStore } from '../../services/store';
import { playEmergencySiren, stopEmergencySiren } from '../../services/audioAlarm';
import { AlertTriangle, PhoneCall, ShieldAlert, X } from 'lucide-react';

export function EmergencyAlarmModal() {
  const { emergencyAlert, dismissEmergencyAlert, currentRole } = useAppStore();

  useEffect(() => {
    if (emergencyAlert.active) {
      playEmergencySiren();
    } else {
      stopEmergencySiren();
    }
    return () => {
      stopEmergencySiren();
    };
  }, [emergencyAlert.active]);

  if (!emergencyAlert.active) return null;

  const canDismiss = ['admin', 'security', 'warden', 'principal'].includes(currentRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md select-none text-white animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0a0a0a] border-2 border-red-500 rounded-3xl p-6 space-y-5 shadow-2xl">
        {/* Flashing Alert Header */}
        <div className="flex items-center justify-between border-b border-red-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-sm font-black uppercase tracking-wider text-red-400">
              CAMPUS EMERGENCY ALERT
            </h2>
          </div>

          <span className="text-xs font-mono text-red-300 bg-red-950 px-2.5 py-0.5 rounded-full border border-red-800 font-semibold">
            SIREN SOUNDING
          </span>
        </div>

        {/* Alert Type & Message */}
        <div className="space-y-3">
          <div className="p-4 bg-red-950/40 border border-red-700/60 rounded-2xl space-y-1.5 shadow-sm">
            <span className="text-xs font-mono font-bold uppercase text-red-400 tracking-wide">
              {emergencyAlert.type.toUpperCase()} HAZARD WARNING
            </span>
            <h3 className="text-base font-bold text-white leading-snug">{emergencyAlert.title}</h3>
            <p className="text-sm text-red-100 leading-relaxed">{emergencyAlert.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="p-3 bg-[#141414] border border-white/5 rounded-xl">
              <span className="text-[11px] text-slate-400 block mb-0.5">Designated Muster Point:</span>
              <span className="font-bold text-white text-xs block leading-tight">
                {emergencyAlert.musterPoint}
              </span>
            </div>
            <div className="p-3 bg-[#141414] border border-white/5 rounded-xl">
              <span className="text-[11px] text-slate-400 block mb-0.5">Issued By:</span>
              <span className="font-bold text-white text-xs truncate block leading-tight">
                {emergencyAlert.issuedBy}
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Hotline Buttons */}
        <div className="space-y-2 pt-1">
          <span className="text-xs text-slate-400 uppercase font-mono font-semibold block">
            Immediate Response Contacts:
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:112"
              className="py-2.5 px-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <PhoneCall size={15} />
              <span>National SOS (112)</span>
            </a>
            <a
              href={`tel:${emergencyAlert.emergencyPhone}`}
              className="py-2.5 px-3.5 rounded-xl bg-[#1e1e1e] hover:bg-[#282828] text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              <PhoneCall size={15} />
              <span>Control Room</span>
            </a>
          </div>
        </div>

        {/* Dismissal / Silence controls */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => stopEmergencySiren()}
            className="text-xs text-slate-400 hover:text-white underline font-mono"
          >
            Mute Siren Audio
          </button>

          {canDismiss ? (
            <button
              onClick={dismissEmergencyAlert}
              className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Clear Emergency (All Safe)
            </button>
          ) : (
            <button
              onClick={dismissEmergencyAlert}
              className="py-2 px-3.5 rounded-xl bg-[#222] hover:bg-[#2c2c2c] text-slate-300 text-xs font-medium"
            >
              Acknowledge & Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
