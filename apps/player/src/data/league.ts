import type {
  Gym,
  GymId,
  LeagueEvent,
  LeagueEventId,
  TrainingTier,
} from '@/types';
import { creatureSprite, uiSprite } from './sprites';

/**
 * League screen (mockup #4).
 * - 1 live event (Torneo del Fuoco)
 * - 3 training tiers (facile / medio / difficile)
 * - 4 gyms (luce, fuoco, natura, ombra) with defeat/lock states
 */

export const liveEvents: readonly LeagueEvent[] = [
  {
    id: 'event-torneo-fuoco' as LeagueEventId,
    title: 'Torneo del Fuoco',
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    heroSprite: creatureSprite('fire', 99, 'TF'),
    maxReward: { gems: 1_200, gold: 5_000 },
  },
];

export const trainingTiers: readonly TrainingTier[] = [
  {
    difficulty: 'easy',
    rewardKind: 'xp',
    rewardAmount: 50,
    rewardSprite: uiSprite('reward-xp', 'XP'),
  },
  {
    difficulty: 'medium',
    rewardKind: 'gold',
    rewardAmount: 100,
    rewardSprite: uiSprite('reward-gold', 'GD'),
  },
  {
    difficulty: 'hard',
    rewardKind: 'item',
    rewardAmount: 200,
    rewardSprite: uiSprite('reward-relic', 'RL'),
  },
];

export const gyms: readonly Gym[] = [
  {
    id: 'gym-light' as GymId,
    name: 'Luce',
    type: 'light',
    sprite: creatureSprite('water', 10, 'L'),
    defeated: true,
    locked: false,
  },
  {
    id: 'gym-fire' as GymId,
    name: 'Fuoco',
    type: 'fire',
    sprite: creatureSprite('fire', 10, 'F'),
    defeated: true,
    locked: false,
  },
  {
    id: 'gym-nature' as GymId,
    name: 'Natura',
    type: 'grass',
    sprite: creatureSprite('grass', 10, 'N'),
    defeated: false,
    locked: true,
  },
  {
    id: 'gym-shadow' as GymId,
    name: 'Ombra',
    type: 'poison',
    sprite: creatureSprite('poison', 10, 'O'),
    defeated: false,
    locked: true,
  },
];
