import { Router } from 'express';
import { validateBody } from '../http/validate';
import { LoginBody, RegisterBody } from './auth.schemas';
import * as controller from './auth.controller';
import { requireAuth } from './requireAuth';

export const authRouter = Router();

authRouter.post('/register', validateBody(RegisterBody), controller.register);
authRouter.post('/login', validateBody(LoginBody), controller.login);
authRouter.get('/me', requireAuth, controller.me);
