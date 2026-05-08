import { z } from 'zod';

/**
 * Body accepted by POST /dev/grant-creatures.
 *
 *  - `slugs`: optional. If omitted, grants ALL seeded creatures to the
 *    authenticated user. If provided, grants only the matching ones.
 *  - `level` / `currentExp`: optional override for the created
 *    UserCreature rows. Defaults: level=1, currentExp=0.
 */
export const GrantCreaturesBody = z
  .object({
    slugs:      z.array(z.string().min(1)).min(1).optional(),
    level:      z.number().int().min(1).max(999).optional(),
    currentExp: z.number().int().min(0).optional(),
  })
  .strict();

export type GrantCreaturesBody = z.infer<typeof GrantCreaturesBody>;


