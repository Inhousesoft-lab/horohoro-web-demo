import React, { useState } from 'react';
import { FeedPost as FeedPostType, FeedPostLocationTag } from '../../types';
import { INITIAL_FEED_POSTS } from '../../data/feedMockData';
import { FeedPost } from './FeedPost';
import { Check } from 'lucide-react';
import { copyText, feedPostUrl } from '../../utils/feedLink';

interface FeedTabProps {
  savedPostIds: string[];
  onToggleSavePost: (postId: string) => void;
  onSelectLocationTag: (tag: FeedPostLocationTag) => void;
}

export const FeedTab: React.FC<FeedTabProps> = ({
  savedPostIds,
  onToggleSavePost,
  onSelectLocationTag,
}) => {
  const [posts] = useState<FeedPostType[]>(INITIAL_FEED_POSTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 링크 복사: 피드 단건 주소 (/feed/{번호})
  const handleCopyLink = async (postId: string) => {
    await copyText(feedPostUrl(postId));
    showToast('링크가 복사되었어요');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  return (
    <div className="pb-24 pt-1">
      {/* Toast Notification (링크 복사 완료 등) */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-ink text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Feed Subtitle (컨텐츠 영역 최상단) */}
      <div className="pb-3.5 pt-0.5">
        <p className="text-[13.5px] text-ink/65 font-medium tracking-tight">
          도깨비들이 발견한 오늘의 한국 이야기
        </p>
      </div>

      {/* Feed Stream without top filters */}
      <div className="-mx-4 divide-y-0">
        {posts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            isSaved={savedPostIds.includes(post.id)}
            onToggleSave={onToggleSavePost}
            onCopyLink={handleCopyLink}
            onSelectLocation={onSelectLocationTag}
          />
        ))}

        {posts.length === 0 && (
          <div className="py-16 text-center text-ink/50 text-xs space-y-2">
            <p>아직 등록된 이야기가 없어요.</p>
          </div>
        )}
      </div>
    </div>
  );
};
