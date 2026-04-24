import type { Creature, CreatureId, CreatureRarity, CreatureType } from '@/types';
import { creatureSprite } from './sprites';

/**
 * Creature collection mirroring the 15-card grid in the Board → Collezione
 * section. The order + levels + progress values match the mockup as closely
 * as the readable data allows.
 */
interface Row {
  id: string;
  name: string;
  type: CreatureType;
  rarity: CreatureRarity;
  frame: number;
  level: number;
  progressCurrent: number;
  progressMax: number;
  owned?: boolean;
}

const rows: Row[] = [
  // Row 1
  { id: 'flarepup',   name: 'Flarepup',   type: 'fire',     rarity: 'epic',      frame: 0,  level: 16, progressCurrent: 12, progressMax: 50 },
  { id: 'voidbat',    name: 'Voidbat',    type: 'poison',   rarity: 'rare',      frame: 0,  level: 15, progressCurrent: 8,  progressMax: 50 },
  { id: 'leafling',   name: 'Leafling',   type: 'grass',    rarity: 'rare',      frame: 0,  level: 14, progressCurrent: 10, progressMax: 50 },
  { id: 'bubblet',    name: 'Bubblet',    type: 'water',    rarity: 'common',    frame: 0,  level: 13, progressCurrent: 3,  progressMax: 50 },
  { id: 'sparkit',    name: 'Sparkit',    type: 'electric', rarity: 'rare',      frame: 0,  level: 10, progressCurrent: 4,  progressMax: 50 },
  // Row 2
  { id: 'blushling',  name: 'Blushling',  type: 'fire',     rarity: 'common',    frame: 1,  level: 12, progressCurrent: 15, progressMax: 30 },
  { id: 'sprout',     name: 'Sprout',     type: 'grass',    rarity: 'common',    frame: 1,  level: 11, progressCurrent: 4,  progressMax: 30 },
  { id: 'driplet',    name: 'Driplet',    type: 'water',    rarity: 'common',    frame: 1,  level: 10, progressCurrent: 7,  progressMax: 30 },
  { id: 'umbril',     name: 'Umbril',     type: 'poison',   rarity: 'rare',      frame: 1,  level: 9,  progressCurrent: 2,  progressMax: 30 },
  { id: 'zaply',      name: 'Zaply',      type: 'electric', rarity: 'common',    frame: 1,  level: 10, progressCurrent: 5,  progressMax: 30 },
  // Row 3
  { id: 'aquaro',     name: 'Aquaro',     type: 'water',    rarity: 'rare',      frame: 2,  level: 8,  progressCurrent: 6,  progressMax: 20 },
  { id: 'gravel',     name: 'Gravel',     type: 'dark',     rarity: 'common',    frame: 2,  level: 7,  progressCurrent: 10, progressMax: 30, owned: false },
  { id: 'emberling',  name: 'Emberling',  type: 'fire',     rarity: 'common',    frame: 2,  level: 3,  progressCurrent: 3,  progressMax: 20 },
  { id: 'wispling',   name: 'Wispling',   type: 'ghost',    rarity: 'rare',      frame: 2,  level: 6,  progressCurrent: 6,  progressMax: 20 },
  { id: 'verdrake',   name: 'Verdrake',   type: 'dragon',   rarity: 'epic',      frame: 2,  level: 4,  progressCurrent: 4,  progressMax: 10 },
];

export const creatures: readonly Creature[] = rows.map((r) => ({
  id: `creature-${r.id}` as CreatureId,
  name: r.name,
  type: r.type,
  rarity: r.rarity,
  sprite: creatureSprite(r.type, r.frame, r.name.slice(0, 2).toUpperCase()),
  level: r.level,
  progressCurrent: r.progressCurrent,
  progressMax: r.progressMax,
  owned: r.owned !== false,
}));

export const creaturesById: Readonly<Record<string, Creature>> = Object.fromEntries(
  creatures.map((c) => [c.id, c]),
);
