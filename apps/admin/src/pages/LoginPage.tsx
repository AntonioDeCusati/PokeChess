import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export function LoginPage() {
  const { login, error } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(identifier, password);
    } catch {
      // error is set in auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-base p-4">
      <div className="w-full max-w-sm rounded-card border border-border-subtle bg-surface-elevated p-8 shadow-card">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-text-primary">PokeChess Admin</h1>
          <p className="mt-1 text-sm text-text-secondary">Accedi al backoffice</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-secondary">Email o username</span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full rounded-control border border-border-subtle bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
              placeholder="admin@pokechess.it"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-secondary">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-control border border-border-subtle bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="rounded-control bg-red-50 px-3 py-2 text-xs font-medium text-status-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-control bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50 transition-colors"
          >
            {loading ? 'Accesso…' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}
