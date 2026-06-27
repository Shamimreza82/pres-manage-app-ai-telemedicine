import { NextFunction, Request, Response } from 'express';

type AsyncHandler<T extends Request> = (req: T, res: Response, next: NextFunction) => Promise<unknown>;
type ErrorHandler<T extends Request> = (req: T, res: Response, error: unknown) => void | Promise<void>;

export const catchAsync = <T extends Request>(
  fn: AsyncHandler<T>,
  onError?: ErrorHandler<T>
) =>
  (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      if (onError) {
        Promise.resolve(onError(req, res, error)).finally(() => next(error));
      } else {
        next(error);
      }
    });
  };
