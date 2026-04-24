import type { CreatureType } from '@/types';

export type CollezioneFilterValue = 'all' | CreatureType;

const FILTER_OPTIONS: Array<{ value: CollezioneFilterValue; label: string }> = [
  { value: 'all',      label: 'Tutti' },
  { value: 'fire',     label: 'Fuoco' },
  { value: 'water',    label: 'Acqua' },
  { value: 'grass',    label: 'Natura' },
  { value: 'electric', label: 'Elettro' },
  { value: 'poison',   label: 'Veleno' },
  { value: 'dark',     label: 'Oscurità' },
  { value: 'ghost',    label: 'Spettro' },
  { value: 'dragon',   label: 'Drago' },
  { value: 'light',    label: 'Luce' },
];

export interface CollezioneFilterProps {
  value: CollezioneFilterValue;
  onChange: (value: CollezioneFilterValue) => void;
}

/** Native <select> styled for the dark theme — fastest + most mobile-friendly. */
export function CollezioneFilter({ value, onChange }: CollezioneFilterProps) {
  return (
    <label className="flex items-center gap-1 text-xxs text-text-secondary">
      <span className="hidden sm:inline">Filtra:</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as CollezioneFilterValue)}
          className="
            appearance-none rounded-tile border border-border-subtle
            bg-bg-elevated py-1 pl-2 pr-6 text-xxs font-medium text-text-primary
            focus:border-accent focus:outline-none
          "
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Filtra: {opt.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-secondary"
        >
          <path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  );
}
