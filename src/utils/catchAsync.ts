import type { NextFunction, Request, Response } from 'express';

/**
 * Wraps an async function to catch any errors and pass them to the next middleware.
 * @param fn - The async function to wrap.
 * @returns A function that wraps the provided async function and handles errors.
 */
const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => unknown,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log({ err });
      next(err); // For other types of errors, pass to the default error handler
    });
  };
};

export default catchAsync;
