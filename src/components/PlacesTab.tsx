import React, { useState, useMemo } from 'react';
import { LuckyPlace, ElementKey } from '../types';
import { ELEMENTS } from '../data/mockData';
import { Heart, X } from 'lucide-react';

interface PlacesTabProps {
  places: LuckyPlace[];
  savedPlaceIds: string[];
  birthDate: string;
  hasGpsPermission: boolean;
  todayElement: ElementKey;
  onToggleSave: (placeId: string) => void;
  onOpenPlaceDetail: (place: LuckyPlace) => void;
  /** '비도가 발견한 오늘의 행운 장소'에서 장소를 연 경우 (없으면 onOpenPlaceDetail 사용) */
  onOpenTodayPick?: (place: LuckyPlace) => void;
  onRequestBirthDate?: () => void;
  onRequestGps?: () => void;
}

interface CategoryItem {
  id: string;
  name: string;
  desc: string;
  image: string;
}

// 7대 카테고리 (전체, 전설, 건강, 용기, 인연, 학업, 재물)
const CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    name: '전체',
    desc: '모든 행운의 장소를 둘러보는 여정',
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'legend',
    name: '전설',
    desc: '신비로운 설화와 도깨비 전설이 깃든 장소',
    image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'health',
    name: '건강',
    desc: '맑은 숨과 피톤치드가 넘치는 치유의 숲길',
    image: '/images/place_woljeongsa_fir_1791770475183.jpg',
  },
  {
    id: 'courage',
    name: '용기',
    desc: '단단한 기운과 선명한 의지로 액운을 털어내는 명소',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'connection',
    name: '인연',
    desc: '소중한 인연과 따뜻한 마음의 온기를 채우는 길',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'study',
    name: '학업',
    desc: '지혜와 맑은 집중력을 북돋아주는 고요한 명소',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'wealth',
    name: '재물',
    desc: '황금빛 풍요와 번영의 복을 부르는 터전',
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=300&q=80',
  },
];

