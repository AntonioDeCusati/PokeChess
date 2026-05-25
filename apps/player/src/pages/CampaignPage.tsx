import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { CreaturePortrait } from '@/components/CreaturePortrait';

interface NpcCreature {
  id: string;
  name: string;
  pokedexPath: string;
  type1: string;
  type2: string | null;
}

interface NpcTrainerSlot {
  tier: string;
  slotIndex: number;
  creature: NpcCreature;
}

interface NpcTrainer {
  id: string;
  slug: string;
  name: string;
  role: string;
  region: string;
  typeSpecialty: string | null;
  slots: NpcTrainerSlot[];
}

type Difficulty = 'base' | 'intermediate' | 'final';

const DIFFICULTY_META: Record<Difficulty, { label: string; color: string; stars: number }> = {
  base:         { label: 'Facile',    color: 'text-green-400 bg-green-500/15 border-green-500/30', stars: 1 },
  intermediate: { label: 'Medio',     color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30', stars: 2 },
  final:        { label: 'Difficile', color: 'text-red-400 bg-red-500/15 border-red-500/30', stars: 3 },
};

const ROLE_LABELS: Record<string, string> = {
  professor: 'Professore',
  gym_leader: 'Capopalestra',
  elite_four: 'Superquattro',
  champion: 'Campione',
  kahuna: 'Kahuna',
  captain: 'Capitano',
  rival: 'Rivale',
  leader: 'Leader',
  elite: 'Elite',
};

interface CampaignPageProps {
  mode?: 'campaign' | 'training';
}

export function CampaignPage({ mode = 'campaign' }: CampaignPageProps) {
  const nav = useNavigate();
  const [trainers, setTrainers] = useState<NpcTrainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);

  const region = mode === 'training' ? 'Speciali' : 'Kanto';
  const title = mode === 'training' ? 'Allenamento' : 'Road to Champions';

  useEffect(() => {
    api.get<{ trainers: NpcTrainer[] }>(`/npc-trainers?region=${region}`)
      .then((d) => setTrainers(d.trainers))
      .catch((err) => console.error('Failed to load trainers:', err))
      .finally(() => setLoading(false));
  }, [region]);

  const handleStartBattle = (trainer: NpcTrainer, difficulty: Difficulty) => {
    nav('/battle', { state: { npcTrainerId: trainer.id, difficulty, npcName: trainer.name } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-3 border-b border-border-subtle bg-bg-elevated">
        <button
          onClick={() => nav('/league')}
          className="text-text-secondary hover:text-text-primary text-sm"
        >
          ← Indietro
        </button>
        <div>
          <h1 className="text-sm font-bold text-accent">{title}</h1>
          <p className="text-[10px] text-text-secondary">{region}</p>
        </div>
      </div>

      {/* Trainer list */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {loading ? (
          <p className="py-10 text-center text-xs text-text-secondary">Caricamento...</p>
        ) : trainers.length === 0 ? (
          <p className="py-10 text-center text-xs text-text-secondary">
            Nessun allenatore trovato.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {trainers.map((trainer) => (
              <li key={trainer.id}>
                <TrainerCard
                  trainer={trainer}
                  isExpanded={selectedTrainerId === trainer.id}
                  onToggle={() =>
                    setSelectedTrainerId(selectedTrainerId === trainer.id ? null : trainer.id)
                  }
                  onStartBattle={(d) => handleStartBattle(trainer, d)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function TrainingPage() {
  return <CampaignPage mode="training" />;
}

// ---------------------------------------------------------------------------

function TrainerCard({
  trainer,
  isExpanded,
  onToggle,
  onStartBattle,
}: {
  trainer: NpcTrainer;
  isExpanded: boolean;
  onToggle: () => void;
  onStartBattle: (d: Difficulty) => void;
}) {
  return (
    <div
      className={`
        rounded-card border bg-bg-elevated overflow-hidden transition
        ${isExpanded ? 'border-accent/40' : 'border-border-subtle'}
      `}
    >
      {/* Main row — no pokemon preview, just trainer info */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2.5 w-full p-2.5 text-left"
      >
        <div className="shrink-0 w-11 h-11 rounded-lg bg-bg-base border border-border-subtle flex items-center justify-center overflow-hidden">
          <CreaturePortrait pokedexPath="0000" name={trainer.name} size="90%" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-text-primary truncate">{trainer.name}</span>
            {trainer.typeSpecialty && trainer.typeSpecialty !== 'Misto' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
                {trainer.typeSpecialty}
              </span>
            )}
          </div>
          <p className="text-[10px] text-text-secondary">
            {ROLE_LABELS[trainer.role] ?? trainer.role}
          </p>
        </div>

        <svg
          className={`w-4 h-4 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Expanded: 3 difficulty tiers with team preview + energy estimate */}
      {isExpanded && (
        <div className="px-2.5 pb-2.5 flex flex-col gap-2">
          {(['base', 'intermediate', 'final'] as Difficulty[]).map((d) => {
            const meta = DIFFICULTY_META[d];
            const teamSlots = trainer.slots
              .filter((s) => s.tier === d)
              .sort((a, b) => a.slotIndex - b.slotIndex);

            return (
              <DifficultyRow
                key={d}
                difficulty={d}
                meta={meta}
                teamSlots={teamSlots}
                onStart={() => onStartBattle(d)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function DifficultyRow({
  difficulty,
  meta,
  teamSlots,
  onStart,
}: {
  difficulty: Difficulty;
  meta: { label: string; color: string; stars: number };
  teamSlots: NpcTrainerSlot[];
  onStart: () => void;
}) {
  const energyEstimate = difficulty === 'base' ? 6 : difficulty === 'intermediate' ? 12 : 18;

  return (
    <button
      type="button"
      onClick={onStart}
      className={`
        w-full rounded-lg border p-2.5 text-left transition
        hover:brightness-110 active:scale-[0.98]
        ${meta.color}
      `}
    >
      {/* Top: difficulty label + stars + energy */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold">{meta.label}</span>
          <span className="text-[10px]">
            {'★'.repeat(meta.stars)}{'☆'.repeat(3 - meta.stars)}
          </span>
        </div>
        <span className="text-[9px] font-semibold opacity-80">
          ~{energyEstimate} energia
        </span>
      </div>

      {/* Bottom: pokemon preview */}
      <div className="flex gap-1">
        {teamSlots.slice(0, 6).map((slot) => (
          <div
            key={slot.slotIndex}
            className="w-8 h-8 rounded bg-black/20 flex items-center justify-center overflow-hidden"
          >
            <CreaturePortrait
              pokedexPath={slot.creature.pokedexPath}
              name={slot.creature.name}
              size="90%"
            />
          </div>
        ))}
        {teamSlots.length === 0 && (
          <span className="text-[9px] opacity-60">Squadra vuota</span>
        )}
      </div>
    </button>
  );
}
