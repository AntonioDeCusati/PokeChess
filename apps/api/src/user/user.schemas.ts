import { z } from 'zod';

/**
 * Accepts partial edits to user-level identity fields. Wallet, level and
 * exp are NOT editable through this endpoint — those will be mutated only
 * by gameplay features (shop, battle, etc.) when they exist.
 *
 * Passwords have their own dedicated flow (not implemented yet).
 */
export const PatchProfileBody = z
  .object({
    email: z.string().email().max(254).optional(),
    username: z
      .string()
      .min(3)
      .max(24)
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'username may only contain letters, digits, "_" and "-"',
      )
      .optional(),
  })
  .strict()
  .refine(
    (body) => Object.keys(body).length > 0,
    'Provide at least one field to update',
  );

export type PatchProfileBody = z.infer<typeof PatchProfileBody>;
