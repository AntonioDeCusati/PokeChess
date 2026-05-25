import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { PlayerProfile } from '@/types';
import { playerProfile as mockProfile } from '@/data';

interface ApiProfile {
  id: string;
  username: string;
  email: string;
  level: number;
  exp: number;
  expToNext: number;
  wallet: { gold: number; gems: number };
}

function apiToPlayerProfile(p: ApiProfile): PlayerProfile {
  return {
    id: p.id as any,
    username: p.username,
    avatar: mockProfile.avatar,
    experience: { level: p.level, current: p.exp, max: p.expToNext },
    wallet: { gold: p.wallet.gold, gem: p.wallet.gems },
  };
}

interface ProfileContextValue {
  profile: PlayerProfile;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PlayerProfile>(mockProfile);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.get<{ profile: ApiProfile }>('/user/profile')
      .then((res) => setProfile(apiToPlayerProfile(res.profile)))
      .catch(() => {});
  }, [user, tick]);

  const refreshProfile = useCallback(() => setTick((t) => t + 1), []);

  return (
    <ProfileContext.Provider value={{ profile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
