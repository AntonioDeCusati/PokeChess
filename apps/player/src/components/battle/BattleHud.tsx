import type { BattleState } from '@/types/battle';

interface BattleHudProps {
  state: BattleState;
}

function PlayerBar({
  name,
  label,
  isActive,
  side,
}: {
  name: string;
  label: string;
  isActive: boolean;
  side: 'left' | 'right';
}) {
  return (
    <div className={`flex items-center gap-2 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
      <div
        className={`
          flex h-8 w-8 shrink-0 items-center justify-center rounded-full
          text-xs font-bold
          ${isActive
            ? 'bg-accent text-black ring-2 ring-accent/50'
            : 'bg-bg-elevated text-text-secondary ring-1 ring-border-subtle'
          }
        `}
      >
        {label}
      </div>
      <div className={`flex flex-col ${side === 'right' ? 'items-end' : ''}`}>
        <span className={`text-xs font-semibold ${isActive ? 'text-accent' : 'text-text-primary'}`}>
          {name}
        </span>
      </div>
    </div>
  );
}

export function BattleHud({ state }: BattleHudProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-bg-base/90 backdrop-blur border-b border-border-subtle">
      <PlayerBar
        name={state.opponent.name}
        label={state.opponent.avatarLabel}
        isActive={state.currentTurn === 'opponent'}
        side="left"
      />

      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Turno
        </span>
        <span className={`
          text-sm font-bold
          ${state.currentTurn === 'player' ? 'text-accent' : 'text-danger'}
        `}>
          {state.turnNumber}
        </span>
      </div>

      <PlayerBar
        name={state.player.name}
        label={state.player.avatarLabel}
        isActive={state.currentTurn === 'player'}
        side="right"
      />
    </div>
  );
}
