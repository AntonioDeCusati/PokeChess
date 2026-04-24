import type { AppRoute } from '@/types';

/**
 * Single source of truth mapping every `AppRoute` to its URL path.
 * Used by both the router (to register routes) and the BottomNav
 * (to resolve `NavLink` targets).
 */
export const routePaths = {
  home: '/home',
  board: '/board',
  shop: '/shop',
  league: '/league',
  friends: '/friends',
} as const satisfies Record<AppRoute, `/${string}`>;

export type RoutePath = (typeof routePaths)[AppRoute];
