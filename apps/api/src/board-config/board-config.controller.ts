import { asyncHandler, HttpError } from '../http/errors';
import * as service from './board-config.service';
import type { UpdateBoardConfigBody } from './board-config.schemas';

export const get = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const boardConfig = await service.getBoardConfig(req.userId);
  res.json({ boardConfig });
});

export const update = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const body = req.body as UpdateBoardConfigBody;
  const boardConfig = await service.updateBoardConfig(req.userId, body);
  res.json({ boardConfig });
});
