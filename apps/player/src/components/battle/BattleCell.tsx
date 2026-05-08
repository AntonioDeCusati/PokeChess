import type { BattlePiece } from '@/types/battle';
import { BattlePieceSprite } from './BattlePieceSprite';

interface BattleCellProps {
  row: number;
  col: number;
  piece?: BattlePiece;
  isSelected: boolean;
  isValidMove: boolean;
  isEnemy: boolean;
  cellSize: number;
  onTap: (row: number, col: number) => void;
}

export function BattleCell({
  row,
  col,
  piece,
  isSelected,
  isValidMove,
  isEnemy,
  cellSize,
  onTap,
}: BattleCellProps) {
  const isDark = (row + col) % 2 === 1;

  let cellClass = isDark ? 'bg-[#1a2030]' : 'bg-[#141822]';

  if (isSelected) {
    cellClass = 'bg-accent/30 ring-2 ring-inset ring-accent';
  } else if (isEnemy) {
    cellClass = 'bg-danger/20 ring-2 ring-inset ring-danger/60';
  } else if (isValidMove) {
    cellClass = isDark
      ? 'bg-emerald-900/30 ring-2 ring-inset ring-emerald-400/60'
      : 'bg-emerald-900/20 ring-2 ring-inset ring-emerald-400/60';
  }

  return (
    <button
      type="button"
      onClick={() => onTap(row, col)}
      className={`
        relative flex items-center justify-center
        transition-all duration-100 active:scale-95
        ${cellClass}
      `}
      style={{ width: cellSize, height: cellSize }}
      aria-label={`Cella ${row},${col}${piece ? ` - ${piece.name}` : ''}`}
    >
      {isValidMove && !piece && (
        <span className="absolute h-2 w-2 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
      )}

      {piece && (
        <BattlePieceSprite piece={piece} cellSize={Math.floor(cellSize * 0.85)} />
      )}

      {piece && piece.hp < piece.maxHp && (
        <div className="absolute bottom-0 left-0.5 right-0.5 h-[2px] rounded-full bg-black/60">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(piece.hp / piece.maxHp) * 100}%`,
              backgroundColor: piece.hp > piece.maxHp * 0.5 ? '#2EA043' : piece.hp > piece.maxHp * 0.25 ? '#E0A83B' : '#D9453C',
            }}
          />
        </div>
      )}
    </button>
  );
}
