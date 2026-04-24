import { prisma } from '../db';
import type { UpdateBoardConfigBody } from './board-config.schemas';

/**
 * Board-level configuration: which support creature, trainer and
 * background are currently selected. Each field may be `null` when the
 * user has not chosen yet.
 *
 * Maps 1:1 to the `Config` Prisma model.
 */
export interface BoardConfigDto {
  supportId: string | null;
  trainerId: string | null;
  backgroundId: string | null;
}

export async function getBoardConfig(userId: string): Promise<BoardConfigDto> {
  const config = await prisma.config.findUnique({ where: { userId } });
  return {
    supportId: config?.supportId ?? null,
    trainerId: config?.trainerId ?? null,
    backgroundId: config?.backgroundId ?? null,
  };
}

/**
 * Apply a partial update: only explicitly-provided keys are mutated.
 * Passing `null` clears a previous selection.
 *
 * A `Config` row is always created at registration so this would normally
 * be a plain `update`, but we use `upsert` as a safety net in case the
 * row is ever missing.
 */
export async function updateBoardConfig(
  userId: string,
  patch: UpdateBoardConfigBody,
): Promise<BoardConfigDto> {
  const data: Record<string, string | null> = {};
  if ('supportId' in patch) data.supportId = patch.supportId ?? null;
  if ('trainerId' in patch) data.trainerId = patch.trainerId ?? null;
  if ('backgroundId' in patch) data.backgroundId = patch.backgroundId ?? null;

  const updated = await prisma.config.upsert({
    where: { userId },
    create: {
      userId,
      supportId: patch.supportId ?? null,
      trainerId: patch.trainerId ?? null,
      backgroundId: patch.backgroundId ?? null,
    },
    update: data,
  });

  return {
    supportId: updated.supportId,
    trainerId: updated.trainerId,
    backgroundId: updated.backgroundId,
  };
}
