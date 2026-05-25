import type { BattleState, EnergyBank } from '@/types/battle';
import type { CreatureType } from '@/types/common';

interface BattleHudProps {
  state: BattleState;
}

const TYPE_COLORS: Record<CreatureType, string> = {
  normal:   '#A8A878',
  fire:     '#F08030',
  water:    '#6890F0',
  grass:    '#78C850',
  electric: '#F8D030',
  ice:      '#98D8D8',
  fighting: '#C03028',
  poison:   '#A040A0',
  ground:   '#E0C068',
  flying:   '#A890F0',
  psychic:  '#F85888',
  bug:      '#A8B820',
  rock:     '#B8A038',
  ghost:    '#705898',
  dragon:   '#7038F8',
  dark:     '#705848',
  steel:    '#B8B8D0',
  fairy:    '#EE99AC',
};

const TYPE_LABELS: Record<CreatureType, string> = {
  normal: '⚪', fire: '🔥', water: '💧', grass: '🌿', electric: '⚡',
  ice: '❄️', fighting: '🥊', poison: '☠️', ground: '🏔️', flying: '🕊️',
  psychic: '🔮', bug: '🐛', rock: '🪨', ghost: '👻', dragon: '🐉',
  dark: '🌑', steel: '⚙️', fairy: '🧚',
};

function EnergyRow({ bank, align }: { bank: EnergyBank; align: 'left' | 'right' }) {
  const active = (Object.entries(bank) as [CreatureType, number][])
    .filter(([, v]) => v > 0);

  if (active.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${align === 'right' ? 'justify-end' : ''}`}>
      {active.map(([type, amount]) => (
        <span
          key={type}
          className="flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: TYPE_COLORS[type] + '25', color: TYPE_COLORS[type] }}
          title={type}
        >
          {TYPE_LABELS[type]}{amount}
        </span>
      ))}
    </div>
  );
}

function PlayerBar({
  name,
  label,
  isActive,
  side,
  energy,
}: {
  name: string;
  label: string;
  isActive: boolean;
  side: 'left' | 'right';
  energy: EnergyBank;
}) {
  return (
    <div className={`flex flex-col gap-1 ${side === 'right' ? 'items-end' : 'items-start'}`}>
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
        <span className={`text-xs font-semibold ${isActive ? 'text-accent' : 'text-text-primary'}`}>
          {name}
        </span>
      </div>
      <EnergyRow bank={energy} align={side} />
    </div>
  );
}

export function BattleHud({ state }: BattleHudProps) {
  return (
    <div className="flex items-start justify-between px-3 py-2 bg-bg-base/90 backdrop-blur border-b border-border-subtle">
      <PlayerBar
        name={state.opponent.name}
        label={state.opponent.avatarLabel}
        isActive={state.currentTurn === 'opponent'}
        side="left"
        energy={state.opponentEnergy}
      />

      <div className="flex flex-col items-center gap-0.5 pt-1">
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
        energy={state.playerEnergy}
      />
    </div>
  );
}
