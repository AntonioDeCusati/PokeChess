import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { HttpError } from './errors';

/**
 * Terminal error middleware.
 * Maps known error types to stable {code, message, details} payloads.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Known, explicit HTTP errors from our code.
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  // Validation errors from zod (wrapped middleware already converts them,
  // but surface anything that slips through).
  if (err instanceof ZodError) {
    res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: err.flatten(),
      },
    });
    return;
  }

  // Known Prisma failures worth translating.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'Unique constraint violation',
          details: err.meta,
        },
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Resource not found' },
      });
      return;
    }
  }

  // Unknown / unexpected.
  console.error('[errorHandler]', err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
  });
};
