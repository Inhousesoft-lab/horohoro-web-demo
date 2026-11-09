import React, { useState, useRef, useEffect } from 'react';
import { FeedPost as FeedPostType, FeedPostLocationTag } from '../../types';
import { AI_EDITORS } from '../../data/feedMockData';
import { EditorAvatar } from './EditorAvatar';
import { Heart, Share2, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeedPostProps {
  post: FeedPostType;
  isSaved?: boolean;
  onToggleSave: (postId: string) => void;
  onCopyLink: (postId: string) => void;
  onSelectLocation?: (tag: FeedPostLocationTag) => void;
}

/**
 * Reusable FeedPost Component (Threads-style image layout)
 * 1. 콘텐츠 배치 순서:
 *    프로필 → 본문 텍스트 → 장소 태그 → 이미지 → 저장/공유 액션
 * 2. 이미지 1장:
 *    - 본문 텍스트 시작선에 정렬
 *    - 원본 비율 유지(자르지 않음), 최대 높이 430px, 모서리 8px
 * 3. 이미지 2장 이상 (Threads 실측: 높이 280px, 간격 6px, 모서리 8px):
 *    - 가로 스크롤 갤러리, 스냅 없이 자유 스크롤 (데스크톱은 마우스 드래그 지원)
 *    - 첫 이미지는 텍스트 시작선에 정렬 (좌측 패딩 66px / sm 70px)
 *    - 스크롤 중에는 화면 좌우 여백 없이(0px) 엣지-투-엣지로 이동
 *    - 높이 고정 + 원본 비율 폭 → 2장은 대부분 한 화면에, 3장 이상은 다음 이미지 일부 노출(peek)
 *    - 마지막 이미지 뒤에는 피드 우측 여백만큼 여백
 * 4. 이미지 뷰어:
 *    - 터치/스와이프 지원
 *    - 탭 시 전체 화면 뷰어 모달 표시 (닫기 및 좌우 스와이프/탐색 지원)
 */
export const FeedPost: React.FC<FeedPostProps> = ({
  post,
  isSaved = false,
  onToggleSave,
  onCopyLink,
  onSelectLocation,
}) => {
  const editor = AI_EDITORS[post.editorId] || AI_EDITORS.hwabi;
  const images = post.images || [];
  const hasImages = images.length > 0;
  const isMultipleImages = images.length > 1;

  const galleryScrollRef = useRef<HTMLDivElement>(null);

  // Full-screen Image Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Keyboard navigation & escape key handler for full-screen viewer
  useEffect(() => {
    if (!isViewerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsViewerOpen(false);
      if (e.key === 'ArrowLeft') setViewerIndex((prev) => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setViewerIndex((prev) => Math.min(images.length - 1, prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewerOpen, images.length]);

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  // 데스크톱 마우스 드래그로 갤러리 좌우 스크롤 (터치는 브라우저 기본 스크롤 사용)
  const dragRef = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  const handleGalleryPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !galleryScrollRef.current) return;
    dragRef.current = {
      startX: e.clientX,
      startScroll: galleryScrollRef.current.scrollLeft,
      moved: false,
    };
  };

  const handleGalleryPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = galleryScrollRef.current;
    if (!drag || !el) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > 5) {
      drag.moved = true;
      el.setPointerCapture(e.pointerId);
    }
    if (drag.moved) el.scrollLeft = drag.startScroll - dx;
  };

  const handleGalleryPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.moved) return;
    galleryScrollRef.current?.releasePointerCapture(e.pointerId);
    suppressClickRef.current = true; // 드래그 직후 클릭으로 뷰어가 열리지 않도록
  };

  const handleGalleryClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <article id={`feed-post-${post.id}`} className="scroll-mt-16 w-full max-w-md mx-auto pt-4 pb-4 px-4 sm:px-5 border-b border-line-warm/50 transition-colors">
      <div className="flex items-start gap-3">
        {/* Left: Dokkaebi Editor Avatar */}
        <div className="shrink-0 pt-0.5">
          <EditorAvatar editorId={post.editorId} size="md" />
        </div>

        {/* Right Content Column */}
        <div className="flex-1 min-w-0">
          {/* 1. Header (Editor Name, Relative Time, Category Badge) */}
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-[15px] text-ink tracking-tight">
                {post.editorName}
              </span>
              <span className="text-ink/30 text-xs">·</span>
              <span className="text-xs text-ink/50 font-medium">
                {post.createdAtText}
              </span>
            </div>

            {/* Category Badge (툴팁 속성 없음) */}
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 transition-colors pointer-events-none select-none"
              style={{
                backgroundColor: `${editor.flameColor}12`,
                borderColor: `${editor.flameColor}30`,
                color: editor.flameColor,
              }}
            >
              {post.category}
            </span>
          </div>

          {/* Optional Post Title */}
          {post.title && (
            <h3 className="text-base font-bold text-ink mb-1.5 leading-snug">
              {post.title}
            </h3>
          )}

          {/* 2. Text Content */}
          <div className="text-[14.5px] sm:text-[15px] text-ink leading-relaxed whitespace-pre-line tracking-normal select-text">
            {post.content}
          </div>

          {/* 3. Location Tags (📍) - placeId가 있는 태그는 탭하면 장소 상세로 이동, 없으면 정적 태그 */}
          {post.locationTags && post.locationTags.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {post.locationTags.map((tag, idx) => {
                const tagClass =
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFECE3] text-brand text-xs font-medium border border-line-warm/70 select-none truncate max-w-full';
                const tagContent = (
                  <>
                    <MapPin className="w-3 h-3 text-brand shrink-0" />
                    <span className="truncate">{tag.name}</span>
                  </>
                );
                return tag.placeId && onSelectLocation ? (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectLocation(tag)}
                    className={`${tagClass} active:scale-95 transition-transform`}
                  >
                    {tagContent}
                  </button>
                ) : (
                  <span key={idx} className={`${tagClass} pointer-events-none`}>
                    {tagContent}
                  </span>
                );
              })}
            </div>
          )}

          {/* 4. Images (콘텐츠의 마지막 영역에 배치) */}
          {hasImages && (
            <div className="mt-3">
              {isMultipleImages ? (
                /* ── 이미지 2장 이상: 화면 끝까지 닿는 가로 스크롤 갤러리 ──
                   - 갤러리 자체는 피드 좌우 끝(엣지)까지 확장 → 스크롤 시 좌우 여백 0
                   - 첫 사진은 본문 텍스트 시작선에 정렬 (좌측 패딩 = 아바타열 폭)
                   - 높이 고정 + 원본 비율 폭 → 2장은 대부분 한 화면, 3장 이상은 다음 사진 일부 노출
                   - 마지막 사진 뒤에는 피드 우측 여백만큼 여백 */
                <div
                  ref={galleryScrollRef}
                  onPointerDown={handleGalleryPointerDown}
                  onPointerMove={handleGalleryPointerMove}
                  onPointerUp={handleGalleryPointerEnd}
                  onPointerCancel={handleGalleryPointerEnd}
                  onClickCapture={handleGalleryClickCapture}
                  className="-ml-[66px] -mr-4 pl-[66px] sm:-ml-[70px] sm:-mr-5 sm:pl-[70px] flex gap-[6px] overflow-x-auto overscroll-x-contain select-none cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {images.map((imgUrl, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => openViewer(index)}
                      className="h-[280px] min-w-[150px] max-w-[min(80vw,340px)] shrink-0 rounded-lg overflow-hidden bg-stone-100 border border-black/10"
                      aria-label={`사진 ${index + 1} 크게 보기`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${post.editorName}의 피드 사진 ${index + 1}`}
                        className="h-full w-auto min-w-[150px] max-w-[min(80vw,340px)] object-cover select-none pointer-events-none"
                        loading={index < 2 ? 'eager' : 'lazy'}
                        referrerPolicy="no-referrer"
                        draggable={false}
                      />
                    </button>
                  ))}
                  {/* 우측 끝 여백 (피드 우측 패딩 - 사진 간격 6px) */}
                  <div className="w-[10px] sm:w-[14px] shrink-0" aria-hidden="true" />
                </div>
              ) : (
                /* ── 이미지 1장: 본문 텍스트 시작선 정렬, 원본 비율 유지(자르지 않음), 최대 높이 430px ── */
                <button
                  type="button"
                  onClick={() => openViewer(0)}
                  className="flex w-full justify-start pointer-events-none"
                  aria-label="사진 크게 보기"
                >
                  <img
                    src={images[0]}
                    alt={`${post.editorName}의 피드 사진`}
                    className="block w-auto h-auto max-w-full max-h-[430px] min-w-[160px] min-h-[120px] rounded-lg border border-black/10 bg-stone-100 select-none pointer-events-auto cursor-pointer"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                </button>
              )}
            </div>
          )}

          {/* 5. Actions Area (저장, 링크 복사) - 이미지 바로 아래 표시 */}
          <div className="mt-3.5 pt-0.5 flex items-center gap-5 text-ink/60">
            {/* Save (Heart) */}
            <button
              type="button"
              onClick={() => onToggleSave(post.id)}
              className="inline-flex items-center gap-1.5 py-1 text-xs font-semibold active:scale-90 transition-transform hover:text-heart"
              aria-label={isSaved ? '저장 취소' : '저장하기'}
            >
              <Heart
                className={`w-4.5 h-4.5 transition-colors ${
                  isSaved
                    ? 'text-heart fill-heart'
                    : 'text-ink/60 hover:text-heart'
                }`}
              />
              <span className={isSaved ? 'text-heart' : ''}>
                {isSaved ? '저장됨' : '저장'}
              </span>
            </button>

            {/* Link Copy */}
            <button
              type="button"
              onClick={() => onCopyLink(post.id)}
              className="inline-flex items-center gap-1.5 py-1 text-xs font-semibold active:scale-90 transition-transform hover:text-brand"
              aria-label="링크 복사"
            >
              <Share2 className="w-4.5 h-4.5 text-ink/60 hover:text-brand transition-colors" />
              <span>링크 복사</span>
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          전체 화면 이미지 뷰어 모달 (Swipe & Fullscreen Viewer)
         ──────────────────────────────────────────────────────── */}
      {isViewerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between select-none animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="사진 전체화면 보기"
        >
          {/* Top Bar: Slide Index Counter & Close Button */}
          <header className="px-5 py-4 flex items-center justify-between text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-sm font-semibold tracking-wide text-white/90">
              {viewerIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setIsViewerOpen(false)}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Main Viewer Stage with Touch Swipe Support */}
          <div className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Desktop Previous Button */}
            {images.length > 1 && viewerIndex > 0 && (
              <button
                type="button"
                onClick={() => setViewerIndex((prev) => Math.max(0, prev - 1))}
                className="hidden sm:flex absolute left-4 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-white items-center justify-center active:scale-90 transition-all cursor-pointer"
                aria-label="이전 사진"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Current Active Image with aspect ratio preserved */}
            <div className="w-full max-w-lg h-full max-h-[82vh] flex items-center justify-center p-2">
              <img
                src={images[viewerIndex]}
                alt={`${post.editorName}의 피드 사진 확대보기 ${viewerIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
                draggable={false}
              />
            </div>

            {/* Desktop Next Button */}
            {images.length > 1 && viewerIndex < images.length - 1 && (
              <button
                type="button"
                onClick={() => setViewerIndex((prev) => Math.min(images.length - 1, prev + 1))}
                className="hidden sm:flex absolute right-4 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-white items-center justify-center active:scale-90 transition-all cursor-pointer"
                aria-label="다음 사진"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails / Swiper Indicators */}
          {images.length > 1 && (
            <footer className="py-4 px-4 flex items-center justify-center gap-2 bg-gradient-to-t from-black/80 to-transparent">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setViewerIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    viewerIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`${idx + 1}번째 사진 보기`}
                />
              ))}
            </footer>
          )}
        </div>
      )}
    </article>
  );
};
