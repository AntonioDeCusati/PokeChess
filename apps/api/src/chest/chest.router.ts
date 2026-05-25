import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { validateBody, validateParams } from '../http/validate';
import { OpenChestParams, GrantChestsBody } from './chest.schemas';
import * as controller from './chest.controller';

export const chestRouter = Router();

chestRouter.use(requireAuth);

chestRouter.get('/', controller.inventory);

chestRouter.post(
  '/:tier/open',
  validateParams(OpenChestParams),
  controller.open,
);

chestRouter.post(
  '/:tier/buy',
  validateParams(OpenChestParams),
  controller.buyAndOpen,
);

chestRouter.post(
  '/grant',
  validateBody(GrantChestsBody),
  controller.grant,
);
