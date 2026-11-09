import React, { useState } from 'react';
import { UserState } from '../types';
import { ArrowLeft, ChevronRight, X, Check, Shield, User, Globe } from 'lucide-react';

interface MyTabProps {
  userState: UserState;
  onUpdateBirthDate: (birthDate: string) => void;
  onToggleGps: () => void;
  onResetToUnregistered?: () => void;
  onBack?: () => void;
}

export const MyTab: React.FC<MyTabProps> = ({
  userState,
  onUpdateBirthDate,
  onToggleGps,
  onResetToUnregistered,
  onBack,
}) => {
  // Modal states
  const [activeModal, setActiveModal] = useState<
    'birthDate' | 'language' | 'account' | 'terms' | null
  >(null);

  // Notification toggle state (기본: 켜짐)
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Birth date edit form state
  const initialParts = userState.birthDate
    ? userState.birthDate.split('.')
    : ['1994', '05', '18'];
  const [editYear, setEditYear] = useState(initialParts[0] || '1994');
  const [editMonth, setEditMonth] = useState(initialParts[1] || '05');
  const [editDay, setEditDay] = useState(initialParts[2] || '18');

  const handleSaveBirthDate = () => {
    const formatted = `${editYear.trim().padStart(4, '1994')}.${editMonth
      .trim()
      .padStart(2, '05')}.${editDay.trim().padStart(2, '18')}`;
    onUpdateBirthDate(formatted);
    setActiveModal(null);
    showToast('생년월일이 성공적으로 수정되었습니다.');
  };

  const handleToggleNotification = () => {
    const next = !isNotificationEnabled;
    setIsNotificationEnabled(next);
    showToast(`알림이 ${next ? '켜졌습니다.' : '꺼졌습니다.'}`);
  };

  const handleToggleLocation = () => {
    onToggleGps();
    showToast(
      userState.hasGpsPermission
        ? '위치 사용 설정이 해제되었습니다.'
        : '위치 사용이 허용되었습니다.'
    );
  };

  return (
    <div className="p-5 pb-24 space-y-6">
      {/* 1. Page Header: ← MY */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-0.5 -ml-1 text-ink active:scale-90 transition-transform"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
        )}
        <h1 className="text-xl font-bold text-ink tracking-tight">MY</h1>
      </div>

      {/* 2. User Name & Greeting (스크린샷: 이태린 / 오늘도 나만의 속도로 걸어봐요.) */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-ink tracking-tight">
          {userState.name || '이태린'}
        </h2>
        <p className="text-sm text-ink/60 tracking-tight">
          오늘도 나만의 속도로 걸어봐요.
        </p>
      </div>

      {/* 3. Section 1: 내 정보 */}
      <section className="pt-4">
        <h3 className="text-sm font-bold text-ink tracking-tight mb-1">
          내 정보
        </h3>

        <div className="divide-y divide-line">
          {/* 생년월일 수정 */}
          <button
            type="button"
            onClick={() => setActiveModal('birthDate')}
            className="w-full py-4 flex items-center justify-between text-left active:opacity-70 transition-opacity"
          >
            <span className="text-base text-ink font-medium tracking-tight">
              생년월일 수정
            </span>
            <div className="flex items-center gap-1.5 text-sm text-ink/50 font-normal">
              <span>{userState.birthDate || '1994.05.18'}</span>
              <ChevronRight className="w-4 h-4 text-ink/40 stroke-[2]" />
            </div>
          </button>

          {/* 위치 사용 설정 */}
          <button
            type="button"
            onClick={handleToggleLocation}
            className="w-full py-4 flex items-center justify-between text-left active:opacity-70 transition-opacity"
          >
            <span className="text-base text-ink font-medium tracking-tight">
              위치 사용 설정
            </span>
            <div className="flex items-center gap-1.5 text-sm text-ink/50 font-normal">
              <span>{userState.hasGpsPermission ? '허용됨' : '허용 안 함'}</span>
              <ChevronRight className="w-4 h-4 text-ink/40 stroke-[2]" />
            </div>
          </button>
        </div>
      </section>

      {/* 4. Section 2: 앱 설정 */}
      <section className="pt-2">
        <h3 className="text-sm font-bold text-ink tracking-tight mb-1">
          앱 설정
        </h3>

        <div className="divide-y divide-line">
          {/* 언어 */}
          <button
            type="button"
            onClick={() => setActiveModal('language')}
            className="w-full py-4 flex items-center justify-between text-left active:opacity-70 transition-opacity"
          >
            <span className="text-base text-ink font-medium tracking-tight">
              언어
            </span>
            <div className="flex items-center gap-1.5 text-sm text-ink/50 font-normal">
              <span>한국어</span>
              <ChevronRight className="w-4 h-4 text-ink/40 stroke-[2]" />
            </div>
          </button>

          {/* 알림 */}
          <button
            type="button"
            onClick={handleToggleNotification}
            className="w-full py-4 flex items-center justify-between text-left active:opacity-70 transition-opacity"
          >
            <span className="text-base text-ink font-medium tracking-tight">
              알림
            </span>
            <div className="flex items-center gap-1.5 text-sm text-ink/50 font-normal">
              <span>{isNotificationEnabled ? '켜짐' : '꺼짐'}</span>
              <ChevronRight className="w-4 h-4 text-ink/40 stroke-[2]" />
            </div>
          </button>

          {/* 계정 관리 */}
          <button
            type="button"
            onClick={() => setActiveModal('account')}
            className="w-full py-4 flex items-center justify-between text-left active:opacity-70 transition-opacity"
          >
            <span className="text-base text-ink font-medium tracking-tight">
              계정 관리
            </span>
            <ChevronRight className="w-4 h-4 text-ink/40 stroke-[2]" />
          </button>

          {/* 이용약관 및 개인정보 처리방침 */}
          <button
            type="button"
            onClick={() => setActiveModal('terms')}
            className="w-full py-4 flex items-center justify-between text-left active:opacity-70 transition-opacity"
          >
            <span className="text-base text-ink font-medium tracking-tight">
              이용약관 및 개인정보 처리방침
            </span>
            <ChevronRight className="w-4 h-4 text-ink/40 stroke-[2]" />
          </button>
        </div>
      </section>

      {/* Toast Notification Message */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-ink/90 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          MODALS & BOTTOM SHEETS
         ──────────────────────────────────────────────────────── */}

      {/* 1. 생년월일 수정 모달 */}
      {activeModal === 'birthDate' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">생년월일 수정</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink/40 hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-ink/60">
              생년월일을 수정하면 나에게 맞는 오늘의 오행과 행운의 장소가 다시 계산됩니다.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div>
                <label className="text-[11px] font-bold text-ink/60 block mb-1">년도</label>
                <input
                  type="text"
                  maxLength={4}
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  placeholder="1994"
                  className="w-full h-11 rounded-xl bg-surface-sunken border border-line text-center font-bold text-sm text-ink focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink/60 block mb-1">월</label>
                <input
                  type="text"
                  maxLength={2}
                  value={editMonth}
                  onChange={(e) => setEditMonth(e.target.value)}
                  placeholder="05"
                  className="w-full h-11 rounded-xl bg-surface-sunken border border-line text-center font-bold text-sm text-ink focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink/60 block mb-1">일</label>
                <input
                  type="text"
                  maxLength={2}
                  value={editDay}
                  onChange={(e) => setEditDay(e.target.value)}
                  placeholder="18"
                  className="w-full h-11 rounded-xl bg-surface-sunken border border-line text-center font-bold text-sm text-ink focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 h-11 rounded-xl bg-canvas text-ink font-bold text-sm active:scale-[0.98] transition-transform"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveBirthDate}
                className="flex-1 h-11 rounded-xl bg-brand text-white font-bold text-sm active:scale-[0.98] transition-transform"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 언어 설정 모달 */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-brand" />
                <h3 className="text-lg font-bold text-ink">언어 설정</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink/40 hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <div className="p-3.5 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-between font-bold text-sm text-brand">
                <span>한국어 (기본)</span>
                <Check className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line flex items-center justify-between text-sm text-ink/50">
                <span>English (준비 중)</span>
                <span className="text-xs text-ink/40">Coming Soon</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-xl bg-brand text-white font-bold text-sm active:scale-[0.98] transition-transform mt-2"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 3. 계정 관리 모달 */}
      {activeModal === 'account' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-brand" />
                <h3 className="text-lg font-bold text-ink">계정 관리</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink/40 hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-surface-sunken rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink/60">사용자 이름</span>
                <span className="font-bold text-ink">{userState.name || '이태린'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">로그인 이메일</span>
                <span className="font-mono text-ink">taerin.lee@inhousesoft.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">계정 상태</span>
                <span className="font-semibold text-brand">정상 활성화</span>
              </div>
            </div>

            {onResetToUnregistered && (
              <button
                type="button"
                onClick={() => {
                  onResetToUnregistered();
                  setActiveModal(null);
                  showToast('데이터가 초기화되었습니다.');
                }}
                className="w-full py-2.5 text-xs text-heart font-medium hover:underline text-center"
              >
                생년월일 초기화 (체험 모드)
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-xl bg-brand text-white font-bold text-sm active:scale-[0.98] transition-transform"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 4. 이용약관 및 개인정보 처리방침 모달 */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm max-h-[80vh] bg-white rounded-3xl p-6 shadow-2xl flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand" />
                <h3 className="text-base font-bold text-ink">
                  이용약관 및 개인정보 처리방침
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink/40 hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 text-xs text-ink/80 leading-relaxed pr-1 flex-1">
              <div>
                <h4 className="font-bold text-ink mb-1">제1조 (목적)</h4>
                <p>
                  본 약관은 HOROHORO 서비스(이하 ‘서비스’)가 제공하는 한국형 오행 및 복길 산책 정보 제공에 관한 제반 사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-ink mb-1">제2조 (개인정보 수집 및 이용)</h4>
                <p>
                  서비스는 맞춤형 오행 운세 및 행운 장소 추천을 위해 이용자의 생년월일과 GPS 위치 정보(선택)를 안전하게 처리합니다. 수집된 정보는 외부로 유출되지 않으며 브라우저 세션에 보호됩니다.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-ink mb-1">제3조 (위치기반 서비스)</h4>
                <p>
                  이용자의 현재 위치를 기반으로 가장 가까운 행운의 장소와의 거리를 계산하여 제공하며, 위치 정보는 서버에 무단 영구 저장되지 않습니다.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-xl bg-brand text-white font-bold text-sm shrink-0 active:scale-[0.98] transition-transform"
            >
              동의 및 확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
