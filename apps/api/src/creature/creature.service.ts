import { prisma } from '../db';
import { HttpError } from '../http/errors';
import {
  toCreatureDto,
  toUserCreatureDto,
  type CreatureDto,
  type UserCreatureDto,
} from './creature.dto';

export async function listCreatures(): Promise<CreatureDto[]> {
  const creatures = await prisma.creature.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return creatures.map(toCreatureDto);
}

/**
 * Look up a single catalog entry by either its internal id or its stable
 * slug. Slugs are client-facing (`flarepup`, `voidbat`, …) while ids are
 * Prisma cuids. The param is passed as-is — we try both shapes.
 */
export async function getCreatureByIdOrSlug(
  idOrSlug: string,
): Promise<CreatureDto> {
  const creature = await prisma.creature.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
  });
  if (!creature) throw HttpError.notFound('Creature not found');
  return toCreatureDto(creature);
}

/**
 * Return the full catalog merged with the user's ownership state.
 * Unowned entries are returned with owned=false/level=0/progress=0 so the
 * client can render a stable grid (Collezione in the mockups).
 */
export async function listCatalogWithOwnership(
  userId: string,
): Promise<UserCreatureDto[]> {
  const [creatures, userCreatures] = await Promise.all([
    prisma.creature.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.userCreature.findMany({ where: { userId } }),
  ]);
  const byCreatureId = new Map(userCreatures.map((uc) => [uc.creatureId, uc]));
  return creatures.map((c) => toUserCreatureDto(c, byCreatureId.get(c.id)));
}

/**
 * Return only the UserCreature rows the user actually owns.
 */
export async function listUserInventory(
  userId: string,
): Promise<UserCreatureDto[]> {
  const rows = await prisma.userCreature.findMany({
    where: { userId, owned: true },
    orderBy: { acquiredAt: 'asc' },
    include: { creature: true },
  });
  return rows.map((r) => toUserCreatureDto(r.creature, r));
}
