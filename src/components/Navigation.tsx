import React from 'react';
import { ActiveTab } from '../types';
import { User } from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const TopBar: React.FC<{
  title?: string;
  subtitle?: string;
  onOpenMy?: () => void;
}> = ({ title, subtitle, onOpenMy }) => {
  const isHome = !title || title === 'HOROHORO';

  return (
    <header className="sticky top-0 z-30 bg-white px-5 py-3.5 flex items-center justify-between transition-colors">
      {/* Brand Title / Page Title & Subtitle */}
      <div className="flex flex-col text-left min-w-0 pr-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-left active:opacity-80 transition-opacity"
        >
          {isHome ? (
            <span className="text-wordmark tracking-tight text-brand-deep">
              HOROHORO
            </span>
          ) : (
            <span className="font-bold text-lg tracking-tight text-ink">
              {title}
            </span>
          )}
        </button>
        {subtitle && (
          <span className="text-[11.5px] text-ink/60 -mt-0.5 tracking-tight truncate">
            {subtitle}
          </span>
        )}
      </div>

      {/* Right Action: MY(프로필) - 회색 아웃라인 아이콘 */}
      {onOpenMy && (
        <button
          onClick={onOpenMy}
          className="p-1 -mr-1 flex items-center justify-center text-ink-muted active:scale-90 transition-transform shrink-0"
          aria-label="MY"
        >
          <User className="w-6 h-6" strokeWidth={1.8} />
        </button>
      )}
    </header>
  );
};

/* ────────────────────────────────────────────────────────
   Bottom Navigation Bar Icons matching exact screenshot design:
   - HOME: House with doorway inside
   - 장소: Location pin with central circular ring
   - 피드: Rounded frame post with landscape peaks and caption line
   - 찜: Heart outline
   - Active: Thick bold stroke (2.4px) + dark green (#31584A) + bold text
   - Inactive: Clean outline stroke (1.65px) + gray (#72766F) + medium text
   ──────────────────────────────────────────────────────── */

const HomeNavIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[23px] h-[23px] transition-all"
    stroke="currentColor"
    strokeWidth={isActive ? 2.4 : 1.65}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* House roof and body */}
    <path d="M3.8 10.6L11.1 4.2C11.6 3.8 12.4 3.8 12.9 4.2L20.2 10.6C20.4 10.8 20.5 11.1 20.5 11.4V19.2C20.5 20.2 19.7 21 18.7 21H5.3C4.3 21 3.5 20.2 3.5 19.2V11.4C3.5 11.1 3.6 10.8 3.8 10.6Z" />
    {/* Inner doorway */}
    <path d="M10 21V14.4C10 13.9 10.4 13.5 11 13.5H13C13.6 13.5 14 13.9 14 14.4V21" />
  </svg>
);

const PlacesNavIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[23px] h-[23px] transition-all"
    stroke="currentColor"
    strokeWidth={isActive ? 2.4 : 1.65}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Pin shape */}
    <path d="M12 21.5C12 21.5 18.2 15.3 18.2 10.2C18.2 6.8 15.4 4 12 4C8.6 4 5.8 6.8 5.8 10.2C5.8 15.3 12 21.5 12 21.5Z" />
    {/* Inner dot circle */}
    <circle cx="12" cy="10.2" r="2.6" />
  </svg>
);

const FeedNavIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[23px] h-[23px] transition-all"
    stroke="currentColor"
    strokeWidth={isActive ? 2.4 : 1.65}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Rounded outer post card */}
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    {/* Mountain landscape peaks inside */}
    <path d="M6.8 12.8L9.8 9.6C10.2 9.2 10.8 9.2 11.2 9.6L13.8 12.4L15.2 11.1C15.6 10.7 16.2 10.7 16.6 11.1L17.5 12" />
    {/* Bottom text bar inside */}
    <line x1="7.2" y1="16.5" x2="12.2" y2="16.5" />
  </svg>
);

const SavedNavIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[23px] h-[23px] transition-all"
    stroke="currentColor"
    strokeWidth={isActive ? 2.4 : 1.65}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Heart outline */}
    <path d="M12 20.2C12 20.2 3.5 15.1 3.5 9.3C3.5 6.5 5.6 4.4 8.3 4.4C9.9 4.4 11.2 5.2 12 6.4C12.8 5.2 14.1 4.4 15.7 4.4C18.4 4.4 20.5 6.5 20.5 9.3C20.5 15.1 12 20.2 12 20.2Z" />
  </svg>
);

export const BottomNav: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navItems: {
    id: ActiveTab;
    label: string;
    renderIcon: (isActive: boolean) => React.ReactNode;
  }[] = [
    {
      id: 'home',
      label: 'HOME',
      renderIcon: (active) => <HomeNavIcon isActive={active} />,
    },
    {
      id: 'places',
      label: '장소',
      renderIcon: (active) => <PlacesNavIcon isActive={active} />,
    },
    {
      id: 'feed',
      label: '피드',
      renderIcon: (active) => <FeedNavIcon isActive={active} />,
    },
    {
      id: 'saved',
      label: '찜',
      renderIcon: (active) => <SavedNavIcon isActive={active} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-line-warm transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-[62px] px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center h-full py-1.5 transition-all active:scale-95 ${
                isActive
                  ? 'text-brand'
                  : 'text-ink-muted'
              }`}
              aria-label={item.label}
            >
              {/* Icon (thick stroke when active) */}
              <div className="flex items-center justify-center">
                {item.renderIcon(isActive)}
              </div>

              {/* Text label underneath */}
              <span
                className={`text-[11px] leading-tight mt-1 tracking-tight select-none transition-all ${
                  isActive
                    ? 'font-bold text-brand'
                    : 'font-medium text-ink-muted'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
