import { Outlet, ScrollRestoration } from 'react-router-dom';
import { GameHeader } from './GameHeader';
import { BottomNav } from './BottomNav';
import { useProfile } from '@/hooks/useProfile';

/**
 * Global app frame.
 *
 * Mobile-first:
 *   - centered max-w-app (~420px) column
 *   - fixed GameHeader (top) + fixed BottomNav (bottom)
 *   - content in <main> scrolls between them
 *
 * Spacing strategy:
 *   The header is ~74px (+safe-area-inset-top) and the footer is ~56px
 *   (+safe-area-inset-bottom). We reserve space via padding-top / padding-bottom
 *   on <main> so content never hides behind the fixed bars.
 */
export function AppShell() {
  const { profile } = useProfile();

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-app flex-col bg-bg-base">
      <GameHeader profile={profile} />

      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: 'calc(74px + env(safe-area-inset-top))',
          paddingBottom: 'calc(68px + env(safe-area-inset-bottom))',
        }}
      >
        <Outlet />
      </main>

      <BottomNav />

      <ScrollRestoration />
    </div>
  );
}
