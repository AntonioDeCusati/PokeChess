import { useMemo, useState } from 'react';
import { Section } from '@/components/Section';
import type { UserCreature } from '@/types';
import { CreatureCard } from './CreatureCard';
import {
  CollezioneFilter,
  type CollezioneFilterValue,
} from './CollezioneFilter';

export interface CollezioneSectionProps {
  creatures: readonly UserCreature[];
  columns?: 3 | 4 | 5;
  onSelectCreature?: (creature: UserCreature) => void;
}

export function CollezioneSection({
  creatures,
  columns = 5,
  onSelectCreature,
}: CollezioneSectionProps) {
  const [filter, setFilter] = useState<CollezioneFilterValue>('all');

  const visible = useMemo(
    () =>
      filter === 'all'
        ? creatures
        : creatures.filter((c) => c.type1 === filter),
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
