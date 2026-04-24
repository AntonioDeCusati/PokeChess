import type { NavTab } from '@/types';

/**
 * Bottom-navigation tabs — order matches every mockup:
 *   Negozio | Scacchiera | Home | Lega | Amici
 */
export const bottomNavTabs: readonly NavTab[] = [
  { route: 'shop',    label: 'Negozio',    icon: 'nav-shop' },
  { route: 'board',   label: 'Scacchiera', icon: 'nav-board' },
  { route: 'home',    label: 'Home',       icon: 'nav-home' },
  { route: 'league',  label: 'Lega',       icon: 'nav-league' },
  { route: 'friends', label: 'Amici',      icon: 'nav-friends' },
];
