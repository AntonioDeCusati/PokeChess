import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import * as controller from './creature.controller';

export const creatureRouter = Router();

creatureRouter.use(requireAuth);

creatureRouter.get('/', controller.list);
creatureRouter.get('/:id', controller.getOne);
