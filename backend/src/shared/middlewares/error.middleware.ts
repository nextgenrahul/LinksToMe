import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values (DO NOT mutate err)
  let statusCode = 500;
  let message = 'Something went very wrong!';
  let status = 'error';

  // If error is our trusted AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    status = err.status;
  }

  // full error details
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status,
      message,
      error: err,
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  // operational errors only
  if (err instanceof AppError && err.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  // Unknown / programming error → log internally
  console.error('ERROR 💥', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};
