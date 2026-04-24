import type { ComponentType, SVGProps } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BoardIcon,
  FriendsIcon,
  HomeIcon,
  LeagueIcon,
  ShopIcon,
} from '@/components/icons';
import { bottomNavTabs } from '@/data';
import { routePaths } from '@/lib/routes';
import type { AppRoute } from '@/types';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconByRoute: Record<AppRoute, IconComponent> = {
  shop: ShopIcon,
  board: BoardIcon,
  home: HomeIcon,
  league: LeagueIcon,
  friends: FriendsIcon,
};

/**
 * Fixed bottom navigation.
 * Thumb-friendly (min 56px tall), 5 tabs in the exact mockup order.
 * Active tab uses the crimson accent + lifts the icon with a subtle tile bg.
 */
export function BottomNav() {
  return (
    <nav
      className="
        fixed inset-x-0 bottom-0 z-40
        mx-auto w-full max-w-app
        border-t border-border-subtle
        bg-bg-base/95 backdrop-blur supports-[backdrop-filter]:bg-bg-base/80
      "
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigazione principale"
    >
      <ul className="grid grid-cols-5">
        {bottomNavTabs.map((tab) => {
          const Icon = iconByRoute[tab.route];
          return (
            <li key={tab.route} className="contents">
              <NavLink
                to={routePaths[tab.route]}
                end
                className={({ isActive }) =>
                  [
                    'flex h-14 min-w-0 flex-col items-center justify-center gap-1 px-1',
                    'text-[10px] leading-none transition-colors',
                    isActive
                      ? 'text-accent-red'
                      : 'text-text-secondary hover:text-text-primary',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        'flex h-7 w-9 items-center justify-center rounded-card transition-colors',
                        isActive
                          ? 'bg-accent-red/15 ring-1 ring-inset ring-accent-red/40'
                          : 'bg-transparent',
                      ].join(' ')}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="max-w-full truncate leading-none">
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
