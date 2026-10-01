import { useEffect, useState } from 'react';
import { X, Volume2, VolumeX, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../services/store';

export function StoryViewerModal() {
  const { activeStoryIndex, closeStory, notices, toggleNoticeGotIt } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);

  const urgentNotices = notices.filter((n) => n.isUrgent);
  const currentNotice = activeStoryIndex !== null ? urgentNotices[activeStoryIndex] : null;

  useEffect(() => {
    if (activeStoryIndex === null) {
      setProgress(0);
      return;
    }

    const durationMs = 7000;
    const intervalMs = 50;
    const step = (intervalMs / durationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // If there's another story, move to next, else close
          if (activeStoryIndex < urgentNotices.length - 1) {
            useAppStore.getState().openStory(activeStoryIndex + 1);
          } else {
            closeStory();
          }
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeStoryIndex, urgentNotices.length, closeStory]);

  if (!currentNotice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      {/* Mobile container */}
      <div className="relative h-full w-full max-w-md bg-slate-950 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Background Image / Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 filter brightness-75"
          style={{
            backgroundImage: `url(${
              currentNotice.reelImage ||
              'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80'
            })`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80" />

        {/* Top Controls & Segment Progress Bars */}
        <div className="relative z-10 p-4 space-y-3">
          <div className="flex gap-1.5 w-full">
            {urgentNotices.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400 transition-all duration-75"
                  style={{
                    width:
                      i < (activeStoryIndex ?? 0)
                        ? '100%'
                        : i === activeStoryIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentNotice.authorAvatar}
                alt={currentNotice.authorName}
                className="h-9 w-9 rounded-full border border-indigo-400 object-cover shadow"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{currentNotice.authorName}</span>
                  <span className="rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold px-1.5 py-0.2 border border-rose-500/30">
                    URGENT
                  </span>
                </div>
                <span className="text-xs text-slate-300">{currentNotice.authorTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="p-2 rounded-full bg-black/40 text-slate-300 hover:text-white"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button
                onClick={closeStory}
                className="p-2 rounded-full bg-black/40 text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 px-6 py-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <ShieldAlert size={14} />
            <span>CAMPUS PRIORITY ADVISORY</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white leading-tight">
            {currentNotice.title}
          </h2>

          <p className="text-sm text-slate-200 leading-relaxed max-h-48 overflow-y-auto pr-1">
            {currentNotice.content}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {currentNotice.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="relative z-10 p-6 bg-slate-900/90 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleNoticeGotIt(currentNotice.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${
                currentNotice.userGotIt
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <CheckCircle size={18} />
              <span>
                {currentNotice.userGotIt
                  ? `Acknowledged (${currentNotice.gotItCount})`
                  : `Acknowledge (${currentNotice.gotItCount})`}
              </span>
            </button>

            <button
              onClick={() => {
                if (activeStoryIndex !== null && activeStoryIndex < urgentNotices.length - 1) {
                  useAppStore.getState().openStory(activeStoryIndex + 1);
                } else {
                  closeStory();
                }
              }}
              className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
