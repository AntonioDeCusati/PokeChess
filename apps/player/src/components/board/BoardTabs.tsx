import type { BoardTab } from '@/types';

export interface BoardTabsProps {
  value: BoardTab;
  onChange: (tab: BoardTab) => void;
}

const tabs: Array<{ id: BoardTab; label: string }> = [
  { id: 'board', label: 'SCACCHIERA' },
  { id: 'collection', label: 'COLLEZIONE' },
];

/**
 * The top segmented tabs on the Board screen.
 * Active tab has a red underline + bright label, inactive is muted.
 */
export function BoardTabs({ value, onChange }: BoardTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Sezioni scacchiera"
      className="grid grid-cols-2 border-b border-border-subtle"
    >
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={[
              'relative h-11 text-[13px] font-semibold tracking-[0.1em] transition-colors',
              active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
            ].join(' ')}
          >
            {t.label}
            <span
              aria-hidden
              className={[
                'pointer-events-none absolute inset-x-4 -bottom-px h-[3px] rounded-t-full transition-opacity',
                active ? 'bg-accent-red opacity-100' : 'opacity-0',
              ].join(' ')}
            />
          </button>
        );
      })}
    </div>
  );
}
