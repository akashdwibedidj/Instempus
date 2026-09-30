// Tabs.tsx — segmented control tab switcher. Controlled (parent owns state).
// Caller passes pre-translated labels. No Supabase imports.
import type { ReactNode } from 'react';

export interface TabDef {
  key:      string;
  label:    string;
  badge?:   number;
  icon?:    ReactNode;
}

interface Props {
  tabs:      TabDef[];
  selected:  string;
  onChange:  (key: string) => void;
  className?: string;
  fullWidth?: boolean;
}

export function Tabs({ tabs, selected, onChange, className = '', fullWidth }: Props) {
  return (
    <div
      role="tablist"
      className={`flex rounded-xl bg-white/[0.06] p-1 gap-1 ${fullWidth ? 'w-full' : 'w-fit'} ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          id={`tab-${tab.key}`}
          aria-selected={selected === tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
            fullWidth ? 'flex-1' : ''
          } ${
            selected === tab.key
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
              {tab.badge > 99 ? '99+' : tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
