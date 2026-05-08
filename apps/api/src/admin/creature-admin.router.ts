import { Router } from 'express';
import { validateBody } from '../http/validate';
import { CreateCreatureBody, UpdateCreatureBody } from './admin.schemas';
import * as svc from './creature-admin.service';
import { asyncHandler } from '../http/errors';

export const creatureAdminRouter = Router();

creatureAdminRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await svc.listAll());
}));

creatureAdminRouter.get('/:id', asyncHandler(async (req, res) => {
  res.json(await svc.getById(req.params.id));
}));

creatureAdminRouter.post('/', validateBody(CreateCreatureBody), asyncHandler(async (req, res) => {
  res.status(201).json(await svc.create(req.body));
}));

creatureAdminRouter.put('/:id', validateBody(UpdateCreatureBody), asyncHandler(async (req, res) => {
  res.json(await svc.update(req.params.id, req.body));
}));

creatureAdminRouter.delete('/:id', asyncHandler(async (req, res) => {
  await svc.remove(req.params.id);
  res.status(204).end();
}));
