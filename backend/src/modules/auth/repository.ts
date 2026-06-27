import { db } from '../../config/database';

export const findUserByEmail = (email: string) =>
  db.user.findUnique({
    where: { email },
    include: { doctor: true, mr: true, receptionist: { include: { doctor: true } } },
  });

export const findUserByEmailDash = (email: string) =>
  db.user.findUnique({ where: { email }, select: { id: true } });

export const findUserById = (id: string) =>
  db.user.findUnique({
    where: { id },
    include: { doctor: true, mr: true, receptionist: { include: { doctor: true } } },
  });

export const findUserByIdSelect = (id: string) =>
  db.user.findUnique({ where: { id }, select: { id: true, isActive: true } });

export const updateRefreshToken = (userId: string, refreshToken: string | null) =>
  db.user.update({ where: { id: userId }, data: { refreshToken } });

export const updatePassword = (userId: string, hashedPassword: string) =>
  db.user.update({ where: { id: userId }, data: { password: hashedPassword } });
