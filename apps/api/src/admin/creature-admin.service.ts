import { prisma } from '../db';
import { HttpError } from '../http/errors';
import type { CreateCreatureBody, UpdateCreatureBody } from './admin.schemas';

const include = { animations: true, evolveTo: true } as const;

export async function listAll() {
  return prisma.creature.findMany({
    orderBy: { pokedexNumber: 'asc' },
    include,
  });
}

export async function getById(id: string) {
  const creature = await prisma.creature.findUnique({ where: { id }, include });
  if (!creature) throw HttpError.notFound('Creature not found');
  return creature;
}

export async function create(body: CreateCreatureBody) {
  const { animations, ...data } = body;

  const creature = await prisma.creature.create({
    data: {
      ...data,
      type2: data.type2 ?? null,
      evolveToId: data.evolveToId ?? null,
      animations: animations
        ? {
            create: animations.map((a) => ({
              type: a.type,
              frameWidth: a.frameWidth,
              frameHeight: a.frameHeight,
              frameCount: a.durations.length,
              durations: a.durations,
              rushFrame: a.rushFrame ?? null,
              hitFrame: a.hitFrame ?? null,
              returnFrame: a.returnFrame ?? null,
            })),
          }
        : undefined,
    },
    include,
  });
  return creature;
}

export async function update(id: string, body: UpdateCreatureBody) {
  const existing = await prisma.creature.findUnique({ where: { id } });
  if (!existing) throw HttpError.notFound('Creature not found');

  const { animations, ...data } = body;

  if (animations) {
    await prisma.creatureAnimation.deleteMany({ where: { creatureId: id } });
    await prisma.creatureAnimation.createMany({
      data: animations.map((a) => ({
        creatureId: id,
        type: a.type,
        frameWidth: a.frameWidth,
        frameHeight: a.frameHeight,
        frameCount: a.durations.length,
        durations: a.durations,
        rushFrame: a.rushFrame ?? null,
        hitFrame: a.hitFrame ?? null,
        returnFrame: a.returnFrame ?? null,
      })),
    });
  }

  return prisma.creature.update({
    where: { id },
    data: {
      ...data,
      type2: data.type2 !== undefined ? (data.type2 ?? null) : undefined,
      evolveToId: data.evolveToId !== undefined ? (data.evolveToId ?? null) : undefined,
    },
    include,
  });
}

export async function remove(id: string) {
  const existing = await prisma.creature.findUnique({ where: { id } });
  if (!existing) throw HttpError.notFound('Creature not found');

  await prisma.creatureAnimation.deleteMany({ where: { creatureId: id } });
  await prisma.userCreature.deleteMany({ where: { creatureId: id } });
  await prisma.teamSlot.deleteMany({ where: { creatureId: id } });
  await prisma.creature.delete({ where: { id } });
}