export const PlacesTab: React.FC<PlacesTabProps> = ({
  places,
  savedPlaceIds,
  hasGpsPermission,
  todayElement,
  onToggleSave,
  onOpenPlaceDetail,
  onOpenTodayPick,
}) => {
  // Sorting: 'recommended' (백엔드 추천순) or 'nearby' (거리순)
  const [sortBy, setSortBy] = useState<'recommended' | 'nearby'>('recommended');

  // Selected Category filter (기본값: 'all' 전체 선택)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');


  // 특별 추천 장소 목록 (스크린샷처럼 오늘의 추천 속성 및 점수에 맞춘 캐러셀)
  const specialPlaces = useMemo(() => {
    return [...places]
      .sort((a, b) => {
        if (a.element === todayElement && b.element !== todayElement) return -1;
        if (b.element === todayElement && a.element !== todayElement) return 1;
        return a.distanceKm - b.distanceKm;
      })
      .slice(0, 5);
  }, [places, todayElement]);

  // Overall place list sorted according to backend response
  const sortedPlaces = useMemo(() => {
    const list = [...places];
    if (sortBy === 'nearby' && hasGpsPermission) {
      return list.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    // Default backend recommendation ordering
    return list.sort((a, b) => {
      if (a.element === todayElement && b.element !== todayElement) return -1;
      if (b.element === todayElement && a.element !== todayElement) return 1;
      return 0;
    });
  }, [places, sortBy, hasGpsPermission, todayElement]);

  // Filter places based on selected category (전체/전설/건강/용기/인연/학업/재물)
  const filteredPlaces = useMemo(() => {
    if (selectedCategory === 'all') return sortedPlaces;
    const filtered = sortedPlaces.filter((place) => {
      if (selectedCategory === 'legend') {
        return (
          place.storyTags.some((t) => t.includes('전설') || t.includes('도깨비') || t.includes('신목')) ||
          place.subtitle.includes('설화') ||
          place.name.includes('도깨비')
        );
      }
      if (selectedCategory === 'health') {
        return (
          place.storyTags.some((t) => t.includes('치유') || t.includes('보호수') || t.includes('전나무')) ||
          place.element === 'wood' ||
          place.walkingInfo.difficulty === '완만함'
        );
      }
      if (selectedCategory === 'courage') {
        return (
          place.storyTags.some((t) => t.includes('바위') || t.includes('결단') || t.includes('신목')) ||
          place.element === 'metal' ||
          place.element === 'fire'
        );
      }
      if (selectedCategory === 'connection') {
        return (
          place.storyTags.some((t) => t.includes('인연') || t.includes('물길') || t.includes('치유') || t.includes('사랑')) ||
          place.element === 'water' ||
          place.element === 'fire'
        );
      }
      if (selectedCategory === 'study') {
        return (
          place.storyTags.some((t) => t.includes('보호수') || t.includes('신목') || t.includes('지혜')) ||
          place.element === 'metal' ||
          place.element === 'water'
        );
      }
      if (selectedCategory === 'wealth') {
        return (
          place.storyTags.some((t) => t.includes('도깨비') || t.includes('복') || t.includes('재물')) ||
          place.element === 'earth' ||
          place.element === 'metal'
        );
      }
      return true;
    });
    // Fallback: if category filter yields 0 items, keep full list to prevent blank screen
    return filtered.length > 0 ? filtered : sortedPlaces;
  }, [sortedPlaces, selectedCategory]);

  return (
    <div className="space-y-6 pb-24 pt-1">
      {/* ────────────────────────────────────────────────────────
          1. [카테고리 영역]: 어디로 여행 가세요?
          전설 / 민화 / 애정운 / 학업운 / 건강운 / 금전운 (원형 가이드 이미지)
         ──────────────────────────────────────────────────────── */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-base font-bold text-ink tracking-tight">
            어디로 여행 가세요?
          </h2>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-[11px] font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span>전체 보기</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 7 Circular Category Items (전체, 전설, 건강, 용기, 인연, 학업, 재물) */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 pt-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(isSelected && cat.id !== 'all' ? 'all' : cat.id)
                }
                className="flex flex-col items-center text-center group cursor-pointer active:scale-95 transition-transform"
              >
                {/* Circular Guide Image */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden relative shadow-2xs transition-all duration-200 bg-stone-100 ${
                    isSelected
                      ? 'ring-3 ring-brand ring-offset-2 scale-105 shadow-md'
                      : 'border border-line group-hover:border-brand/50'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-brand/25 backdrop-blur-2xs flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                    </div>
                  )}
                </div>

                {/* Category Label */}
                <span
                  className={`text-xs mt-1.5 tracking-tight transition-colors ${
                    isSelected
                      ? 'font-bold text-brand'
                      : 'font-medium text-ink/80 group-hover:text-ink'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          2. [특별한 장소 영역]: 비도가 발견한 오늘의 행운 장소
          (F6F3EA 배경, 2.5개 카드 노출 및 20px 좌우 마진 엣지-투-엣지 스크롤)
         ──────────────────────────────────────────────────────── */}
      <section className="-mx-4 py-5 bg-hanji border-y border-hanji-line space-y-3">
        <div className="px-5">
          <h2 className="text-base sm:text-lg font-bold text-ink tracking-tight">
            비도가 발견한 오늘의 행운 장소
          </h2>
          <p className="text-xs text-ink/65 mt-0.5 tracking-tight font-medium">
            오늘의 물 기운과 어울리는 장소들을 찾아왔어!
          </p>
        </div>

        {/* Horizontal Card Carousel: 2.5개 카드 노출 & 20px 좌우 여백 엣지-투-엣지 스크롤 */}
        <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 scrollbar-none">
          {specialPlaces.map((place) => {
            const el = ELEMENTS[place.element] || ELEMENTS.water;
            const isSaved = savedPlaceIds.includes(place.id);
            // Derive badges: element badge (e.g. "水 물"), category/story tag 1, category/story tag 2
            const tag1 = place.storyTags[0] || '전설';
            const tag2 = place.storyTags[1] || '재물';

            return (
              <article
                key={place.id}
                onClick={() => (onOpenTodayPick ?? onOpenPlaceDetail)(place)}
                className="w-[140px] sm:w-[150px] shrink-0 bg-white rounded-2xl overflow-hidden border border-[#E5E1D5] shadow-2xs cursor-pointer active:scale-[0.98] transition-transform flex flex-col"
              >
                {/* Landscape Photo */}
                <div className="h-24 sm:h-26 w-full overflow-hidden bg-stone-100 relative">
                  <img
                    src={place.heroImage}
                    alt={place.name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Card Content */}
                <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  {/* Row 1: Name + Distance + Heart */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-baseline gap-1 min-w-0">
                      <h3 className="text-[13px] font-bold text-ink truncate">
                        {place.name.split(' ')[0]}
                      </h3>
                      <span className="text-[10px] text-ink/50 shrink-0 font-normal">
                        {place.distanceKm}km
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(place.id);
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-ink/40 active:scale-90 transition-transform shrink-0 -mr-0.5"
                      aria-label="찜하기"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isSaved
                            ? 'fill-heart text-heart'
                            : 'text-ink/60 stroke-[1.6]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Row 2: Badges (水 물, 전설, 재물운) */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="inline-flex items-center text-[9.5px] font-semibold text-brand bg-[#EAF3EE] px-1.5 py-0.5 rounded leading-none">
                      {el.hanja} {el.name.split(' · ')[0]}
                    </span>
                    <span className="inline-flex items-center text-[9.5px] font-medium text-ink/70 bg-[#F0F2F1] px-1.5 py-0.5 rounded leading-none">
                      {tag1}
                    </span>
                    <span className="inline-flex items-center text-[9.5px] font-medium text-ink/70 bg-[#F0F2F1] px-1.5 py-0.5 rounded leading-none">
                      {tag2}
                    </span>
                  </div>

                  {/* Row 3: Description Hook */}
                  <p className="text-[10.5px] text-ink/75 leading-tight line-clamp-2 mt-0.5">
                    {place.hook || place.subtitle}
                  </p>
                </div>
              </article>
            );
          })}
          {/* Right-end spacer to guarantee 20px padding when scrolled to the end */}
          <div className="w-1 shrink-0 pointer-events-none" />
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          3. [구글 배너 광고 영역]: 특별한 장소 바로 아래 배치
          테두리 radius 0, 왼쪽 여백 0, 오른쪽 여백 0 (-mx-4 rounded-none)
         ──────────────────────────────────────────────────────── */}
      <section className="-mx-4 bg-surface-sunken rounded-none py-3 px-4 border-y border-line relative overflow-hidden transition-all">
        <div className="flex items-center justify-between gap-3">
          {/* Ad Copy */}
          <div className="flex-1 min-w-0 pr-1 text-left">
            <span className="text-[10.5px] text-ink/60 font-medium block truncate">
              럭셔리 풀빌라, 프리미엄 혜택까지 한 번에 !!
            </span>
            <p className="text-sm font-bold text-[#0284C7] tracking-tight mt-0.5 truncate">
              빌라 드 코라이 그랑엘리아 나트랑
            </p>
            {/* Ad Indicators & Pagination Dots */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[9px] font-bold text-ink/40 border border-ink/20 rounded px-1 leading-tight">
                AD
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
                <span className="w-1.5 h-1.5 rounded-full bg-ink/25" />
                <span className="w-1.5 h-1.5 rounded-full bg-ink/25" />
                <span className="w-1.5 h-1.5 rounded-full bg-ink/25" />
              </div>
              <span className="text-[9px] text-ink/40 ml-1">
                Google 광고
              </span>
            </div>
          </div>

          {/* Ad Scenic Thumbnail */}
          <div className="w-20 h-14 rounded-lg overflow-hidden bg-stone-200 shrink-0 shadow-2xs relative">
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80"
              alt="빌라 드 코라이 나트랑 리조트"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          4. [전체 행운의 장소] 세로 리스트
         ──────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        {/* Section Header with Sort Option */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-ink tracking-tight flex items-center gap-1.5">
            <span>
              {selectedCategory !== 'all'
                ? `${CATEGORIES.find((c) => c.id === selectedCategory)?.name} 추천 장소`
                : '전체 행운의 장소'}
            </span>
            <span className="text-xs font-normal text-ink/40">
              ({filteredPlaces.length})
            </span>
          </h2>

          {/* Sort Controls */}
          {hasGpsPermission ? (
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setSortBy('recommended')}
                className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                  sortBy === 'recommended'
                    ? 'bg-brand text-white font-bold'
                    : 'text-ink/60 bg-white border border-line'
                }`}
              >
                추천순
              </button>
              <button
                onClick={() => setSortBy('nearby')}
                className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                  sortBy === 'nearby'
                    ? 'bg-brand text-white font-bold'
                    : 'text-ink/60 bg-white border border-line'
                }`}
              >
                가까운 순
              </button>
            </div>
          ) : (
            <span className="text-xs text-ink/50">
              총 {filteredPlaces.length}곳
            </span>
          )}
        </div>

        {/* Vertical List of Places */}
        {/* 카드: 테두리·배경 없음, 좌측 사진(157×118, 모서리 8px) + 우측 제목/칩/설명, 우상단 찜 */}
        <div className="space-y-4">
          {filteredPlaces.map((place) => {
            const el = ELEMENTS[place.element] || ELEMENTS.water;
            const isSaved = savedPlaceIds.includes(place.id);
            const chips = [`${el.hanja} ${el.name.split(' · ')[0]}`, ...place.storyTags.slice(0, 2)];

            return (
              <article
                key={place.id}
                onClick={() => onOpenPlaceDetail(place)}
                className="flex items-start gap-3 cursor-pointer active:opacity-80 transition-opacity"
              >
                {/* Thumbnail Image */}
                <div className="w-[157px] h-[118px] rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={place.heroImage}
                    alt={place.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pt-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[15px] font-bold text-ink tracking-tight leading-snug truncate">
                      {place.name}
                    </h3>
                    {/* Save Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(place.id);
                      }}
                      className="-mt-1 -mr-1 p-1 shrink-0 active:scale-90 transition-transform"
                      aria-label={isSaved ? '찜 해제' : '찜하기'}
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          isSaved ? 'fill-heart text-heart' : 'text-ink-muted'
                        }`}
                        strokeWidth={1.75}
                      />
                    </button>
                  </div>

                  {/* Chips: 오행 + 이야기 태그 */}
                  <div className="mt-1.5 flex flex-wrap gap-[5px]">
                    {chips.map((chip) => (
                      <span
                        key={chip}
                        className="px-[5px] py-[2px] rounded-[4px] bg-brand-tint text-brand text-[11px] leading-[14px] font-bold"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 text-[13px] leading-[21px] text-ink-muted line-clamp-2">
                    {place.subtitle}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
