import { Router } from 'express';
import { validateBody } from '../http/validate';
import { CreateSupportBody, UpdateSupportBody } from './admin.schemas';
import { asyncHandler } from '../http/errors';
import { prisma } from '../db';
import { HttpError } from '../http/errors';

export const supportAdminRouter = Router();

supportAdminRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await prisma.support.findMany({ orderBy: { name: 'asc' } }));
}));

supportAdminRouter.get('/:id', asyncHandler(async (req, res) => {
  const row = await prisma.support.findUnique({ where: { id: req.params.id } });
  if (!row) throw HttpError.notFound('Support not found');
  res.json(row);
}));

supportAdminRouter.post('/', validateBody(CreateSupportBody), asyncHandler(async (req, res) => {
  res.status(201).json(await prisma.support.create({ data: req.body }));
}));

supportAdminRouter.put('/:id', validateBody(UpdateSupportBody), asyncHandler(async (req, res) => {
  const exists = await prisma.support.findUnique({ where: { id: req.params.id } });
  if (!exists) throw HttpError.notFound('Support not found');
  res.json(await prisma.support.update({ where: { id: req.params.id }, data: req.body }));
}));

supportAdminRouter.delete('/:id', asyncHandler(async (req, res) => {
  const exists = await prisma.support.findUnique({ where: { id: req.params.id } });
  if (!exists) throw HttpError.notFound('Support not found');
  await prisma.support.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));
