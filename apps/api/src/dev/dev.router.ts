import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { validateBody } from '../http/validate';
import { GrantCreaturesBody } from './dev.schemas';
import * as controller from './dev.controller';

/**
 * Dev-only router. Wired into the app ONLY when NODE_ENV !== 'production'
 * (see app.ts). Intended as a temporary seeding helper so the team
 * endpoints can be tested with real data before a proper inventory /
 * purchase flow exists.
 */
export const devRouter = Router();

devRouter.use(requireAuth);

devRouter.post(
  '/grant-creatures',
  validateBody(GrantCreaturesBody),
  controller.grantCreatures,
);
