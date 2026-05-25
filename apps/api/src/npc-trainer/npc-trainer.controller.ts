import { asyncHandler, HttpError } from '../http/errors';
import * as service from './npc-trainer.service';

export const list = asyncHandler(async (req, res) => {
  const region = (req.query.region as string) || 'Kanto';
  const trainers = await service.listByRegion(region);
  res.json({ trainers });
});

export const get = asyncHandler(async (req, res) => {
  const trainer = await service.getById(req.params.id);
  if (!trainer) throw HttpError.notFound('Trainer not found');
  res.json({ trainer });
});
