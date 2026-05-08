import type { AnimationData, CreatureRarity, UserCreature } from '@/types';
import type { CreatureType } from '@/types/common';

interface Row {
  slug: string;
  pokedexNumber: number;
  pokedexPath: string;
  name: string;
  type1: CreatureType;
  type2?: CreatureType;
  rarity: CreatureRarity;
  expMax: number;
  canEvolve: boolean;
  evolvesToId?: string;
  level: number;
  currentExp: number;
  owned?: boolean;
}

function placeholderAnimations(): AnimationData[] {
  return [
    { type: 'idle',   frameWidth: 32, frameHeight: 40, frameCount: 3,  durations: [40, 6, 6] },
    { type: 'walk',   frameWidth: 40, frameHeight: 40, frameCount: 6,  durations: [4, 4, 4, 4, 4, 4] },
    { type: 'attack', frameWidth: 64, frameHeight: 72, frameCount: 11, durations: [4, 2, 4, 2, 2, 2, 2, 2, 2, 2, 4], rushFrame: 2, hitFrame: 5, returnFrame: 7 },
    { type: 'hurt',   frameWidth: 40, frameHeight: 56, frameCount: 2,  durations: [2, 8] },
  ];
}

const rows: Row[] = [
  { slug: 'charizard',  pokedexNumber: 6,   pokedexPath: '0006', name: 'Charizard',  type1: 'fire',     type2: 'light',    rarity: 'rare',      expMax: 150, canEvolve: false, level: 16, currentExp: 80 },
  { slug: 'blastoise',  pokedexNumber: 9,   pokedexPath: '0009', name: 'Blastoise',  type1: 'water',                       rarity: 'rare',      expMax: 150, canEvolve: false, level: 15, currentExp: 55 },
  { slug: 'venusaur',   pokedexNumber: 3,   pokedexPath: '0003', name: 'Venusaur',   type1: 'grass',    type2: 'poison',   rarity: 'rare',      expMax: 150, canEvolve: false, level: 14, currentExp: 70 },
  { slug: 'pikachu',    pokedexNumber: 25,  pokedexPath: '0025', name: 'Pikachu',    type1: 'electric',                    rarity: 'common',    expMax: 100, canEvolve: true,  level: 13, currentExp: 20 },
  { slug: 'gengar',     pokedexNumber: 94,  pokedexPath: '0094', name: 'Gengar',     type1: 'ghost',    type2: 'poison',   rarity: 'rare',      expMax: 150, canEvolve: false, level: 10, currentExp: 30 },
  { slug: 'dragonite',  pokedexNumber: 149, pokedexPath: '0149', name: 'Dragonite',  type1: 'dragon',   type2: 'light',    rarity: 'epic',      expMax: 200, canEvolve: false, level: 12, currentExp: 60 },
  { slug: 'eevee',      pokedexNumber: 133, pokedexPath: '0133', name: 'Eevee',      type1: 'light',                       rarity: 'common',    expMax: 100, canEvolve: true,  level: 11, currentExp: 25 },
  { slug: 'mewtwo',     pokedexNumber: 150, pokedexPath: '0150', name: 'Mewtwo',     type1: 'light',                       rarity: 'legendary', expMax: 300, canEvolve: false, level: 10, currentExp: 40 },
  { slug: 'alakazam',   pokedexNumber: 65,  pokedexPath: '0065', name: 'Alakazam',   type1: 'light',                       rarity: 'rare',      expMax: 150, canEvolve: false, level:  9, currentExp: 15 },
  { slug: 'machamp',    pokedexNumber: 68,  pokedexPath: '0068', name: 'Machamp',    type1: 'fire',                        rarity: 'rare',      expMax: 150, canEvolve: false, level: 10, currentExp: 35 },
  { slug: 'arcanine',   pokedexNumber: 59,  pokedexPath: '0059', name: 'Arcanine',   type1: 'fire',                        rarity: 'rare',      expMax: 150, canEvolve: false, level:  8, currentExp: 50 },
  { slug: 'gyarados',   pokedexNumber: 130, pokedexPath: '0130', name: 'Gyarados',   type1: 'water',    type2: 'light',    rarity: 'rare',      expMax: 150, canEvolve: false, level:  7, currentExp: 60, owned: false },
  { slug: 'snorlax',    pokedexNumber: 143, pokedexPath: '0143', name: 'Snorlax',    type1: 'light',                       rarity: 'rare',      expMax: 150, canEvolve: false, level:  3, currentExp: 18 },
  { slug: 'lucario',    pokedexNumber: 448, pokedexPath: '0448', name: 'Lucario',    type1: 'fire',     type2: 'electric', rarity: 'epic',      expMax: 200, canEvolve: false, level:  6, currentExp: 45 },
  { slug: 'garchomp',   pokedexNumber: 445, pokedexPath: '0445', name: 'Garchomp',   type1: 'dragon',   type2: 'dark',     rarity: 'epic',      expMax: 200, canEvolve: false, level:  4, currentExp: 30 },
];

export const creatures: readonly UserCreature[] = rows.map((r) => ({
  id:            `creature-${r.slug}`,
  slug:          r.slug,
  pokedexNumber: r.pokedexNumber,
  pokedexPath:   r.pokedexPath,
  name:          r.name,
  type1:         r.type1,
  ...(r.type2 ? { type2: r.type2 } : {}),
  rarity:        r.rarity,
  expMax:        r.expMax,
  canEvolve:     r.canEvolve,
  animations:    placeholderAnimations(),
  level:         r.level,
  currentExp:    r.currentExp,
  owned:         r.owned !== false,
}));

export const creaturesBySlug: Readonly<Record<string, UserCreature>> = Object.fromEntries(
  creatures.map((c) => [c.slug, c]),
);

export const creaturesById: Readonly<Record<string, UserCreature>> = Object.fromEntries(
  creatures.map((c) => [c.id, c]),
);
