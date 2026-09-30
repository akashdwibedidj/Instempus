// PostCard.tsx — Instagram-style notice/post card for the Home feed.
// No Supabase imports. All data passed as props (pre-fetched by page).
import { useState } from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge } from '@/components/ui/Badge';
import type { Role } from '@/constants/roles';

export interface PostCardData {
  id:          string;
  author:      { name: string; role: Role; avatarUrl?: string };
  targetGroup: string;
  body:        string;
  hashtags?:   string[];
  image?:      string;
  timeAgo:     string;
  seenCount?:  number;
  needsAck?:   boolean;
}

interface Props {
  post:       PostCardData;
  onAck?:     (id: string) => void;
  onHashtag?: (tag: string) => void;
}

export function PostCard({ post, onAck, onHashtag }: Props) {
  const { t } = useTranslation();
  const [acked, setAcked] = useState(false);

  function handleAck() {
    setAcked(true);
    onAck?.(post.id);
  }

  return (
    <article className="glass-card overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        <Avatar name={post.author.name} src={post.author.avatarUrl} size="md" role={post.author.role} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-white">{post.author.name}</span>
            <RoleBadge role={post.author.role} />
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-gray-500">{post.timeAgo}</span>
            <span className="text-xs text-brand-400/80">→ {post.targetGroup}</span>
          </div>
        </div>
      </div>

      {/* ── Optional image ── */}
      {post.image && (
        <img src={post.image} alt="" className="max-h-56 w-full object-cover" />
      )}

      {/* ── Body ── */}
      <div className="px-4 py-3">
        <p className="text-sm leading-relaxed text-gray-200">{post.body}</p>

        {/* Hashtag chips */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.hashtags.map((tag) => (
              <button
                key={tag}
                onClick={() => onHashtag?.(tag)}
                className="text-xs text-brand-400 transition-colors hover:text-brand-300"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer: Got-it + Seen count ── */}
      {(post.needsAck || post.seenCount !== undefined) && (
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5">
          {post.needsAck && (
            <button
              id={`ack-${post.id}`}
              onClick={handleAck}
              disabled={acked}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                acked ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
              }`}
            >
              <CheckCircle2 size={14} />
              {acked ? '✓' : t('home.gotIt')}
            </button>
          )}
          {post.seenCount !== undefined && (
            <span className="ml-auto flex items-center gap-1 text-xs text-gray-600">
              <Eye size={13} />
              {post.seenCount}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
