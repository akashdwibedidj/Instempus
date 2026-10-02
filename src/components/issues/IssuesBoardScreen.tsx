import { useState } from 'react';
import { useAppStore } from '../../services/store';
import {
  AlertCircle,
  ThumbsUp,
  MapPin,
  Clock,
  Plus,
  CheckCircle2,
  Wrench,
  Search,
} from 'lucide-react';
import { AndroidBottomSheet } from '../android/AndroidBottomSheet';
import { IssueCategory, CampusIssue } from '../../types';

export function IssuesBoardScreen() {
  const { issues, toggleIssueUpvote, createIssue, currentUser, currentRole, updateIssueStatus } =
    useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isReportOpen, setIsReportOpen] = useState(false);

  // New Issue form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('hostel');
  const [location, setLocation] = useState('Hostel Block A, 2nd Floor East Wing');

  const categories = [
    { id: 'all', label: 'All Issues' },
    { id: 'hostel', label: 'Hostel Block' },
    { id: 'mess', label: 'Mess & Dining' },
    { id: 'labs', label: 'Labs & Computing' },
    { id: 'academic', label: 'Academic Block' },
  ];

  const filteredIssues = issues.filter(
    (issue) => selectedCategory === 'all' || issue.category === selectedCategory
  );

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createIssue(title.trim(), description.trim(), category, location.trim());
    setTitle('');
    setDescription('');
    setIsReportOpen(false);
  };

  const isStaffOrAdmin = ['warden', 'canteen', 'admin', 'principal', 'hod'].includes(currentRole);

  return (
    <div className="space-y-4 pb-20 select-none text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between px-1 pt-1 pb-1">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Campus Grievance Ledger</h1>
          <p className="text-xs text-slate-400 font-medium">Institutional Maintenance and Upvote Priority Board</p>
        </div>

        <button
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus size={14} />
          <span>Report Issue</span>
        </button>
      </div>

      {/* Category Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs whitespace-nowrap rounded-xl transition-colors font-medium ${
              selectedCategory === cat.id
                ? 'bg-white text-black font-bold shadow-xs'
                : 'bg-[#141414] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Issues List (Rounded Cards) */}
      <div className="space-y-3.5">
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="bg-[#101010] p-4 space-y-3 border border-white/5 rounded-2xl shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-indigo-400 uppercase font-semibold">
                    {issue.id} • {issue.category.toUpperCase()}
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full uppercase font-medium ${
                      issue.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : issue.status === 'in_progress'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-[#222] text-slate-400 border border-white/10'
                    }`}
                  >
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-1 leading-snug">{issue.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Upvote counter button */}
              <button
                onClick={() => toggleIssueUpvote(issue.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl min-w-[50px] transition-colors border shadow-xs ${
                  issue.userUpvoted
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#161616] border-white/5 text-slate-400 hover:bg-[#202020]'
                }`}
              >
                <ThumbsUp size={15} />
                <span className="font-mono font-bold text-xs mt-1">{issue.upvotes}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
              <span>Location: {issue.location}</span>
              <span>Reported: {issue.createdAt}</span>
            </div>

            {/* Status Update note */}
            {issue.statusUpdateNote && (
              <div className="p-3 bg-[#161616] border-l-2 border-amber-500 rounded-xl text-xs text-slate-300 space-y-0.5">
                <span className="font-bold text-amber-400 block font-mono text-[11px] uppercase">
                  Estate Action Note:
                </span>
                <p>{issue.statusUpdateNote}</p>
              </div>
            )}

            {/* Staff status update controls */}
            {isStaffOrAdmin && (
              <div className="flex gap-2 pt-1 border-t border-white/5">
                <button
                  onClick={() => updateIssueStatus(issue.id, 'in_progress', 'Staff dispatched for inspection.')}
                  className="px-3 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#242424] text-slate-200 text-xs font-semibold border border-white/5 transition-colors"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => updateIssueStatus(issue.id, 'resolved', 'Repairs completed and verified.')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
                >
                  Mark Resolved
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* REPORT ISSUE BOTTOM SHEET */}
      <AndroidBottomSheet
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="Submit Campus Maintenance Grievance"
        subtitle={`Reported by ${currentUser.name} (${currentUser.rollNo || currentUser.role})`}
      >
        <form onSubmit={handleReportSubmit} className="space-y-4 pt-2 text-sm">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Issue Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            >
              <option value="hostel">Hostel Electrical / Water / Furniture</option>
              <option value="mess">Mess & Dining Hall Services</option>
              <option value="labs">Computer Labs & Fiber Connectivity</option>
              <option value="infrastructure">Campus Walkways & Classroom Fixtures</option>
              <option value="academic">Departmental Facilities & Projector</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Specific Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hostel Block A, Room 204 or Lab 4"
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Brief Subject Line
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Water cooler leaking on 2nd floor"
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Detailed Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details so maintenance technicians can arrive equipped..."
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md mt-2 transition-colors"
          >
            Submit Grievance to Ledger
          </button>
        </form>
      </AndroidBottomSheet>
    </div>
  );
}
