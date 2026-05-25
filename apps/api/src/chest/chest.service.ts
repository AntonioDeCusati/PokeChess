import type { ChestTier } from '@prisma/client';
import { prisma } from '../db';
import { rollRarity } from './gacha';
import { HttpError } from '../http/errors';

export interface ChestInventoryDto {
  tier: ChestTier;
  quantity: number;
}

export interface ChestOpenResultDto {
  creature: {
    id: string;
    slug: string;
    name: string;
    pokedexPath: string;
    type1: string;
    type2: string | null;
    rarity: string;
  };
  isNew: boolean;
  wasPity: boolean;
}

const CHEST_COST: Record<ChestTier, { currency: 'gold' | 'gems'; amount: number }> = {
  wood:    { currency: 'gold', amount: 100 },
  iron:    { currency: 'gems', amount: 150 },
  gold:    { currency: 'gems', amount: 450 },
  diamond: { currency: 'gems', amount: 1200 },
};

export function getChestCost(tier: ChestTier) {
  return CHEST_COST[tier];
}

export async function getInventory(userId: string): Promise<ChestInventoryDto[]> {
  const rows = await prisma.userChest.findMany({
    where: { userId },
    orderBy: { tier: 'asc' },
  });

  const allTiers: ChestTier[] = ['wood', 'iron', 'gold', 'diamond'];
  return allTiers.map((tier) => ({
    tier,
    quantity: rows.find((r) => r.tier === tier)?.quantity ?? 0,
  }));
}

export async function grantChests(
  userId: string,
  tier: ChestTier,
  quantity: number,
): Promise<ChestInventoryDto> {
  const row = await prisma.userChest.upsert({
    where: { userId_tier: { userId, tier } },
    create: { userId, tier, quantity },
    update: { quantity: { increment: quantity } },
  });
  return { tier: row.tier, quantity: row.quantity };
}

/**
 * Purchase and immediately open a chest, deducting the correct currency.
 * This is the "buy & open" flow used from the shop.
 */
export async function buyAndOpenChest(
  userId: string,
  tier: ChestTier,
): Promise<ChestOpenResultDto> {
  const cost = CHEST_COST[tier];

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { gold: true, gems: true },
  });

  const balance = cost.currency === 'gold' ? user.gold : user.gems;
  if (balance < cost.amount) {
    const label = cost.currency === 'gold' ? 'oro' : 'gemme';
    throw HttpError.badRequest(`Non hai abbastanza ${label} (servono ${cost.amount}, hai ${balance})`);
  }

  return performOpen(userId, tier, cost);
}

/**
 * Open a chest from inventory (already owned).
 */
export async function openChest(
  userId: string,
  tier: ChestTier,
): Promise<ChestOpenResultDto> {
  const chest = await prisma.userChest.findUnique({
    where: { userId_tier: { userId, tier } },
  });

  if (!chest || chest.quantity <= 0) {
    throw HttpError.badRequest(`Non hai bauli di tipo ${tier}`);
  }

  return performOpen(userId, tier, null, true);
}

async function performOpen(
  userId: string,
  tier: ChestTier,
  cost: { currency: 'gold' | 'gems'; amount: number } | null,
  fromInventory = false,
): Promise<ChestOpenResultDto> {
  const missStreak = await prisma.chestOpenLog.count({
    where: {
      userId,
      tier,
      rarity: { in: ['common', 'rare'] },
      openedAt: { gt: await getLastEpicPlusDate(userId, tier) },
    },
  });

  const { rarity, wasPity } = rollRarity(tier, missStreak);

  const creatures = await prisma.creature.findMany({
    where: { rarity },
    select: { id: true },
  });

  if (creatures.length === 0) {
    throw HttpError.badRequest(`Nessuna creatura trovata per rarità ${rarity}`);
  }

  const notOwned = await filterNotOwned(userId, creatures.map((c) => c.id));
  const pool = notOwned.length > 0 ? notOwned : creatures.map((c) => c.id);
  const chosenId = pool[Math.floor(Math.random() * pool.length)];

  const [creature, existingOwnership] = await Promise.all([
    prisma.creature.findUniqueOrThrow({
      where: { id: chosenId },
      select: {
        id: true, slug: true, name: true,
        pokedexPath: true, type1: true, type2: true, rarity: true,
      },
    }),
    prisma.userCreature.findUnique({
      where: { userId_creatureId: { userId, creatureId: chosenId } },
    }),
  ]);

  const isNew = !existingOwnership;

  const txOps = [];

  if (cost) {
    txOps.push(
      prisma.user.update({
        where: { id: userId },
        data: { [cost.currency]: { decrement: cost.amount } },
      }),
    );
  }

  if (fromInventory) {
    txOps.push(
      prisma.userChest.update({
        where: { userId_tier: { userId, tier } },
        data: { quantity: { decrement: 1 } },
      }),
    );
  }

  txOps.push(
    prisma.chestOpenLog.create({
      data: { userId, tier, creatureId: chosenId, rarity, wasPity },
    }),
  );

  if (isNew) {
    txOps.push(
      prisma.userCreature.create({
        data: { userId, creatureId: chosenId, level: 1, currentExp: 0, owned: true },
      }),
    );
  }

  await prisma.$transaction(txOps);

  return {
    creature: {
      id: creature.id,
      slug: creature.slug,
      name: creature.name,
      pokedexPath: creature.pokedexPath,
      type1: creature.type1,
      type2: creature.type2,
      rarity: creature.rarity,
    },
    isNew,
    wasPity,
  };
}

async function getLastEpicPlusDate(userId: string, tier: ChestTier): Promise<Date> {
  const lastGood = await prisma.chestOpenLog.findFirst({
    where: { userId, tier, rarity: { in: ['epic', 'legendary'] } },
    orderBy: { openedAt: 'desc' },
    select: { openedAt: true },
  });
  return lastGood?.openedAt ?? new Date(0);
}

async function filterNotOwned(userId: string, creatureIds: string[]): Promise<string[]> {
  const owned = await prisma.userCreature.findMany({
    where: { userId, creatureId: { in: creatureIds } },
    select: { creatureId: true },
  });
  const ownedSet = new Set(owned.map((o) => o.creatureId));
  return creatureIds.filter((id) => !ownedSet.has(id));
}
