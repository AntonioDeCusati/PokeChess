import { asyncHandler, HttpError } from '../http/errors';
import * as service from './saved-game.service';

export const list = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const saves = await service.listSaves(req.userId);
  res.json({ saves });
});

export const get = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const save = await service.getSave(req.userId, req.params.id);
  res.json(save);
});

export const create = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const { name, state } = req.body;
  const save = await service.createSave(req.userId, name ?? null, state);
  res.status(201).json(save);
});

export const update = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const { name, state } = req.body;
  const save = await service.updateSave(req.userId, req.params.id, name ?? null, state);
  res.json(save);
});

export const remove = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  await service.deleteSave(req.userId, req.params.id);
  res.status(204).end();
});
