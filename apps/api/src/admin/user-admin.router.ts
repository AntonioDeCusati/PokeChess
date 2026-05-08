import { Router } from 'express';
import { validateBody } from '../http/validate';
import { asyncHandler } from '../http/errors';
import { prisma } from '../db';
import { HttpError } from '../http/errors';
import { hashPassword } from '../auth/password';
import { z } from 'zod';

export const userAdminRouter = Router();

const UpdateUserBody = z.object({
  username: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  level: z.number().int().min(1).optional(),
  exp: z.number().int().min(0).optional(),
  expToNext: z.number().int().min(1).optional(),
  gold: z.number().int().min(0).optional(),
  gems: z.number().int().min(0).optional(),
}).strict();

const userSelect = {
  id: true,
  email: true,
  username: true,
  level: true,
  exp: true,
  expToNext: true,
  gold: true,
  gems: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { creatures: true, teamSlots: true } },
} as const;

userAdminRouter.get('/', asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: userSelect,
  });
  res.json(users);
}));

userAdminRouter.get('/:id', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      ...userSelect,
      creatures: {
        include: { creature: { select: { name: true, slug: true, pokedexNumber: true } } },
        orderBy: { acquiredAt: 'asc' },
      },
      teamSlots: {
        include: { creature: { select: { name: true, slug: true } } },
        orderBy: { slotIndex: 'asc' },
      },
      config: true,
    },
  });
  if (!user) throw HttpError.notFound('User not found');
  res.json(user);
}));

userAdminRouter.put('/:id', validateBody(UpdateUserBody), asyncHandler(async (req, res) => {
  const exists = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!exists) throw HttpError.notFound('User not found');

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: req.body,
    select: userSelect,
  });
  res.json(updated);
}));

const ResetPasswordBody = z.object({ password: z.string().min(4).max(128) }).strict();

userAdminRouter.post('/:id/reset-password', validateBody(ResetPasswordBody), asyncHandler(async (req, res) => {
  const exists = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!exists) throw HttpError.notFound('User not found');

  const passwordHash = await hashPassword(req.body.password);
  await prisma.user.update({ where: { id: req.params.id }, data: { passwordHash } });
  res.json({ ok: true });
}));

userAdminRouter.delete('/:id', asyncHandler(async (req, res) => {
  const exists = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!exists) throw HttpError.notFound('User not found');

  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));
