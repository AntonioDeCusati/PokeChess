import { asyncHandler, HttpError } from '../http/errors';
import * as service from './auth.service';

export const register = asyncHandler(async (req, res) => {
  const result = await service.register(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await service.login(req.body);
  res.json(result);
});

export const me = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const user = await service.getMe(req.userId);
  res.json({ user });
});
