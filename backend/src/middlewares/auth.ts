import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { unauthorized, forbidden } from '../utils/errors';
import { AuthRequest } from '../types/express';
import { catchAsync } from '../utils/catchAsync';

export const authenticate = catchAsync(async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;

  if (!token) return next(unauthorized('No token provided'));

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded.isActive) return next(unauthorized('Account is deactivated'));
    req.user = decoded;
    next();
  } catch {
    next(unauthorized('Invalid or expired token'));
  }
});

export const authorize = (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(forbidden('Insufficient permissions'));
    }
    next();
  };
