import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

/**
 * Generic CRUD hook for admin entity pages.
 * Handles list, create, update, delete operations with loading/error state.
 */
export function useResource<T extends { id: string }>(basePath: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<T[]>(basePath);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore di caricamento');
    } finally {
      setLoading(false);
    }
  }, [basePath]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (body: Partial<T>) => {
    const created = await api.post<T>(basePath, body);
    await refresh();
    return created;
  }, [basePath, refresh]);

  const update = useCallback(async (id: string, body: Partial<T>) => {
    const updated = await api.put<T>(`${basePath}/${id}`, body);
    await refresh();
    return updated;
  }, [basePath, refresh]);

  const remove = useCallback(async (id: string) => {
    await api.del(`${basePath}/${id}`);
    await refresh();
  }, [basePath, refresh]);

  return { items, loading, error, refresh, create, update, remove };
}
