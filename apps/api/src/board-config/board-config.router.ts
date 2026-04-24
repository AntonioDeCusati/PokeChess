import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { validateBody } from '../http/validate';
import { UpdateBoardConfigBody } from './board-config.schemas';
import * as controller from './board-config.controller';

export const boardConfigRouter = Router();

boardConfigRouter.use(requireAuth);

boardConfigRouter.get('/', controller.get);
boardConfigRouter.post(
  '/update',
  validateBody(UpdateBoardConfigBody),
  controller.update,
);
