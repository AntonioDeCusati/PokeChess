import express, { type Express } from 'express';
import cors from 'cors';
import { env, resolveTrustProxy } from './env';
import { errorHandler } from './http/errorHandler';
import { HttpError } from './http/errors';
import { authRouter } from './auth/auth.router';
import { userRouter } from './user/user.router';
import { creatureRouter } from './creature/creature.router';
import { teamRouter } from './team/team.router';
import { boardConfigRouter } from './board-config/board-config.router';
import { bootstrapRouter } from './app-bootstrap/bootstrap.router';
import { devRouter } from './dev/dev.router';
import { adminRouter } from './admin/admin.router';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');

  // Required when running behind nginx/Caddy so req.ip, req.protocol
  // and rate-limiting middlewares see the real client. Opt-in via env.
  const trustProxy = resolveTrustProxy(env.TRUST_PROXY);
  if (trustProxy !== false) app.set('trust proxy', trustProxy);

  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '1mb' }));

  // Liveness / readiness.
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Feature routers.
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/creatures', creatureRouter);
  app.use('/team', teamRouter);
  app.use('/board-config', boardConfigRouter);
  app.use('/app', bootstrapRouter);
  app.use('/admin', adminRouter);

  // Dev-only helpers: mounted strictly outside production so the surface
  // cannot be reached on real deployments. In production NODE_ENV must be
  // 'production' (validated in env.ts); any other value here falls through.
  if (env.NODE_ENV !== 'production') {
    app.use('/dev', devRouter);
    console.warn(
      '[api] dev-only routes enabled at /dev (NODE_ENV=%s). Do NOT deploy with this flag.',
      env.NODE_ENV,
    );
  }

  // 404 fallback — must be before the error handler.
  app.use((_req, _res, next) => {
    next(HttpError.notFound('Route not found'));
  });

  app.use(errorHandler);

  return app;
}
