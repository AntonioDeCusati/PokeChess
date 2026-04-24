import { prisma } from '../db';
import { HttpError } from '../http/errors';
import type { GrantCreaturesBody } from './dev.schemas';

export interface GrantResult {
  userId: string;
  granted: string[]; // slugs actually granted (either newly created or updated)
  total: number;
}

/**
 * Grant (or re-grant) a set of creatures to the given user as owned
 * UserCreature rows. Idempotent via upsert.
 */
export async function grantCreatures(
  userId: string,
  body: GrantCreaturesBody,
): Promise<GrantResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) throw HttpError.notFound('User not found');

  const targets = await prisma.creature.findMany({
    where: body.slugs ? { slug: { in: body.slugs } } : undefined,
    select: {
      id: true,
      slug: true,
      defaultProgressMax: true,
    },
  });

  if (body.slugs) {
    const found = new Set(targets.map((t) => t.slug));
    const missing = body.slugs.filter((s) => !found.has(s));
    if (missing.length > 0) {
      throw HttpError.badRequest('Unknown creature slug(s)', { missing });
    }
  }

  if (targets.length === 0) {
    throw HttpError.badRequest(
      'No creatures to grant. Has the seed been run? (npm run db:seed)',
    );
  }

  const level = body.level ?? 1;
  const progressCurrent = body.progressCurrent ?? 0;

  await prisma.$transaction(
    targets.map((creature) =>
      prisma.userCreature.upsert({
        where: {
          userId_creatureId: { userId, creatureId: creature.id },
        },
        create: {
          userId,
          creatureId: creature.id,
          level,
          progressCurrent,
          progressMax: creature.defaultProgressMax,
          owned: true,
        },
        update: {
          owned: true,
          level,
          progressCurrent,
        },
      }),
    ),
  );

  return {
    userId,
    granted: targets.map((t) => t.slug),
    total: targets.length,
  };
}
