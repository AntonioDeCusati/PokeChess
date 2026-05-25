import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import * as ctrl from './saved-game.controller';

export const savedGameRouter = Router();

savedGameRouter.use(requireAuth);

savedGameRouter.get('/',       ctrl.list);
savedGameRouter.get('/:id',    ctrl.get);
savedGameRouter.post('/',      ctrl.create);
savedGameRouter.put('/:id',    ctrl.update);
savedGameRouter.delete('/:id', ctrl.remove);
