import { useState } from 'react';
import { useAppStore } from '../../services/store';
import { Role, Language } from '../../types';
import {
  Printer,
  Calendar,
  Clock,
  PenTool,
  Check,
  Shield,
  Layers,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { AndroidBottomSheet } from '../android/AndroidBottomSheet';
import { AccountSettingsSheet } from './AccountSettingsSheet';
import { AdminCommandCenterModal } from '../admin/AdminCommandCenterModal';

export function RoleProfileScreen() {
  const {
    currentUser,
    currentRole,
    setRole,
    profiles,
    adminEditUserProfile,
    teacherClasses,
    toggleStudentAttendance,
    submitClassAttendance,
    saveTeacherDigitalSignature,
    applications,
    approveApplication,
    gatePasses,
    language,
    setLanguage,
    toggleOffline,
    isOffline,
    auditLogs,
    setActiveTab,
    logout,
  } = useAppStore();

  const [activeTabLocal, setActiveTabLocal] = useState<'workflow' | 'id_card'>('workflow');
  const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
  const [isAdminCommandCenterOpen, setIsAdminCommandCenterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adminTargetRole, setAdminTargetRole] = useState<Role>('student');
  const [adminName, setAdminName] = useState(profiles.student.name);
  const [adminDept, setAdminDept] = useState(profiles.student.department);
  const [adminPhone, setAdminPhone] = useState(profiles.student.phone);

  const [attendanceDate, setAttendanceDate] = useState('2026-10-01');
  const [attendanceSlot, setAttendanceSlot] = useState('Period 2 (10:00 AM - 11:00 AM)');
  const [signatureText, setSignatureText] = useState(
    currentUser.digitalSignature || `${currentUser.name} (Faculty Mentor)`
  );
  const [sigSaved, setSigSaved] = useState(false);

  const rolesList: { id: Role; label: string; desc: string }[] = [
    { id: 'student', label: 'Arya Pattnayak', desc: 'Scholar (2501CSE008)' },
    { id: 'teacher', label: 'Prof. Sneha Mohanty', desc: 'Faculty Mentor, CSE' },
    { id: 'hod', label: 'Dr. Rajesh Senapati', desc: 'HOD, Computer Science' },
    { id: 'warden', label: 'Mr. Niranjan Sahu', desc: 'Chief Warden, Block A' },
    { id: 'security', label: 'Pradeep Rout', desc: 'Security Officer, Gate 1' },
    { id: 'admin', label: 'Campus Administrator', desc: 'Dean Operations (God Mode)' },
  ];

  const handleAdminSave = (e: React.FormEvent) => {
    e.preventDefault();
    adminEditUserProfile(adminTargetRole, {
      name: adminName,
      department: adminDept,
      phone: adminPhone,
    });
    setIsAdminEditOpen(false);
  };

  const handleSaveSignature = () => {
    saveTeacherDigitalSignature(signatureText);
    setSigSaved(true);
    setTimeout(() => setSigSaved(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommitAttendance = (classId: string) => {
    submitClassAttendance(classId, attendanceDate, attendanceSlot);
  };

  return (
    <div className="space-y-4 pb-20 select-none text-white">
      {/* ── PROFILE HEADER (Rounded Card with Clean Spacing) ── */}
      <div className="bg-[#101010] p-5 space-y-4 border border-white/5 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-16 w-16 rounded-full object-cover border border-white/10"
            />
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-around flex-1 text-center">
            <div>
              <span className="block text-base font-bold text-white">
                {currentRole === 'student'
                  ? '94.2%'
                  : currentRole === 'teacher'
                  ? teacherClasses.length
                  : currentRole === 'hod'
                  ? '1'
                  : currentRole === 'warden'
                  ? '240'
                  : '1,250'}
              </span>
              <span className="text-xs text-slate-400 uppercase font-mono">
                {currentRole === 'student'
                  ? 'Attendance'
                  : currentRole === 'teacher'
                  ? 'Classes'
                  : currentRole === 'hod'
                  ? 'Department'
                  : currentRole === 'warden'
                  ? 'Residents'
                  : 'Users'}
              </span>
            </div>

            <div>
              <span className="block text-base font-bold text-white">
                {currentRole === 'student'
                  ? gatePasses.length
                  : currentRole === 'teacher'
                  ? '90'
                  : currentRole === 'hod'
                  ? '18'
                  : currentRole === 'warden'
                  ? '20:30'
                  : '9'}
              </span>
              <span className="text-xs text-slate-400 uppercase font-mono">
                {currentRole === 'student'
                  ? 'Passes'
                  : currentRole === 'teacher'
                  ? 'Students'
                  : currentRole === 'hod'
                  ? 'Faculty'
                  : currentRole === 'warden'
                  ? 'Curfew'
                  : 'Roles'}
              </span>
            </div>

            <div>
              <span className="block text-base font-bold text-white">
                {currentRole === 'student'
                  ? 'Clear'
                  : currentRole === 'teacher'
                  ? applications.filter((a) => a.status === 'pending_mentor').length
                  : currentRole === 'hod'
                  ? '1'
                  : currentRole === 'warden'
                  ? 'Active'
                  : '100%'}
              </span>
              <span className="text-xs text-slate-400 uppercase font-mono">
                {currentRole === 'student'
                  ? 'Dues'
                  : currentRole === 'teacher'
                  ? 'Pending'
                  : currentRole === 'hod'
                  ? 'Escalations'
                  : currentRole === 'warden'
                  ? 'Status'
                  : 'Uptime'}
              </span>
            </div>
          </div>
        </div>

        {/* Identity Information (Bio removed, details in Settings) */}
        <div className="space-y-1.5 text-xs pt-1">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-white">{currentUser.name}</h2>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#181818] hover:bg-[#222] text-slate-200 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs"
              title="Account Details & Settings"
            >
              <Settings size={14} />
              <span>Settings</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 bg-[#1e1e1e] px-2.5 py-0.5 rounded-full border border-white/5">
              {currentUser.role}
            </span>
            <span className="font-mono text-xs text-slate-400">
              {currentUser.rollNo || currentUser.employeeId}
            </span>
          </div>
          <div className="pt-0.5 text-xs text-slate-400 font-mono">
            <span>Department: {currentUser.department}</span>
            {currentUser.roomNo && <span> • Location: {currentUser.roomNo}</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          {currentRole === 'admin' ? (
            <button
              onClick={() => setIsAdminCommandCenterOpen(true)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Shield size={14} />
              <span>Admin Command Center</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('services')}
              className="flex-1 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222] text-slate-200 font-semibold text-xs text-center border border-white/10 transition-colors shadow-xs"
            >
              View Services & Passes
            </button>
          )}

          <button
            onClick={() => setActiveTab('messages')}
            className="flex-1 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222] text-slate-200 font-semibold text-xs text-center border border-white/10 transition-colors shadow-xs"
          >
            Direct Messages
          </button>
        </div>
      </div>

      {/* ── PROFILE SEGMENT TABS ── */}
      <div className="flex items-center p-1 bg-[#101010] border border-white/5 rounded-2xl gap-1">
        <button
          onClick={() => setActiveTabLocal('workflow')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTabLocal === 'workflow'
              ? 'bg-white text-black font-bold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Workflows & Management
        </button>

        <button
          onClick={() => setActiveTabLocal('id_card')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTabLocal === 'id_card'
              ? 'bg-white text-black font-bold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Digital ID & Card
        </button>
      </div>

      {/* ── TAB 1: ROLE WORKFLOWS ── */}
      {activeTabLocal === 'workflow' && (
        <div className="space-y-4">
          {/* TEACHER WORKFLOW */}
          {currentRole === 'teacher' && (
            <div className="space-y-4">
              {/* DATE & TIME SLOT SELECTION BAR FOR ATTENDANCE */}
              <div className="bg-[#101010] p-4 space-y-3 border border-white/5 rounded-2xl shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Select Attendance Date and Lecture Time Slot:
                </span>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Lecture Date
                    </label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Time Slot / Period
                    </label>
                    <select
                      value={attendanceSlot}
                      onChange={(e) => setAttendanceSlot(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                    >
                      <option value="Period 1 (09:00 AM - 10:00 AM)">Period 1 (09:00 - 10:00)</option>
                      <option value="Period 2 (10:00 AM - 11:00 AM)">Period 2 (10:00 - 11:00)</option>
                      <option value="Period 3 (11:15 AM - 12:15 PM)">Period 3 (11:15 - 12:15)</option>
                      <option value="Lab Slot (02:00 PM - 05:00 PM)">Lab Slot (02:00 - 05:00)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Classes List */}
              {teacherClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-[#101010] p-4 space-y-3.5 border border-white/5 rounded-2xl shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-mono text-xs text-indigo-400 font-bold uppercase">
                        {cls.subjectCode} • Sem {cls.semester} (Sec {cls.section})
                      </span>
                      <h4 className="text-sm font-bold text-white">{cls.subjectName}</h4>
                      <p className="text-xs text-slate-400">{cls.timeSlot} • {cls.room}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                      {cls.attendanceRate}% Present
                    </span>
                  </div>

                  {/* Student Attendance Roll */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs text-slate-400 uppercase font-mono block">
                      Roll Call for {attendanceDate} ({attendanceSlot}):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {cls.students.map((st) => (
                        <button
                          key={st.rollNo}
                          onClick={() => toggleStudentAttendance(cls.id, st.rollNo)}
                          className={`flex items-center justify-between p-2.5 text-left text-xs transition-colors rounded-xl border ${
                            st.present
                              ? 'bg-[#101912] border-emerald-500/30 text-emerald-300'
                              : 'bg-[#1a1012] border-rose-500/30 text-rose-300'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs block">{st.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">{st.rollNo}</span>
                          </div>
                          <span className="text-xs font-mono font-bold">
                            {st.present ? 'P' : 'A'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons with Print button */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#181818] hover:bg-[#252525] text-slate-300 text-xs font-semibold border border-white/5"
                    >
                      <Printer size={14} />
                      <span>Print Register</span>
                    </button>

                    <button
                      onClick={() => handleCommitAttendance(cls.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      Commit Attendance ({cls.attendanceRate}%)
                    </button>
                  </div>
                </div>
              ))}

              {/* Digital Signature Settings for Mentor */}
              <div className="bg-[#101010] p-4 space-y-3 border border-white/5 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <PenTool size={16} className="text-indigo-400" />
                  <span className="text-sm font-bold text-white">Faculty Digital Signature</span>
                </div>
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-400 font-mono"
                />
                <button
                  onClick={handleSaveSignature}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Save Signature for Documents
                </button>
                {sigSaved && (
                  <p className="text-center text-xs text-emerald-400 font-semibold">
                    Digital signature updated and cached for document certification.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STUDENT WORKFLOW */}
          {currentRole === 'student' && (
            <div className="space-y-4">
              <div className="bg-[#101010] p-4 space-y-3 border border-white/5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-white">Subject-Wise Attendance Analysis</h4>
                  <span className="text-emerald-400 font-mono font-bold text-sm">94.2% Overall</span>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">CS601: Distributed Systems</span>
                      <span className="font-bold text-emerald-400 font-mono">96.0% (Eligible)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#202020] mt-1.5 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[96%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">CS602: Compiler Design Lab</span>
                      <span className="font-bold text-emerald-400 font-mono">92.5% (Eligible)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#202020] mt-1.5 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[92.5%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">CS603: Cloud Computing Infrastructure</span>
                      <span className="font-bold text-emerald-400 font-mono">94.0% (Eligible)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#202020] mt-1.5 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 mt-2">
                  Institutional examination attendance requirement satisfied (&gt;75%).
                </div>
              </div>

              {/* Printable Official Certificates */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Approved Institutional Certificates
                </h4>
                {applications
                  .filter((a) => a.status === 'approved')
                  .map((app) => (
                    <div
                      key={app.id}
                      className="bg-[#101010] p-4 space-y-3 border border-indigo-500/30 rounded-2xl shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-sm">{app.title}</span>
                        <span className="text-emerald-400 font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10">
                          SEALED
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Document verified with Mentor and HOD cryptographic signatures.
                      </p>
                      <button
                        onClick={handlePrint}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <Printer size={14} />
                        <span>Print Official Certificate</span>
                      </button>
                    </div>
                  ))}
              </div>

              {/* Fees and Dues Status */}
              <div className="bg-[#101010] p-4 space-y-2 border border-white/5 rounded-2xl shadow-sm">
                <h4 className="font-bold text-sm text-white">Semester Tuition and Hostel Dues</h4>
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">6th Semester Tuition Fee:</span>
                    <span className="font-bold text-emerald-400 font-mono">PAID (Receipt #9910)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hostel Block A Accommodation:</span>
                    <span className="font-bold text-emerald-400 font-mono">CLEARED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Central Mess Coupon Balance:</span>
                    <span className="font-bold text-emerald-400 font-mono">INR 1,450 Remaining</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN GOD-MODE WORKFLOW */}
          {currentRole === 'admin' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#140f1a] border border-purple-500/30 rounded-2xl space-y-2.5 shadow-sm">
                <span className="font-bold text-purple-300 block text-sm">
                  Institutional Master Controller Privileges
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Master authority to overwrite user credentials, reassign departments and rooms, and inspect systemic audit trails.
                </p>
                <button
                  onClick={() => setIsAdminEditOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Edit Any User Profile (God Mode)
                </button>
              </div>

              {/* Audit Ledger Stream */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Central Institutional Security Audit Trail
                </h4>
                {auditLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="bg-[#101010] p-3 text-xs space-y-1 border border-white/5 rounded-xl"
                  >
                    <div className="flex justify-between">
                      <span className="font-mono text-xs text-purple-400 font-bold">
                        {log.action}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-200 font-medium text-xs">{log.target}</p>
                    <p className="text-xs text-slate-400">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: DIGITAL ID & INSTITUTIONAL CREDENTIALS ── */}
      {activeTabLocal === 'id_card' && (
        <div className="space-y-4">
          {/* Institutional Smart Card */}
          <div className="bg-[#101010] p-5 space-y-4 border border-white/5 rounded-2xl shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="h-14 w-14 rounded-full object-cover border border-white/10"
                />
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                    BPUT DIGITAL VERIFIED ID
                  </span>
                  <h2 className="text-base font-bold text-white">{currentUser.name}</h2>
                  <p className="font-mono text-xs text-slate-300">
                    {currentUser.rollNo || currentUser.employeeId}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono uppercase px-2.5 py-1 bg-[#181818] text-slate-300 rounded-full border border-white/5">
                {currentUser.role}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-[#161616] p-3 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400 block mb-0.5">Department</span>
                <span className="font-semibold text-white text-xs">{currentUser.department}</span>
              </div>
              <div className="bg-[#161616] p-3 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400 block mb-0.5">Quarter / Room</span>
                <span className="font-semibold text-white text-xs">
                  {currentUser.hostelBlock || 'Faculty Quarters'}
                </span>
              </div>
            </div>

            {/* Barcode line */}
            <div className="pt-2 text-center">
              <div className="h-7 w-full max-w-[220px] mx-auto bg-white/95 rounded-md flex items-center justify-around px-2">
                {[...Array(26)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-black h-5"
                    style={{ width: `${(i % 3) + 1}px` }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1.5 block">
                NFC OPTICAL VERIFICATION ENABLED
              </span>
            </div>
          </div>

          {/* Role Switcher for Evaluation */}
          <div className="bg-[#101010] p-4 space-y-3 border border-white/5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider px-1">
              Switch Institutional Profile
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {rolesList.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-3 text-left text-xs transition-colors rounded-xl border ${
                    currentRole === r.id
                      ? 'bg-indigo-600/30 border-indigo-400 text-white font-semibold'
                      : 'bg-[#141414] border-white/5 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-slate-200 text-xs">{r.label}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GOD-MODE ADMIN EDIT USER BOTTOM SHEET */}
      <AndroidBottomSheet
        isOpen={isAdminEditOpen}
        onClose={() => setIsAdminEditOpen(false)}
        title="Admin God-Mode User Directory Editor"
        subtitle="Live override of institutional records"
      >
        <form onSubmit={handleAdminSave} className="space-y-4 pt-2 text-sm">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Select User Persona to Modify
            </label>
            <select
              value={adminTargetRole}
              onChange={(e) => {
                const r = e.target.value as Role;
                setAdminTargetRole(r);
                setAdminName(profiles[r].name);
                setAdminDept(profiles[r].department);
                setAdminPhone(profiles[r].phone);
              }}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
            >
              {rolesList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label} ({r.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Full Official Name
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Department
            </label>
            <input
              type="text"
              value={adminDept}
              onChange={(e) => setAdminDept(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Phone
            </label>
            <input
              type="text"
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md mt-2 transition-colors"
          >
            Apply Record Updates
          </button>
        </form>
      </AndroidBottomSheet>

      {/* Account Settings Sheet (Houses User Details & Log Out) */}
      <AccountSettingsSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Admin Command Center (God Mode) */}
      <AdminCommandCenterModal
        isOpen={isAdminCommandCenterOpen}
        onClose={() => setIsAdminCommandCenterOpen(false)}
      />
    </div>
  );
}
