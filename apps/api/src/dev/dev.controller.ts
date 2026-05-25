import { asyncHandler, HttpError } from '../http/errors';
import * as service from './dev.service';

export const grantCreatures = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const result = await service.grantCreatures(req.userId, req.body);
  res.json(result);
});

export const setWallet = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const result = await service.setWallet(req.userId, req.body);
  res.json(result);
});
