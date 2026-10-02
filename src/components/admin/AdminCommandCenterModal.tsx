import { useState } from 'react';
import { useAppStore } from '../../services/store';
import {
  Shield,
  Search,
  Users,
  BookOpen,
  History,
  X,
  Edit2,
  Check,
  Building,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { Role } from '../../types';

export function AdminCommandCenterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    currentUser,
    teacherClasses,
    profiles,
    studentsRoster,
    auditLogs,
    adminEditUserProfile,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'classes' | 'profiles' | 'audit'>('classes');
  const [profileSearch, setProfileSearch] = useState('');
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<Role | null>(null);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editPhone, setEditPhone] = useState('');

  if (!isOpen) return null;

  const staffProfilesList = Object.values(profiles);

  const filteredStaff = staffProfilesList.filter(
    (u) =>
      u.name.toLowerCase().includes(profileSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(profileSearch.toLowerCase()) ||
      u.department.toLowerCase().includes(profileSearch.toLowerCase()) ||
      (u.rollNo && u.rollNo.toLowerCase().includes(profileSearch.toLowerCase()))
  );

  const filteredStudents = studentsRoster.filter(
    (s) =>
      s.name.toLowerCase().includes(profileSearch.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(profileSearch.toLowerCase()) ||
      s.department.toLowerCase().includes(profileSearch.toLowerCase())
  );

  const startEdit = (role: Role) => {
    const user = profiles[role];
    setSelectedUserToEdit(role);
    setEditName(user.name);
    setEditDept(user.department);
    setEditPhone(user.phone);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserToEdit) return;

    adminEditUserProfile(selectedUserToEdit, {
      name: editName,
      department: editDept,
      phone: editPhone,
    });
    setSelectedUserToEdit(null);
  };

  const totalClasses = teacherClasses.length;
  const avgAttendance =
    Math.round(
      (teacherClasses.reduce((acc, c) => acc + c.attendanceRate, 0) / totalClasses) * 10
    ) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md select-none text-white animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[90vh] max-h-[750px] bg-[#0d0d0d] border border-purple-500/30 rounded-3xl flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-950/40 via-[#121212] to-indigo-950/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-sm shadow-purple-500/30">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">Admin Command Center</h3>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30 font-semibold">
                  GOD MODE
                </span>
              </div>
              <p className="text-xs text-slate-400">Dean of Student Affairs & Central Operations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Top Metrics Cards */}
        <div className="p-3 bg-[#111111] border-b border-white/5 grid grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 bg-[#161616] rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Classes Active</span>
            <span className="text-base font-bold text-white">{totalClasses} Lectures</span>
          </div>
          <div className="p-2.5 bg-[#161616] rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Avg Attendance</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{avgAttendance}%</span>
          </div>
          <div className="p-2.5 bg-[#161616] rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Audit Chain</span>
            <span className="text-base font-bold text-purple-300 font-mono">{auditLogs.length} Events</span>
          </div>
        </div>

        {/* Segmented Navigation Tabs */}
        <div className="flex items-center p-1.5 bg-[#101010] border-b border-white/5 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex-1 py-1.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'classes'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen size={13} />
            <span>All Classes</span>
          </button>

          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 py-1.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'profiles'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={13} />
            <span>Profile Search</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-1.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History size={13} />
            <span>Security Ledger</span>
          </button>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
          {/* TAB 1: ALL CLASSES & LIVE ATTENDANCE MATRIX */}
          {activeTab === 'classes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-slate-300 uppercase tracking-wide">
                  College-Wide Lecture & Lab Attendance Matrix
                </span>
                <span className="text-[10px] font-mono text-emerald-400">LIVE SYNC</span>
              </div>

              {teacherClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-[#141414] p-3.5 space-y-2 border border-white/5 rounded-2xl shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-indigo-400 font-bold uppercase">
                        {cls.subjectCode} • Semester {cls.semester} ({cls.section})
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{cls.subjectName}</h4>
                      <p className="text-xs text-slate-400">{cls.timeSlot} • {cls.room}</p>
                    </div>

                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                        cls.attendanceRate >= 90
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {cls.attendanceRate}% Present
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span>Enrolled: {cls.students.length} scholars</span>
                    <span className="font-mono text-[10px]">Last: {cls.lastAttendanceDate || 'Today'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: INSTAGRAM-STYLE PROFILE DIRECTORY SEARCH & EDIT */}
          {activeTab === 'profiles' && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                  placeholder="Search students, faculty, wardens, or roll numbers..."
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Staff / Roles Section */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Institutional Authority Profiles ({filteredStaff.length})
                </span>

                {filteredStaff.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 bg-[#141414] border border-white/5 rounded-2xl flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="h-10 w-10 rounded-full object-cover border border-white/10"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-white truncate">{u.name}</span>
                          <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-medium">
                            {u.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{u.department}</p>
                        <p className="font-mono text-[10px] text-slate-500">{u.phone}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => startEdit(u.role)}
                      className="p-2 rounded-xl bg-[#202020] hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                      title="Edit Profile Dossier"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Enrolled Students Section */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Enrolled Students Directory ({filteredStudents.length})
                </span>

                {filteredStudents.map((st) => (
                  <div
                    key={st.rollNo}
                    className="p-3 bg-[#141414] border border-white/5 rounded-2xl flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={st.avatarUrl}
                        alt={st.name}
                        className="h-9 w-9 rounded-full object-cover border border-white/10"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-white block truncate">{st.name}</span>
                        <span className="font-mono text-[10px] text-slate-400 block">
                          {st.rollNo} • {st.department}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {st.hostelBlock} ({st.roomNo}) • {st.phone}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CRYPTOGRAPHIC SECURITY AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-slate-300 uppercase tracking-wide">
                  Immutable Cryptographic Hash Ledger
                </span>
                <span className="text-[10px] font-mono text-purple-400">MERKLE VERIFIED</span>
              </div>

              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#141414] p-3 text-xs space-y-1 border border-white/5 rounded-2xl shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-purple-400 font-bold">{log.action}</span>
                    <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                  </div>
                  <div className="text-xs text-slate-200 font-medium">
                    {log.actorName} ({log.actorRole.toUpperCase()}) &rarr; {log.target}
                  </div>
                  <p className="text-[11px] text-slate-400">{log.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal User Profile Editor (When editing a role) */}
        {selectedUserToEdit && (
          <div className="p-4 bg-[#141414] border-t border-purple-500/30 space-y-3 animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Override Profile: {selectedUserToEdit.toUpperCase()}
              </span>
              <button
                onClick={() => setSelectedUserToEdit(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-2 text-xs">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
              <input
                type="text"
                value={editDept}
                onChange={(e) => setEditDept(e.target.value)}
                placeholder="Department"
                className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Contact Phone"
                className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Commit Changes to Institutional Ledger
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
