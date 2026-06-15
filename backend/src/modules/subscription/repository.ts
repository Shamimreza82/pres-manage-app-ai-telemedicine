import { db } from '../../config/database';

export const getDoctorStats = (doctorId: string) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return Promise.all([
    db.patient.count({ where: { doctorId } }),
    db.prescription.count({ where: { doctorId } }),
    db.appointment.count({ where: { doctorId, date: { gte: monthStart } } }),
    db.prescription.count({ where: { doctorId, createdAt: { gte: monthStart } } }),
    Promise.all(
      Array.from({ length: 12 }, (_, i) => {
        const ms = new Date(now.getFullYear(), i, 1);
        const me = new Date(now.getFullYear(), i + 1, 1);
        return db.prescription.count({ where: { doctorId, createdAt: { gte: ms, lt: me } } });
      })
    ),
  ] as const);
};

export const getAdminStats = () =>
  Promise.all([
    db.doctor.count(),
    db.doctor.count({ where: { user: { isActive: true } } }),
    db.patient.count(),
    db.prescription.count(),
    db.payment.aggregate({ _sum: { amount: true } }),
    db.subscription.groupBy({ by: ['plan'], _count: true }),
  ] as const);

export const getSubscriptionByDoctor = (doctorId: string) =>
  db.subscription.findUnique({ where: { doctorId } });

export const getAuditLogs = () =>
  db.auditLog.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
