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
  creatures,
  usedCreatureIds,
  onPick,
  onClose,
}: CreaturePickerModalProps) {
  const [filter, setFilter] = useState<CollezioneFilterValue>('all');

  const available = useMemo(() => {
    const filtered = filter === 'all'
      ? creatures
      : creatures.filter((c) => c.type1 === filter);
    return filtered.filter((c) => c.owned);
  }, [creatures, filter]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/70 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-bg-elevated border-b border-border-subtle">
        <h2 className="text-sm font-bold text-text-primary">Scegli una creatura</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary text-lg leading-none px-2"
        >
          ✕
        </button>
      </div>

      <div className="px-4 py-2 bg-bg-base border-b border-border-subtle">
        <CollezioneFilter value={filter} onChange={setFilter} />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 bg-bg-base">
        {available.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-secondary">
            Nessuna creatura disponibile.
          </p>
        ) : (
          <ul className="grid grid-cols-4 gap-2">
            {available.map((creature) => {
              const inUse = usedCreatureIds.has(creature.id);
              return (
                <li key={creature.id}>
                  <button
                    type="button"
                    disabled={inUse}
                    onClick={() => onPick(creature)}
                    className={[
                      'flex flex-col items-center gap-1 w-full p-2 rounded-card border transition-colors',
                      inUse
                        ? 'opacity-40 border-border-subtle bg-bg-elevated cursor-not-allowed'
                        : 'border-border-subtle bg-bg-elevated hover:border-accent active:bg-bg-surface',
                    ].join(' ')}
                  >
                    <div className="aspect-square w-full flex items-center justify-center rounded-tile bg-bg-base">
                      <CreaturePortrait
                        pokedexPath={creature.pokedexPath}
                        name={creature.name}
                        size="80%"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-text-primary truncate w-full text-center">
                      {creature.name}
                    </span>
                    {inUse && (
                      <span className="text-[9px] text-accent-red">In squadra</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
