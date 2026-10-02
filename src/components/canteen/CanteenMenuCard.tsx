import { useState } from 'react';
import { useAppStore } from '../../services/store';
import { Utensils, Edit3, ChevronRight, Sparkles, Clock, Check } from 'lucide-react';
import { AndroidBottomSheet } from '../android/AndroidBottomSheet';

export function CanteenMenuCard() {
  const { canteenMenu, updateCanteenMenu, currentRole } = useAppStore();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [breakfast, setBreakfast] = useState(canteenMenu.breakfast);
  const [lunch, setLunch] = useState(canteenMenu.lunch);
  const [snacks, setSnacks] = useState(canteenMenu.snacks);
  const [dinner, setDinner] = useState(canteenMenu.dinner);
  const [specialDish, setSpecialDish] = useState(canteenMenu.specialDish || '');
  const [isVegOnly, setIsVegOnly] = useState(canteenMenu.isVegOnly);

  const canEdit = ['canteen', 'admin', 'warden'].includes(currentRole);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCanteenMenu({
      breakfast,
      lunch,
      snacks,
      dinner,
      specialDish,
      isVegOnly,
      lastUpdated: 'Just now',
    });
    setIsEditOpen(false);
  };

  return (
    <>
      {/* 
        COMPACT CANTEEN HIGHLIGHT CARD:
        Doesn't take whole home screen space!
        Tapping it opens full detailed meals view.
      */}
      <div
        onClick={() => setIsDetailsOpen(true)}
        className="group cursor-pointer bg-gradient-to-r from-amber-500/10 via-[#121212] to-indigo-500/10 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-3.5 space-y-2 select-none text-white shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-[0.99]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Utensils size={18} />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-white tracking-tight">
                  Campus Canteen & Mess
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    canteenMenu.isVegOnly
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {canteenMenu.isVegOnly ? 'VEG ONLY' : 'TODAY SPECIAL'}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate">
                {canteenMenu.specialDish || 'Dalma, Paneer & Rice • Tap for full schedule'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-amber-400 group-hover:text-amber-300 font-semibold flex-shrink-0">
            <span>View Menu</span>
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* FULL CANTEEN SCHEDULE BOTTOM SHEET */}
      <AndroidBottomSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Campus Canteen and Mess Menu"
        subtitle={`${canteenMenu.date} • Dining Hall Mess 2`}
      >
        <div className="space-y-4 pt-1 select-none text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono px-2.5 py-1 rounded-full font-semibold ${
                  canteenMenu.isVegOnly
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {canteenMenu.isVegOnly ? 'VEG ONLY TODAY' : 'STANDARD / NON-VEG'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Updated {canteenMenu.lastUpdated}
              </span>
            </div>

            {canEdit && (
              <button
                onClick={() => {
                  setIsDetailsOpen(false);
                  setIsEditOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181818] hover:bg-[#242424] text-slate-200 text-xs font-semibold border border-white/10 transition-colors shadow-xs"
              >
                <Edit3 size={13} />
                <span>Edit Menu</span>
              </button>
            )}
          </div>

          {canteenMenu.specialDish && (
            <div className="p-3.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wide block">
                  Today's Chef Special
                </span>
                <span className="font-bold text-white text-sm">{canteenMenu.specialDish}</span>
              </div>
              <Sparkles size={18} className="text-amber-400 animate-pulse" />
            </div>
          )}

          {/* Meals Grid */}
          <div className="space-y-2.5">
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-3.5 space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                <span className="font-bold text-slate-200 text-sm">Breakfast</span>
                <span>07:30 - 09:30</span>
              </div>
              <p className="font-medium text-slate-300 text-sm leading-relaxed">{canteenMenu.breakfast}</p>
            </div>

            <div className="bg-[#141414] border border-white/5 rounded-2xl p-3.5 space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                <span className="font-bold text-slate-200 text-sm">Lunch</span>
                <span>12:30 - 14:30</span>
              </div>
              <p className="font-medium text-slate-300 text-sm leading-relaxed">{canteenMenu.lunch}</p>
            </div>

            <div className="bg-[#141414] border border-white/5 rounded-2xl p-3.5 space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                <span className="font-bold text-slate-200 text-sm">Evening Snacks</span>
                <span>17:00 - 18:00</span>
              </div>
              <p className="font-medium text-slate-300 text-sm leading-relaxed">{canteenMenu.snacks}</p>
            </div>

            <div className="bg-[#141414] border border-white/5 rounded-2xl p-3.5 space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                <span className="font-bold text-slate-200 text-sm">Dinner</span>
                <span>20:00 - 22:00</span>
              </div>
              <p className="font-medium text-slate-300 text-sm leading-relaxed">{canteenMenu.dinner}</p>
            </div>
          </div>
        </div>
      </AndroidBottomSheet>

      {/* UPDATE MENU BOTTOM SHEET (For Canteen Manager / Staff) */}
      <AndroidBottomSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Canteen & Mess Schedule"
        subtitle="Changes reflect instantly on all student feeds"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2 text-sm">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Breakfast (07:30 - 09:30)
            </label>
            <input
              type="text"
              required
              value={breakfast}
              onChange={(e) => setBreakfast(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Lunch (12:30 - 14:30)
            </label>
            <input
              type="text"
              required
              value={lunch}
              onChange={(e) => setLunch(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Evening Snacks (17:00 - 18:00)
            </label>
            <input
              type="text"
              required
              value={snacks}
              onChange={(e) => setSnacks(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Dinner (20:00 - 22:00)
            </label>
            <input
              type="text"
              required
              value={dinner}
              onChange={(e) => setDinner(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Special Dish (Optional)
            </label>
            <input
              type="text"
              value={specialDish}
              onChange={(e) => setSpecialDish(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="vegCheck"
              checked={isVegOnly}
              onChange={(e) => setIsVegOnly(e.target.checked)}
              className="h-4 w-4 rounded-md bg-slate-800 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="vegCheck" className="text-sm font-medium text-slate-200">
              Strictly Vegetarian Menu Today
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md mt-2 transition-colors"
          >
            Publish Daily Menu
          </button>
        </form>
      </AndroidBottomSheet>
    </>
  );
}
