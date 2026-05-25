import { z } from 'zod';

/**
 * Canonical move patterns accepted by the API.
 * Must stay aligned with `apps/player/src/types/move.ts::MovePattern`.
 */
export const MoveIdSchema = z.enum([
  'horizontal',
  'vertical',
  'diagonal',
  'l-shape',
  'jump',
  'projection',
  'pawn',
  'king',
  'rook',
]);
export type MoveId = z.infer<typeof MoveIdSchema>;

export const TeamSlotInput = z.object({
  index: z.number().int().min(1).max(6),
  creatureSlug: z.string().min(1).max(64),
  moveId: MoveIdSchema,
});
export type TeamSlotInput = z.infer<typeof TeamSlotInput>;

/**
 * Body accepted by POST /team/update.
 *
 * Only the 6 prima-linea slots are managed here. Support / trainer /
 * background live on the `Config` table and are exposed through the
 * dedicated /board-config module to keep the concerns separated.
 *
 * `slots` may be:
 *  - a complete array of 6 entries (full replace)
 *  - a partial list merged onto the existing team by slot index
 */
export const UpdateTeamBody = z
  .object({
    slots: z
      .array(TeamSlotInput)
      .min(1)
      .max(6)
      .refine(
        (arr) => {
          const seen = new Set<number>();
          for (const s of arr) {
            if (seen.has(s.index)) return false;
            seen.add(s.index);
          }
          return true;
        },
        { message: 'Duplicate slot indexes are not allowed' },
      ),
  })
  .strict();

export type UpdateTeamBody = z.infer<typeof UpdateTeamBody>;
