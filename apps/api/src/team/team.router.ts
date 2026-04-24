import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { validateBody } from '../http/validate';
import { UpdateTeamBody } from './team.schemas';
import * as controller from './team.controller';

export const teamRouter = Router();

teamRouter.use(requireAuth);

teamRouter.get('/', controller.get);
teamRouter.post('/update', validateBody(UpdateTeamBody), controller.update);
