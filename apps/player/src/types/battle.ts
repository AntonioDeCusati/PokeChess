import type { MovePattern } from './move';

export interface BoardPosition {
  row: number;
  col: number;
}

export interface BattlePiece {
  id: string;
  owner: 'player' | 'opponent';
  creatureId: string;
  /** Creature display name (cached for HUD). */
  name: string;
  /** Portrait path (e.g. "0006") for sprite resolution. */
  pokedexPath: string;
  /** Movement pattern assigned to this piece. */
  movementType: MovePattern;
  row: number;
  col: number;
  hp: number;
  maxHp: number;
  isTrainer?: boolean;
  selected?: boolean;
  availableMoves?: BoardPosition[];
}

export interface BattlePlayer {
  id: string;
  name: string;
  avatarLabel: string;
}

export interface BattleState {
  currentTurn: 'player' | 'opponent';
  turnNumber: number;
  selectedPieceId: string | null;
  inspectedPieceId: string | null;
  pieces: BattlePiece[];
  player: BattlePlayer;
  opponent: BattlePlayer;
  status: 'playing' | 'won' | 'lost' | 'draw';
}

export const BOARD_ROWS = 10;
export const BOARD_COLS = 7;
