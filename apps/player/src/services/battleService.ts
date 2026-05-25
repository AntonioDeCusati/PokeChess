import type { BattleState, BattlePiece } from '@/types/battle';
import { emptyEnergyBank } from '@/types/battle';
import type { MovePattern } from '@/types/move';
import type { CreatureType } from '@/types/common';
import type { UserCreature } from '@/types';

interface MockCreature {
  name: string;
  pokedexPath: string;
  type1: CreatureType;
  type2?: CreatureType;
  rewardType1?: number;
  rewardType2?: number;
}

const BACK_ROW_PATTERNS: MovePattern[] = [
  'rook', 'l-shape', 'diagonal', 'king', 'diagonal', 'l-shape', 'rook',
];

const OPPONENT_LEFT: MockCreature[] = [
  { name: 'Mewtwo',     pokedexPath: '0150', type1: 'psychic' },
  { name: 'Alakazam',   pokedexPath: '0065', type1: 'psychic' },
  { name: 'Machamp',    pokedexPath: '0068', type1: 'fighting' },
];

const OPPONENT_TRAINER: MockCreature = { name: 'Brock', pokedexPath: '0000', type1: 'normal' };

const OPPONENT_RIGHT: MockCreature[] = [
  { name: 'Gyarados',   pokedexPath: '0130', type1: 'water',    type2: 'flying' },
  { name: 'Lucario',    pokedexPath: '0448', type1: 'fighting', type2: 'steel' },
  { name: 'Garchomp',   pokedexPath: '0445', type1: 'dragon',   type2: 'ground' },
];

const OPPONENT_SUPPORT: MockCreature = { name: 'Ditto', pokedexPath: '0132', type1: 'normal' };

// Fallback player data when no team is configured
const FALLBACK_LEFT: MockCreature[] = [
  { name: 'Charizard',  pokedexPath: '0006', type1: 'fire',   type2: 'flying' },
  { name: 'Gengar',     pokedexPath: '0094', type1: 'ghost',  type2: 'poison' },
  { name: 'Dragonite',  pokedexPath: '0149', type1: 'dragon', type2: 'flying' },
];
const FALLBACK_TRAINER: MockCreature = { name: 'Deku', pokedexPath: '0000', type1: 'normal' };
const FALLBACK_RIGHT: MockCreature[] = [
  { name: 'Venusaur',   pokedexPath: '0003', type1: 'grass',  type2: 'poison' },
  { name: 'Blastoise',  pokedexPath: '0009', type1: 'water' },
  { name: 'Snorlax',    pokedexPath: '0143', type1: 'normal' },
];
const FALLBACK_SUPPORT: MockCreature = { name: 'Ditto', pokedexPath: '0132', type1: 'normal' };

function makePiece(
  owner: 'player' | 'opponent',
  creature: MockCreature,
  row: number,
  col: number,
  movePattern: MovePattern,
  index: number,
  isTrainer = false,
): BattlePiece {
  return {
    id: `${owner}-${index}`,
    owner,
    creatureId: `creature-${creature.pokedexPath}`,
    name: creature.name,
    pokedexPath: creature.pokedexPath,
    movementType: movePattern,
    row,
    col,
    hp: 100,
    maxHp: 100,
    isTrainer,
    type1: creature.type1,
    type2: creature.type2,
    rewardType1: creature.rewardType1 ?? 1,
    rewardType2: creature.rewardType2 ?? 1,
  };
}

function buildBackRow(
  owner: 'player' | 'opponent',
  left: MockCreature[],
  trainer: MockCreature,
  right: MockCreature[],
  row: number,
  startIdx: number,
  patterns: MovePattern[] = BACK_ROW_PATTERNS,
): { pieces: BattlePiece[]; nextIdx: number } {
  const pieces: BattlePiece[] = [];
  let idx = startIdx;

  for (let i = 0; i < 3; i++) {
    pieces.push(makePiece(owner, left[i], row, i, patterns[i], idx++));
  }

  pieces.push(makePiece(owner, trainer, row, 3, 'king', idx++, true));

  for (let i = 0; i < 3; i++) {
    pieces.push(makePiece(owner, right[i], row, 4 + i, patterns[4 + i], idx++));
  }

  return { pieces, nextIdx: idx };
}

export interface TeamSlotForBattle {
  index: number;
  creatureId: string;
  creatureSlug: string;
  moveId: string;
}

export interface NpcOpponentCreature {
  name: string;
  pokedexPath: string;
  type1: string;
  type2?: string | null;
}

export interface NpcOpponentData {
  name: string;
  team: NpcOpponentCreature[];
}

/**
 * Build battle state using the player's real team.
 * DB slots are 1-6. Board back row columns 0-6 with trainer at col 3:
 *   col 0 = slot 1, col 1 = slot 2, col 2 = slot 3
 *   col 3 = TRAINER
 *   col 4 = slot 4, col 5 = slot 5, col 6 = slot 6
 *
 * When `npcOpponent` is provided, it replaces the hardcoded opponent.
 */
