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
      <div className="flex items-center justify-between px-2 py-2 border-b border-[#141414]">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Campus Grievance Ledger</h1>
          <p className="text-[10px] text-slate-400">Institutional Maintenance and Upvote Priority Board</p>
        </div>

        <button
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow transition-colors"
        >
          <Plus size={13} />
          <span>Report Issue</span>
        </button>
      </div>

      {/* Category Filter Strip */}
      <div className="flex items-center gap-1 px-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md transition-colors ${
              selectedCategory === cat.id
                ? 'bg-white text-black font-semibold'
                : 'bg-[#121212] text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Issues List (Flat, Minimal Rounding on Small Buttons) */}
      <div className="divide-y divide-[#141414]">
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-indigo-400 uppercase font-semibold">
                    {issue.id} • {issue.category.toUpperCase()}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-sm uppercase ${
                      issue.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : issue.status === 'in_progress'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white mt-1 leading-snug">{issue.title}</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                  {issue.description}
                </p>
              </div>

              {/* Upvote counter button */}
              <button
                onClick={() => toggleIssueUpvote(issue.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-md min-w-[48px] transition-colors ${
                  issue.userUpvoted
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#141414] text-slate-400 hover:bg-[#1f1f1f]'
                }`}
              >
                <ThumbsUp size={14} />
                <span className="font-mono font-bold text-[10px] mt-0.5">{issue.upvotes}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
              <span>Location: {issue.location}</span>
              <span>Reported: {issue.createdAt}</span>
            </div>

            {/* Status Update note */}
            {issue.statusUpdateNote && (
              <div className="p-2 bg-[#0c0c0c] border-l-2 border-amber-500 text-[10px] text-slate-300">
                <span className="font-bold text-amber-400 block">Estate Action Note:</span>
                {issue.statusUpdateNote}
              </div>
            )}

            {/* Staff status update controls */}
            {isStaffOrAdmin && (
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => updateIssueStatus(issue.id, 'in_progress', 'Staff dispatched for inspection.')}
                  className="px-2 py-0.5 rounded-md bg-[#1a1a1a] text-slate-300 hover:text-white text-[10px] font-medium"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => updateIssueStatus(issue.id, 'resolved', 'Repairs completed and verified.')}
                  className="px-2 py-0.5 rounded-md bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 text-[10px] font-medium"
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
        <form onSubmit={handleReportSubmit} className="space-y-3 pt-2 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Issue Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
              className="w-full bg-[#141414] border-b border-[#2b2b2b] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400"
            >
              <option value="hostel">Hostel Electrical / Water / Furniture</option>
              <option value="mess">Mess & Dining Hall Services</option>
              <option value="labs">Computer Labs & Fiber Network</option>
              <option value="academic">Classrooms & Projector Facilities</option>
              <option value="infrastructure">General Campus Grounds</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Issue Headline</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lab 4 Cisco AP dropping connection..."
              className="w-full bg-[#141414] border-b border-[#2b2b2b] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Precise Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hostel Block A, 2nd Floor East Wing"
              className="w-full bg-[#141414] border-b border-[#2b2b2b] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Detailed Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe symptoms, timings, and severity..."
              className="w-full bg-[#141414] border-b border-[#2b2b2b] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow mt-2"
          >
            Submit Grievance to Estate Cell
          </button>
        </form>
      </AndroidBottomSheet>
    </div>
  );
}
