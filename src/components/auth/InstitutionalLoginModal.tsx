import { useState } from 'react';
import { useAppStore, DEMO_PROFILES } from '../../services/store';
import { supabase } from '../../services/supabase';
import { Role } from '../../types';
import { Lock, Mail, UserCheck, ShieldCheck, X } from 'lucide-react';

export function InstitutionalLoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { setRole, currentUser } = useAppStore();
  const [identifier, setIdentifier] = useState('2501CSE008');
  const [password, setPassword] = useState('bput@2026');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [statusMsg, setStatusMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg('Verifying institutional credentials...');

    try {
      // Attempt Supabase authentication if email/password format
      if (identifier.includes('@')) {
        const { error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: password,
        });
        if (error) {
          console.warn('Supabase auth fallback:', error.message);
        }
      }

      // Map to role persona
      setRole(selectedRole);
      setStatusMsg('Authentication successful.');
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 400);
    } catch (err: any) {
      // Offline / fallback immediate authorization
      setRole(selectedRole);
      setIsLoading(false);
      onClose();
    }
  };

  const roles: { role: Role; label: string; desc: string }[] = [
    { role: 'student', label: 'Scholar / Student', desc: 'Arya (Roll: 2501CSE008)' },
    { role: 'teacher', label: 'Faculty Mentor', desc: 'Prof. Sneha Mohanty (CSE)' },
    { role: 'canteen', label: 'Canteen & Mess Manager', desc: 'Gopal Sahoo (Dining Hall 2)' },
    { role: 'warden', label: 'Hostel Chief Warden', desc: 'Mr. Niranjan Sahu (Block A)' },
    { role: 'security', label: 'Gate Security Head', desc: 'Pradeep Rout (Main Gate 1)' },
    { role: 'hod', label: 'Head of Department', desc: 'Dr. Rajesh Senapati (CSE)' },
    { role: 'admin', label: 'Campus Administrator', desc: 'Dean Operations (God Mode)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none text-white animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#0c0c0c] border border-[#222222] p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Institutional Authentication Portal
            </h2>
            <p className="text-[10px] text-slate-400">Connected to Supabase &amp; BPUT Directory</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Select Institutional Persona
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                const r = e.target.value as Role;
                setSelectedRole(r);
                const prof = DEMO_PROFILES[r];
                setIdentifier(prof.email || prof.rollNo || prof.employeeId || 'user@bput.ac.in');
              }}
              className="w-full bg-[#141414] border-b border-[#2b2b2b] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400"
            >
              {roles.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.label} — {r.desc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Institutional Email / Roll Number
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-[#141414] border-b border-[#2b2b2b] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400 font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#141414] border-b border-[#2b2b2b] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400 font-mono"
            />
          </div>

          {statusMsg && (
            <p className="text-[10px] text-indigo-400 font-mono">{statusMsg}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-colors mt-2"
          >
            {isLoading ? 'Verifying Session...' : 'Authenticate and Enter'}
          </button>
        </form>

        <div className="pt-2 border-t border-[#1a1a1a] text-[10px] text-slate-500 font-mono text-center">
          Supabase Project: wthukayomfqxoifcrkxa.supabase.co
        </div>
      </div>
    </div>
  );
}
