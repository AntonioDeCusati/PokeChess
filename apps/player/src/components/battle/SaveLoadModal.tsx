import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface SavedGameItem {
  id: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SaveLoadModalProps {
  onLoad: (state: unknown) => void;
  onClose: () => void;
}

export function SaveLoadModal({ onLoad, onClose }: SaveLoadModalProps) {
  const [saves, setSaves] = useState<SavedGameItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ saves: SavedGameItem[] }>('/saves')
      .then((d) => setSaves(d.saves))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLoad = async (id: string) => {
    try {
      const save = await api.get<{ state: unknown }>(`/saves/${id}`);
      onLoad(save.state);
    } catch {
      alert('Errore nel caricamento della partita');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.del(`/saves/${id}`);
      setSaves((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Errore nella cancellazione');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-xl border border-border-subtle bg-bg-elevated overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
          <h2 className="text-sm font-bold text-text-primary">Partite Salvate</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-lg px-1">✕</button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {loading ? (
            <p className="py-8 text-center text-xs text-text-secondary">Caricamento...</p>
          ) : saves.length === 0 ? (
            <p className="py-8 text-center text-xs text-text-secondary">Nessun salvataggio trovato.</p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {saves.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">
                      {s.name || 'Partita senza nome'}
                    </p>
                    <p className="text-[10px] text-text-secondary">
                      {new Date(s.updatedAt).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex gap-1.5 ml-2">
                    <button
                      onClick={() => handleLoad(s.id)}
                      className="text-[10px] font-semibold text-accent px-2 py-1 rounded bg-accent/10 hover:bg-accent/20"
                    >
                      Carica
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-[10px] font-semibold text-accent-red px-2 py-1 rounded bg-accent-red/10 hover:bg-accent-red/20"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
