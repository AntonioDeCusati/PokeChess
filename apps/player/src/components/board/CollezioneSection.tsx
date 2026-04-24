import { useMemo, useState } from 'react';
import { Section } from '@/components/Section';
import { creatures as allCreatures } from '@/data';
import type { Creature } from '@/types';
import { CreatureCard } from './CreatureCard';
import {
  CollezioneFilter,
  type CollezioneFilterValue,
} from './CollezioneFilter';

export interface CollezioneSectionProps {
  creatures?: readonly Creature[];
  /** Optional grid density override; default matches the mockup (5 cols). */
  columns?: 3 | 4 | 5;
  onSelectCreature?: (creature: Creature) => void;
}

/**
 * "COLLEZIONE" — filterable creature grid.
 * Default layout mirrors the mockup: 5 columns, 3 rows visible.
 */
export function CollezioneSection({
  creatures = allCreatures,
  columns = 5,
  onSelectCreature,
}: CollezioneSectionProps) {
  const [filter, setFilter] = useState<CollezioneFilterValue>('all');

  const visible = useMemo(
    () =>
      filter === 'all'
        ? creatures
        : creatures.filter((c) => c.type === filter),
    [creatures, filter],
  );

  const gridColsClass =
    columns === 3 ? 'grid-cols-3' : columns === 4 ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <Section
      title="COLLEZIONE"
      headerRight={<CollezioneFilter value={filter} onChange={setFilter} />}
    >
      {visible.length === 0 ? (
        <p className="py-6 text-center text-xs text-text-secondary">
          Nessuna creatura di questo tipo.
        </p>
      ) : (
        <ul className={`grid ${gridColsClass} gap-2`}>
          {visible.map((creature) => (
            <li key={creature.id}>
              <CreatureCard creature={creature} onClick={onSelectCreature} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
