import { db } from '../config/database';

export const createAuditLog = ({
  userId,
  action,
  entity,
  entityId,
  details,
  ipAddress,
}: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: unknown;
  ipAddress?: string;
}) =>
  db.auditLog.create({
    data: { userId, action, entity, entityId, details: details as any, ipAddress },
  });
