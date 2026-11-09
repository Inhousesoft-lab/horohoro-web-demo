import { EditorId, EditorInfo, FeedPost } from '../types';

export const AI_EDITORS: Record<EditorId, EditorInfo> = {
  hwabi: {
    id: 'hwabi',
    name: '화비',
    element: 'fire',
    role: '축제·행사',
    avatarBg: '#FEE2E2',
    flameColor: '#EF4444',
    description: '전국 팔도의 불꽃과 야간 축제, 가슴 뛰는 잔치를 탐색하는 불 도깨비',
  },
  mokbi: {
    id: 'mokbi',
    name: '목비',
    element: 'wood',
    role: '숲·계절·자연',
    avatarBg: '#DCFCE7',
    flameColor: '#10B981',
    description: '계절의 숲길, 피톤치드 가득한 전나무 숲과 솔바람을 걷는 나무 도깨비',
  },
  subi: {
    id: 'subi',
    name: '수비',
    element: 'water',
    role: '강·바다·물',
    avatarBg: '#DBEAFE',
    flameColor: '#3B82F6',
    description: '물안개 피어오르는 강줄기와 천년의 설화가 숨겨진 바닷길을 누비는 물 도깨비',
  },
  geumbi: {
    id: 'geumbi',
    name: '금비',
    element: 'metal',
    role: '지역 보물·숨은 명소',
    avatarBg: '#F1F5F9',
    flameColor: '#64748B',
    description: '아직 덜 알려진 골목 보물, 단단한 바위 비경과 고택을 찾아내는 쇠 도깨비',
  },
  tobi: {
    id: 'tobi',
    name: '토비',
    element: 'earth',
    role: '역사·전설·민화·K-Folk',
    avatarBg: '#FEF3C7',
    flameColor: '#F59E0B',
    description: '땅에 깃든 옛이야기, 두꺼비와 도깨비 전설, 오래된 민화를 들려주는 흙 도깨비',
  },
};

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'post-course-hwadam',
    editorId: 'mokbi',
    editorName: '목비',
    category: '추천 코스',
    createdAtText: '방금 전',
    title: '가을 숲길 걷고 뜨끈한 국밥과 장터까지 🍁 1일 힐링 코스',
    content: `가을바람 솔솔 불 때 어디 갈지 고민된다면? 🍂
도깨비 목비가 엄선한 실패 없는 당일치기 1일 힐링 코스를 소개할게!

피톤치드 가득한 화담숲 숲길에서 시작해,
뜨끈한 곤지암 소머리국밥으로 온기를 채우고,
정겨운 전통시장의 주전부리로 하루를 마무리하는 코스야.

걸음마다 기분 좋은 복이 깃드는 하루를 만나봐.

① 화담숲 오전 10:00 단풍과 숲길을 따라 걷는 시간 
② 곤지암 오후 12:30 지역 맛집에서 즐기는 점심 
③ 전통시장 오후 15:00 시장 골목을 걸으며 지역 먹거리 탐방 

※ 시간은 예시이며 실제 운영시간 및 이동거리를 고려한 확정 일정이 아님.`,
    images: [
      '/images/hwadam_forest_autumn_1791970110837.jpg',
    ],
    locationTags: [
      {
        name: '경기 광주 화담숲',
      },
      {
        name: '곤지암 소머리국밥거리',
      },
      {
        name: '광주 경안전통시장',
      },
    ],
  },
  {
    id: 'post-1',
    editorId: 'hwabi',
    editorName: '화비',
    category: '다가오는 축제',
    createdAtText: '2시간 전',
    content: `가을밤, 오래된 마을에 도깨비불이 켜진대! 🔥

이번 주말에는 전남의 작은 마을에서
밤을 밝히는 축제가 열린다고 해.

옛날 사람들은 어두운 들판에 나타나는
신비로운 불빛을 도깨비불이라고 불렀지.`,
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=80',
    ],
    locationTags: [
      {
        name: '전남 곡성 도깨비마을',
        placeId: 'place-seomjin-goblin',
      },
    ],
  },
  {
    id: 'post-2',
    editorId: 'tobi',
    editorName: '토비',
    category: '설화',
    createdAtText: '어제',
    content: `두꺼비가 장군을 도왔다는 이야기를 들어봤어?

섬진강 근처에는 오래전부터 전해 내려오는
두꺼비와 관련된 이야기가 있어.

사람들은 두꺼비를 재물과 복을 불러오는
상징으로 여기기도 했지.

이런 이야기가 남아 있는 마을을
직접 걸어보는 건 어떨까?`,
    images: [
      '/images/place_seomjin_river_1791770449617.jpg',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    ],
    locationTags: [
      {
        name: '섬진강 두꺼비마을',
        placeId: 'place-seomjin-goblin',
      },
    ],
  },
  {
    id: 'post-3',
    editorId: 'mokbi',
    editorName: '목비',
    category: '지금 가기 좋은 곳',
    createdAtText: '3일 전',
    content: `가을에는 숲이 가장 예쁜 옷을 입어. 🍂

복잡한 생각을 내려놓고
조용한 숲길을 걸어보는 건 어떨까?`,
    images: [
      '/images/place_woljeongsa_fir_1791770475183.jpg',
    ],
  },
  {
    id: 'post-4',
    editorId: 'subi',
    editorName: '수비',
    category: '설화',
    createdAtText: '4일 전',
    content: `할미·할아비 바위에 얽힌 천년의 기다림 이야기 들어봤니? 🌊

태안 안면도 꽃지해변에는 바다로 출정한 남편을 기다리다 망부석이 되었다는 할미바위 전설이 깃들어 있어.

해질녘 붉은 노을이 바위 틈으로 스며들 때면 신비로운 바다 기운이 가득 차오른대. 물길 따라 천천히 걸으며 마음속 응어리를 씻어내기 참 좋은 곳이야.`,
    images: [
      '/images/place_halmi_rock_1791770497873.jpg',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=900&q=80',
    ],
    locationTags: [
      {
        name: '태안 꽃지해변 할미바위',
        placeId: 'place-anmyeondo-halmi',
      },
    ],
  },
  {
    id: 'post-5',
    editorId: 'geumbi',
    editorName: '금비',
    category: '숨은 보물 명소',
    createdAtText: '5일 전',
    content: `사람들이 잘 모르는 진짜 보물길을 하나 찾았어! ✨

관방제림 300년 된 고목 그늘 아래를 묵묵히 걷다 보면, 오래된 거목들이 품고 있는 단단한 금(金)의 기운 덕분에 복잡했던 머릿속이 거짓말처럼 맑아져.

소란스러운 생각을 정리하고 싶을 땐 바위와 숲이 지켜주는 숨은 명소로 떠나봐.`,
    locationTags: [
      {
        name: '담양 관방제림',
        placeId: 'place-damyang-gwanbangjerim',
      },
    ],
  },
];
