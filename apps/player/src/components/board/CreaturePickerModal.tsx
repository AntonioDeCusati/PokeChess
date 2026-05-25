import { useMemo, useState } from 'react';
import type { UserCreature } from '@/types';
import { CreaturePortrait } from '@/components/CreaturePortrait';
import { CollezioneFilter, type CollezioneFilterValue } from './CollezioneFilter';

interface CreaturePickerModalProps {
  creatures: UserCreature[];
  usedCreatureIds: Set<string>;
  onPick: (creature: UserCreature) => void;
  onClose: () => void;
}

export function CreaturePickerModal({
  creatures = [],
  usedCreatureIds,
  onPick,
  onClose,
}: CreaturePickerModalProps) {
  const [filter, setFilter] = useState<CollezioneFilterValue>('all');
  const [search, setSearch] = useState('');

  const available = useMemo(() => {
    let list = creatures.filter((c) => c.owned);
    if (filter !== 'all' && filter !== 'owned') {
      list = list.filter((c) => c.type1 === filter || c.type2 === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [creatures, filter, search]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-bg-base">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-subtle bg-bg-elevated">
        <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">Scegli Creatura</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-base text-text-secondary hover:text-text-primary text-sm"
        >
          ✕
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-1.5 border-b border-border-subtle">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per nome..."
          className="w-full rounded-lg border border-border-subtle bg-bg-elevated px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-secondary/50 focus:border-accent focus:outline-none"
        />
      </div>

      {/* Type filters */}
      <div className="px-2 py-1 border-b border-border-subtle">
        <CollezioneFilter value={filter} onChange={setFilter} />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {available.length === 0 ? (
          <p className="py-10 text-center text-xs text-text-secondary">
            Nessuna creatura disponibile.
          </p>
        ) : (
          <div className="grid grid-cols-5 gap-1.5">
            {available.map((creature) => {
              const inUse = usedCreatureIds.has(creature.id);
              return (
                <button
                  key={creature.id}
                  type="button"
                  disabled={inUse}
                  onClick={() => onPick(creature)}
                  className={`
                    flex flex-col items-center gap-0.5 rounded-lg border p-1 transition
                    ${inUse
                      ? 'opacity-30 border-border-subtle bg-bg-elevated cursor-not-allowed'
                      : 'border-border-subtle bg-bg-elevated hover:border-accent active:bg-bg-surface'
                    }
                  `}
                >
                  <div className="aspect-square w-full flex items-center justify-center rounded bg-bg-base">
                    <CreaturePortrait
                      pokedexPath={creature.pokedexPath}
                      name={creature.name}
                      size="85%"
                    />
                  </div>
                  <span className="text-[9px] font-medium text-text-primary truncate w-full text-center leading-tight">
                    {creature.name}
                  </span>
                  {inUse && (
                    <span className="text-[8px] text-accent-red leading-none">In uso</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
