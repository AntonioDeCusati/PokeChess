import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { creatureAdminRouter } from './creature-admin.router';
import { trainerAdminRouter } from './trainer-admin.router';
import { backgroundAdminRouter } from './background-admin.router';
import { supportAdminRouter } from './support-admin.router';
import { userAdminRouter } from './user-admin.router';

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.use('/creatures', creatureAdminRouter);
adminRouter.use('/trainers', trainerAdminRouter);
adminRouter.use('/backgrounds', backgroundAdminRouter);
adminRouter.use('/supports', supportAdminRouter);
adminRouter.use('/users', userAdminRouter);
