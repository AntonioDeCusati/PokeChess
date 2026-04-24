import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { bootstrap } from './bootstrap.controller';

export const bootstrapRouter = Router();

bootstrapRouter.use(requireAuth);

bootstrapRouter.get('/bootstrap', bootstrap);
