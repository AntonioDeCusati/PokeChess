import { prisma } from '../db';
import { HttpError } from '../http/errors';
import type { UpdateTeamBody } from './team.schemas';

/**
 * Wire shape of the team — the 6 prima-linea slots only.
 *
 * Board-level configuration (support / trainer / background) is NOT
 * returned here anymore; it lives on /board-config to keep concerns
 * separated. The aggregate /app/bootstrap response stitches them back
 * together for one-shot client hydration.
 *
 * `slots` is sorted by slotIndex and may contain fewer than 6 entries
 * while the user is still building their team.
 */
export interface TeamDto {
  slots: {
    index: number;
    creatureId: string;
    creatureSlug: string;
    moveId: string;
  }[];
}

export async function getTeam(userId: string): Promise<TeamDto> {
  const slots = await prisma.teamSlot.findMany({
    where: { userId },
    orderBy: { slotIndex: 'asc' },
    include: { creature: { select: { slug: true } } },
  });
  return {
    slots: slots.map((s) => ({
      index: s.slotIndex,
      creatureId: s.creatureId,
      creatureSlug: s.creature.slug,
      moveId: s.moveId,
    })),
  };
}

/**
 * Apply a partial update to the 6 team slots.
 *
 * Validation rules enforced here:
 *  - every `creatureSlug` must exist in the catalog
 *  - every referenced creature must be owned by the user
 *    (there must be a matching UserCreature row with owned=true)
 *  - a creature may not appear in more than one slot for the same user
 *    (enforced across merged state, not just the incoming payload)
 */
export async function updateTeam(
  userId: string,
  body: UpdateTeamBody,
): Promise<TeamDto> {
  return prisma.$transaction(async (tx) => {
    const slugs = body.slots.map((s) => s.creatureSlug);

    // Resolve slug → id and ensure every slug exists in the catalog.
    const catalog = await tx.creature.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    });
    if (catalog.length !== new Set(slugs).size) {
      const found = new Set(catalog.map((c) => c.slug));
      const missing = slugs.filter((s) => !found.has(s));
      throw HttpError.badRequest('Unknown creature slug(s)', { missing });
    }
    const idBySlug = new Map(catalog.map((c) => [c.slug, c.id]));

    // Ownership check: the user must actually own each referenced creature.
    const creatureIds = catalog.map((c) => c.id);
    const owned = await tx.userCreature.findMany({
      where: { userId, creatureId: { in: creatureIds }, owned: true },
      select: { creatureId: true },
    });
    const ownedSet = new Set(owned.map((u) => u.creatureId));
    const unowned = body.slots.filter(
      (s) => !ownedSet.has(idBySlug.get(s.creatureSlug)!),
    );
    if (unowned.length > 0) {
      throw HttpError.forbidden(
        `Cannot place unowned creatures in team: ${unowned
          .map((u) => u.creatureSlug)
          .join(', ')}`,
      );
    }

    // Cross-slot uniqueness: after applying the patch, no creature may
    // appear twice across the user's 6 slots.
    const existing = await tx.teamSlot.findMany({
      where: { userId },
      select: { slotIndex: true, creatureId: true },
    });
    const merged = new Map<number, string>();
    for (const s of existing) merged.set(s.slotIndex, s.creatureId);
    for (const s of body.slots) {
      merged.set(s.index, idBySlug.get(s.creatureSlug)!);
    }
    const seen = new Set<string>();
    for (const cId of merged.values()) {
      if (seen.has(cId)) {
        throw HttpError.badRequest(
          'The same creature cannot occupy two slots',
        );
      }
      seen.add(cId);
    }

    // Upsert each slot independently (partial updates stay partial).
    for (const slot of body.slots) {
      const creatureId = idBySlug.get(slot.creatureSlug)!;
      await tx.teamSlot.upsert({
        where: { userId_slotIndex: { userId, slotIndex: slot.index } },
        create: {
          userId,
          slotIndex: slot.index,
          creatureId,
          moveId: slot.moveId,
        },
        update: { creatureId, moveId: slot.moveId },
      });
    }

    const slots = await tx.teamSlot.findMany({
      where: { userId },
      orderBy: { slotIndex: 'asc' },
      include: { creature: { select: { slug: true } } },
    });
    return {
      slots: slots.map((s) => ({
        index: s.slotIndex,
        creatureId: s.creatureId,
        creatureSlug: s.creature.slug,
        moveId: s.moveId,
      })),
    };
  });
}
