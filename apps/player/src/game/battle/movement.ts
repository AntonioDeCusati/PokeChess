import type { BattlePiece, BoardPosition } from '@/types/battle';
import { BOARD_ROWS, BOARD_COLS } from '@/types/battle';
import type { MovePattern } from '@/types/move';

export function isInsideBoard(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
}

function isOccupied(row: number, col: number, pieces: BattlePiece[]): BattlePiece | undefined {
  return pieces.find((p) => p.row === row && p.col === col);
}

function addIfValid(
  targets: BoardPosition[],
  row: number,
  col: number,
  pieces: BattlePiece[],
  owner: 'player' | 'opponent',
) {
  if (!isInsideBoard(row, col)) return;
  const occupant = isOccupied(row, col, pieces);
  if (occupant && occupant.owner === owner) return;
  targets.push({ row, col });
}

function lineTargets(
  piece: BattlePiece,
  pieces: BattlePiece[],
  dr: number,
  dc: number,
  maxSteps = 99,
): BoardPosition[] {
  const targets: BoardPosition[] = [];
  for (let step = 1; step <= maxSteps; step++) {
    const r = piece.row + dr * step;
    const c = piece.col + dc * step;
    if (!isInsideBoard(r, c)) break;
    const occupant = isOccupied(r, c, pieces);
    if (occupant) {
      if (occupant.owner !== piece.owner) targets.push({ row: r, col: c });
      break;
    }
    targets.push({ row: r, col: c });
  }
  return targets;
}

function horizontalMoves(piece: BattlePiece, pieces: BattlePiece[]): BoardPosition[] {
  return [
    ...lineTargets(piece, pieces, 0, 1),
    ...lineTargets(piece, pieces, 0, -1),
  ];
}

function verticalMoves(piece: BattlePiece, pieces: BattlePiece[]): BoardPosition[] {
  return [
    ...lineTargets(piece, pieces, 1, 0),
    ...lineTargets(piece, pieces, -1, 0),
  ];
}

function diagonalMoves(piece: BattlePiece, pieces: BattlePiece[]): BoardPosition[] {
  return [
    ...lineTargets(piece, pieces, 1, 1),
    ...lineTargets(piece, pieces, 1, -1),
    ...lineTargets(piece, pieces, -1, 1),
    ...lineTargets(piece, pieces, -1, -1),
  ];
}

function lShapeMoves(piece: BattlePiece, pieces: BattlePiece[]): BoardPosition[] {
  const offsets = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1],
  ];
  const targets: BoardPosition[] = [];
  for (const [dr, dc] of offsets) {
    addIfValid(targets, piece.row + dr, piece.col + dc, pieces, piece.owner);
  }
  return targets;
}

function jumpMoves(piece: BattlePiece, pieces: BattlePiece[]): BoardPosition[] {
  const targets: BoardPosition[] = [];
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      if (dr === 0 && dc === 0) continue;
      addIfValid(targets, piece.row + dr, piece.col + dc, pieces, piece.owner);
    }
  }
  return targets;
}

function projectionMoves(piece: BattlePiece, pieces: BattlePiece[]): BoardPosition[] {
  return [
    ...horizontalMoves(piece, pieces),
    ...verticalMoves(piece, pieces),
    ...diagonalMoves(piece, pieces),
  ];
}

function rookMoves(piece: BattlePiece, pieces: BattlePiece[]): BoardPosition[] {
  return [
    ...horizontalMoves(piece, pieces),
    ...verticalMoves(piece, pieces),
  ];
}

function kingMoves(piece: BattlePiece, pieces: BattlePiece[]): BoardPosition[] {
  const targets: BoardPosition[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      addIfValid(targets, piece.row + dr, piece.col + dc, pieces, piece.owner);
    }
  }
  return targets;
}

const PLAYER_PAWN_START_ROW = 8;
const OPPONENT_PAWN_START_ROW = 1;

function pawnMoves(piece: BattlePiece, pieces: BattlePiece[]): BoardPosition[] {
  const targets: BoardPosition[] = [];
  const isPlayer = piece.owner === 'player';
  const forward = isPlayer ? -1 : 1;
  const startRow = isPlayer ? PLAYER_PAWN_START_ROW : OPPONENT_PAWN_START_ROW;

  const oneAhead = piece.row + forward;
  if (isInsideBoard(oneAhead, piece.col) && !isOccupied(oneAhead, piece.col, pieces)) {
    targets.push({ row: oneAhead, col: piece.col });

    if (piece.row === startRow) {
      const twoAhead = piece.row + forward * 2;
      if (isInsideBoard(twoAhead, piece.col) && !isOccupied(twoAhead, piece.col, pieces)) {
        targets.push({ row: twoAhead, col: piece.col });
      }
    }
  }

  for (const dc of [-1, 1]) {
    const cr = piece.row + forward;
    const cc = piece.col + dc;
    if (!isInsideBoard(cr, cc)) continue;
    const occupant = isOccupied(cr, cc, pieces);
    if (occupant && occupant.owner !== piece.owner) {
      targets.push({ row: cr, col: cc });
    }
  }

  return targets;
}

export function getAvailableMoves(
  piece: BattlePiece,
  pieces: BattlePiece[],
  movementType: MovePattern,
): BoardPosition[] {
  switch (movementType) {
    case 'horizontal':  return horizontalMoves(piece, pieces);
    case 'vertical':    return verticalMoves(piece, pieces);
    case 'diagonal':    return diagonalMoves(piece, pieces);
    case 'l-shape':     return lShapeMoves(piece, pieces);
    case 'jump':        return jumpMoves(piece, pieces);
    case 'projection':  return projectionMoves(piece, pieces);
    case 'rook':        return rookMoves(piece, pieces);
    case 'king':        return kingMoves(piece, pieces);
    case 'pawn':        return pawnMoves(piece, pieces);
  }
}
