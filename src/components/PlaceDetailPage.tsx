import React, { useState } from 'react';
import { LuckyPlace } from '../types';
import { ELEMENTS } from '../data/mockData';
import { ArrowLeft, Heart, Share, MapPin, BusFront, Waves, Sparkles, Sparkle, Ghost } from 'lucide-react';

interface PlaceDetailPageProps {
  place: LuckyPlace;
  isSaved: boolean;
  /** 비도가 이곳을 찾은 이유 카드 노출 여부 (생년월일 등록 + '비도가 발견한 오늘의 행운 장소'에서 진입한 경우만) */
  showBidoReason?: boolean;
  onToggleSave: (id: string) => void;
  onBack: () => void;
}

export const PlaceDetailPage: React.FC<PlaceDetailPageProps> = ({
  place,
  isSaved,
  showBidoReason = false,
  onToggleSave,
  onBack,
}) => {
  const elementInfo = ELEMENTS[place.element] || ELEMENTS.water;

  // 상단 이미지 (현재 데이터는 대표 사진 1장, 여러 장이 되면 스와이프)
  const heroImages = [place.heroImage];
  const [heroIndex, setHeroIndex] = useState(0);

  // 근처 장소 찜 (데모: 화면 안에서만 유지)
  const [savedSpotNames, setSavedSpotNames] = useState<string[]>([]);
  const toggleSpotSaved = (name: string) =>
    setSavedSpotNames((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  // 주소: 상세 주소가 없으면 지역명 표시
  const address = place.address || place.location;
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // 클립보드 접근 불가 시 무시
    }
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 1500);
  };

  // 태그: 이야기 태그 2개 → 오행 → 나머지 이야기 태그 (예: 전설, 민화, 水 물)
  const elementChip = `${elementInfo.hanja} ${elementInfo.name.split(' · ')[0]}`;
  const tags = [...place.storyTags.slice(0, 2), elementChip, ...place.storyTags.slice(2)];

  const handleShare = async () => {
    const text = `[HOROHORO 호로호로] 오늘의 행운 산책지: ${place.name} (${place.location})\n“${place.hook}”\n함께 걸어볼까요?`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('장소 링크와 소개가 복사되었습니다!');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* 1. 앱바: 사진 위에 떠 있는 흰색 원형 버튼 (스크롤해도 상단 고정) */}
      <header className="sticky top-0 z-30 h-0">
        <div
          className="absolute inset-x-0 top-0 px-5 flex items-center justify-between"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
        >
          <button
            onClick={onBack}
            aria-label="뒤로가기"
            className="w-9 h-9 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)] flex items-center justify-center text-ink active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(place.id)}
              aria-label={isSaved ? '찜 해제' : '찜하기'}
              className="w-9 h-9 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-90 transition-transform"
            >
              <Heart
                className={`w-5 h-5 ${isSaved ? 'fill-heart text-heart' : 'text-ink'}`}
                strokeWidth={2}
              />
            </button>
            <button
              onClick={handleShare}
              aria-label="공유하기"
              className="w-9 h-9 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)] flex items-center justify-center text-ink active:scale-90 transition-transform"
            >
              <Share className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. 상단 이미지: 화면 꽉 채움, 좌우 스와이프, 하단 중앙 페이지 표시 */}
      <div className="relative w-full aspect-[390/276] bg-stone-100">
        <div
          onScroll={(e) => {
            const el = e.currentTarget;
            setHeroIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {heroImages.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`${place.name} 사진 ${i + 1}`}
              className="w-full h-full shrink-0 snap-start object-cover"
              referrerPolicy="no-referrer"
              draggable={false}
            />
          ))}
        </div>
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 h-6 px-3 rounded-full bg-white/90 text-[13px] leading-6 font-medium text-ink-muted tabular-nums pointer-events-none">
          {heroIndex + 1} / {heroImages.length}
        </span>
      </div>

      {/* 3. 제목 + 주소 + 태그 */}
      <section className="px-5 pt-2.5">
        <h1 className="text-[26px] leading-[34px] font-bold tracking-tight text-ink">
          {place.name}
        </h1>
        <div className="mt-2 flex items-center gap-1.5 text-[14px] leading-5">
          <MapPin className="w-4 h-4 shrink-0 text-ink-muted" strokeWidth={2} />
          <span className="text-ink-muted min-w-0">{address}</span>
          <button
            type="button"
            onClick={handleCopyAddress}
            className="shrink-0 ml-0.5 font-bold text-ink active:opacity-60"
          >
            {isAddressCopied ? '복사됨' : '복사'}
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="h-[26px] px-2 rounded-full bg-[#E8EBE8] text-[#305546] text-[14px] leading-[26px] font-bold"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 4. Page Content Canvas */}
      <div className="p-4 pt-6 space-y-6">
        {/* 비도가 이곳을 찾은 이유 (생년월일 등록 + 오늘의 행운 장소에서 진입 시에만) */}
        {showBidoReason && (
          <section className="mx-1 mb-8 rounded-[20px] bg-brand-tint p-5">
            <h2 className="flex items-center gap-2 text-[18px] leading-[26px] font-bold tracking-tight text-ink">
              <Ghost className="w-5 h-5 text-brand shrink-0" strokeWidth={2} />
              비도가 이곳을 찾은 이유
            </h2>
            <p className="mt-3 text-[14px] leading-[21px] text-ink-muted">{place.whyRecommended}</p>
            <div className="mt-3 flex gap-2">
              {[
                { icon: <Sparkle className="w-5 h-5" strokeWidth={2.25} />, label: '추천 아이템', value: place.luckyItem },
                { icon: <SquiggleIcon />, label: '걷기 거리', value: place.walkingInfo.distance },
                { icon: <Waves className="w-5 h-5" strokeWidth={2.25} />, label: '난이도', value: place.walkingInfo.difficulty },
              ]
                .filter((item) => item.value)
                .map((item) => (
                  <div
                    key={item.label}
                    className="flex-1 min-w-0 h-[86px] rounded-xl bg-white flex flex-col items-center justify-center text-center"
                  >
                    <span className="h-5 flex items-center text-brand">{item.icon}</span>
                    <span className="mt-1.5 text-[13px] leading-[18px] text-ink-muted">{item.label}</span>
                    <span className="mt-[3px] text-[15px] leading-5 font-bold text-ink">{item.value}</span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* 장소 이야기 + 찾아가는 길 & 안전 안내 (카드 없이 텍스트 섹션, 좌우 20px, 섹션 간격 32px) */}
        <div className="px-1 space-y-8">
          {/* 장소 이야기: 한 줄 소개 + 문단 (문단 사이 한 줄 간격) */}
          <section>
            <h2 className="text-[18px] leading-[26px] font-bold tracking-tight text-ink">
              장소 이야기
            </h2>
            <div className="mt-2.5 space-y-[21px] text-[14px] leading-[21px] text-ink">
              <p>{place.story30s.hook}</p>
              {place.story30s.body.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </section>

          {/* 찾아가는 길 & 안전 안내 */}
          <section>
            <h2 className="text-[18px] leading-[26px] font-bold tracking-tight text-ink">
              찾아가는 길 &amp; 안전 안내
            </h2>
            <ul className="mt-3 space-y-3">
              {[
                { Icon: BusFront, color: 'text-brand', title: '대중교통 & 접근', text: place.accessInfo.transport },
                { Icon: MapPin, color: 'text-brand', title: '주차 정보', text: place.accessInfo.parking },
                { Icon: Waves, color: 'text-[#B49554]', title: '안전 수칙', text: place.accessInfo.safetyTip },
              ].map(({ Icon, color, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="h-6 flex items-center shrink-0">
                    <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.25} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[16px] leading-6 font-bold text-ink">{title}</p>
                    <p className="mt-1 text-[14px] leading-[21px] text-ink-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 근처 함께 가볼 곳: 카드 없이 리스트 (썸네일 72px + 분류/이름/설명 + 우측 찜) */}
          <section>
            <h2 className="text-[18px] leading-[26px] font-bold tracking-tight text-ink">
              근처 함께 가볼 곳
            </h2>
            <ul className="mt-4 space-y-4">
              {place.nearbySpots.map((spot) => {
                const isSpotSaved = savedSpotNames.includes(spot.name);
                return (
                  <li key={spot.name} className="flex items-center gap-3">
                    <div className="w-[72px] h-[72px] rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      {spot.image ? (
                        <img
                          src={spot.image}
                          alt={spot.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-sunken">
                          <Sparkles className="w-5 h-5 text-brand/60" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] leading-[18px] text-ink-muted">{spot.category}</p>
                      <p className="mt-0.5 text-[16px] leading-[22px] font-bold tracking-tight text-ink truncate">
                        {spot.name}
                      </p>
                      <p className="mt-0.5 text-[14px] leading-[21px] text-ink-muted truncate">
                        {spot.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSpotSaved(spot.name)}
                      aria-label={isSpotSaved ? `${spot.name} 찜 해제` : `${spot.name} 찜하기`}
                      className="p-1 -mr-1 shrink-0 active:scale-90 transition-transform"
                    >
                      <Heart
                        className={`w-6 h-6 ${isSpotSaved ? 'fill-heart text-heart' : 'text-ink-muted'}`}
                        strokeWidth={1.75}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

/** 걷기 거리 아이콘: 세로로 쌓인 짧은 물결 3줄 */
const SquiggleIcon: React.FC = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M2 4c1.5-1.6 2.5-1.6 4 0s2.5 1.6 4 0 2.5-1.6 4 0" />
    <path d="M2 10c1.5-1.6 2.5-1.6 4 0s2.5 1.6 4 0 2.5-1.6 4 0" />
    <path d="M2 16c1.5-1.6 2.5-1.6 4 0s2.5 1.6 4 0 2.5-1.6 4 0" />
  </svg>
);
