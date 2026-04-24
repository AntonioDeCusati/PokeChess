import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';

/**
 * Admin backoffice layout.
 *
 * Desktop-first: left sidebar (fixed), top bar (fixed), content area scrolls.
 * Deliberately DIFFERENT from the player's mobile AppShell.
 */
export function AdminShell() {
  return (
    <div className="flex min-h-dvh bg-surface-base text-text-primary">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
