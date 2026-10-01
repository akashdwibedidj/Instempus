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
} from 'lucide-react';
import { AndroidBottomSheet } from '../android/AndroidBottomSheet';
import { ServiceApplication, PassType } from '../../types';
import { GuardScannerScreen } from '../security/GuardScannerScreen';

export function ServicesScreen() {
  const {
    applications,
    currentUser,
    currentRole,
    approveApplication,
    gatePasses,
    requestGatePass,
  } = useAppStore();

  const [selectedApp, setSelectedApp] = useState<ServiceApplication | null>(null);
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [isRequestPassOpen, setIsRequestPassOpen] = useState(false);

  // Gate pass form state
  const [passType, setPassType] = useState<PassType>('day_out');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [departureTime, setDepartureTime] = useState('Today, 17:30 hours');
  const [expectedReturnTime, setExpectedReturnTime] = useState('Today, 20:30 hours');
  const [parentContact, setParentContact] = useState('+91 98610 11222');

  const canApprove = ['teacher', 'hod', 'warden', 'admin', 'principal'].includes(currentRole);

  // Active pass ONLY exists if the user has created one!
  const activePass = gatePasses.find((p) => p.status === 'approved');
  const pastPasses = gatePasses.filter((p) => p.id !== activePass?.id);

  const handleApprove = () => {
    if (!selectedApp) return;
    approveApplication(selectedApp.id, approvalRemarks || `Approved by ${currentUser.name}`);
    setApprovalRemarks('');
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

  if (currentRole === 'security') {
    return (
      <div className="space-y-4 pb-20 select-none text-white">
        <div className="p-2 border-b border-[#1a1a1a]">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Main Gate Security Terminal
          </h2>
          <p className="text-[11px] text-slate-400">Optical QR pass verification and student gate logs</p>
        </div>
        <GuardScannerScreen />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 select-none text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-[#141414]">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Campus Services</h1>
          <p className="text-[10px] text-slate-400">Institutional Certificates, Clearances and Gate Passes</p>
        </div>
      </div>

      {/* Available Services Catalog Grid */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
          Available Service Applications
        </h2>

        <div className="grid grid-cols-2 gap-2 px-2">
          {/* Service 1: Gate Pass */}
          <div className="bg-[#0e0e0e] p-3 space-y-2 border-b border-[#1c1c1c]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-indigo-400 font-semibold uppercase">
                Hostel Protocol
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Gate Pass (Outing)</h3>
              <p className="text-[10px] text-slate-400">Day out, Night out, Medical</p>
            </div>
            <button
              onClick={() => setIsRequestPassOpen(true)}
              className="w-full py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              Apply for Pass
            </button>
          </div>

          {/* Service 2: Bonafide Certificate */}
          <div className="bg-[#0e0e0e] p-3 space-y-2 border-b border-[#1c1c1c]">
            <span className="text-[9px] font-mono text-emerald-400 font-semibold uppercase">
              Academic Cell
            </span>
            <div>
              <h3 className="text-xs font-bold text-white">Bonafide Certificate</h3>
              <p className="text-[10px] text-slate-400">Bank loans, passports, scholarships</p>
            </div>
            <span className="inline-block text-[10px] text-slate-400 font-mono">
              24-Hour Processing
            </span>
          </div>

          {/* Service 3: Duty Leave */}
          <div className="bg-[#0e0e0e] p-3 space-y-2 border-b border-[#1c1c1c]">
            <span className="text-[9px] font-mono text-purple-400 font-semibold uppercase">
              Faculty Endorsed
            </span>
            <div>
              <h3 className="text-xs font-bold text-white">Academic Duty Leave</h3>
              <p className="text-[10px] text-slate-400">Hackathon, symposium representation</p>
            </div>
            <span className="inline-block text-[10px] text-slate-400 font-mono">
              Mentor Verified
            </span>
          </div>

          {/* Service 4: Mess Rebate */}
          <div className="bg-[#0e0e0e] p-3 space-y-2 border-b border-[#1c1c1c]">
            <span className="text-[9px] font-mono text-amber-400 font-semibold uppercase">
              Dining Board
            </span>
            <div>
              <h3 className="text-xs font-bold text-white">Mess Rebate</h3>
              <p className="text-[10px] text-slate-400">3 or more days authorized leave</p>
            </div>
            <span className="inline-block text-[10px] text-slate-400 font-mono">
              Account Credit
            </span>
          </div>
        </div>
      </div>

      {/* ACTIVE GATE PASS DISPLAY (ONLY IF USER HAS APPLIED AND CREATED ONE!) */}
      {activePass && (
        <div className="px-2 space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Active Approved Gate Pass
          </h2>

          <div className="bg-[#0f0f0f] p-4 space-y-3 border-b border-[#222]">
            <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a]">
              <div>
                <span className="text-xs font-bold text-white block">{activePass.id}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  VERIFIED FOR EXIT / RETURN
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#181818] text-slate-300">
                {activePass.passType.replace('_', ' ')}
              </span>
            </div>

            {/* QR Code Presentation Box */}
            <div className="mx-auto flex flex-col items-center justify-center p-3 bg-white text-black max-w-[190px]">
              <QRCodeSVG
                value={activePass.qrToken}
                size={160}
                level="H"
                includeMargin={false}
              />
              <span className="font-mono text-[8px] font-bold text-slate-800 mt-1">
                {activePass.qrToken}
              </span>
            </div>

            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Student:</span>
                <span className="font-semibold">{activePass.studentName} ({activePass.rollNo})</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Destination:</span>
                <span className="font-semibold">{activePass.destination}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Curfew Deadline:</span>
                <span className="font-mono font-bold text-amber-400">
                  {activePass.expectedReturnTime}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Parent Contact:</span>
                <span className="font-mono">{activePass.parentContact}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 p-2 bg-[#080808] border border-[#1a1a1a]">
              Present this token to the Security Officer on duty at Main Gate 1.
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CLEARANCE WORKFLOW APPLICATIONS */}
      <div className="px-2 space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Your Applications and Clearances
        </h2>

        <div className="space-y-2">
          {applications.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className="bg-[#0f0f0f] p-3.5 space-y-2.5 border-b border-[#1c1c1c] cursor-pointer hover:bg-[#141414] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-mono text-indigo-400 uppercase">
                    {app.id} • {app.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-xs font-bold text-white mt-0.5">{app.title}</h3>
                  <p className="text-[10px] text-slate-400">
                    Applicant: {app.studentName} ({app.rollNo})
                  </p>
                </div>

                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                    app.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {app.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="pt-1.5 border-t border-[#1a1a1a]">
                <div className="flex items-center gap-1">
                  {app.timeline.map((step, idx) => (
                    <div key={idx} className="flex-1 flex flex-col gap-1">
                      <div
                        className={`h-1 transition-all ${
                          step.status === 'completed'
                            ? 'bg-emerald-500'
                            : step.status === 'current'
                            ? 'bg-amber-400'
                            : 'bg-[#222]'
                        }`}
                      />
                      <span className="text-[8px] text-slate-400 truncate">
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

      {/* Past Gate Passes (if any) */}
      {pastPasses.length > 0 && (
        <div className="px-2 space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Archived Pass Records
          </h2>
          {pastPasses.map((p) => (
            <div key={p.id} className="bg-[#0e0e0e] p-3 text-xs space-y-1 border-b border-[#1a1a1a]">
              <div className="flex justify-between">
                <span className="font-mono text-slate-300 font-bold">{p.id}</span>
                <span className="text-[9px] font-mono uppercase text-slate-400">{p.status}</span>
              </div>
              <p className="text-slate-400 text-[11px]">{p.destination} • {p.reason}</p>
            </div>
          ))}
        </div>
      )}

      {/* REQUEST GATE PASS BOTTOM SHEET */}
      <AndroidBottomSheet
        isOpen={isRequestPassOpen}
        onClose={() => setIsRequestPassOpen(false)}
        title="Apply for Campus Gate Pass"
        subtitle={`Applicant: ${currentUser.name} (${currentUser.rollNo || currentUser.role})`}
      >
        <form onSubmit={handlePassSubmit} className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Outing Type</label>
            <div className="grid grid-cols-2 gap-1.5">
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
                  className={`p-2 text-left text-xs transition-colors border-b ${
                    passType === item.type
                      ? 'bg-indigo-600/30 border-indigo-400 text-white font-semibold'
                      : 'bg-[#141414] border-[#222] text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Destination</label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Master Canteen Market, Bhubaneswar"
              className="w-full bg-[#121212] border-b border-[#2a2a2a] px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Exit Time</label>
              <input
                type="text"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full bg-[#121212] border-b border-[#2a2a2a] px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Expected Return</label>
              <input
                type="text"
                required
                value={expectedReturnTime}
                onChange={(e) => setExpectedReturnTime(e.target.value)}
                className="w-full bg-[#121212] border-b border-[#2a2a2a] px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Reason for Outing</label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide exact justification..."
              className="w-full bg-[#121212] border-b border-[#2a2a2a] px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Parent Contact Number</label>
            <input
              type="text"
              required
              value={parentContact}
              onChange={(e) => setParentContact(e.target.value)}
              className="w-full bg-[#121212] border-b border-[#2a2a2a] px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow mt-2"
          >
            Submit Gate Pass Request
          </button>
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
          <div className="space-y-4 pt-1 text-xs">
            <div className="bg-[#121212] p-3 space-y-1.5 border-b border-[#222]">
              {Object.entries(selectedApp.details).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-400">{key}:</span>
                  <span className="font-semibold text-white">{val}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Official Verification Trail
              </h4>
              {selectedApp.timeline.map((step, i) => (
                <div key={i} className="bg-[#0e0e0e] p-2.5 border-b border-[#1c1c1c] space-y-0.5">
                  <div className="flex justify-between">
                    <span className="font-bold text-white">{step.step}</span>
                    <span className="text-[9px] font-mono text-slate-400">{step.updatedAt}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{step.role}</p>
                  {step.remarks && (
                    <p className="text-[10px] text-indigo-300 italic mt-0.5">
                      "{step.remarks}"
                    </p>
                  )}
                </div>
              ))}
            </div>

            {canApprove && selectedApp.status !== 'approved' && (
              <div className="p-3 bg-[#121212] space-y-2 border-t border-[#222]">
                <span className="font-bold text-white text-xs block">Endorsement Action</span>
                <input
                  type="text"
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  placeholder="Official endorsement notes..."
                  className="w-full bg-[#090909] border-b border-[#262626] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleApprove}
                    className="flex-1 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white"
                  >
                    Grant Approval
                  </button>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-3 py-2 rounded-md bg-[#222] text-slate-300 text-xs"
                  >
                    Close
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