export function createBattleFromTeam(
  teamSlots: TeamSlotForBattle[],
  creatures: UserCreature[],
  playerName = 'Player',
  npcOpponent?: NpcOpponentData,
): BattleState {
  const creatureById = new Map(creatures.map((c) => [c.id, c]));

  // Map DB slot index (1-6) to board column (0,1,2,4,5,6)
  const slotToCol: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 4, 5: 5, 6: 6 };

  // Build 6 piece slots + their move patterns
  const boardPieces: MockCreature[] = [
    FALLBACK_SUPPORT, FALLBACK_SUPPORT, FALLBACK_SUPPORT,
    FALLBACK_SUPPORT, FALLBACK_SUPPORT, FALLBACK_SUPPORT,
  ];
  const boardPatterns: MovePattern[] = [
    'rook', 'l-shape', 'diagonal', 'diagonal', 'l-shape', 'rook',
  ];

  for (const slot of teamSlots) {
    const c = creatureById.get(slot.creatureId);
    const col = slotToCol[slot.index];
    if (!c || col === undefined) continue;

    // arrayIdx: 0-2 for left side (cols 0-2), 3-5 for right side (cols 4-6)
    const arrayIdx = col < 3 ? col : col - 1;

    boardPieces[arrayIdx] = {
      name: c.name,
      pokedexPath: c.pokedexPath,
      type1: c.type1,
      type2: c.type2,
      rewardType1: c.rewardType1 ?? 1,
      rewardType2: c.rewardType2 ?? 1,
    };
    if (slot.moveId) {
      boardPatterns[arrayIdx] = slot.moveId as MovePattern;
    }
  }

  const left = boardPieces.slice(0, 3);
  const right = boardPieces.slice(3, 6);

  const fullPatterns: MovePattern[] = [
    boardPatterns[0], boardPatterns[1], boardPatterns[2],
    'king',
    boardPatterns[3], boardPatterns[4], boardPatterns[5],
  ];

  // Build opponent data
  let oppLeft: MockCreature[];
  let oppTrainer: MockCreature;
  let oppRight: MockCreature[];
  let oppSupport: MockCreature;
  let opponentName: string;

  if (npcOpponent && npcOpponent.team.length >= 6) {
    const t = npcOpponent.team;
    oppLeft = t.slice(0, 3).map(npcToMock);
    oppRight = t.slice(3, 6).map(npcToMock);
    oppTrainer = { name: npcOpponent.name, pokedexPath: '0000', type1: 'normal' };
    oppSupport = { name: 'Ditto', pokedexPath: '0132', type1: 'normal' };
    opponentName = npcOpponent.name;
  } else {
    oppLeft = OPPONENT_LEFT;
    oppTrainer = OPPONENT_TRAINER;
    oppRight = OPPONENT_RIGHT;
    oppSupport = OPPONENT_SUPPORT;
    opponentName = 'Brock';
  }

  const pieces: BattlePiece[] = [];
  let idx = 0;

  const oppBack = buildBackRow('opponent', oppLeft, oppTrainer, oppRight, 0, idx);
  pieces.push(...oppBack.pieces);
  idx = oppBack.nextIdx;

  for (let col = 0; col < 7; col++) {
    pieces.push(makePiece('opponent', oppSupport, 1, col, 'pawn', idx++));
  }

  for (let col = 0; col < 7; col++) {
    pieces.push(makePiece('player', FALLBACK_SUPPORT, 8, col, 'pawn', idx++));
  }

  const trainerMock: MockCreature = { name: playerName, pokedexPath: '0000', type1: 'normal' };
  const plBack = buildBackRow('player', left, trainerMock, right, 9, idx, fullPatterns);
  pieces.push(...plBack.pieces);

  return {
    currentTurn: 'player',
    turnNumber: 1,
    selectedPieceId: null,
    inspectedPieceId: null,
    pieces,
    player: { id: 'player-1', name: playerName, avatarLabel: playerName.slice(0, 2).toUpperCase() },
    opponent: { id: 'opponent-1', name: opponentName, avatarLabel: opponentName.slice(0, 2).toUpperCase() },
    playerEnergy: emptyEnergyBank(),
    opponentEnergy: emptyEnergyBank(),
    status: 'playing',
  };
}

function npcToMock(c: NpcOpponentCreature): MockCreature {
  return {
    name: c.name,
    pokedexPath: c.pokedexPath,
    type1: (c.type1 ?? 'normal') as CreatureType,
    type2: c.type2 ? c.type2 as CreatureType : undefined,
  };
}

/** Fallback when no team data is available. */
export function createMockBattle(): BattleState {
  const pieces: BattlePiece[] = [];
  let idx = 0;

  const oppBack = buildBackRow('opponent', OPPONENT_LEFT, OPPONENT_TRAINER, OPPONENT_RIGHT, 0, idx);
  pieces.push(...oppBack.pieces);
  idx = oppBack.nextIdx;

  for (let col = 0; col < 7; col++) {
    pieces.push(makePiece('opponent', OPPONENT_SUPPORT, 1, col, 'pawn', idx++));
  }

  for (let col = 0; col < 7; col++) {
    pieces.push(makePiece('player', FALLBACK_SUPPORT, 8, col, 'pawn', idx++));
  }

  const plBack = buildBackRow('player', FALLBACK_LEFT, FALLBACK_TRAINER, FALLBACK_RIGHT, 9, idx);
  pieces.push(...plBack.pieces);
  idx = plBack.nextIdx;

  return {
    currentTurn: 'player',
    turnNumber: 1,
    selectedPieceId: null,
    inspectedPieceId: null,
    pieces,
    player: { id: 'player-1', name: 'Deku', avatarLabel: 'DK' },
    opponent: { id: 'opponent-1', name: 'Brock', avatarLabel: 'BR' },
    playerEnergy: emptyEnergyBank(),
    opponentEnergy: emptyEnergyBank(),
    status: 'playing',
  };
}
