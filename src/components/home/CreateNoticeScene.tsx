import { useState, useRef } from 'react';
import { useAppStore } from '../../services/store';
import { ArrowLeft, Send, Upload, Film, Image as ImageIcon, X, Sparkles } from 'lucide-react';

export function CreateNoticeScene() {
  const { setCreateSceneOpen, createNotice, currentUser } = useAppStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupName, setGroupName] = useState('Computer Science 6th Semester');
  const [tags, setTags] = useState('#academics #notice');
  const [isUrgent, setIsUrgent] = useState(false);

  // File upload state (Image or Video)
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Touch swipe to return to Home feed (swipe left like closing Instagram camera)
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

    // Swiping left returns to Home Feed
    if (diffX < -60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      setCreateSceneOpen(false);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      const isVideo = file.type.startsWith('video');
      setMediaType(isVideo ? 'video' : 'image');
      const previewUrl = URL.createObjectURL(file);
      setMediaPreviewUrl(previewUrl);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagsArray = tags
      .split(' ')
      .map((t) => t.trim())
      .filter((t) => t.startsWith('#'));

    createNotice(
      title.trim(),
      content.trim(),
      groupName,
      tagsArray.length ? tagsArray : ['#general'],
      isUrgent,
      mediaPreviewUrl || undefined
    );
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-full bg-black text-white p-4 space-y-4 pb-20 select-none animate-in slide-in-from-left duration-300 ease-out"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <button
          onClick={() => setCreateSceneOpen(false)}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-indigo-400" />
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200">
            Create Notice
          </h2>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim()}
          className="text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-40 hover:from-indigo-500 hover:to-purple-500 px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
        >
          Publish
        </button>
      </div>

      <div className="text-xs text-slate-300 bg-gradient-to-r from-indigo-500/10 via-[#101010] to-purple-500/10 p-3.5 rounded-2xl border border-indigo-500/20 leading-relaxed flex items-center justify-between">
        <span>Slide left anytime or tap Back to return to feed.</span>
        <span className="text-[10px] font-mono text-indigo-400 font-semibold">SWIPE ENABLED</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target Group Selector */}
        <div className="bg-[#101010] border border-white/5 rounded-2xl p-4 space-y-2 shadow-xs">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Target Group / Enrolled Cohort
          </label>
          <select
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="Computer Science 6th Semester">Computer Science 6th Semester</option>
            <option value="Campus Canteen and Mess Menu">Campus Canteen and Mess Menu</option>
            <option value="Hostel Block A Residents">Hostel Block A Residents</option>
            <option value="Computer Science Department (All Semesters)">
              Computer Science Department (All Semesters)
            </option>
            <option value="Central Institutional Notice (All Students)">
              Central Institutional Notice (All Students)
            </option>
            <option value="Faculty and Staff Only">Faculty and Staff Only</option>
          </select>
        </div>

        {/* Title */}
        <div className="bg-[#101010] border border-white/5 rounded-2xl p-4 space-y-2 shadow-xs">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Notice Title / Headline
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Official circular subject or daily menu headline..."
            className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Body */}
        <div className="bg-[#101010] border border-white/5 rounded-2xl p-4 space-y-2 shadow-xs">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Notice Content and Instructions
          </label>
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write official instructions or menu list (Breakfast, Lunch, Dinner)..."
            className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* REAL IMAGE & VIDEO FILE UPLOAD */}
        <div className="bg-[#101010] border border-white/5 rounded-2xl p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Upload Image or Video (Camera / Device)
            </label>
            {mediaPreviewUrl && (
              <button
                type="button"
                onClick={handleRemoveMedia}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <X size={14} />
                <span>Remove</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="mediaUploadInput"
          />

          {mediaPreviewUrl ? (
            <div className="relative bg-[#161616] rounded-xl overflow-hidden border border-white/10">
              {mediaType === 'video' ? (
                <video
                  src={mediaPreviewUrl}
                  controls
                  className="w-full max-h-60 object-contain"
                />
              ) : (
                <img
                  src={mediaPreviewUrl}
                  alt="Upload preview"
                  className="w-full max-h-60 object-cover"
                />
              )}
              <div className="p-2.5 bg-[#121212] text-xs text-slate-400 font-mono flex justify-between">
                <span>{mediaFile?.name}</span>
                <span>{(mediaFile!.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>
          ) : (
            <label
              htmlFor="mediaUploadInput"
              className="flex flex-col items-center justify-center p-6 bg-[#161616] border border-dashed border-white/15 hover:border-indigo-400 rounded-xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 text-indigo-400 mb-1.5">
                <Upload size={20} />
                <ImageIcon size={20} />
                <Film size={20} />
              </div>
              <span className="text-sm font-semibold text-slate-200">
                Choose Image or Video File
              </span>
              <span className="text-xs text-slate-500 mt-0.5">
                Supports JPG, PNG, MP4, MOV from Camera or Disk
              </span>
            </label>
          )}
        </div>

        {/* Hashtags */}
        <div className="bg-[#101010] border border-white/5 rounded-2xl p-4 space-y-2 shadow-xs">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Categorization Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="#academics #canteen #notice"
            className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Priority Urgent Toggle */}
        <div className="flex items-center justify-between p-4 bg-[#101010] border border-white/5 rounded-2xl shadow-xs">
          <div>
            <p className="text-sm font-bold text-white">Mark as Urgent Priority Circular</p>
            <p className="text-xs text-slate-400">Triggers priority placement in student feed</p>
          </div>
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="h-5 w-5 rounded-md bg-slate-800 text-indigo-600 focus:ring-0"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Send size={16} />
          <span>Publish Group Notice</span>
        </button>
      </form>
    </div>
  );
}
