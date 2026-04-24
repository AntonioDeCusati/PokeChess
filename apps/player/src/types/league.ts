import type {
  CreatureType,
  GymId,
  LeagueEventId,
  SpriteRef,
} from './common';

/** Difficulty tiers shown in "Allenamento". */
export type TrainingDifficulty = 'easy' | 'medium' | 'hard';

export interface TrainingTier {
  difficulty: TrainingDifficulty;
  /** Reward amount (xp/gold). The icon is inferred from `rewardKind`. */
  rewardAmount: number;
  rewardKind: 'xp' | 'gold' | 'gem' | 'item';
  rewardSprite?: SpriteRef;
}

/** Reward row shown under a live event (gems + gold, etc.). */
export interface LeagueReward {
  gems?: number;
  gold?: number;
}

/** A live event card (e.g. "Torneo del Fuoco"). */
export interface LeagueEvent {
  id: LeagueEventId;
  title: string;
  /** ISO datetime string for countdown end. */
  endsAt: string;
  heroSprite: SpriteRef;
  maxReward: LeagueReward;
}

/** A gym in the "PALESTRE" grid. */
export interface Gym {
  id: GymId;
  name: string;
  type: CreatureType;
  sprite: SpriteRef;
  /** Whether the player has defeated this gym. */
  defeated: boolean;
  /** Whether the gym is gated (lock icon in the mockup). */
  locked: boolean;
}

/** Season progress banner at the top of the Home screen. */
export interface SeasonProgress {
  seasonNumber: number;
  current: number;
  max: number;
  /** Optional CTA label (e.g. "Missioni"). */
  questsLabel?: string;
}
