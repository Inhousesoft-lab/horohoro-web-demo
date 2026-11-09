/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActiveTab, LuckyPlace, UserState, ScreenState, ElementKey } from './types';
import { LUCKY_PLACES, FORTUNE_SENTENCES } from './data/mockData';
import { INITIAL_FEED_POSTS } from './data/feedMockData';
import { TopBar, BottomNav } from './components/Navigation';
import { HomeTab } from './components/HomeTab';
import { PlacesTab } from './components/PlacesTab';
import { SavedTab } from './components/SavedTab';
import { FeedTab } from './components/feed/FeedTab';
import { MyTab } from './components/MyTab';
import { PlaceDetailPage } from './components/PlaceDetailPage';
import { BirthDateInputPage } from './components/BirthDateInputPage';
import { FeedDetailPage } from './components/feed/FeedDetailPage';
import { feedPostIdFromPath, feedPostPath } from './utils/feedLink';

export default function App() {
  // 주소가 /feed/{번호} 로 들어오면 해당 피드 단건 화면으로 시작 (뒤로가기 시 피드 탭)
  const [initialFeedPostId] = useState(() => feedPostIdFromPath(window.location.pathname, INITIAL_FEED_POSTS));
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialFeedPostId ? 'feed' : 'home');
  const [screen, setScreen] = useState<ScreenState>(
    initialFeedPostId
      ? { type: 'feed-detail', postId: initialFeedPostId, returnTab: 'feed' }
      : { type: 'tab', tab: 'home' }
  );
  const [places] = useState<LuckyPlace[]>(LUCKY_PLACES);

  const [userState, setUserState] = useState<UserState>({
    name: '이태린',
    birthDate: '1994.05.18', // 생년월일 (스크린샷 일치)
    hasGpsPermission: false, // 위치 권한: 스크린샷 '허용 안 함' 일치
    todayElement: 'water',
    fortuneSentence: FORTUNE_SENTENCES.water,
    savedPlaceIds: ['place-seomjin-goblin', 'place-anmyeondo-halmi'],
    savedFeedPostIds: ['post-1', 'post-2'], // 찜한 피드 목록
    visitedPlaceIds: ['place-anmyeondo-halmi'],
    completedWalkIds: ['place-anmyeondo-halmi'],
  });

  // Calculate element & fortune from birthDate
  const calculateElementFromBirthDate = (bDate: string): ElementKey => {
    if (!bDate || !bDate.trim()) return 'water';
    const clean = bDate.replace(/\D/g, '');
    const num = parseInt(clean, 10) || 19940815;
    const elementKeys: ElementKey[] = ['water', 'wood', 'fire', 'earth', 'metal'];
    return elementKeys[num % elementKeys.length];
  };

  // Update birth date & recalculate
  const handleUpdateBirthDate = (newBirthDate: string, requestGps?: boolean) => {
    const newElement = calculateElementFromBirthDate(newBirthDate);
    setUserState((prev) => ({
      ...prev,
      birthDate: newBirthDate,
      hasGpsPermission: requestGps !== undefined ? requestGps : prev.hasGpsPermission,
      todayElement: newElement,
      fortuneSentence: FORTUNE_SENTENCES[newElement],
    }));
    setScreen({ type: 'tab', tab: 'home' });
    setActiveTab('home');
  };

  // Reset to unregistered (for MVP 1 testing and onboarding demo)
  const handleResetToUnregistered = () => {
    setUserState((prev) => ({
      ...prev,
      birthDate: '',
    }));
    setActiveTab('home');
    setScreen({ type: 'tab', tab: 'home' });
  };

  // Toggle GPS permission independently
  const handleToggleGps = () => {
    setUserState((prev) => ({
      ...prev,
      hasGpsPermission: !prev.hasGpsPermission,
    }));
  };

  // Toggle Save (Heart) for Places
  const handleToggleSave = (placeId: string) => {
    setUserState((prev) => {
      const isAlreadySaved = prev.savedPlaceIds.includes(placeId);
      const newSaved = isAlreadySaved
        ? prev.savedPlaceIds.filter((id) => id !== placeId)
        : [...prev.savedPlaceIds, placeId];
      return {
        ...prev,
        savedPlaceIds: newSaved,
      };
    });
  };

  // Toggle Save on Feed Post
  const handleToggleSaveFeedPost = (postId: string) => {
    setUserState((prev) => {
      const isAlreadySaved = prev.savedFeedPostIds.includes(postId);
      const newSaved = isAlreadySaved
        ? prev.savedFeedPostIds.filter((id) => id !== postId)
        : [...prev.savedFeedPostIds, postId];
      return {
        ...prev,
        savedFeedPostIds: newSaved,
      };
    });
  };

  // Switch Bottom Tab
  const handleTabChange = (tab: ActiveTab) => {
    if (window.location.pathname !== '/') window.history.replaceState(null, '', '/');
    setActiveTab(tab);
    setScreen({ type: 'tab', tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroPlace = places.find((p) => p.id === 'place-seomjin-goblin') || places[0];

  // ── 스크롤 위치 관리 ──
  // 목록 → 상세/MY: 목록 스크롤 위치를 기억하고 새 화면은 최상단에서 시작
  // 상세/MY → 목록: 기억해 둔 위치로 복귀 (탭 화면은 숨김 상태로 유지되어 필터·정렬 상태도 그대로)
  const scrollMemory = useRef<Record<ActiveTab, number>>({ home: 0, places: 0, feed: 0, saved: 0 });
  const pendingScrollTop = useRef<number | null>(null);

  const openPlaceDetail = (placeId: string, returnTab: ActiveTab, fromTodayPick = false) => {
    scrollMemory.current[returnTab] = window.scrollY;
    pendingScrollTop.current = 0;
    setScreen({ type: 'place-detail', placeId, returnTab, fromTodayPick });
  };

  const openMy = () => {
    scrollMemory.current[activeTab] = window.scrollY;
    pendingScrollTop.current = 0;
    setScreen({ type: 'my', returnTab: activeTab });
  };

  // 피드 단건 화면 (/feed/{번호}): 브라우저 주소와 뒤로가기를 함께 맞춤
  const openFeedPost = (postId: string) => {
    scrollMemory.current[activeTab] = window.scrollY;
    pendingScrollTop.current = 0;
    window.history.pushState({ feedDetail: true }, '', feedPostPath(postId));
    setScreen({ type: 'feed-detail', postId, returnTab: activeTab });
  };

  const backToTab = (returnTab: ActiveTab | undefined) => {
    const target = returnTab || activeTab;
    pendingScrollTop.current = scrollMemory.current[target] ?? 0;
    setScreen({ type: 'tab', tab: target });
  };

  const closeFeedDetail = (returnTab: ActiveTab) => {
    if (window.history.state?.feedDetail) {
      window.history.back(); // popstate에서 목록으로 복귀
    } else {
      // 링크로 바로 들어온 경우: 이전 기록이 없으므로 주소만 바꾸고 피드 탭으로
      window.history.replaceState(null, '', '/');
      backToTab(returnTab);
    }
  };

  // 브라우저 뒤로/앞으로 가기 처리
  const screenRef = useRef(screen);
  screenRef.current = screen;
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;
  useEffect(() => {
    const handlePopState = () => {
      const current = screenRef.current;
      const postId = feedPostIdFromPath(window.location.pathname, INITIAL_FEED_POSTS);
      if (postId) {
        if (current.type === 'tab') scrollMemory.current[current.tab] = window.scrollY;
        pendingScrollTop.current = 0;
        setScreen({ type: 'feed-detail', postId, returnTab: current.type === 'tab' ? current.tab : activeTabRef.current });
      } else if (current.type === 'feed-detail') {
        pendingScrollTop.current = scrollMemory.current[current.returnTab] ?? 0;
        setScreen({ type: 'tab', tab: current.returnTab });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 화면이 바뀐 직후(그리기 전) 예약된 스크롤 위치 적용
  useLayoutEffect(() => {
    if (pendingScrollTop.current === null) return;
    window.scrollTo(0, pendingScrollTop.current);
    pendingScrollTop.current = null;
  }, [screen]);

  // Screen 1: Birth Date Input Screen
  if (screen.type === 'birthdate-input') {
    return (
      <div className="min-h-screen bg-canvas flex justify-center selection:bg-brand/20 selection:text-brand">
        <div className="w-full max-w-md min-h-screen bg-white shadow-2xl relative flex flex-col border-x border-line">
          <BirthDateInputPage
            currentBirthDate={userState.birthDate}
            hasGpsPermission={userState.hasGpsPermission}
            onSave={(bDate, enableGps) => handleUpdateBirthDate(bDate, enableGps)}
            onBack={() => setScreen({ type: 'tab', tab: screen.returnTab || activeTab })}
          />
        </div>
      </div>
    );
  }

  const isTabVisible = screen.type === 'tab';
  const selectedPlace =
    screen.type === 'place-detail'
      ? places.find((p) => p.id === screen.placeId) || heroPlace
      : null;

  const selectedFeedPost =
    screen.type === 'feed-detail' ? INITIAL_FEED_POSTS.find((p) => p.id === screen.postId) : undefined;

  // Determine top bar title based on current active tab
  const getTopBarTitle = () => {
    if (activeTab === 'places') return '행운의 장소';
    if (activeTab === 'feed') return '피드';
    if (activeTab === 'saved') return '찜';
    return 'HOROHORO';
  };

  return (
    <div className="min-h-screen bg-canvas flex justify-center selection:bg-brand/20 selection:text-brand">
      <div className="w-full max-w-md min-h-screen bg-white shadow-2xl relative flex flex-col border-x border-line">
        {/* Primary Tab Screens: HOME · 장소 · 피드 · 찜 (상세/MY가 열려 있어도 숨김 상태로 유지) */}
        <div className={isTabVisible ? 'contents' : 'hidden'}>
          {/* 상단 앱바: 우측 MY(프로필) 버튼 */}
          <TopBar title={getTopBarTitle()} onOpenMy={openMy} />

          {/* Tab Content */}
          <main className={`flex-1 ${activeTab === 'home' ? 'px-5 pt-1 pb-20' : activeTab === 'saved' ? 'px-4 pt-1' : 'px-4 pt-2'}`}>
            {activeTab === 'home' && (
              <HomeTab
                birthDate={userState.birthDate}
                hasGpsPermission={userState.hasGpsPermission}
                todayElement={userState.todayElement}
                heroPlace={heroPlace}
                savedPlaceIds={userState.savedPlaceIds}
                onRequestBirthDate={() => setScreen({ type: 'birthdate-input', returnTab: 'home' })}
                onRequestGps={handleToggleGps}
                onOpenPlaceDetail={(place) => openPlaceDetail(place.id, 'home')}
                onNavigateToPlaces={() => handleTabChange('places')}
                onToggleSave={handleToggleSave}
              />
            )}

            {activeTab === 'places' && (
              <PlacesTab
                places={places}
                savedPlaceIds={userState.savedPlaceIds}
                birthDate={userState.birthDate}
                hasGpsPermission={userState.hasGpsPermission}
                todayElement={userState.todayElement}
                onToggleSave={handleToggleSave}
                onOpenPlaceDetail={(place) => openPlaceDetail(place.id, 'places')}
                onOpenTodayPick={(place) => openPlaceDetail(place.id, 'places', true)}
                onRequestBirthDate={() => setScreen({ type: 'birthdate-input', returnTab: 'places' })}
                onRequestGps={handleToggleGps}
              />
            )}

            {activeTab === 'feed' && (
              <FeedTab
                savedPostIds={userState.savedFeedPostIds}
                onToggleSavePost={handleToggleSaveFeedPost}
                onSelectLocationTag={(tag) => {
                  if (tag.placeId) openPlaceDetail(tag.placeId, 'feed');
                }}
              />
            )}

            {activeTab === 'saved' && (
              <SavedTab
                places={places}
                savedPlaceIds={userState.savedPlaceIds}
                feedPosts={INITIAL_FEED_POSTS}
                savedFeedPostIds={userState.savedFeedPostIds}
                onToggleSave={handleToggleSave}
                onToggleSaveFeedPost={handleToggleSaveFeedPost}
                onOpenPlaceDetail={(place) => openPlaceDetail(place.id, 'saved')}
                onOpenFeedPost={openFeedPost}
                onNavigateToPlaces={() => handleTabChange('places')}
              />
            )}
          </main>
        </div>

        {/* MY Screen (상단 앱바 프로필 버튼으로 진입, 뒤로가기로 원래 탭 복귀) */}
        {screen.type === 'my' && (
          <MyTab
            userState={userState}
            onBack={() => backToTab(screen.returnTab)}
            onUpdateBirthDate={(bDate) => handleUpdateBirthDate(bDate)}
            onToggleGps={handleToggleGps}
            onResetToUnregistered={handleResetToUnregistered}
          />
        )}

        {/* Place Detail Page */}
        {screen.type === 'place-detail' && selectedPlace && (
          <PlaceDetailPage
            place={selectedPlace}
            isSaved={userState.savedPlaceIds.includes(selectedPlace.id)}
            showBidoReason={Boolean(screen.fromTodayPick) && userState.birthDate.trim().length > 0}
            onToggleSave={handleToggleSave}
            onBack={() => backToTab(screen.returnTab)}
          />
        )}

        {/* Feed Detail Page (/feed/{번호}) */}
        {screen.type === 'feed-detail' && selectedFeedPost && (
          <FeedDetailPage
            post={selectedFeedPost}
            isSaved={userState.savedFeedPostIds.includes(selectedFeedPost.id)}
            onToggleSave={handleToggleSaveFeedPost}
            onBack={() => closeFeedDetail(screen.returnTab)}
          />
        )}

        {/* Bottom Navigation (HOME, 장소, 피드, 찜) */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
}
