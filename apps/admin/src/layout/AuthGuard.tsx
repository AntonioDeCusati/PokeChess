import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LoginPage } from '@/pages/LoginPage';

export function AuthGuard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-base">
        <p className="text-sm text-text-secondary">Caricamento…</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return <Outlet />;
}
