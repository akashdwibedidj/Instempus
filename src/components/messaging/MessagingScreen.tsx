import { useState } from 'react';
import { useAppStore } from '../../services/store';
import {
  MessageSquare,
  Send,
  ArrowLeft,
  CheckCheck,
  Search,
  UserPlus,
  Bot,
  Sparkles,
} from 'lucide-react';
import { CreateGroupModal } from './CreateGroupModal';

export function MessagingScreen() {
  const {
    threads,
    messages,
    selectedThreadId,
    selectThread,
    sendMessage,
    currentUser,
    currentRole,
    toggleAIChat,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'channels' | 'dms'>('all');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const isStaffOrAuthority = currentRole !== 'student';

  const activeThread = threads.find((th) => th.id === selectedThreadId);
  const currentMessages = selectedThreadId ? messages[selectedThreadId] || [] : [];

  const filteredThreads = threads.filter((th) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'channels' && th.type === 'channel') ||
      (activeTab === 'dms' && th.type === 'dm');
    const matchesSearch =
      searchQuery.trim() === '' ||
      th.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      th.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedThreadId) return;

    sendMessage(selectedThreadId, inputText.trim());
    setInputText('');
  };

  // If a thread is selected, render conversation view
  if (activeThread) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] max-h-[640px] pb-2 select-none text-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-3.5 bg-[#101010] border border-white/5 rounded-2xl shadow-sm mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => selectThread(null)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="relative">
              <img
                src={activeThread.avatar}
                alt={activeThread.name}
                className="h-10 w-10 rounded-full object-cover border border-white/10"
              />
              {activeThread.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-black" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-[200px]">
                {activeThread.name}
              </h3>
              <p className="text-xs text-slate-400">
                {activeThread.isOnline ? 'Online now' : activeThread.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
          <div className="text-center py-1">
            <span className="text-[10px] font-mono text-slate-400 bg-[#141414] px-3 py-1 rounded-full border border-white/5">
              ENCRYPTED INSTITUTIONAL DIRECT NETWORK
            </span>
          </div>

          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isMe && (
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="h-7 w-7 rounded-full object-cover mb-0.5 border border-white/10"
                />
              )}

              <div
                className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                  msg.isMe
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-xs'
                    : 'bg-[#181818] text-slate-200 border border-white/5 rounded-2xl rounded-tl-xs'
                }`}
              >
                {!msg.isMe && (
                  <span className="block text-xs font-bold text-indigo-300 mb-0.5">
                    {msg.senderName}
                  </span>
                )}
                <p>{msg.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-mono ${
                    msg.isMe ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.isMe && <CheckCheck size={12} className="text-indigo-200" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-2.5 border-t border-white/5 flex items-center gap-2 bg-[#0c0c0c] rounded-2xl">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activeThread.name.split(' ')[0]}...`}
            className="flex-1 bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-40 text-white flex items-center justify-center hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition-transform shadow-xs"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 select-none text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-1 pb-1">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Institutional Messaging</h1>
          <p className="text-xs text-slate-400 font-medium">Direct Faculty Mentorship and Departmental Broadcasts</p>
        </div>

        {/* Create Group Button (For faculty, wardens, HOD, admin) */}
        {isStaffOrAuthority && (
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
            title="Create Custom Cohort Group"
          >
            <UserPlus size={14} />
            <span>New Cohort</span>
          </button>
        )}
      </div>

      {/* GEMINI AI ASSISTANT CARD TRIGGER */}
      <div
        onClick={toggleAIChat}
        className="group cursor-pointer p-3.5 bg-gradient-to-r from-indigo-950/40 via-[#141414] to-purple-950/40 border border-indigo-500/25 hover:border-indigo-500/50 rounded-2xl flex items-center justify-between shadow-sm transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">Campus AI Assistant</span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
                AI BOT
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Ask about gate passes, leave guidelines, mess timings, or regulations
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
          Chat &rarr;
        </span>
      </div>

      {/* Search Bar */}
      <div>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels or faculty mentors..."
            className="w-full bg-[#121212] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Channels' },
          { id: 'channels', label: 'Department Broadcasts' },
          { id: 'dms', label: 'Faculty Mentorship' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 text-xs whitespace-nowrap rounded-xl transition-colors font-medium ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-white to-slate-200 text-black font-bold shadow-xs'
                : 'bg-[#141414] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Threads List (Rounded Card List) */}
      <div className="space-y-2.5">
        {filteredThreads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => selectThread(thread.id)}
            className="flex items-center justify-between p-3.5 bg-[#101010] border border-white/5 rounded-2xl hover:bg-[#161616] cursor-pointer transition-colors shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={thread.avatar}
                  alt={thread.name}
                  className="h-11 w-11 rounded-full object-cover border border-white/10"
                />
                {thread.isOnline && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-black" />
                )}
              </div>

              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-sm font-bold text-white truncate">
                  {thread.name}
                </span>
                <span className="text-xs text-slate-400 truncate mt-0.5">
                  {thread.lastMessage}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pl-2">
              <span className="text-xs font-mono text-slate-400">{thread.lastMessageTime}</span>
              {thread.unreadCount > 0 && (
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-xs" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp-Style Group Creator Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />
    </div>
  );
}
