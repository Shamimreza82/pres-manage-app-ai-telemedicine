import { Response, NextFunction } from 'express';
import { forbidden } from '../utils/errors';
import { AuthRequest } from '../types/express';

export const authorize = (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(forbidden('Insufficient permissions'));
    }
    next();
  };
