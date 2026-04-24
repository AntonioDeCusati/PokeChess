import type { RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { HttpError } from './errors';

/**
 * Factory for a middleware that parses `req.body` against a zod schema and
 * replaces it with the parsed, typed value. Anything invalid becomes a 422.
 */
export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(
        HttpError.unprocessable(
          'Invalid request body',
          result.error.flatten(),
        ),
      );
      return;
    }
    req.body = result.data;
    next();
  };
}
