import { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../types/errors.js';
import { config } from '../config.js';

interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  details?: unknown;
  stack?: string;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const response: ErrorResponse = {
    status: 'error',
    message: 'Internal server error',
  };

  let statusCode = 500;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.message = err.message;
    response.code = err.code;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    response.message = 'Validation error';
    response.code = 'VALIDATION_ERROR';
    response.details = err.errors;
  } else if (err instanceof Error) {
    response.message =
      config.nodeEnv === 'production' ? 'Internal server error' : err.message;

    if (config.nodeEnv !== 'production') {
      response.stack = err.stack;
    }
  }

  // Log error for debugging
  if (statusCode >= 500) {
    console.error('Server error:', err);
  }

  res.status(statusCode).json(response);
}
