import React from 'react';
import { ElementKey } from '../../types';

type DokkaebiPose = 'unregistered' | 'registered' | 'guiding' | 'happy' | 'compact';

interface FlameStyle {
  outer: string;
  inner: string;
  aura: string;
  ember: string;
  title: string;
  elementName: string;
  hanja: string;
  glowFilter: string;
}

export const DOKKAEBI_FLAME_CONFIG: Record<ElementKey, FlameStyle> = {
  water: {
    outer: '#3B82F6',
    inner: '#BAE6FD',
    aura: 'rgba(59, 130, 246, 0.45)',
    ember: '#60A5FA',
    title: '푸른 물의 도깨비불',
    elementName: '물 (水)',
    hanja: '水',
    glowFilter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.45))',
  },
  wood: {
    outer: '#10B981',
    inner: '#BBF7D0',
    aura: 'rgba(16, 185, 129, 0.45)',
    ember: '#34D399',
    title: '초록 나무의 도깨비불',
    elementName: '나무 (木)',
    hanja: '木',
    glowFilter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.45))',
  },
  fire: {
    outer: '#EF4444',
    inner: '#FED7AA',
    aura: 'rgba(239, 68, 68, 0.45)',
    ember: '#F87171',
    title: '붉은 불꽃의 도깨비불',
    elementName: '불 (火)',
    hanja: '火',
    glowFilter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.45))',
  },
  earth: {
    outer: '#F59E0B',
    inner: '#FEF08A',
    aura: 'rgba(245, 158, 11, 0.45)',
    ember: '#FCD34D',
    title: '황금 흙의 도깨비불',
    elementName: '흙 (土)',
    hanja: '土',
    glowFilter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.45))',
  },
  metal: {
    outer: '#94A3B8',
    inner: '#FFFFFF',
    aura: 'rgba(148, 163, 184, 0.5)',
    ember: '#CBD5E1',
    title: '은빛 바위의 도깨비불',
    elementName: '바위·쇠 (金)',
    hanja: '金',
    glowFilter: 'drop-shadow(0 0 8px rgba(148, 163, 184, 0.5))',
  },
};

/**
 * 2D Dokkaebi Fire (도깨비불)
 * Floats gently beside the Dokkaebi character, changing color according to today's Five Elements.
 */
const DokkaebiFire: React.FC<{
  element: ElementKey;
  className?: string;
  size?: 'stage' | 'hero' | 'card' | 'inline' | 'sm';
}> = ({ element, className = '', size = 'hero' }) => {
  const config = DOKKAEBI_FLAME_CONFIG[element] || DOKKAEBI_FLAME_CONFIG.water;

  const sizeClasses = {
    stage: 'w-12 h-[62px]',
    hero: 'w-10 h-13 sm:w-11 sm:h-15',
    card: 'w-7 h-9',
    inline: 'w-5 h-7',
    sm: 'w-4 h-5',
  }[size];

  return (
    <div
      className={`relative inline-block pointer-events-none ${sizeClasses} ${className}`}
      style={{
        animation: 'dokkaebiFlameFloat 2.8s ease-in-out infinite',
      }}
    >
      <svg
        viewBox="0 0 44 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible transition-colors duration-500"
        style={{ filter: config.glowFilter }}
      >
        {/* Soft Ambient Aura */}
        <ellipse cx="22" cy="34" rx="18" ry="18" fill={config.aura} opacity="0.6" />

        {/* Outer Flame Silhouette */}
        <path
          d="M 22 3
             C 25 11, 35 18, 38 29
             C 42 41, 34 52, 22 52
             C 10 52, 2 41, 6 29
             C 9 18, 19 11, 22 3 Z"
          fill={config.outer}
          stroke="#222522"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Flick / Wisp Line at flame top */}
        <path
          d="M 22 5 C 24 10, 27 15, 23 19 C 20 22, 19 25, 21 28"
          stroke="#222522"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Inner Core Flame */}
        <path
          d="M 22 17
             C 24 22, 30 26, 31 33
             C 33 41, 27 46, 22 46
             C 17 46, 11 41, 13 33
             C 14 26, 20 22, 22 17 Z"
          fill={config.inner}
          stroke="#222522"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Adorable Mini Eyes & Smile on Flame */}
        <circle cx="19.5" cy="33.5" r="1.4" fill="#222522" />
        <circle cx="24.5" cy="33.5" r="1.4" fill="#222522" />
        <path
          d="M 21 36.5 C 22 38, 23 38, 24 36.5"
          stroke="#222522"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Cute Floating Embers */}
        <circle
          cx="37"
          cy="14"
          r="2.2"
          fill={config.ember}
          stroke="#222522"
          strokeWidth="1.2"
          style={{ animation: 'dokkaebiEmberPulse 2s ease-in-out infinite' }}
        />
        <circle
          cx="8"
          cy="20"
          r="1.6"
          fill={config.ember}
          stroke="#222522"
          strokeWidth="1.1"
          style={{ animation: 'dokkaebiEmberPulse 2s ease-in-out 1s infinite' }}
        />
      </svg>
    </div>
  );
};

