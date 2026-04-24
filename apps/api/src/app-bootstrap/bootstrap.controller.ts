import { asyncHandler, HttpError } from '../http/errors';
import { buildBootstrap } from './bootstrap.service';

export const bootstrap = asyncHandler(async (req, res) => {
  if (!req.userId) throw HttpError.unauthorized();
  const payload = await buildBootstrap(req.userId);
  res.json(payload);
});
