import { z } from 'zod';

/**
 * Body accepted by POST /board-config/update.
 *
 * All three fields are optional and independently settable. Pass `null`
 * to clear a previous selection. At least one field must be present.
 *
 * Ids are free-form slugs chosen by the client catalogs (trainers,
 * supports, backgrounds live on the client as static data today), so we
 * only apply a reasonable length bound here and do not validate them
 * against any server-side enum.
 */
export const UpdateBoardConfigBody = z
  .object({
    supportId: z.string().min(1).max(64).nullable().optional(),
    trainerId: z.string().min(1).max(64).nullable().optional(),
    backgroundId: z.string().min(1).max(64).nullable().optional(),
  })
  .strict()
  .refine(
    (body) =>
      body.supportId !== undefined ||
      body.trainerId !== undefined ||
      body.backgroundId !== undefined,
    'Provide at least one of supportId / trainerId / backgroundId',
  );

export type UpdateBoardConfigBody = z.infer<typeof UpdateBoardConfigBody>;