interface BidoCharacterProps {
  pose?: DokkaebiPose;
  element?: ElementKey;
  showFlame?: boolean;
  flamePosition?: 'right' | 'left';
  size?: 'stage' | 'hero' | 'card' | 'inline' | 'icon';
  className?: string;
}

/**
 * HOROHORO 2D Dokkaebi Character (비도 / BIDO)
 * - 300 years old Korean dokkaebi spirit in the body of a cheerful, playful 10-year-old Korean boy
 * - Wearing traditional Korean paeraengi straw hat (#D6B477) with knot ornament (#BA694B)
 * - Ivory shirt with traditional muted teal vest (#287D77)
 * - Friendly waving hand and one hand resting confidently on waist
 * - NO horns, NO fangs, NO old-man wrinkles
 * - Accompanied by floating Dokkaebi Fire (도깨비불) that adapts to the Five Elements
 */
export const BidoCharacter: React.FC<BidoCharacterProps> = ({
  pose = 'registered',
  element,
  showFlame,
  flamePosition = 'right',
  size = 'hero',
  className = '',
}) => {
  // Sizing definitions
  const sizeClasses = {
    stage: 'w-[226px] h-[295px]', // 홈 상단 (390px 시안 실측)
    hero: 'w-44 h-58 sm:w-48 sm:h-64',
    card: 'w-30 h-40',
    inline: 'w-14 h-14',
    icon: 'w-10 h-10',
  }[size];

  // Determine whether to display the Dokkaebi Fire
  const shouldShowFlame = showFlame !== undefined ? showFlame : Boolean(element && pose !== 'unregistered');

  // Flame position relative to Bido's waving left hand
  const flamePosClass = {
    // stage: 머리 오른쪽 옆 (390px 화면에서 도깨비불 박스 오른쪽 끝이 말풍선 오른쪽 끝선보다 18px 안쪽)
    stage: flamePosition === 'right' ? 'top-[45px] left-[189px]' : 'top-[45px] right-[189px]',
    hero: flamePosition === 'right' ? 'top-2 right-0 sm:top-1 sm:-right-2' : 'top-2 left-0 sm:top-1 sm:-left-2',
    card: flamePosition === 'right' ? 'top-1 right-0' : 'top-1 left-0',
    inline: flamePosition === 'right' ? '-top-1 -right-1' : '-top-1 -left-1',
    icon: 'hidden',
  }[size];

  const flameSize = size === 'stage' ? 'stage' : size === 'hero' ? 'hero' : size === 'card' ? 'card' : size === 'inline' ? 'inline' : 'sm';

  const isSmallCrop = size === 'inline' || size === 'icon';

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {/* Floating Keyframe Styles for Dokkaebi Fire */}
      <style>{`
        @keyframes dokkaebiFlameFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes dokkaebiEmberPulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
      `}</style>

      {/* Dokkaebi Fire (도깨비불) floating beside Bido's waving hand */}
      {shouldShowFlame && element && (
        <div className={`absolute z-20 ${flamePosClass} transition-all duration-300`}>
          <DokkaebiFire element={element} size={flameSize} />
        </div>
      )}

      {isSmallCrop ? (
        // Small avatar / inline crop focusing on Bido's face and single red horn
        <div className="w-full h-full rounded-2xl overflow-hidden bg-white border border-ink/15 shadow-2xs flex items-center justify-center relative">
          <img
            src="/images/dokkaebi_character.png"
            alt="300살 복도깨비 비도"
            className="w-full h-full object-cover object-[center_35%] scale-[1.35] pointer-events-none select-none"
            referrerPolicy="no-referrer"
            draggable={false}
          />
        </div>
      ) : (
        // Full-body Bido illustration standing firmly on the ground - static, no floating motion
        <div className="relative w-full h-full flex items-end justify-center">
          <img
            src="/images/dokkaebi_character.png"
            alt="300살 복도깨비 비도"
            className="w-full h-full object-contain pointer-events-none select-none"
            referrerPolicy="no-referrer"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
};
