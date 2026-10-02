import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore } from '../../services/store';
import {
  FileText,
  Clock,
  ChevronRight,
  Shield,
  Award,
  Calendar,
  UtensilsCrossed,
  FileCheck,
  Check,
  Plus,
  MapPin,
  PhoneCall,
  Layers,
  CheckCircle,
  XCircle,
  AlertCircle,
  PenTool,
} from 'lucide-react';
import { AndroidBottomSheet } from '../android/AndroidBottomSheet';
import { ServiceApplication, PassType, GatePass } from '../../types';
import { GuardScannerScreen } from '../security/GuardScannerScreen';

export function ServicesScreen() {
  const {
    applications,
    currentUser,
    currentRole,
    approveApplication,
    rejectApplication,
    gatePasses,
    requestGatePass,
    approveGatePass,
    rejectGatePass,
  } = useAppStore();

  const [selectedApp, setSelectedApp] = useState<ServiceApplication | null>(null);
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRequestPassOpen, setIsRequestPassOpen] = useState(false);
  const [rejectingPassId, setRejectingPassId] = useState<string | null>(null);
  const [passRejectReasonInput, setPassRejectReasonInput] = useState('');

  // Gate pass form state
  const [passType, setPassType] = useState<PassType>('day_out');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [departureTime, setDepartureTime] = useState('Today, 17:30 hours');
  const [expectedReturnTime, setExpectedReturnTime] = useState('Today, 20:30 hours');
  const [parentContact, setParentContact] = useState('+91 98610 11222');

  const canApprove = ['teacher', 'hod', 'warden', 'admin', 'principal'].includes(currentRole);

  // Student's active pass (most recent non-expired pass)
  const studentPasses = gatePasses.filter((p) => p.studentId === currentUser.id || p.rollNo === currentUser.rollNo);
  const activeStudentPass = studentPasses[0];

  // Pending passes queue for approvers (warden, admin, teacher)
  const pendingPassesQueue = gatePasses.filter((p) => p.status === 'pending');

  const handleApproveApp = () => {
    if (!selectedApp) return;
    approveApplication(selectedApp.id, approvalRemarks || `Approved by ${currentUser.name}`);
    setApprovalRemarks('');
    setSelectedApp(null);
  };

  const handleRejectApp = () => {
    if (!selectedApp || !rejectionReason.trim()) return;
    rejectApplication(selectedApp.id, rejectionReason.trim());
    setRejectionReason('');
    setSelectedApp(null);
  };

  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !reason.trim()) return;

    requestGatePass({
      passType,
      destination: destination.trim(),
      reason: reason.trim(),
      departureTime,
      expectedReturnTime,
      parentContact,
    });

    setIsRequestPassOpen(false);
    setDestination('');
    setReason('');
  };

  const confirmPassRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPassId || !passRejectReasonInput.trim()) return;
    rejectGatePass(rejectingPassId, passRejectReasonInput.trim());
    setRejectingPassId(null);
    setPassRejectReasonInput('');
  };

  if (currentRole === 'security') {
    return (
      <div className="space-y-4 pb-20 select-none text-white">
        <div className="p-3 bg-[#101010] border border-white/5 rounded-2xl shadow-sm">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Main Gate Security Terminal
          </h2>
          <p className="text-xs text-slate-400">Optical QR pass verification and student gate logs</p>
        </div>
        <GuardScannerScreen />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 select-none text-white">
      {/* Header */}
      <div className="px-1 pt-1 pb-1">
        <h1 className="text-xl font-bold text-white tracking-tight">Campus Services</h1>
        <p className="text-xs text-slate-400 font-medium">Institutional Certificates, Clearances and Gate Passes</p>
      </div>

      {/* APPROVER REVIEW QUEUE (Visible to Warden, Faculty, Admin, HOD) */}
      {canApprove && pendingPassesQueue.length > 0 && (
        <div className="space-y-2.5 bg-[#120f14] border border-amber-500/30 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Pending Gate Pass Approvals Queue ({pendingPassesQueue.length})
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">ACTION REQUIRED</span>
          </div>

          <div className="space-y-3 pt-1">
            {pendingPassesQueue.map((pass) => (
              <div
                key={pass.id}
                className="bg-[#181818] p-4 rounded-xl border border-white/10 space-y-2.5 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                      {pass.id} • {pass.passType.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {pass.studentName} ({pass.rollNo})
                    </h3>
                    <p className="text-xs text-slate-400">
                      {pass.department} • {pass.hostelBlock} ({pass.roomNo})
                    </p>
                  </div>

                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Pending Review
                  </span>
                </div>

                <div className="p-2.5 bg-[#101010] rounded-lg text-xs space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destination:</span>
                    <span className="font-semibold text-white">{pass.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Curfew Return:</span>
                    <span className="font-mono text-amber-300 font-bold">{pass.expectedReturnTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Justification:</span>
                    <span className="italic">"{pass.reason}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Emergency Phone:</span>
                    <span className="font-mono">{pass.parentContact}</span>
                  </div>
                </div>

                {/* Approve / Reject Controls */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => approveGatePass(pass.id, 'Approved with digital signature stamp.')}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                  >
                    <CheckCircle size={14} />
                    <span>Approve (Sign & Mint QR)</span>
                  </button>

                  <button
                    onClick={() => {
                      setRejectingPassId(pass.id);
                      setPassRejectReasonInput('Curfew violation risk / Academic hours conflict');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENT PASS CARD (Real-world workflow with Pending / Approved / Rejected states) */}
      {currentRole === 'student' && activeStudentPass && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Latest Gate Pass Application Status
            </h2>
            <span className="text-[10px] font-mono text-slate-500">{activeStudentPass.id}</span>
          </div>

          {/* STATE 1: PENDING REVIEW (No QR code generated yet!) */}
          {activeStudentPass.status === 'pending' && (
            <div className="bg-[#121015] p-5 space-y-4 border border-amber-500/30 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber-400 animate-spin" />
                  <span className="text-sm font-bold text-white">Under Review by Hostel Warden</span>
                </div>
                <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PENDING
                </span>
              </div>

              <div className="p-4 bg-[#181818] border border-white/5 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-semibold text-white">{activeStudentPass.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Requested Curfew Return:</span>
                  <span className="font-mono text-amber-300 font-bold">{activeStudentPass.expectedReturnTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stated Purpose:</span>
                  <span className="italic text-slate-300">"{activeStudentPass.reason}"</span>
                </div>
              </div>

              <div className="text-xs text-amber-300/90 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl leading-relaxed flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0 text-amber-400" />
                <span>
                  Optical QR Token is locked. It will generate automatically once Chief Warden Niranjan Sahu signs and endorses your pass.
                </span>
              </div>
            </div>
          )}

          {/* STATE 2: APPROVED WITH CRYPTOGRAPHIC QR TOKEN */}
          {activeStudentPass.status === 'approved' && activeStudentPass.qrToken && (
            <div className="bg-[#101010] p-5 space-y-4 border border-emerald-500/30 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-sm font-bold text-white block">{activeStudentPass.id}</span>
                  <span className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle size={13} />
                    <span>VERIFIED FOR MAIN GATE 1</span>
                  </span>
                </div>
                <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[#181818] text-slate-200 border border-white/10">
                  {activeStudentPass.passType.replace('_', ' ')}
                </span>
              </div>

              {/* Dynamic QR Presentation Box */}
              <div className="mx-auto flex flex-col items-center justify-center p-4 bg-white text-black rounded-2xl shadow-sm max-w-[200px]">
                <QRCodeSVG
                  value={activeStudentPass.qrToken}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
                <span className="font-mono text-[9px] font-bold text-slate-800 mt-2 truncate max-w-[170px]">
                  {activeStudentPass.qrToken}
                </span>
              </div>

              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Curfew Deadline:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {activeStudentPass.expectedReturnTime}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Digitally Endorsed By:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{activeStudentPass.approvedBy}</span>
                </div>
                {activeStudentPass.digitalSignature && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Digital Signature:</span>
                    <span className="font-mono text-[10px] text-slate-400 truncate max-w-[180px]">
                      {activeStudentPass.digitalSignature}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-300 p-3 bg-[#161616] border border-white/5 rounded-xl leading-relaxed">
                Present this rolling token to the Optical Scanner at Main Gate 1 for exit timestamping.
              </div>
            </div>
          )}

          {/* STATE 3: REJECTED WITH MANDATORY REASON */}
          {activeStudentPass.status === 'rejected' && (
            <div className="bg-[#181012] p-5 space-y-4 border border-rose-500/30 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-rose-400" />
                  <span className="text-sm font-bold text-white">Outing Request Disapproved</span>
                </div>
                <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  REJECTED
                </span>
              </div>

              <div className="p-3 bg-[#141414] rounded-xl border border-white/5 space-y-1.5 text-xs">
                <span className="text-rose-400 font-bold uppercase font-mono text-[11px] block">
                  Mandatory Rejection Justification:
                </span>
                <p className="text-slate-200 italic">
                  "{activeStudentPass.rejectionReason || 'Exceeds permissible curfew hours.'}"
                </p>
                <div className="pt-1 text-[11px] text-slate-400 font-mono">
                  Reviewed by: {activeStudentPass.reviewedBy || 'Hostel Authority'} ({activeStudentPass.reviewedAt || 'Today'})
                </div>
              </div>

              <button
                onClick={() => setIsRequestPassOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] text-slate-200 text-xs font-semibold transition-colors"
              >
                Submit Revised Request
              </button>
            </div>
          )}
        </div>
      )}

      {/* Available Services Catalog Grid */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Available Service Applications
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Service 1: Gate Pass */}
          <div className="bg-[#101010] p-4 space-y-2.5 border border-white/5 rounded-2xl shadow-sm">
            <span className="text-xs font-mono text-indigo-400 font-semibold uppercase">
              Hostel Protocol
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Gate Pass (Outing)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Day out, Night out, Medical</p>
            </div>
            <button
              onClick={() => setIsRequestPassOpen(true)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-xs"
            >
              Apply for Pass
            </button>
          </div>

          {/* Service 2: Bonafide Certificate */}
          <div className="bg-[#101010] p-4 space-y-2.5 border border-white/5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">
                Academic Cell
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Bonafide Certificate</h3>
              <p className="text-xs text-slate-400 mt-0.5">Loans, passports, scholarships</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Digital University Seal
            </span>
          </div>

          {/* Service 3: Duty Leave */}
          <div className="bg-[#101010] p-4 space-y-2.5 border border-white/5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-purple-400 font-semibold uppercase">
                Faculty Endorsed
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Academic Duty Leave</h3>
              <p className="text-xs text-slate-400 mt-0.5">Auto-credit attendance (OD)</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Mentor & HOD Stamped
            </span>
          </div>

          {/* Service 4: Mess Rebate */}
          <div className="bg-[#101010] p-4 space-y-2.5 border border-white/5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                Dining Board
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Mess Rebate</h3>
              <p className="text-xs text-slate-400 mt-0.5">3+ days authorized leave</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Direct Bill Credit
            </span>
          </div>
        </div>
      </div>

      {/* ACTIVE CLEARANCE WORKFLOW APPLICATIONS */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Your Applications and Clearances
        </h2>

        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className="bg-[#101010] p-4 space-y-3 border border-white/5 rounded-2xl cursor-pointer hover:bg-[#151515] transition-colors shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono text-indigo-400 uppercase font-medium">
                    {app.id} • {app.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-white">{app.title}</h3>
                  <p className="text-xs text-slate-400">
                    Applicant: {app.studentName} ({app.rollNo})
                  </p>
                </div>

                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                    app.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : app.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {app.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  {app.timeline.map((step, idx) => (
                    <div key={idx} className="flex-1 flex flex-col gap-1">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          step.status === 'completed'
                            ? 'bg-emerald-500'
                            : step.status === 'current'
                            ? 'bg-amber-400'
                            : 'bg-[#222]'
                        }`}
                      />
                      <span className="text-[10px] text-slate-400 truncate">
                        {step.role.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REQUEST GATE PASS BOTTOM SHEET */}
      <AndroidBottomSheet
        isOpen={isRequestPassOpen}
        onClose={() => setIsRequestPassOpen(false)}
        title="Apply for Campus Gate Pass"
        subtitle={`Applicant: ${currentUser.name} (${currentUser.rollNo || currentUser.role})`}
      >
        <form onSubmit={handlePassSubmit} className="space-y-4 pt-2 text-sm">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Outing Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'day_out', label: 'Day Outing (Curfew 20:30)' },
                { type: 'market_pass', label: 'Market / Medical (2 Hours)' },
                { type: 'night_out', label: 'Hostel Night Out' },
                { type: 'emergency', label: 'Emergency Permit' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setPassType(item.type as PassType)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-colors border ${
                    passType === item.type
                      ? 'bg-indigo-600/30 border-indigo-400 text-white font-semibold shadow-xs'
                      : 'bg-[#141414] border-white/5 text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Destination
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Master Canteen Market, Bhubaneswar"
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Exit Time
              </label>
              <input
                type="text"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Expected Return
              </label>
              <input
                type="text"
                required
                value={expectedReturnTime}
                onChange={(e) => setExpectedReturnTime(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Reason for Outing
            </label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide exact justification..."
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Parent Contact Number
            </label>
            <input
              type="text"
              required
              value={parentContact}
              onChange={(e) => setParentContact(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-md mt-2 transition-all active:scale-95"
          >
            Submit for Warden Endorsement
          </button>
        </form>
      </AndroidBottomSheet>

      {/* REJECT GATE PASS WITH REASON MODAL */}
      <AndroidBottomSheet
        isOpen={!!rejectingPassId}
        onClose={() => setRejectingPassId(null)}
        title="Disapprove Gate Pass Request"
        subtitle="Mandatory justification required for student and parent audit ledger"
      >
        <form onSubmit={confirmPassRejection} className="space-y-4 pt-1 text-sm select-none text-white">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Reason for Disapproval
            </label>
            <textarea
              required
              rows={3}
              value={passRejectReasonInput}
              onChange={(e) => setPassRejectReasonInput(e.target.value)}
              placeholder="State the regulatory or academic grounds for rejecting this gate pass..."
              className="w-full bg-[#161616] border border-red-500/40 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-400"
            />
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Confirm Disapproval & Dispatch Notice
            </button>
            <button
              type="button"
              onClick={() => setRejectingPassId(null)}
              className="px-4 py-3 rounded-xl bg-[#202020] text-slate-300 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </AndroidBottomSheet>

      {/* APPLICATION DETAIL BOTTOM SHEET */}
      <AndroidBottomSheet
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={selectedApp?.title || 'Application Details'}
        subtitle={`Application ID: ${selectedApp?.id} • Submitter: ${selectedApp?.studentName}`}
      >
        {selectedApp && (
          <div className="space-y-4 pt-1 text-sm">
            <div className="bg-[#141414] p-4 space-y-2 border border-white/5 rounded-2xl shadow-xs">
              {Object.entries(selectedApp.details).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-400 text-xs">{key}:</span>
                  <span className="font-semibold text-white text-xs">{val}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Verification Trail
              </h4>
              {selectedApp.timeline.map((step, i) => (
                <div key={i} className="bg-[#121212] p-3.5 border border-white/5 rounded-xl space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-white text-xs">{step.step}</span>
                    <span className="text-xs font-mono text-slate-400">{step.updatedAt}</span>
                  </div>
                  <p className="text-xs text-slate-400">{step.role}</p>
                  {step.remarks && (
                    <p className="text-xs text-indigo-300 italic mt-0.5">
                      "{step.remarks}"
                    </p>
                  )}
                </div>
              ))}
            </div>

            {canApprove && selectedApp.status !== 'approved' && selectedApp.status !== 'rejected' && (
              <div className="p-4 bg-[#141414] space-y-3 border border-white/5 rounded-2xl shadow-xs">
                <span className="font-bold text-white text-sm block">Endorsement Action</span>
                <input
                  type="text"
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  placeholder="Official endorsement notes or digital remarks..."
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
                />

                <div className="flex gap-2.5 pt-1">
                  <button
                    onClick={handleApproveApp}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-xs text-white shadow-xs transition-all active:scale-95"
                  >
                    Grant Approval (Digital Seal)
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Please enter the reason for rejection:');
                      if (reason && reason.trim()) {
                        rejectApplication(selectedApp.id, reason.trim());
                        setSelectedApp(null);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold transition-colors"
                  >
                    Reject with Reason
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </AndroidBottomSheet>
    </div>
  );
}
