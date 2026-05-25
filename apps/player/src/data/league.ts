import type {
  LeagueEvent,
  LeagueEventId,
} from '@/types';
import { creatureSprite } from './sprites';

export const liveEvents: readonly LeagueEvent[] = [
  {
    id: 'event-torneo-fuoco' as LeagueEventId,
    title: 'Torneo del Fuoco',
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    heroSprite: creatureSprite('fire', 99, 'TF'),
    maxReward: { gems: 1_200, gold: 5_000 },
  },
  {
    id: 'event-sfida-acqua' as LeagueEventId,
    title: 'Sfida delle Onde',
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    heroSprite: creatureSprite('water', 99, 'SO'),
    maxReward: { gems: 800, gold: 3_000 },
  },
  {
    id: 'event-arena-drago' as LeagueEventId,
    title: 'Arena dei Draghi',
    endsAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    heroSprite: creatureSprite('dragon', 99, 'AD'),
    maxReward: { gems: 2_000, gold: 8_000 },
  },
  {
    id: 'event-notte-spettri' as LeagueEventId,
    title: 'Notte degli Spettri',
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    heroSprite: creatureSprite('ghost', 99, 'NS'),
    maxReward: { gems: 1_500, gold: 6_000 },
  },
];

export const REGIONS = [
  'Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unima', 'Kalos', 'Alola', 'Galar', 'Paldea',
] as const;

export type Region = typeof REGIONS[number];
