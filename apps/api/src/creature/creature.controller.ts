import { asyncHandler, HttpError } from '../http/errors';
import * as service from './creature.service';

export const list = asyncHandler(async (_req, res) => {
  const creatures = await service.listCreatures();
  res.json({ creatures });
});

export const getOne = asyncHandler(async (req, res) => {
  const idOrSlug = req.params.id;
  if (!idOrSlug) throw HttpError.badRequest('Missing id parameter');
  const creature = await service.getCreatureByIdOrSlug(idOrSlug);
  res.json({ creature });
});
