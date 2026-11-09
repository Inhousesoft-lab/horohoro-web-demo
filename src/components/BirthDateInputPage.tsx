import React, { useState } from 'react';
import { BidoCharacter, DOKKAEBI_FLAME_CONFIG } from './character/BidoCharacter';
import { ElementKey } from '../types';
import { ELEMENTS } from '../data/mockData';
import { ArrowLeft, Check, Navigation } from 'lucide-react';

interface BirthDateInputPageProps {
  currentBirthDate: string;
  hasGpsPermission: boolean;
  onSave: (birthDate: string, requestGps: boolean) => void;
  onBack: () => void;
}

export const BirthDateInputPage: React.FC<BirthDateInputPageProps> = ({
  currentBirthDate,
  hasGpsPermission,
  onSave,
  onBack,
}) => {
  const parts = currentBirthDate ? currentBirthDate.split('.') : ['1994', '08', '15'];
  const [year, setYear] = useState(parts[0] || '1994');
  const [month, setMonth] = useState(parts[1] || '08');
  const [day, setDay] = useState(parts[2] || '15');
  const [enableGps, setEnableGps] = useState(!hasGpsPermission);

  // Dynamically compute Five Elements based on input
  const cleanDigits = `${year}${month}${day}`.replace(/\D/g, '');
  const isValidDateEntered = year.trim().length === 4 && month.trim().length > 0 && day.trim().length > 0;
  const elementKeys: ElementKey[] = ['water', 'wood', 'fire', 'earth', 'metal'];
  const previewElement: ElementKey = elementKeys[(parseInt(cleanDigits, 10) || 0) % elementKeys.length];
  const flameConfig = DOKKAEBI_FLAME_CONFIG[previewElement];
  const elementInfo = ELEMENTS[previewElement];

  const handleComplete = () => {
    const formatted = `${year.trim().padStart(4, '1994')}.${month.trim().padStart(2, '01')}.${day.trim().padStart(2, '01')}`;
    onSave(formatted, enableGps);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-line px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="뒤로가기"
          className="w-9 h-9 rounded-full flex items-center justify-center text-ink active:scale-90 transition-transform -ml-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold text-ink">생년월일 등록</h1>
        <div className="w-9" />
      </header>

      {/* Main Content */}
      <div className="p-5 flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
        <div className="space-y-6 pt-4">
          {/* Dokkaebi Guide with dynamic Dokkaebi Fire */}
          <div className="text-center space-y-2">
            <div className="relative inline-block mx-auto">
              <BidoCharacter
                pose={isValidDateEntered ? 'guiding' : 'unregistered'}
                element={previewElement}
                showFlame={isValidDateEntered}
                size="hero"
                className="mx-auto"
              />
            </div>

            {isValidDateEntered ? (
              <div className="animate-fade-in space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs"
                  style={{
                    backgroundColor: `${flameConfig.outer}15`,
                    borderColor: `${flameConfig.outer}40`,
                    color: flameConfig.outer,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: flameConfig.outer }}
                  />
                  <span>{flameConfig.title} 밝혀짐</span>
                </div>
                <h2 className="text-base font-bold text-ink">
                  {elementInfo.name.split(' · ')[0]}의 기운이 깃든 날
                </h2>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-ink">
                  오늘의 행운을 불러올까요?
                </h2>
                <p className="text-xs text-ink/60 max-w-xs mx-auto leading-relaxed">
                  생년월일을 입력하면 오늘의 오행 도깨비불이 켜지고 맞춤 행운의 길을 안내해요.
                </p>
              </>
            )}
          </div>

          {/* Date Input Boxes */}
          <div className="bg-white rounded-3xl p-5 border border-line-warm shadow-2xs space-y-3">
            <label className="text-xs font-bold text-ink block">
              생년월일 (양력 기준)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <span className="text-[10px] text-ink/50 block mb-1">년도</span>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="1994"
                  className="w-full h-12 rounded-xl bg-surface-sunken border border-line-input text-center font-bold text-sm text-ink focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <span className="text-[10px] text-ink/50 block mb-1">월</span>
                <input
                  type="number"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="08"
                  min="1"
                  max="12"
                  className="w-full h-12 rounded-xl bg-surface-sunken border border-line-input text-center font-bold text-sm text-ink focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <span className="text-[10px] text-ink/50 block mb-1">일</span>
                <input
                  type="number"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="15"
                  min="1"
                  max="31"
                  className="w-full h-12 rounded-xl bg-surface-sunken border border-line-input text-center font-bold text-sm text-ink focus:outline-none focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* GPS Permission Option */}
          <div
            onClick={() => setEnableGps(!enableGps)}
            className="p-4 bg-white rounded-2xl border border-line-warm shadow-2xs flex items-center justify-between cursor-pointer active:bg-black/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">현재 위치 함께 켜기</p>
                <p className="text-[11px] text-ink/50">나와 가장 가까운 행운 장소를 우선 추천해요</p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                enableGps
                  ? 'bg-brand border-brand text-white'
                  : 'border-line-warm bg-white'
              }`}
            >
              {enableGps && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-6">
          <button
            onClick={handleComplete}
            className="w-full h-13 rounded-2xl bg-brand text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
          >
            <span>확인하고 행운 보러가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
