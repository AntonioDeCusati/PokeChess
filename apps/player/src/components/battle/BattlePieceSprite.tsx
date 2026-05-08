import type { BattlePiece } from '@/types/battle';
import { AnimatedSprite } from './AnimatedSprite';

interface BattlePieceSpriteProps {
  piece: BattlePiece;
  /** Cell size in pixels — sprite scales to fit inside. */
  cellSize?: number;
  className?: string;
}

export function BattlePieceSprite({ piece, cellSize = 40, className = '' }: BattlePieceSpriteProps) {
  return (
    <AnimatedSprite
      pokedexPath={piece.pokedexPath}
      owner={piece.owner}
      size={cellSize}
      className={className}
    />
  );
}
