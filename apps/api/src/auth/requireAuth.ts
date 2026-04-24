import type { RequestHandler } from 'express';
import { HttpError } from '../http/errors';
import { verifyToken } from './jwt';

/**
 * Augment the Express Request with the authenticated user id so handlers can
 * read `req.userId` without additional casts.
 */
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

/**
 * Extracts a Bearer token, verifies it, and attaches `req.userId`.
 * Responds 401 if the header is missing or the token fails verification.
 */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(HttpError.unauthorized('Missing bearer token'));
    return;
  }
  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    next(HttpError.unauthorized('Empty bearer token'));
    return;
  }
  try {
    const { sub } = verifyToken(token);
    req.userId = sub;
    next();
  } catch {
    next(HttpError.unauthorized('Invalid or expired token'));
  }
};
