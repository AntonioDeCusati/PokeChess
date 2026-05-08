import type { BattleState, BattlePiece, BoardPosition } from '@/types/battle';
import { getAvailableMoves } from '@/game/battle/movement';
import type { CustomAiMove, CustomAiOptions } from './custom-ai.types';
import { DIFFICULTY_WEIGHTS, type CustomAiDifficulty } from './custom-ai.types';

export class CustomBattleAi {
  private options: CustomAiOptions;

  constructor(difficulty: CustomAiDifficulty = 'medium') {
    this.options = { ...DIFFICULTY_WEIGHTS[difficulty] };
  }

  setDifficulty(difficulty: CustomAiDifficulty): void {
    this.options = { ...DIFFICULTY_WEIGHTS[difficulty] };
  }

  /**
   * Pick a move for the opponent given the current battle state.
   * Returns null if the opponent has no legal moves.
   */
  pickMove(state: BattleState): CustomAiMove | null {
    const opponentPieces = state.pieces.filter((p) => p.owner === 'opponent');
    const allMoves = this.listAllMoves(opponentPieces, state.pieces);

    if (allMoves.length === 0) return null;

    const captures = allMoves.filter((m) => m.isCapture);

    if (this.options.preferCaptures && captures.length > 0) {
      if (Math.random() < this.options.aggressiveness || captures.length === allMoves.length) {
        return this.randomPick(captures);
      }
    }

    return this.randomPick(allMoves);
  }

  private listAllMoves(
    opponentPieces: BattlePiece[],
    allPieces: BattlePiece[],
  ): CustomAiMove[] {
    const moves: CustomAiMove[] = [];

    for (const piece of opponentPieces) {
      const targets = getAvailableMoves(piece, allPieces, piece.movementType);

      for (const target of targets) {
        const captured = this.pieceAt(target, allPieces);
        moves.push({
          pieceId: piece.id,
          from: { row: piece.row, col: piece.col },
          to: target,
          isCapture: captured !== undefined,
          capturedPieceId: captured?.id,
        });
      }
    }

    return moves;
  }

  private pieceAt(
    pos: BoardPosition,
    pieces: BattlePiece[],
  ): BattlePiece | undefined {
    return pieces.find(
      (p) => p.row === pos.row && p.col === pos.col && p.owner === 'player',
    );
  }

  private randomPick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
