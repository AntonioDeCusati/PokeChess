import { useEffect, useRef, useState } from 'react';
import type { BattlePiece, BattleState, BoardPosition } from '@/types/battle';
import { BOARD_ROWS, BOARD_COLS } from '@/types/battle';
import { BattleCell } from './BattleCell';

interface BattleBoardProps {
  state: BattleState;
  onCellTap: (row: number, col: number) => void;
}

export function BattleBoard({ state, onCellTap }: BattleBoardProps) {
  const { pieces, selectedPieceId } = state;
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(40);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const availW = el.clientWidth - 4; // 2px border each side
      const availH = window.innerHeight * 0.7;
      const byW = Math.floor(availW / BOARD_COLS);
      const byH = Math.floor(availH / BOARD_ROWS);
      setCellSize(Math.max(20, Math.min(byW, byH)));
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const selectedPiece = selectedPieceId
    ? pieces.find((p) => p.id === selectedPieceId)
    : undefined;

  const validMoves: BoardPosition[] = selectedPiece?.availableMoves ?? [];
  const validMoveSet = new Set(validMoves.map((m) => `${m.row},${m.col}`));

  const pieceMap = new Map<string, BattlePiece>();
  for (const p of pieces) {
    pieceMap.set(`${p.row},${p.col}`, p);
  }

  const rows: number[] = [];
  for (let r = 0; r < BOARD_ROWS; r++) rows.push(r);

  const cols: number[] = [];
  for (let c = 0; c < BOARD_COLS; c++) cols.push(c);

  const boardW = cellSize * BOARD_COLS;

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-[min(100vw,420px)] px-1">
      <div
        className="mx-auto grid border border-border-strong rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        style={{
          gridTemplateColumns: `repeat(${BOARD_COLS}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${BOARD_ROWS}, ${cellSize}px)`,
          width: boardW + 2,
        }}
      >
        {rows.map((row) =>
          cols.map((col) => {
            const key = `${row},${col}`;
            const piece = pieceMap.get(key);
            const isValidMove = validMoveSet.has(key);
            const isSelected = piece?.id === selectedPieceId;
            const isEnemy = isValidMove && !!piece && piece.owner !== (selectedPiece?.owner ?? 'player');

            return (
              <BattleCell
                key={key}
                row={row}
                col={col}
                piece={piece}
                isSelected={isSelected}
                isValidMove={isValidMove}
                isEnemy={isEnemy}
                cellSize={cellSize}
                onTap={onCellTap}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
