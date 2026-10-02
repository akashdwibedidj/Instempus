import { useState, useRef } from 'react';
import { useAppStore } from '../../services/store';
import {
  Search,
  CheckCircle2,
  Share2,
  Paperclip,
  Plus,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { CreateNoticeScene } from './CreateNoticeScene';
import { CanteenMenuCard } from '../canteen/CanteenMenuCard';

export function HomeFeedScreen() {
  const {
    notices,
    currentUser,
    currentRole,
    openStory,
    toggleNoticeGotIt,
    isCreateSceneOpen,
    setCreateSceneOpen,
    triggerEmergencyAlert,
  } = useAppStore();

  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX.current;
    const diffY = touchEndY - touchStartY.current;

    // SWIPE RIGHT (like Instagram camera from Home Feed)
    if (diffX > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      setCreateSceneOpen(true);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (isCreateSceneOpen) {
    return <CreateNoticeScene />;
  }

  const urgentNotices = notices.filter((n) => n.isUrgent);
  const allTags = [
    'all',
    '#canteen',
    '#cse-dept',
    '#hostel-a',
    '#gate-pass',
    '#curfew',
    '#hackathon',
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesTag =
      selectedTag === 'all' ||
      n.tags.includes(selectedTag) ||
      (selectedTag === '#canteen' && n.groupName.includes('Canteen'));

    const matchesQuery =
      searchQuery.trim() === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.groupName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesQuery;
  });

  const canTriggerAlarm = ['admin', 'security', 'warden', 'principal'].includes(currentRole);

  const handleEmergencyTrigger = () => {
    triggerEmergencyAlert(
      'fire',
      'Urgent Campus Evacuation Protocol Active',
      'Evacuate academic blocks immediately via emergency fire exits. Assemble at the Central Convocation Sports Field Ground.'
    );
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="space-y-4 pb-20 select-none text-white"
    >
      {/* Top Header with ambient subtle gradient glow */}
      <div className="relative overflow-hidden p-3.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-white/5 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Instempus
            </h1>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs text-slate-300 font-medium">
            {currentUser.name} • {currentUser.department.split(' ')[0]}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Emergency Siren Alarm Trigger (Visible to Admin, Security, Warden) */}
          {canTriggerAlarm && (
            <button
              onClick={handleEmergencyTrigger}
              className="flex items-center gap-1.5 bg-red-950/70 hover:bg-red-900 text-red-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-800 transition-all shadow-xs active:scale-95"
              title="Broadcast Emergency Siren to all phones"
            >
              <AlertTriangle size={13} className="text-red-400 animate-bounce" />
              <span>SOS</span>
            </button>
          )}

          {/* Quick Create Button with Instagram-like Gradient */}
          <button
            onClick={() => setCreateSceneOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
            title="Create Group Notice (or swipe right)"
          >
            <Plus size={15} />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Swipe Right Hint Bar (Instagram camera style gesture) */}
      <div
        onClick={() => setCreateSceneOpen(true)}
        className="p-3 bg-gradient-to-r from-indigo-500/10 via-[#101010] to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl flex items-center justify-between text-xs text-slate-300 shadow-sm cursor-pointer transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-400" />
          <span>Swipe right to open notice creator</span>
        </div>
        <span className="text-indigo-400 font-semibold flex items-center gap-1">
          Open <ArrowRight size={13} />
        </span>
      </div>

      {/* COMPACT CANTEEN DAILY MENU BANNER (Tap to view full meal schedule) */}
      <CanteenMenuCard />

      {/* Stories / Urgent Priority Broadcasts */}
      {urgentNotices.length > 0 && (
        <div className="bg-[#101010] border border-white/5 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Priority Campus Notices
            </span>
            <span className="text-xs font-mono text-slate-500">OFFICIAL DESK</span>
          </div>

          <div className="flex gap-3.5 overflow-x-auto no-scrollbar py-1">
            {urgentNotices.map((notice, idx) => (
              <button
                key={notice.id}
                onClick={() => openStory(idx)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 focus:outline-none group"
              >
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 shadow-sm group-hover:scale-105 transition-transform">
                  <div className="p-0.5 rounded-full bg-black">
                    <img
                      src={notice.authorAvatar}
                      alt={notice.authorName}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-300 max-w-[68px] truncate text-center group-hover:text-white transition-colors">
                  {notice.authorName.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices, circulars, or instructors..."
            className="w-full bg-[#121212] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Tag filter strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 text-xs whitespace-nowrap rounded-xl transition-all font-medium ${
              selectedTag === tag
                ? 'bg-gradient-to-r from-white to-slate-200 text-black font-bold shadow-xs'
                : 'bg-[#141414] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Notices Feed List (Rounded Cards with Generous Spacing and Entrance Transitions) */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500 bg-[#101010] rounded-2xl border border-white/5">
            No notices found for this filter.
          </div>
        ) : (
          filteredNotices.map((post) => (
            <article
              key={post.id}
              className="bg-[#101010] border border-white/5 rounded-2xl p-4 space-y-3.5 shadow-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
            >
              {/* Group Source Tag & Author Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 text-xs">
                    Group: {post.groupName}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">{post.timestamp}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="h-10 w-10 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{post.authorName}</span>
                        <span className="text-xs uppercase px-2 py-0.5 rounded-md bg-[#1e1e1e] text-slate-300 font-mono font-medium">
                          {post.authorRole}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{post.authorTitle}</p>
                    </div>
                  </div>

                  {post.isUrgent && (
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
                      URGENT
                    </span>
                  )}
                </div>
              </div>

              {/* Notice Title & Text */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white leading-snug">{post.title}</h3>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Image or Video Player Embed */}
              {post.mediaType === 'video' && post.mediaUrl ? (
                <div className="w-full bg-black rounded-xl overflow-hidden aspect-video border border-white/5 shadow-xs">
                  <video
                    src={post.mediaUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : post.imageUrl ? (
                <div className="w-full bg-[#181818] rounded-xl overflow-hidden aspect-[16/9] border border-white/5 shadow-xs">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              {/* Attachments if any */}
              {post.attachments && post.attachments.length > 0 && (
                <div className="space-y-1.5">
                  {post.attachments.map((att, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-[#161616] px-3.5 py-2.5 rounded-xl text-xs border border-white/5"
                    >
                      <div className="flex items-center gap-2 text-slate-200">
                        <Paperclip size={14} className="text-indigo-400" />
                        <span className="font-mono text-xs font-medium">{att.name}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{att.size}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {post.tags.map((tg) => (
                  <span key={tg} className="text-xs text-indigo-400 font-medium">
                    {tg}
                  </span>
                ))}
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button
                  onClick={() => toggleNoticeGotIt(post.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    post.userGotIt
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 text-emerald-300 border border-emerald-500/40 shadow-xs'
                      : 'bg-[#181818] text-slate-300 hover:text-white border border-white/5 active:scale-95'
                  }`}
                >
                  <CheckCircle2 size={15} />
                  <span>
                    {post.userGotIt ? 'Acknowledged' : 'Acknowledge'} ({post.gotItCount})
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: post.title, text: post.content });
                    }
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#181818] transition-colors active:scale-95"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
