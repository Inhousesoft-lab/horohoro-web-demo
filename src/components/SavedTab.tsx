import React, { useState } from 'react';
import { LuckyPlace, FeedPost } from '../types';
import { ELEMENTS } from '../data/mockData';
import { BidoCharacter } from './character/BidoCharacter';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';

interface SavedTabProps {
  places: LuckyPlace[];
  savedPlaceIds: string[];
  feedPosts: FeedPost[];
  savedFeedPostIds: string[];
  onToggleSave: (id: string) => void;
  onToggleSaveFeedPost: (postId: string) => void;
  onOpenPlaceDetail: (place: LuckyPlace) => void;
  onOpenFeedPost: (postId: string) => void;
  onNavigateToPlaces: () => void;
}

type SavedFilter = 'all' | 'place' | 'feed';

interface SavedCardItem {
  key: string;
  kind: 'place' | 'feed';
  image?: string;
  title: string;
  meta: string;
  onOpen: () => void;
  onUnsave: () => void;
}

/**
 * 찜 탭 (390px 기준 실측)
 * - 상단: "N곳"(24px 녹색 bold) + 안내 문구, 필터 칩(전체/장소/피드 + 개수)
 * - 2열 그리드: 좌우 16px, 열 간격 12px, 행 간격 20px
 * - 카드: 정사각 이미지(모서리 12px) + 좌상단 구분 배지 + 우상단 찜 하트
 *         제목 16px bold 최대 2줄(2줄 높이 고정 → 같은 행의 카드 높이 동일) + 메타 13px
 */
export const SavedTab: React.FC<SavedTabProps> = ({
  places,
  savedPlaceIds,
  feedPosts,
  savedFeedPostIds,
  onToggleSave,
  onToggleSaveFeedPost,
  onOpenPlaceDetail,
  onOpenFeedPost,
  onNavigateToPlaces,
}) => {
  const [filter, setFilter] = useState<SavedFilter>('all');

  const placeItems: SavedCardItem[] = savedPlaceIds
    .map((id) => places.find((p) => p.id === id))
    .filter((p): p is LuckyPlace => Boolean(p))
    .map((place) => {
      const el = ELEMENTS[place.element] || ELEMENTS.water;
      return {
        key: `place-${place.id}`,
        kind: 'place',
        image: place.heroImage,
        title: place.name,
        meta: `${el.hanja} ${el.name.split(' · ')[0]} · ${place.location}`,
        onOpen: () => onOpenPlaceDetail(place),
        onUnsave: () => onToggleSave(place.id),
      };
    });

  const feedItems: SavedCardItem[] = savedFeedPostIds
    .map((id) => feedPosts.find((p) => p.id === id))
    .filter((p): p is FeedPost => Boolean(p))
    .map((post) => ({
      key: `feed-${post.id}`,
      kind: 'feed',
      image: post.images?.[0],
      // 제목이 없으면 본문 첫 줄을 제목으로 사용
      title: post.title || post.content.split('\n')[0],
      meta: post.locationTags?.[0]?.name || post.editorName,
      onOpen: () => onOpenFeedPost(post.id),
      onUnsave: () => onToggleSaveFeedPost(post.id),
    }));

  // 전체: 장소와 피드를 번갈아 배치
  const allItems: SavedCardItem[] = [];
  for (let i = 0; i < Math.max(placeItems.length, feedItems.length); i++) {
    if (placeItems[i]) allItems.push(placeItems[i]);
    if (feedItems[i]) allItems.push(feedItems[i]);
  }

  const visibleItems = filter === 'place' ? placeItems : filter === 'feed' ? feedItems : allItems;
  const filters: { id: SavedFilter; label: string; count: number }[] = [
    { id: 'all', label: '전체', count: allItems.length },
    { id: 'place', label: '장소', count: placeItems.length },
    { id: 'feed', label: '피드', count: feedItems.length },
  ];

  return (
    <div className="pt-3.5 pb-24">
      {/* 개수 + 안내 문구 */}
      <div className="px-1 space-y-1.5 text-left">
        <div className="text-[24px] font-bold text-brand leading-none tracking-tight">
          {allItems.length}곳
        </div>
        <p className="text-[15px] text-ink-muted tracking-tight">마음에 담아둔 곳, 천천히 걸어봐요.</p>
      </div>

      {allItems.length === 0 ? (
        <div className="mx-1 mt-6 bg-white rounded-3xl p-8 border border-line text-center space-y-4">
          <BidoCharacter pose="unregistered" size="card" className="mx-auto" />
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-ink">아직 찜한 곳이 없어요</h2>
            <p className="text-xs text-ink/60">마음에 드는 장소나 피드에 하트를 눌러 모아보세요.</p>
          </div>
          <button
            onClick={onNavigateToPlaces}
            className="px-5 py-2.5 rounded-xl bg-brand text-white text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <span>행운의 장소 둘러보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <>
          {/* 필터 칩 */}
          <div className="px-1 mt-4 flex gap-2">
            {filters.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={isActive}
                  className={`h-8 px-3 rounded-full text-[15px] leading-8 tracking-tight flex items-center gap-1 transition-colors ${
                    isActive ? 'bg-brand text-white' : 'bg-brand-tint text-brand'
                  }`}
                >
                  <span className="font-bold">{f.label}</span>
                  <span className={isActive ? 'font-bold' : 'text-ink-muted'}>{f.count}</span>
                </button>
              );
            })}
          </div>

          {/* 2열 카드 그리드 */}
          {visibleItems.length === 0 ? (
            <p className="mt-10 text-center text-sm text-ink-muted">
              {filter === 'feed' ? '찜한 피드가 없어요.' : '찜한 장소가 없어요.'}
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5">
              {visibleItems.map((item) => (
                <li key={item.key}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={item.onOpen}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.onOpen();
                      }
                    }}
                    className="cursor-pointer active:opacity-80 transition-opacity"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-tint">
                          <Sparkles className="w-6 h-6 text-brand/60" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 h-5 px-[5px] rounded-md bg-white text-[12px] leading-5 font-bold text-ink">
                        {item.kind === 'place' ? '장소' : '피드'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onUnsave();
                        }}
                        aria-label={`${item.title} 찜 해제`}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/25 flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <Heart className="w-5 h-5 fill-heart text-heart" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="px-2.5 mt-2">
                      <p className="h-10 text-[16px] leading-5 font-bold tracking-tight text-ink line-clamp-2 break-keep">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[13px] leading-[18px] text-ink-muted truncate">{item.meta}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};
