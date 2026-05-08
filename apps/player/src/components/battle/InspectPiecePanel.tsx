import type { BattlePiece } from '@/types/battle';
import { MoveIcon } from '@/components/icons';
import { AnimatedSprite } from './AnimatedSprite';

interface InspectPiecePanelProps {
  piece: BattlePiece;
}

const MOVE_LABELS: Record<string, string> = {
  rook: 'Torre',
  'l-shape': 'Cavallo',
  diagonal: 'Alfiere',
  king: 'Re',
  pawn: 'Soldato',
  projection: 'Regina',
  horizontal: 'Orizzontale',
  vertical: 'Verticale',
  jump: 'Salto',
};

export function InspectPiecePanel({ piece }: InspectPiecePanelProps) {
  const hpPct = Math.round((piece.hp / piece.maxHp) * 100);

  return (
    <div className="mx-3 mt-2 flex items-center gap-3 rounded-card border border-red-500/30 bg-bg-elevated/95 backdrop-blur p-3 shadow-card">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-card border border-red-500/40 bg-bg-surface">
        <AnimatedSprite
          pokedexPath={piece.pokedexPath}
          owner={piece.owner}
          size={44}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
            Avversario
          </span>
          {piece.isTrainer && (
            <span className="text-[9px] rounded bg-yellow-500/20 px-1.5 py-0.5 font-bold text-yellow-400">
              Allenatore
            </span>
          )}
        </div>

        <span className="truncate text-sm font-semibold text-text-primary">
          {piece.name}
        </span>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-text-secondary">
            <MoveIcon pattern={piece.movementType} className="h-4 w-4 text-red-400" />
            <span className="text-[11px]">
              {MOVE_LABELS[piece.movementType] ?? piece.movementType}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-bg-base">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{ width: `${hpPct}%` }}
              />
            </div>
            <span className="text-[10px] text-red-400">
              {piece.hp}/{piece.maxHp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
