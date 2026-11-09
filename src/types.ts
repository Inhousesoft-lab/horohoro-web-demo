export type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface ElementInfo {
  key: ElementKey;
  hanja: string;
  name: string;
  nature: string;
  color: string;
  textColor: string;
  badgeBg: string;
}

export interface LuckyPlace {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  address?: string; // 도로명 상세 주소 (상세 화면 표시·복사용)
  region: '전국' | '서울' | '경기' | '강원' | '충청' | '전라' | '경상' | '제주';
  element: ElementKey;
  distanceKm: number; // 거리 (예: 1.2, 3.4, 5.8)
  storyTags: string[];
  heroImage: string;
  hook: string;
  whyRecommended: string;
  luckyItem?: string; // 비도 추천 아이템 (예: 모자)
  walkingInfo: {
    distance: string;
    duration: string;
    difficulty: '완만함' | '보통' | '약간 오르막';
    elevation: string;
    steps: number;
  };
  story30s: {
    hook: string;
    body: string[];
    whatToSee: string;
    bidoQuote: string;
  };
  accessInfo: {
    transport: string;
    parking: string;
    safetyTip: string;
  };
  nearbySpots: {
    category: '카페' | '로컬미식' | '특산물' | '전통체험';
    name: string;
    description: string;
    image?: string;
  }[];
  isSaved?: boolean;
  isVisited?: boolean;
}

/**
 * 5 Five Elements AI Dokkaebi Editors:
 * 화비 : 축제·행사 (Fire)
 * 목비 : 숲·계절·자연 (Wood)
 * 수비 : 강·바다·물 (Water)
 * 금비 : 지역 보물·숨은 명소 (Metal)
 * 토비 : 역사·전설·민화·K-Folk (Earth)
 */
export type EditorId = 'hwabi' | 'mokbi' | 'subi' | 'geumbi' | 'tobi';

export interface EditorInfo {
  id: EditorId;
  name: string; // 화비, 목비, 수비, 금비, 토비
  element: ElementKey;
  role: string; // 축제·행사, 숲·계절·자연, 강·바다·물, 지역 보물·숨은 명소, 역사·전설·민화·K-Folk
  avatarBg: string;
  flameColor: string;
  description: string;
}

export interface FeedPostLocationTag {
  name: string; // e.g. "전남 곡성 도깨비마을", "섬진강 두꺼비마을"
  placeId?: string; // Optional reference to a LuckyPlace ID
}

export interface CourseStop {
  step: number; // 1, 2, 3
  name: string; // e.g. "화담숲", "곤지암 소머리국밥", "광주 경안전통시장"
  subname?: string; // "생명의 숲길 산책", "로컬 미식 한 그릇", "정겨운 전통장터"
  time?: string; // e.g. "10:30", "13:00", "15:30"
  category?: string; // "숲 산책", "로컬 미식", "전통 장터"
  description: string;
  image?: string;
  tag?: string;
}

export interface FeedCourseInfo {
  theme: string;
  totalDuration?: string;
  routeSummary: string[]; // ['화담숲', '곤지암', '전통시장']
  stops: CourseStop[];
}

export interface FeedPost {
  id: string; // e.g. "post-1", "post-2"
  editorId: EditorId;
  editorName: string; // 화비, 목비, etc.
  category: string; // 다가오는 축제, 설화, 추천 코스, 지금 가기 좋은 곳, etc.
  createdAtText: string; // 2시간 전, 어제, 3일 전
  title?: string;
  content: string; // Text content (variable length)
  images?: string[]; // 0 to multiple images
  course?: FeedCourseInfo; // Optional 1-day course recommendation structure
  locationTags?: FeedPostLocationTag[]; // Optional location tags
  isSaved?: boolean;
}

export interface UserState {
  name: string;
  birthDate: string; // 빈 문자열 '' 이면 미등록 상태
  hasGpsPermission: boolean; // 독립적 위치 권한 상태
  todayElement: ElementKey;
  fortuneSentence: string;
  savedPlaceIds: string[];
  savedFeedPostIds: string[]; // 찜한 피드 포스트 ID 목록
  visitedPlaceIds: string[];
  completedWalkIds: string[];
}

export type ActiveTab = 'home' | 'places' | 'feed' | 'saved';

export type ScreenState =
  | { type: 'tab'; tab: ActiveTab }
  | { type: 'my'; returnTab?: ActiveTab }
  | { type: 'place-detail'; placeId: string; returnTab?: ActiveTab; fromTodayPick?: boolean }
  | { type: 'feed-detail'; postId: string; returnTab: ActiveTab }
  | { type: 'birthdate-input'; returnTab?: ActiveTab };
