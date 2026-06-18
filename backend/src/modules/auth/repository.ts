import { db } from '../../config/database';

export const findUserByEmail = (email: string) =>
  db.user.findUnique({ where: { email }, include: { doctor: true, mr: true, receptionist: { include: { doctor: true } } } });

export const findUserById = (id: string) =>
  db.user.findUnique({ where: { id }, include: { doctor: true, mr: true, receptionist: { include: { doctor: true } } } });

export const createUser = (data: {
  email: string;
  password: string;
  role: string;
  fullName: string;
}) =>
  db.user.create({
    data: {
      email: data.email,
      password: data.password,
      role: data.role as any,
      doctor: data.role === 'DOCTOR'
        ? {
            create: {
              fullName: data.fullName,
              degree: [],
              specialization: [],
              clinicName: '',
              clinicAddress: '',
              phone: '',
            },
          }
        : undefined,
    },
    include: { doctor: true },
  });

export const updateRefreshToken = (userId: string, refreshToken: string | null) =>
  db.user.update({ where: { id: userId }, data: { refreshToken } });

export const updatePassword = (userId: string, hashedPassword: string) =>
  db.user.update({ where: { id: userId }, data: { password: hashedPassword } });

export const createFreeSubscription = async (doctorId: string) => {
  const freePlan = await db.plan.findFirst({ where: { price: 0, isActive: true }, select: { id: true, patientLimit: true, prescriptionLimit: true } });
  if (!freePlan) throw new Error('No free plan found');
  return db.subscription.create({
    data: {
      doctorId,
      planId: freePlan.id,
      status: 'ACTIVE',
      patientLimit: freePlan.patientLimit,
      prescriptionLimit: freePlan.prescriptionLimit,
    },
  });
};
