import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { HttpError } from '../http/errors';
import type { PatchProfileBody } from './user.schemas';

/**
 * Shape consumed by the Player's global header + Home stats.
 * Keep in sync with `apps/player/src/types/player.ts::PlayerProfile`.
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  level: number;
  exp: number;
  expToNext: number;
  wallet: {
    gold: number;
    gems: number;
  };
  createdAt: string;
}

const profileSelect = {
  id: true,
  username: true,
  email: true,
  level: true,
  exp: true,
  expToNext: true,
  gold: true,
  gems: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

type UserRow = Prisma.UserGetPayload<{ select: typeof profileSelect }>;

function mapProfile(user: UserRow): UserProfile {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    level: user.level,
    exp: user.exp,
    expToNext: user.expToNext,
    wallet: { gold: user.gold, gems: user.gems },
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getProfile(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });
  if (!user) throw HttpError.notFound('User not found');
  return mapProfile(user);
}

/**
 * Apply a partial update to the user's identity fields. Uniqueness
 * violations are translated from Prisma's P2002 into 409 Conflict so the
 * client can surface a clean error.
 */
export async function updateProfile(
  userId: string,
  patch: PatchProfileBody,
): Promise<UserProfile> {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(patch.email !== undefined
          ? { email: patch.email.toLowerCase().trim() }
          : {}),
        ...(patch.username !== undefined
          ? { username: patch.username.trim() }
          : {}),
      },
      select: profileSelect,
    });
    return mapProfile(updated);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        const target = (err.meta?.target as string[] | undefined)?.[0];
        throw HttpError.conflict(
          target === 'email'
            ? 'Email already in use'
            : target === 'username'
              ? 'Username already in use'
              : 'Value already in use',
        );
      }
      if (err.code === 'P2025') throw HttpError.notFound('User not found');
    }
    throw err;
  }
}
