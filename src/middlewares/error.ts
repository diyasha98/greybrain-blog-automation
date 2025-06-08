import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { ErrorRequestHandler } from 'express';
import { env } from '../config/envConfig';
import ApiError from '../utils/ApiError';

export const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof PrismaClientKnownRequestError
        ? 400
        : 500;
    const defaultErrorMessage =
      statusCode === 400 ? 'Bad Request' : 'Internal Server Error';
    const message = error.message || defaultErrorMessage;
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (env.isProduction && !err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(env.isDevelopment && { stack: err.stack }),
  };
  if (env.isDevelopment) {
    console.error(err);
  }

  res.status(statusCode).send(response);
};
