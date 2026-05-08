import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api, setToken, clearToken, isAuthenticated, ApiError } from './api';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      api.get<{ user: User }>('/auth/me')
        .then((r) => setUser(r.user))
        .catch(() => clearToken())
        .finally(() => setLoading(false));
      return;
    }

    if (import.meta.env.DEV) {
      api.post<{ token: string; user: User }>('/auth/login', {
        identifier: 'test',
        password: 'test',
      })
        .then((res) => { setToken(res.token); setUser(res.user); })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    setError(null);
    try {
      const res = await api.post<{ token: string; user: User }>('/auth/login', {
        identifier,
        password,
      });
      setToken(res.token);
      setUser(res.user);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Errore di connessione';
      setError(msg);
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
