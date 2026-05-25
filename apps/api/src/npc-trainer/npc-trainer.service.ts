import { prisma } from '../db';

export interface NpcTrainerDto {
  id: string;
  slug: string;
  name: string;
  role: string;
  region: string;
  typeSpecialty: string | null;
  spritePath: string | null;
  portraitPath: string | null;
  slots: {
    tier: string;
    slotIndex: number;
    creature: {
      id: string;
      name: string;
      pokedexPath: string;
      type1: string;
      type2: string | null;
    };
  }[];
}

export async function listByRegion(region: string): Promise<NpcTrainerDto[]> {
  const trainers = await prisma.npcTrainer.findMany({
    where: { region },
    orderBy: { createdAt: 'asc' },
    include: {
      slots: {
        orderBy: [{ tier: 'asc' }, { slotIndex: 'asc' }],
        include: {
          creature: {
            select: { id: true, name: true, pokedexPath: true, type1: true, type2: true },
          },
        },
      },
    },
  });

  return trainers.map(toDto);
}

function toDto(t: any): NpcTrainerDto {
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    role: t.role,
    region: t.region,
    typeSpecialty: t.typeSpecialty,
    spritePath: t.spritePath,
    portraitPath: t.portraitPath,
    slots: t.slots.map((s: any) => ({
      tier: s.tier,
      slotIndex: s.slotIndex,
      creature: {
        id: s.creature.id,
        name: s.creature.name,
        pokedexPath: s.creature.pokedexPath,
        type1: s.creature.type1,
        type2: s.creature.type2,
      },
    })),
  };
}

export async function getById(id: string): Promise<NpcTrainerDto | null> {
  const t = await prisma.npcTrainer.findUnique({
    where: { id },
    include: {
      slots: {
        orderBy: [{ tier: 'asc' }, { slotIndex: 'asc' }],
        include: {
          creature: {
            select: { id: true, name: true, pokedexPath: true, type1: true, type2: true },
          },
        },
      },
    },
  });
  if (!t) return null;
  return toDto(t);
}
