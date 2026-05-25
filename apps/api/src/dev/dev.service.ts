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
    select: { id: true, slug: true },
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
  const currentExp = body.currentExp ?? 0;

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
          currentExp,
          owned: true,
        },
        update: {
          owned: true,
          level,
          currentExp,
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

export async function setWallet(
  userId: string,
  body: { gold?: number; gems?: number },
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(body.gold !== undefined ? { gold: body.gold } : {}),
      ...(body.gems !== undefined ? { gems: body.gems } : {}),
    },
    select: { id: true, gold: true, gems: true },
  });
  return { id: user.id, gold: user.gold, gems: user.gems };
}
