import type { BattlePiece } from '@/types/battle';
import { MoveIcon } from '@/components/icons';
import { Button } from '@/components/Button';
import { AnimatedSprite } from './AnimatedSprite';

interface SelectedPiecePanelProps {
  piece: BattlePiece;
  onMove: () => void;
  onAbility: () => void;
  onInfo: () => void;
  onCancel: () => void;
}

export function SelectedPiecePanel({
  piece,
  onMove,
  onAbility,
  onInfo,
  onCancel,
}: SelectedPiecePanelProps) {
  return (
    <div className="mx-3 mt-2 flex items-center gap-3 rounded-card border border-border-subtle bg-bg-elevated/95 backdrop-blur p-3 shadow-card">
      {/* Creature animated preview */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-card border border-border-strong bg-bg-surface">
        <AnimatedSprite
          pokedexPath={piece.pokedexPath}
          owner={piece.owner}
          size={44}
        />
      </div>

      {/* Info column */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm font-semibold text-text-primary">
          {piece.name}
        </span>
        <div className="flex items-center gap-1 text-text-secondary">
          <MoveIcon pattern={piece.movementType} className="h-4 w-4 text-accent" />
          <span className="text-[11px] capitalize">{piece.movementType}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-1.5 shrink-0">
        <Button variant="accent" size="xs" onClick={onMove}>
          Muovi
        </Button>
        <Button variant="ghost" size="xs" onClick={onAbility} disabled>
          Abilità
        </Button>
        <Button variant="outline" size="xs" onClick={onInfo}>
          Info
        </Button>
        <Button variant="danger" size="xs" onClick={onCancel}>
          Annulla
        </Button>
      </div>
    </div>
  );
}
