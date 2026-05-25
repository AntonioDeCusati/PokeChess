import { useNavigate } from 'react-router-dom';
import type { BattleState, EnergyBank } from '@/types/battle';
import type { CreatureType } from '@/types/common';

interface BattleEndScreenProps {
  state: BattleState;
  onRematch: () => void;
}

const TYPE_COLORS: Record<CreatureType, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', grass: '#78C850',
  electric: '#F8D030', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

const TYPE_LABELS: Record<CreatureType, string> = {
  normal: 'Normale', fire: 'Fuoco', water: 'Acqua', grass: 'Erba',
  electric: 'Elettro', ice: 'Ghiaccio', fighting: 'Lotta', poison: 'Veleno',
  ground: 'Terra', flying: 'Volante', psychic: 'Psico', bug: 'Coleott.',
  rock: 'Roccia', ghost: 'Spettro', dragon: 'Drago', dark: 'Buio',
  steel: 'Acciaio', fairy: 'Folletto',
};

const TYPE_ICONS: Record<CreatureType, string> = {
  normal: '⚪', fire: '🔥', water: '💧', grass: '🌿', electric: '⚡',
  ice: '❄️', fighting: '🥊', poison: '☠️', ground: '🏔️', flying: '🕊️',
  psychic: '🔮', bug: '🐛', rock: '🪨', ghost: '👻', dragon: '🐉',
  dark: '🌑', steel: '⚙️', fairy: '🧚',
};

function EnergyList({ bank }: { bank: EnergyBank }) {
  const active = (Object.entries(bank) as [CreatureType, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  if (active.length === 0) {
    return <p className="text-text-muted text-xs">Nessuna energia guadagnata</p>;
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {active.map(([type, amount]) => (
        <div
          key={type}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold"
          style={{ backgroundColor: TYPE_COLORS[type] + '30', color: TYPE_COLORS[type] }}
        >
          <span>{TYPE_ICONS[type]}</span>
          <span>{TYPE_LABELS[type]}</span>
          <span className="ml-1 rounded bg-black/20 px-1.5 py-0.5 text-xs">+{amount}</span>
        </div>
      ))}
    </div>
  );
}

export function BattleEndScreen({ state, onRematch }: BattleEndScreenProps) {
  const navigate = useNavigate();
  const won = state.status === 'won';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-bg-elevated p-6 text-center shadow-2xl border border-border-subtle">
        <div className={`text-5xl mb-3 ${won ? 'animate-bounce' : ''}`}>
          {won ? '🏆' : '💀'}
        </div>

        <h2 className={`text-2xl font-black mb-1 ${won ? 'text-accent' : 'text-danger'}`}>
          {won ? 'VITTORIA!' : 'SCONFITTA'}
        </h2>

        <p className="text-text-secondary text-sm mb-4">
          {won
            ? 'Hai catturato l\'allenatore avversario!'
            : 'Il tuo allenatore è stato catturato.'}
        </p>

        <div className="mb-5">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Energie Guadagnate
          </h3>
          <EnergyList bank={state.playerEnergy} />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 rounded-xl bg-bg-base py-2.5 text-sm font-bold text-text-primary border border-border-subtle hover:bg-bg-elevated transition"
          >
            Home
          </button>
          <button
            onClick={onRematch}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-black transition ${
              won
                ? 'bg-accent hover:bg-accent/90'
                : 'bg-danger hover:bg-danger/90 text-white'
            }`}
          >
            Rivincita
          </button>
        </div>
      </div>
    </div>
  );
}
