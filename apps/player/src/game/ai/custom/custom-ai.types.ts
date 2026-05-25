import type { BoardPosition } from '@/types/battle';

export interface CustomAiMove {
  pieceId: string;
  from: BoardPosition;
  to: BoardPosition;
  isCapture: boolean;
  capturedPieceId?: string;
}

export interface CustomAiOptions {
  preferCaptures: boolean;
  /** 0 = random, 1 = always best capture target */
  aggressiveness: number;
}

export type CustomAiDifficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_WEIGHTS: Record<CustomAiDifficulty, CustomAiOptions> = {
  easy:   { preferCaptures: false, aggressiveness: 0 },
  medium: { preferCaptures: true,  aggressiveness: 0.5 },
  hard:   { preferCaptures: true,  aggressiveness: 1 },
};
