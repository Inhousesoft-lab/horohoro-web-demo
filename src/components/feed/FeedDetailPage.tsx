import React, { useEffect, useState } from 'react';
import { FeedPost } from '../../types';
import { EditorAvatar } from './EditorAvatar';
import { ArrowLeft, Check, Heart, Link2, MoreHorizontal } from 'lucide-react';
import { copyText, feedPostUrl } from '../../utils/feedLink';

interface FeedDetailPageProps {
  post: FeedPost;
  isSaved: boolean;
  onToggleSave: (postId: string) => void;
  onBack: () => void;
}

/**
 * 피드 단건 화면 (/feed/{번호}, 390px 기준 실측)
 * - 앱바 56px: 좌측 뒤로가기, 우측 더보기(…) 아이콘, 좌우 20px
 * - 본문 좌우 20px
 *   프로필(아바타 40px + 이름 15px bold / 날짜 14px 회색) → 16px
 *   카테고리(14px bold 녹색) → 6px → 제목(20px bold) → 14px
 *   본문(16px, 줄 높이 25px) → 16px → 📍 장소(16px) → 16px
 *   사진(높이 210px, 모서리 12px, 간격 10px, 다음 사진 일부 노출) → 8px
 *   하트·링크 아이콘(22px)
 * - 제목이 없는 게시물은 본문 첫 줄을 제목으로 사용
 */
export const FeedDetailPage: React.FC<FeedDetailPageProps> = ({ post, isSaved, onToggleSave, onBack }) => {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const lines = post.content.split('\n');
  const title = post.title || lines[0];
  const body = (post.title ? post.content : lines.slice(1).join('\n')).trim();
  const images = post.images || [];

  const handleCopyLink = async () => {
    await copyText(feedPostUrl(post.id));
    setToast('링크가 복사되었어요');
  };

  return (
    <div className="flex-1 pb-24 bg-white">
      {/* 앱바 */}
      <header className="sticky top-0 z-30 h-14 px-5 bg-white flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="w-10 h-10 -ml-2 flex items-center justify-center text-ink active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2} />
        </button>
        <span className="w-10 h-10 -mr-2 flex items-center justify-center text-ink-muted" aria-hidden="true">
          <MoreHorizontal className="w-6 h-6" strokeWidth={2} />
        </span>
      </header>

      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-ink text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toast}</span>
        </aside>
      )}

      <article className="pt-4 text-left">
        {/* 프로필 */}
        <div className="px-5 flex items-center gap-3">
          <EditorAvatar editorId={post.editorId} size="base" />
          <div className="min-w-0">
            <p className="text-[15px] leading-5 font-bold text-ink">{post.editorName}</p>
            <p className="mt-0.5 text-[14px] leading-5 text-ink-muted">{post.createdAtText}</p>
          </div>
        </div>

        {/* 카테고리 + 제목 + 본문 */}
        <div className="px-5 mt-4">
          <p className="text-[14px] leading-5 font-bold text-brand">{post.category}</p>
          <h1 className="mt-1.5 text-[20px] leading-7 font-bold tracking-tight text-ink break-keep">{title}</h1>
          {body && (
            <p className="mt-3.5 text-[16px] leading-[25px] text-ink whitespace-pre-line select-text">{body}</p>
          )}
        </div>

        {/* 장소 */}
        {post.locationTags && post.locationTags.length > 0 && (
          <div className="px-5 mt-4 space-y-1">
            {post.locationTags.map((tag) => (
              <p key={tag.name} className="text-[16px] leading-6 text-ink">
                <span className="mr-1.5" aria-hidden="true">📍</span>
                {tag.name}
              </p>
            ))}
          </div>
        )}

        {/* 사진: 높이 210px 고정, 가로 스크롤, 좌우 20px 여백 안에서 다음 사진 일부 노출 */}
        {images.length > 0 && (
          <div className="px-5 mt-4">
            <div
              className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              {images.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`${post.editorName}의 피드 사진 ${index + 1}`}
                  className={`h-[210px] shrink-0 snap-start rounded-xl object-cover bg-stone-100 ${
                    images.length > 1 ? 'w-[79%]' : 'w-full'
                  }`}
                  referrerPolicy="no-referrer"
                  loading={index < 2 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* 하트 · 링크 복사 */}
        <div className="pl-3 mt-2 flex items-center">
          <button
            type="button"
            onClick={() => onToggleSave(post.id)}
            aria-label={isSaved ? '찜 해제' : '찜하기'}
            aria-pressed={isSaved}
            className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform"
          >
            <Heart
              className={`w-[22px] h-[22px] ${isSaved ? 'fill-heart text-heart' : 'text-ink-muted'}`}
              strokeWidth={1.8}
            />
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="링크 복사"
            className="w-10 h-10 flex items-center justify-center text-ink-muted active:scale-90 transition-transform"
          >
            <Link2 className="w-[22px] h-[22px] -rotate-45" strokeWidth={1.8} />
          </button>
        </div>
      </article>
    </div>
  );
};
