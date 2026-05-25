import type { CreatureType } from '@/types';

export type CollezioneFilterValue = 'all' | 'owned' | CreatureType;

const TYPE_OPTIONS: Array<{ value: CreatureType; label: string; icon: string; color: string }> = [
  { value: 'normal',   label: 'Normale',  icon: '⚪', color: '#A8A878' },
  { value: 'fire',     label: 'Fuoco',    icon: '🔥', color: '#F08030' },
  { value: 'water',    label: 'Acqua',    icon: '💧', color: '#6890F0' },
  { value: 'grass',    label: 'Erba',     icon: '🌿', color: '#78C850' },
  { value: 'electric', label: 'Elettro',  icon: '⚡', color: '#F8D030' },
  { value: 'ice',      label: 'Ghiaccio', icon: '❄️', color: '#98D8D8' },
  { value: 'fighting', label: 'Lotta',    icon: '🥊', color: '#C03028' },
  { value: 'poison',   label: 'Veleno',   icon: '☠️', color: '#A040A0' },
  { value: 'ground',   label: 'Terra',    icon: '🏔️', color: '#E0C068' },
  { value: 'flying',   label: 'Volante',  icon: '🕊️', color: '#A890F0' },
  { value: 'psychic',  label: 'Psico',    icon: '🔮', color: '#F85888' },
  { value: 'bug',      label: 'Coleott.', icon: '🐛', color: '#A8B820' },
  { value: 'rock',     label: 'Roccia',   icon: '🪨', color: '#B8A038' },
  { value: 'ghost',    label: 'Spettro',  icon: '👻', color: '#705898' },
  { value: 'dragon',   label: 'Drago',    icon: '🐉', color: '#7038F8' },
  { value: 'dark',     label: 'Buio',     icon: '🌑', color: '#705848' },
  { value: 'steel',    label: 'Acciaio',  icon: '⚙️', color: '#B8B8D0' },
  { value: 'fairy',    label: 'Folletto', icon: '🧚', color: '#EE99AC' },
];

export interface CollezioneFilterProps {
  value: CollezioneFilterValue;
  onChange: (value: CollezioneFilterValue) => void;
  showOwnedFilter?: boolean;
}

export function CollezioneFilter({ value, onChange, showOwnedFilter }: CollezioneFilterProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
      <FilterPill
        active={value === 'all'}
        onClick={() => onChange('all')}
        label="Tutti"
      />
      {showOwnedFilter && (
        <FilterPill
          active={value === 'owned'}
          onClick={() => onChange('owned')}
          label="Posseduti"
          color="#3FA9F5"
        />
      )}
      {TYPE_OPTIONS.map((opt) => (
        <FilterPill
          key={opt.value}
          active={value === opt.value}
          onClick={() => onChange(opt.value)}
          label={opt.icon}
          title={opt.label}
          color={opt.color}
        />
      ))}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  title,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  title?: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition
        ${active
          ? 'ring-1 ring-inset'
          : 'bg-bg-elevated/60 text-text-secondary hover:bg-bg-elevated'
        }
      `}
      style={active && color
        ? { backgroundColor: color + '25', color, borderColor: color, '--tw-ring-color': color } as React.CSSProperties
        : active
          ? { backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff' }
          : undefined
      }
    >
      {label}
    </button>
  );
}
