import { prisma } from '../db';
import { HttpError } from '../http/errors';
import {
  toCreatureDto,
  toUserCreatureDto,
  type CreatureDto,
  type UserCreatureDto,
} from './creature.dto';

/** Include clause shared by every catalog query. */
const withAnimations = { animations: true } as const;

export async function listCreatures(): Promise<CreatureDto[]> {
  const creatures = await prisma.creature.findMany({
    orderBy: { pokedexNumber: 'asc' },
    include: withAnimations,
  });
  return creatures.map(toCreatureDto);
}

/**
 * Look up a single catalog entry by its internal cuid, slug, or pokedex
 * number. Slugs are client-facing stable ids ("flarepup", "voidbat", …).
 */
export async function getCreatureByIdOrSlug(
  idSlugOrNumber: string,
): Promise<CreatureDto> {
  const asNumber = Number(idSlugOrNumber);
  const creature = await prisma.creature.findFirst({
    where: {
      OR: [
        { id: idSlugOrNumber },
        { slug: idSlugOrNumber },
        ...(Number.isInteger(asNumber) && !Number.isNaN(asNumber)
          ? [{ pokedexNumber: asNumber }]
          : []),
      ],
    },
    include: withAnimations,
  });
  if (!creature) throw HttpError.notFound('Creature not found');
  return toCreatureDto(creature);
}

/**
 * Return the full catalog merged with the user's ownership state.
 * Unowned entries are returned with owned=false/level=0/currentExp=0 so the
 * client can render a stable grid (Collezione in the mockups).
 */
export async function listCatalogWithOwnership(
  userId: string,
): Promise<UserCreatureDto[]> {
  const [creatures, userCreatures] = await Promise.all([
    prisma.creature.findMany({
      orderBy: { pokedexNumber: 'asc' },
      include: withAnimations,
    }),
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
    include: { creature: { include: withAnimations } },
  });
  return rows.map((r) => toUserCreatureDto(r.creature, r));
}


