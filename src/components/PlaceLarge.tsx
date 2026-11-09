import React from 'react';
import { LuckyPlace, ElementKey } from '../types';
import { ELEMENTS } from '../data/mockData';
import { Heart } from 'lucide-react';

export interface PlaceLargeProps {
  place: LuckyPlace;
  isSaved?: boolean;
  element?: ElementKey;
  customTags?: string[];
  className?: string;
  onOpenDetail?: (place: LuckyPlace) => void;
  onToggleSave?: (placeId: string) => void;
}

/**
 * place_large (PlaceLargeCard)
 * Figma 디자인 기준 대형 장소 카드 컴포넌트:
 * - 1.75:1 비율의 대표 이미지 (상단 라운드 처리, 오버레이 없음)
 * - 장소 이름 + 찜(하트 아웃라인) 버튼
 * - 연한 녹색 Pill 태그 (오행, 설화, 민화, 지역 등)
 * - 장소 설명 텍스트
 */
export const PlaceLarge: React.FC<PlaceLargeProps> = ({
  place,
  isSaved = false,
  element,
  customTags,
  className = '',
  onOpenDetail,
  onToggleSave,
}) => {
  const elementKey = element || place.element || 'water';
  const elementInfo = ELEMENTS[elementKey] || ELEMENTS.water;

  // 태그 목록 구성: 水 물, 전설, 민화, 지역
  const tags = customTags || [
    `${elementInfo.hanja} ${elementInfo.name.split(' · ')[0]}`,
    ...(place.storyTags && place.storyTags.length > 0
      ? place.storyTags
      : ['전설', '민화']),
    place.location && place.location.includes('곡성')
      ? place.location
      : place.region || '전남 곡성',
  ];

  return (
    <article
      onClick={() => onOpenDetail?.(place)}
      className={`w-full bg-white rounded-[16px] overflow-hidden border border-line shadow-2xs cursor-pointer active:scale-[0.99] transition-transform text-left ${className}`}
    >
      {/* 1. 장소 대표 이미지: 1.75:1 가로 비율, 상단 모서리 둥글게, 오버레이 없음 */}
      <div className="w-full aspect-[1.75/1] overflow-hidden bg-stone-100 relative">
        <img
          src={place.heroImage || '/seomjin_sunny_river.png'}
          alt={place.name}
          className="w-full h-full object-cover select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 2 & 3 & 4. 장소 정보 영역 */}
      <div className="p-4 sm:p-5 bg-white">
        {/* 2. 장소 이름 및 찜 버튼 */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-place-title font-bold text-ink tracking-tight truncate">
            {place.name.replace(/ 길$/, '')}
          </h3>
          {onToggleSave && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(place.id);
              }}
              className="p-1 -mr-1 text-brand-deep hover:opacity-80 active:scale-90 transition-transform shrink-0"
              aria-label="찜하기"
            >
              <Heart
                className={`w-6 h-6 stroke-[1.8] ${
                  isSaved
                    ? 'fill-heart text-heart'
                    : 'text-brand-deep'
                }`}
              />
            </button>
          )}
        </div>

        {/* 3. 장소 태그: 水 물, 전설, 민화, 전남 곡성 (연한 녹색 배경, 짙은 녹색 텍스트, 둥근 Pill) */}
        <div className="flex items-center flex-wrap gap-2 mt-2.5">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-tag font-medium text-brand-deep bg-tag-tint px-2.5 py-1 rounded-full leading-none"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 4. 장소 설명 */}
        <p className="text-desc text-ink-subtle mt-3">
          {place.subtitle || place.hook || '장군을 도운 도깨비들의 이야기가 전해지는 곳'}
        </p>
      </div>
    </article>
  );
};
