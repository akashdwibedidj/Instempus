import { useState } from 'react';
import { useAppStore } from '../../services/store';
import { AndroidBottomSheet } from '../android/AndroidBottomSheet';
import { Search, UserPlus, Check, Users, Sparkles } from 'lucide-react';

export function CreateGroupModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { studentsRoster, createCohortGroupWithStudents, currentUser } = useAppStore();

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRollNos, setSelectedRollNos] = useState<string[]>([]);

  const filteredStudents = studentsRoster.filter(
    (st) =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStudent = (rollNo: string) => {
    if (selectedRollNos.includes(rollNo)) {
      setSelectedRollNos(selectedRollNos.filter((r) => r !== rollNo));
    } else {
      setSelectedRollNos([...selectedRollNos, rollNo]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRollNos.length === filteredStudents.length) {
      setSelectedRollNos([]);
    } else {
      setSelectedRollNos(filteredStudents.map((s) => s.rollNo));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedRollNos.length === 0) return;

    createCohortGroupWithStudents(
      groupName.trim(),
      description.trim() || `Official cohort created by ${currentUser.name}`,
      selectedRollNos
    );

    setGroupName('');
    setDescription('');
    setSelectedRollNos([]);
    onClose();
  };

  return (
    <AndroidBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Student Cohort Group"
      subtitle={`Enrolling as ${currentUser.name} (${currentUser.role.toUpperCase()})`}
    >
      <form onSubmit={handleCreate} className="space-y-4 pt-1 select-none text-white text-sm">
        {/* Group Name & Purpose */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Group Title / Name
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. CSE Hackathon Finalists or Hostel Block A 2nd Floor"
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Cohort Objective / Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief purpose of this official broadcast channel..."
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Student Selector (WhatsApp Style Search & Multi-select) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Select Students ({selectedRollNos.length} selected)
            </label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              {selectedRollNos.length === filteredStudents.length
                ? 'Deselect All'
                : 'Select All Visible'}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Roll No, Student Name, or Department..."
              className="w-full bg-[#141414] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* Student Roster Cards */}
          <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1.5 p-1 bg-[#121212] rounded-2xl border border-white/5">
            {filteredStudents.map((st) => {
              const isSelected = selectedRollNos.includes(st.rollNo);
              return (
                <div
                  key={st.rollNo}
                  onClick={() => toggleStudent(st.rollNo)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors border ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'bg-[#181818] border-white/5 text-slate-300 hover:bg-[#202020]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={st.avatarUrl}
                      alt={st.name}
                      className="h-8 w-8 rounded-full object-cover border border-white/10"
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-white block truncate">
                        {st.name}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 block truncate">
                        {st.rollNo} • {st.department.split(' ')[0]} ({st.hostelBlock})
                      </span>
                    </div>
                  </div>

                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-white/20 bg-black/40'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={!groupName.trim() || selectedRollNos.length === 0}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Users size={16} />
          <span>Create Cohort Channel ({selectedRollNos.length} Students)</span>
        </button>
      </form>
    </AndroidBottomSheet>
  );
}
