import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { createAuditLog } from '../utils/auditLogger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const userId = (req as any).user?.userId;
  const details: any = { error: err.message };

  if (err instanceof AppError) {
    details.statusCode = err.statusCode;
    if (err.statusCode >= 500) {
      createAuditLog({ userId, action: 'ERROR', entity: 'System', details, ipAddress: req.ip }).catch(() => {});
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error('[UNHANDLED]', err);
  createAuditLog({ userId, action: 'ERROR', entity: 'System', details: { ...details, stack: err.stack }, ipAddress: req.ip }).catch(() => {});
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
};
