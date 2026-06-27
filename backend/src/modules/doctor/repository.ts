import { db } from '../../config/database';
import { PaginationParams } from '../../utils/pagination';

const publicSelect = {
  id: true,
  fullName: true,
  degree: true,
  specialization: true,
  bmdcRegNo: true,
  clinicName: true,
  clinicAddress: true,
  phone: true,
  chamberSchedule: true,
};

export const searchDoctorsPublic = (
  filters: { search: string; degree: string; specialization: string },
  pagination: PaginationParams,
) => {
  const where: Record<string, unknown> = {
    user: { isActive: true },
  };
  const orConditions: Record<string, unknown>[] = [];
  if (filters.search) {
    orConditions.push(
      { fullName: { contains: filters.search, mode: 'insensitive' } },
      { clinicName: { contains: filters.search, mode: 'insensitive' } },
    );
  }
  if (filters.degree) {
    where.degree = { hasSome: [filters.degree] };
  }
  if (filters.specialization) {
    where.specialization = { hasSome: [filters.specialization] };
  }
  if (orConditions.length > 0) {
    where.OR = orConditions;
  }
  return Promise.all([
    db.doctor.findMany({
      where,
      select: publicSelect,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { fullName: 'asc' },
    }),
    db.doctor.count({ where }),
  ] as const);
};

export const findDoctorByIdPublic = (doctorId: string) =>
  db.doctor.findUnique({
    where: { id: doctorId },
    select: {
      ...publicSelect,
      clinicLogo: true,
      signatureImg: true,
      user: { select: { email: true } },
    },
  });

export const findDoctorById = (doctorId: string) =>
  db.doctor.findUnique({
    where: { id: doctorId },
    include: {
      user: { select: { email: true, role: true, isVerified: true } },
      _count: { select: { prescriptions: true } },
    },
  });

export const updateDoctor = (doctorId: string, data: Record<string, unknown>) =>
  db.doctor.update({ where: { id: doctorId }, data: { ...data, isProfileComplete: true } as any });

export const updateSignature = (doctorId: string, filename: string) =>
  db.doctor.update({ where: { id: doctorId }, data: { signatureImg: filename } });

export const updateLogo = (doctorId: string, filename: string) =>
  db.doctor.update({ where: { id: doctorId }, data: { clinicLogo: filename } });

export const removeSignature = (doctorId: string) =>
  db.doctor.update({ where: { id: doctorId }, data: { signatureImg: null } });

export const removeLogo = (doctorId: string) =>
  db.doctor.update({ where: { id: doctorId }, data: { clinicLogo: null } });

export const findAllDoctors = (pagination: PaginationParams) => {
  const where: Record<string, unknown> = {};
  if (pagination.search) {
    where.OR = [
      { fullName: { contains: pagination.search, mode: 'insensitive' } },
      { clinicName: { contains: pagination.search, mode: 'insensitive' } },
    ];
  }
  return Promise.all([
    db.doctor.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      include: {
        user: { select: { id: true, email: true, isActive: true, createdAt: true } },
        subscription: true,
        _count: { select: { patients: true, prescriptions: true, appointments: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.doctor.count({ where }),
  ] as const);
};

export const toggleUserStatus = (userId: string, isActive: boolean) =>
  db.user.update({ where: { id: userId }, data: { isActive } });
