import React from 'react';
import { LuckyPlace, ElementKey } from '../types';
import { ELEMENTS, FORTUNE_SENTENCES } from '../data/mockData';
import { BidoCharacter } from './character/BidoCharacter';
import { PlaceLarge } from './PlaceLarge';
import { ArrowRight } from 'lucide-react';

interface HomeTabProps {
  birthDate: string;
  hasGpsPermission: boolean;
  todayElement: ElementKey;
  heroPlace: LuckyPlace;
  savedPlaceIds: string[];
  onRequestBirthDate: () => void;
  onRequestGps: () => void;
  onOpenPlaceDetail: (place: LuckyPlace) => void;
  onNavigateToPlaces: () => void;
  onToggleSave: (placeId: string) => void;
}

// 오행별 속성 한글 이름, 한자 및 오늘의 운세 점수 (이전 버전 복원)
const ATTRIBUTE_DATA: Record<
  ElementKey,
  { koreanWord: string; hanja: string; score: number }
> = {
  water: {
    koreanWord: '물',
    hanja: '水',
    score: 95,
  },
  wood: {
    koreanWord: '나무',
    hanja: '木',
    score: 92,
  },
  fire: {
    koreanWord: '불',
    hanja: '火',
    score: 88,
  },
  earth: {
    koreanWord: '바위',
    hanja: '土',
    score: 96,
  },
  metal: {
    koreanWord: '금',
    hanja: '金',
    score: 90,
  },
};

export const HomeTab: React.FC<HomeTabProps> = ({
  birthDate,
  todayElement,
  heroPlace,
  savedPlaceIds,
  onRequestBirthDate,
  onOpenPlaceDetail,
  onNavigateToPlaces,
  onToggleSave,
}) => {
  const isBirthDateRegistered = Boolean(birthDate && birthDate.trim().length > 0);
  const elementInfo = ELEMENTS[todayElement] || ELEMENTS.water;
  const fortuneSentence = FORTUNE_SENTENCES[todayElement] || FORTUNE_SENTENCES.water;
  const isHeroSaved = savedPlaceIds.includes(heroPlace.id);

  // 현재 운세 속성 데이터 (기본값: 수속성 '물', 95점)
  const currentAttr = ATTRIBUTE_DATA[todayElement] || ATTRIBUTE_DATA.water;

  // 장소 태그 리스트: 水 물, 전설, 민화, 전남 곡성
  const placeTags = [
    `${elementInfo.hanja} ${currentAttr.koreanWord}`,
    ...(heroPlace.storyTags && heroPlace.storyTags.length > 0
      ? heroPlace.storyTags
      : ['전설', '민화']),
    heroPlace.location && heroPlace.location.includes('곡성')
      ? heroPlace.location
      : '전남 곡성',
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* ────────────────────────────────────────────────────────
          이전 버전 복원: 오늘 추천 속성, 운세 점수, 중앙 도깨비 위치 & 도깨비불
         ──────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center pt-2 pb-[31px]">
        {/* 도깨비 영역 (390px 시안 실측, 기준점 = 이 영역 왼쪽 위)
            - 왼쪽 정보: 가운데 x 57px / 라벨 13px 회색, 속성 22px 오행색, 점수 32px
            - 도깨비: 226×295px, 왼쪽 93px · 위 -22px (투명 여백 포함)
            - 도깨비불: 48×62px, 도깨비 기준 왼쪽 189px · 위 45px
            - 영역 높이 235px → 바로 아래 말풍선 꼬리 */}
        <div className="relative w-full max-w-sm h-[235px] mt-1">
          <div className="absolute left-0 top-5 w-[114px] flex flex-col items-center z-20">
            <span className="text-[13px] leading-[18px] text-ink-muted tracking-tight">오늘 추천 속성</span>
            <span className="mt-[7px] text-[22px] leading-7 font-bold tracking-tight" style={{ color: elementInfo.color }}>
              {currentAttr.koreanWord}
            </span>
            <span className="mt-[22px] text-[13px] leading-[18px] text-ink-muted tracking-tight">운세 점수</span>
            <span className="mt-0.5 text-[32px] leading-[38px] font-black text-ink tracking-tighter">
              {currentAttr.score}점
            </span>
          </div>

          <div className="absolute left-[93px] -top-[22px]">
            <BidoCharacter
              pose={isBirthDateRegistered ? 'guiding' : 'unregistered'}
              size="stage"
              element={todayElement}
              showFlame={true}
            />
          </div>
        </div>

        {/* 비도의 한마디 말풍선: 좌우 끝선 = 본문 여백, 문장은 너비에 맞춰 자연스럽게 줄바꿈 */}
        <div className="relative w-full max-w-sm">
          <div className="w-3.5 h-3.5 bg-hanji border-l border-t border-line-warm rotate-45 mx-auto -mb-2 z-10 relative" />
          <div className="bg-hanji border border-line-warm rounded-[22px] px-6 py-6 text-center">
            <p className="text-fortune text-ink break-keep text-center">
              {fortuneSentence.replace(/\n/g, ' ')}
            </p>
          </div>
        </div>

        {/* 생년월일 미등록 상태일 때 나타나는 간결한 CTA 버튼 */}
        {!isBirthDateRegistered && (
          <div className="w-full max-w-sm mt-3">
            <button
              onClick={onRequestBirthDate}
              className="w-full h-12 rounded-[16px] bg-brand-deep text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-transform"
            >
              <span>행운 보러가기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* ────────────────────────────────────────────────────────
          행운의 장소 섹션: 비도가 발견한 오늘의 행운 장소 & 개편 카드
         ──────────────────────────────────────────────────────── */}
      <section className="pt-1">
        {/* 행운의 장소 섹션 헤더 */}
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-[18px] font-bold text-ink tracking-tight">
            비도가 발견한 오늘의 행운 장소
          </h2>
          <button
            onClick={onNavigateToPlaces}
            className="text-[14px] font-semibold text-brand-deep hover:opacity-80 transition-opacity flex items-center gap-0.5"
          >
            <span>더보기</span>
            <span className="text-[13px] font-bold ml-0.5">&gt;</span>
          </button>
        </div>

        {/* 행운의 장소 대형 카드 컴포넌트 (place_large) */}
        <PlaceLarge
          place={heroPlace}
          isSaved={isHeroSaved}
          customTags={placeTags}
          onOpenDetail={onOpenPlaceDetail}
          onToggleSave={onToggleSave}
        />
      </section>
    </div>
  );
};
