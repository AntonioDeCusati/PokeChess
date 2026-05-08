import { Router } from 'express';
import { validateBody } from '../http/validate';
import { CreateTrainerBody, UpdateTrainerBody } from './admin.schemas';
import { asyncHandler } from '../http/errors';
import { prisma } from '../db';
import { HttpError } from '../http/errors';

export const trainerAdminRouter = Router();

trainerAdminRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await prisma.trainer.findMany({ orderBy: { name: 'asc' } }));
}));

trainerAdminRouter.get('/:id', asyncHandler(async (req, res) => {
  const row = await prisma.trainer.findUnique({ where: { id: req.params.id } });
  if (!row) throw HttpError.notFound('Trainer not found');
  res.json(row);
}));

trainerAdminRouter.post('/', validateBody(CreateTrainerBody), asyncHandler(async (req, res) => {
  res.status(201).json(await prisma.trainer.create({ data: req.body }));
}));

trainerAdminRouter.put('/:id', validateBody(UpdateTrainerBody), asyncHandler(async (req, res) => {
  const exists = await prisma.trainer.findUnique({ where: { id: req.params.id } });
  if (!exists) throw HttpError.notFound('Trainer not found');
  res.json(await prisma.trainer.update({ where: { id: req.params.id }, data: req.body }));
}));

trainerAdminRouter.delete('/:id', asyncHandler(async (req, res) => {
  const exists = await prisma.trainer.findUnique({ where: { id: req.params.id } });
  if (!exists) throw HttpError.notFound('Trainer not found');
  await prisma.trainer.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));
