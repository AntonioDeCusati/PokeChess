/**
 * Centralized sprite-key builders.
 *
 * Keeps asset keys consistent across data files and makes it trivial to
 * rename namespaces later. Components never import this — only data files do.
 */

import type { CreatureType, SpriteRef } from '@/types/common';

const typeColor: Record<CreatureType, string> = {
  fire: '#E85C3A',
  water: '#4FA8E0',
  grass: '#5BBF4A',
  electric: '#E8C244',
  poison: '#8A4FB8',
  dark: '#3E4454',
  ghost: '#C7C7D1',
  dragon: '#55B89C',
  light: '#EDE8D0',
};

/** Creature sprite (spritesheet, one frame per creature variant). */
export const creatureSprite = (
  type: CreatureType,
  frame: number,
  label?: string,
): SpriteRef => ({
  key: `creatures/${type}`,
  type: 'spritesheet',
  frame,
  fallbackColor: typeColor[type],
  fallbackLabel: label,
});

/** Trainer portrait (single image). */
export const trainerSprite = (slug: string, label?: string): SpriteRef => ({
  key: `trainers/${slug}`,
  type: 'image',
  fallbackColor: '#C04A3B',
  fallbackLabel: label,
});

/** Support unit artwork (single image). */
export const supportSprite = (slug: string, label?: string): SpriteRef => ({
  key: `support/${slug}`,
  type: 'image',
  fallbackColor: '#8A4FB8',
  fallbackLabel: label,
});

/** Background scene (single image). */
export const backgroundSprite = (slug: string, label?: string): SpriteRef => ({
  key: `backgrounds/${slug}`,
  type: 'image',
  fallbackColor: '#3A6B42',
  fallbackLabel: label,
});

/** UI element (chest, coin, gem, icon). */
export const uiSprite = (slug: string, label?: string): SpriteRef => ({
  key: `ui/${slug}`,
  type: 'image',
  fallbackColor: '#2A3038',
  fallbackLabel: label,
});

/** Avatar (image). */
export const avatarSprite = (slug: string, label?: string): SpriteRef => ({
  key: `avatars/${slug}`,
  type: 'image',
  fallbackColor: '#4B5563',
  fallbackLabel: label,
});
