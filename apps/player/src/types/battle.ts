import type { MovePattern } from './move';
import type { CreatureType } from './common';

export interface BoardPosition {
  row: number;
  col: number;
}

export interface BattlePiece {
  id: string;
  owner: 'player' | 'opponent';
  creatureId: string;
  name: string;
  pokedexPath: string;
  movementType: MovePattern;
  row: number;
  col: number;
  hp: number;
  maxHp: number;
  isTrainer?: boolean;
  type1: CreatureType;
  type2?: CreatureType;
  rewardType1: number;
  rewardType2: number;
  selected?: boolean;
  availableMoves?: BoardPosition[];
}

export type EnergyBank = Record<CreatureType, number>;

export function emptyEnergyBank(): EnergyBank {
  return {
    normal: 0, fire: 0, water: 0, grass: 0, electric: 0, ice: 0,
    fighting: 0, poison: 0, ground: 0, flying: 0, psychic: 0,
    bug: 0, rock: 0, ghost: 0, dragon: 0, dark: 0, steel: 0, fairy: 0,
  };
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
  playerEnergy: EnergyBank;
  opponentEnergy: EnergyBank;
  status: 'playing' | 'won' | 'lost' | 'draw';
}

export const BOARD_ROWS = 10;
export const BOARD_COLS = 7;
