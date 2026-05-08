import type { BattleState, BattlePiece } from '@/types/battle';
import type { MovePattern } from '@/types/move';

interface MockCreature {
  name: string;
  pokedexPath: string;
}

/**
 * Back-row layout (cols 0-6):
 *   Rook, Knight, Bishop, Trainer(King), Bishop, Knight, Rook
 */
const BACK_ROW_PATTERNS: MovePattern[] = [
  'rook', 'l-shape', 'diagonal', 'king', 'diagonal', 'l-shape', 'rook',
];

const PLAYER_LEFT: MockCreature[] = [
  { name: 'Charizard',  pokedexPath: '0006' },
  { name: 'Gengar',     pokedexPath: '0094' },
  { name: 'Dragonite',  pokedexPath: '0149' },
];

const PLAYER_TRAINER: MockCreature = { name: 'Deku', pokedexPath: '0000' };

const PLAYER_RIGHT: MockCreature[] = [
  { name: 'Venusaur',   pokedexPath: '0003' },
  { name: 'Blastoise',  pokedexPath: '0009' },
  { name: 'Snorlax',    pokedexPath: '0143' },
];

const PLAYER_SUPPORT: MockCreature = { name: 'Ditto', pokedexPath: '0132' };

const OPPONENT_LEFT: MockCreature[] = [
  { name: 'Mewtwo',     pokedexPath: '0150' },
  { name: 'Alakazam',   pokedexPath: '0065' },
  { name: 'Machamp',    pokedexPath: '0068' },
];

const OPPONENT_TRAINER: MockCreature = { name: 'Brock', pokedexPath: '0000' };

const OPPONENT_RIGHT: MockCreature[] = [
  { name: 'Gyarados',   pokedexPath: '0130' },
  { name: 'Lucario',    pokedexPath: '0448' },
  { name: 'Garchomp',   pokedexPath: '0445' },
];

const OPPONENT_SUPPORT: MockCreature = { name: 'Ditto', pokedexPath: '0132' };

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
  };
}

function buildBackRow(
  owner: 'player' | 'opponent',
  left: MockCreature[],
  trainer: MockCreature,
  right: MockCreature[],
  row: number,
  startIdx: number,
): { pieces: BattlePiece[]; nextIdx: number } {
  const pieces: BattlePiece[] = [];
  let idx = startIdx;

  for (let i = 0; i < 3; i++) {
    pieces.push(makePiece(owner, left[i], row, i, BACK_ROW_PATTERNS[i], idx++));
  }

  pieces.push(makePiece(owner, trainer, row, 3, 'king', idx++, true));

  for (let i = 0; i < 3; i++) {
    pieces.push(makePiece(owner, right[i], row, 4 + i, BACK_ROW_PATTERNS[4 + i], idx++));
  }

  return { pieces, nextIdx: idx };
}

export function createMockBattle(): BattleState {
  const pieces: BattlePiece[] = [];
  let idx = 0;

  // Opponent back row (row 0): Rook, Knight, Bishop, Trainer, Bishop, Knight, Rook
  const oppBack = buildBackRow('opponent', OPPONENT_LEFT, OPPONENT_TRAINER, OPPONENT_RIGHT, 0, idx);
  pieces.push(...oppBack.pieces);
  idx = oppBack.nextIdx;

  // Opponent pawn row (row 1): all Ditto with pawn movement
  for (let col = 0; col < 7; col++) {
    pieces.push(makePiece('opponent', OPPONENT_SUPPORT, 1, col, 'pawn', idx++));
  }

  // Player pawn row (row 8): all Ditto with pawn movement
  for (let col = 0; col < 7; col++) {
    pieces.push(makePiece('player', PLAYER_SUPPORT, 8, col, 'pawn', idx++));
  }

  // Player back row (row 9): Rook, Knight, Bishop, Trainer, Bishop, Knight, Rook
  const plBack = buildBackRow('player', PLAYER_LEFT, PLAYER_TRAINER, PLAYER_RIGHT, 9, idx);
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
    status: 'playing',
  };
}

export function getBattleState(): BattleState {
  return createMockBattle();
}

export function submitMove(
  _state: BattleState,
  _pieceId: string,
  _to: { row: number; col: number },
): BattleState {
  return _state;
}
