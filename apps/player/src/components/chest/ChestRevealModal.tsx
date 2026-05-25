import { useEffect, useState } from 'react';
import { AnimatedSprite } from '@/components/battle/AnimatedSprite';

interface RevealCreature {
  name: string;
  pokedexPath: string;
  type1: string;
  type2: string | null;
  rarity: string;
}

interface ChestRevealModalProps {
  creature: RevealCreature;
  isNew: boolean;
  wasPity: boolean;
  onClose: () => void;
}

const RARITY_STYLES: Record<string, { bg: string; border: string; glow: string; label: string }> = {
  common:    { bg: 'from-gray-800 to-gray-900',    border: 'border-gray-500',   glow: 'shadow-gray-500/30',    label: 'Comune' },
  rare:      { bg: 'from-blue-900 to-blue-950',    border: 'border-blue-400',   glow: 'shadow-blue-400/40',    label: 'Raro' },
  epic:      { bg: 'from-purple-900 to-purple-950', border: 'border-purple-400', glow: 'shadow-purple-400/50',  label: 'Epico' },
  legendary: { bg: 'from-yellow-800 to-amber-950',  border: 'border-yellow-400', glow: 'shadow-yellow-400/60',  label: 'Leggendario' },
};

type Phase = 'shake' | 'burst' | 'reveal';

export function ChestRevealModal({ creature, isNew, wasPity, onClose }: ChestRevealModalProps) {
  const [phase, setPhase] = useState<Phase>('shake');
  const style = RARITY_STYLES[creature.rarity] ?? RARITY_STYLES.common;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('burst'), 1200);
    const t2 = setTimeout(() => setPhase('reveal'), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={phase === 'reveal' ? onClose : undefined}
    >
      {phase === 'shake' && (
        <div className="animate-chest-shake">
          <svg width="120" height="120" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="35" width="60" height="35" rx="4" fill="#B8860B" />
            <path d="M8 35 C8 25, 15 15, 40 12 C65 15, 72 25, 72 35 L8 35Z" fill="#DAA520" />
            <rect x="10" y="33" width="60" height="5" rx="1" fill="#FFD700" />
            <rect x="33" y="38" width="14" height="14" rx="3" fill="#FFD700" />
            <circle cx="40" cy="45" r="2" fill="#FFE555" />
          </svg>
        </div>
      )}

      {phase === 'burst' && (
        <div className="animate-chest-burst flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-white/90 blur-xl" />
        </div>
      )}

      {phase === 'reveal' && (
        <div className="mx-4 w-full max-w-xs animate-fade-in-up">
          <div
            className={`
              flex flex-col items-center gap-4 rounded-2xl border-2 p-6
              bg-gradient-to-b ${style.bg} ${style.border}
              shadow-2xl ${style.glow}
            `}
          >
            {wasPity && (
              <span className="rounded-full bg-yellow-500/20 px-3 py-0.5 text-[10px] font-bold text-yellow-300 uppercase tracking-wider">
                Pity garantito
              </span>
            )}

            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 bg-gradient-to-br ${style.bg}`} />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-black/30">
                <AnimatedSprite
                  pokedexPath={creature.pokedexPath}
                  owner="player"
                  size={96}
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-black text-white">{creature.name}</p>
              <p className={`text-xs font-bold uppercase tracking-widest ${
                creature.rarity === 'legendary' ? 'text-yellow-300' :
                creature.rarity === 'epic' ? 'text-purple-300' :
                creature.rarity === 'rare' ? 'text-blue-300' :
                'text-gray-300'
              }`}>
                {style.label}
              </p>
            </div>

            {isNew && (
              <span className="rounded-lg bg-green-500/20 px-4 py-1 text-sm font-bold text-green-300 border border-green-500/30">
                NUOVO!
              </span>
            )}

            {!isNew && (
              <span className="text-xs text-gray-400">
                Già nella tua collezione
              </span>
            )}

            <button
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-white/10 py-2.5 text-sm font-bold text-white hover:bg-white/20 transition border border-white/10"
            >
              Continua
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
