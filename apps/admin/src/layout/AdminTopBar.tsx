import { useAuth } from '@/lib/auth';

export function AdminTopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border-subtle bg-surface-elevated px-6">
      <h1 className="text-sm font-semibold text-text-primary">
        Admin Backoffice
      </h1>

      <div className="ml-auto flex items-center gap-3">
        {user && (
          <span className="text-xs text-text-secondary">
            {user.username}
          </span>
        )}
        <span className="rounded-control border border-border-subtle bg-surface-muted px-2 py-1 text-[11px] text-text-secondary">
          env: local
        </span>
        {user && (
          <button
            onClick={logout}
            className="rounded-control border border-border-subtle px-3 py-1 text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-status-danger transition-colors"
          >
            Esci
          </button>
        )}
      </div>
    </header>
  );
}
