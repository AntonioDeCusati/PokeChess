import { asyncHandler, HttpError } from '../http/errors';
import { listUserInventory } from '../creature/creature.service';
import * as service from './user.service';
import type { PatchProfileBody } from './user.schemas';

export const profile = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const profile = await service.getProfile(req.userId);
  res.json({ profile });
});

export const patchProfile = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const body = req.body as PatchProfileBody;
  const profile = await service.updateProfile(req.userId, body);
  res.json({ profile });
});

/**
 * Inventory of creatures the user owns, joined with catalog metadata.
 * For the catalog + ownership overlay used by the Collezione grid,
 * use GET /app/bootstrap instead.
 */
export const inventory = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const creatures = await listUserInventory(req.userId);
  res.json({ creatures });
});
