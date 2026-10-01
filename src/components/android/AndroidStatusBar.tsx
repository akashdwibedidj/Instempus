import { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Bell, Moon } from 'lucide-react';
import { useAppStore } from '../../services/store';

export function AndroidStatusBar() {
  const [time, setTime] = useState('');
  const isOffline = useAppStore((s) => s.isOffline);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 pt-2 pb-1 text-xs font-semibold text-slate-300 select-none z-30">
      {/* Left: Clock */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[13px] tracking-tight text-white">{time || '09:41'}</span>
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>

      {/* Center: Punch-hole camera marker */}
      <div className="flex items-center justify-center">
        <div className="h-3.5 w-3.5 rounded-full bg-black/90 border border-slate-700/60 shadow-inner flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-900 border border-emerald-500/20" />
        </div>
      </div>

      {/* Right: Android Status Icons */}
      <div className="flex items-center gap-2 text-slate-300">
        <Moon size={11} className="text-slate-400" />
        {isOffline ? (
          <span className="rounded bg-rose-500/20 px-1 text-[9px] font-bold text-rose-400 uppercase">
            Offline
          </span>
        ) : (
          <span className="font-mono text-[10px] font-bold text-emerald-400">5G</span>
        )}
        <Signal size={12} className={isOffline ? 'text-slate-600' : 'text-slate-300'} />
        <Wifi size={12} className={isOffline ? 'text-rose-400' : 'text-slate-300'} />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-slate-400">96%</span>
          <BatteryMedium size={14} className="text-slate-300" />
        </div>
      </div>
    </div>
  );
}
