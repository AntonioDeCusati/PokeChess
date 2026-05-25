import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import * as ctrl from './npc-trainer.controller';

export const npcTrainerRouter = Router();

npcTrainerRouter.use(requireAuth);

npcTrainerRouter.get('/', ctrl.list);
npcTrainerRouter.get('/:id', ctrl.get);
