import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { validateBody } from '../http/validate';
import { PatchProfileBody } from './user.schemas';
import * as controller from './user.controller';

export const userRouter = Router();

userRouter.use(requireAuth);

userRouter.get('/profile', controller.profile);
userRouter.patch(
  '/profile',
  validateBody(PatchProfileBody),
  controller.patchProfile,
);
userRouter.get('/creatures', controller.inventory);
