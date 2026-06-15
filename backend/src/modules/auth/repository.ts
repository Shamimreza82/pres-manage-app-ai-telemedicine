import { db } from '../../config/database';

export const findUserByEmail = (email: string) =>
  db.user.findUnique({ where: { email }, include: { doctor: true } });

export const findUserById = (id: string) =>
  db.user.findUnique({ where: { id }, include: { doctor: true } });

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
              degree: '',
              specialization: '',
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

export const createFreeSubscription = (doctorId: string) =>
  db.subscription.create({
    data: {
      doctorId,
      plan: 'FREE',
      status: 'ACTIVE',
      patientLimit: 50,
      prescriptionLimit: 100,
    },
  });
