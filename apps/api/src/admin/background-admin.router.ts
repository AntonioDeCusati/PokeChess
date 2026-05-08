import { Router } from 'express';
import { validateBody } from '../http/validate';
import { CreateBackgroundBody, UpdateBackgroundBody } from './admin.schemas';
import { asyncHandler } from '../http/errors';
import { prisma } from '../db';
import { HttpError } from '../http/errors';

export const backgroundAdminRouter = Router();

backgroundAdminRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await prisma.background.findMany({ orderBy: { name: 'asc' } }));
}));

backgroundAdminRouter.get('/:id', asyncHandler(async (req, res) => {
  const row = await prisma.background.findUnique({ where: { id: req.params.id } });
  if (!row) throw HttpError.notFound('Background not found');
  res.json(row);
}));

backgroundAdminRouter.post('/', validateBody(CreateBackgroundBody), asyncHandler(async (req, res) => {
  res.status(201).json(await prisma.background.create({ data: req.body }));
}));

backgroundAdminRouter.put('/:id', validateBody(UpdateBackgroundBody), asyncHandler(async (req, res) => {
  const exists = await prisma.background.findUnique({ where: { id: req.params.id } });
  if (!exists) throw HttpError.notFound('Background not found');
  res.json(await prisma.background.update({ where: { id: req.params.id }, data: req.body }));
}));

backgroundAdminRouter.delete('/:id', asyncHandler(async (req, res) => {
  const exists = await prisma.background.findUnique({ where: { id: req.params.id } });
  if (!exists) throw HttpError.notFound('Background not found');
  await prisma.background.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));
