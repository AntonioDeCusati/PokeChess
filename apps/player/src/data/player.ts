import type { PlayerId, PlayerProfile, PlayerStats } from '@/types';
import { avatarSprite } from './sprites';

export const playerProfile: PlayerProfile = {
  id: 'player-deku' as PlayerId,
  username: 'Deku',
  avatar: avatarSprite('deku', 'D'),
  experience: {
    level: 16,
    current: 650,
    max: 1200,
  },
  wallet: {
    gold: 12_450,
    gem: 1_280,
  },
};

export const playerStats: PlayerStats = {
  trophies: 2_450,
  trophiesDelta: 45,
  victories: 128,
  topPercent: 'Top 12%',
};
