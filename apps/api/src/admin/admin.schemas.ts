import { z } from 'zod';

export const CreatureTypeEnum = z.enum([
  'fire', 'water', 'grass', 'electric', 'poison', 'dark', 'ghost', 'dragon', 'light',
]);

export const CreatureRarityEnum = z.enum(['common', 'rare', 'epic', 'legendary']);

export const AnimationTypeEnum = z.enum(['idle', 'walk', 'attack', 'hurt']);

const AnimationInput = z.object({
  type: AnimationTypeEnum,
  frameWidth: z.number().int().positive(),
  frameHeight: z.number().int().positive(),
  durations: z.array(z.number().int().min(1)).min(1),
  rushFrame: z.number().int().min(0).optional(),
  hitFrame: z.number().int().min(0).optional(),
  returnFrame: z.number().int().min(0).optional(),
});

export const CreateCreatureBody = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  pokedexNumber: z.number().int().min(0),
  pokedexPath: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  type1: CreatureTypeEnum,
  type2: CreatureTypeEnum.optional(),
  rarity: CreatureRarityEnum,
  expMax: z.number().int().positive().default(100),
  canEvolve: z.boolean().default(false),
  evolveToId: z.string().optional(),
  animations: z.array(AnimationInput).optional(),
}).strict();

export const UpdateCreatureBody = CreateCreatureBody.partial().strict();

export const CreateTrainerBody = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  imageUrl: z.string().max(500).optional(),
}).strict();

export const UpdateTrainerBody = CreateTrainerBody.partial().strict();

export const CreateBackgroundBody = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  imageUrl: z.string().max(500).optional(),
}).strict();

export const UpdateBackgroundBody = CreateBackgroundBody.partial().strict();

export const CreateSupportBody = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  imageUrl: z.string().max(500).optional(),
  description: z.string().max(500).optional(),
}).strict();

export const UpdateSupportBody = CreateSupportBody.partial().strict();

export type CreateCreatureBody = z.infer<typeof CreateCreatureBody>;
export type UpdateCreatureBody = z.infer<typeof UpdateCreatureBody>;
export type CreateTrainerBody = z.infer<typeof CreateTrainerBody>;
export type UpdateTrainerBody = z.infer<typeof UpdateTrainerBody>;
export type CreateBackgroundBody = z.infer<typeof CreateBackgroundBody>;
export type UpdateBackgroundBody = z.infer<typeof UpdateBackgroundBody>;
export type CreateSupportBody = z.infer<typeof CreateSupportBody>;
export type UpdateSupportBody = z.infer<typeof UpdateSupportBody>;
