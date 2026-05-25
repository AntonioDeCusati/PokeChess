import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export type ChestTier = 'wood' | 'iron' | 'gold' | 'diamond';

export interface ChestSlot {
  tier: ChestTier;
  quantity: number;
}

export interface ChestOpenResult {
  creature: {
    id: string;
    slug: string;
    name: string;
    pokedexPath: string;
    type1: string;
    type2: string | null;
    rarity: string;
  };
  isNew: boolean;
  wasPity: boolean;
}

export function useChests() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<ChestSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.get<ChestSlot[]>('/chests');
      setSlots(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const openChest = useCallback(async (tier: ChestTier): Promise<ChestOpenResult> => {
    const result = await api.post<ChestOpenResult>(`/chests/${tier}/open`, {});
    await fetchInventory();
    return result;
  }, [fetchInventory]);

  const buyChest = useCallback(async (tier: ChestTier): Promise<ChestOpenResult> => {
    const result = await api.post<ChestOpenResult>(`/chests/${tier}/buy`, {});
    await fetchInventory();
    return result;
  }, [fetchInventory]);

  const grantChest = useCallback(async (tier: ChestTier, quantity: number) => {
    await api.post('/chests/grant', { tier, quantity });
    await fetchInventory();
  }, [fetchInventory]);

  return { slots, loading, openChest, buyChest, grantChest, refetch: fetchInventory };
}
