import { asyncHandler, HttpError } from '../http/errors';
import * as service from './team.service';
import type { UpdateTeamBody } from './team.schemas';

export const get = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const team = await service.getTeam(req.userId);
  res.json({ team });
});

export const update = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const body = req.body as UpdateTeamBody;
  const team = await service.updateTeam(req.userId, body);
  res.json({ team });
});
