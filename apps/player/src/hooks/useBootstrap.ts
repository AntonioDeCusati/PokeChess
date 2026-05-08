import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { UserCreature } from '@/types';

interface TeamSlotDto {
  index: number;
  creatureId: string;
  creatureSlug: string;
  moveId: string;
}

interface BootstrapData {
  creatures: UserCreature[];
  team: { slots: TeamSlotDto[] };
}

interface UseBootstrapResult {
  creatures: UserCreature[];
  team: { slots: TeamSlotDto[] } | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBootstrap(): UseBootstrapResult {
  const { user } = useAuth();
  const [creatures, setCreatures] = useState<UserCreature[]>([]);
  const [team, setTeam] = useState<{ slots: TeamSlotDto[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    api.get<BootstrapData>('/app/bootstrap')
      .then((data) => {
        setCreatures(data.creatures);
        setTeam(data.team);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Errore caricamento dati');
      })
      .finally(() => setLoading(false));
  }, [user, tick]);

  const refetch = () => setTick((t) => t + 1);

  return { creatures, team, loading, error, refetch };
}
