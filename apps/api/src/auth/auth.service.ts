import { prisma } from '../db';
import { HttpError } from '../http/errors';
import { hashPassword, verifyPassword } from './password';
import { signToken } from './jwt';
import type { RegisterBody, LoginBody } from './auth.schemas';

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  level: number;
  exp: number;
  expToNext: number;
  gold: number;
  gems: number;
  createdAt: string;
}

/**
 * Strip the password hash and normalize dates.
 * Never let the hash leave the service layer.
 */
function toPublicUser(u: {
  id: string;
  email: string;
  username: string;
  level: number;
  exp: number;
  expToNext: number;
  gold: number;
  gems: number;
  createdAt: Date;
}): PublicUser {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    level: u.level,
    exp: u.exp,
    expToNext: u.expToNext,
    gold: u.gold,
    gems: u.gems,
    createdAt: u.createdAt.toISOString(),
  };
}

export async function register(input: RegisterBody) {
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username: input.username }] },
    select: { id: true, email: true, username: true },
  });
  if (existing) {
    if (existing.email === email) {
      throw HttpError.conflict('Email already in use');
    }
    throw HttpError.conflict('Username already in use');
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email,
      username: input.username,
      passwordHash,
      config: { create: {} },
    },
  });

  const token = signToken({ sub: user.id });
  return { token, user: toPublicUser(user) };
}

export async function login(input: LoginBody) {
  const identifier = input.identifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: input.identifier }],
    },
  });
  if (!user) throw HttpError.unauthorized('Invalid credentials');

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) throw HttpError.unauthorized('Invalid credentials');

  const token = signToken({ sub: user.id });
  return { token, user: toPublicUser(user) };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw HttpError.unauthorized('Session user no longer exists');
  return toPublicUser(user);
}
