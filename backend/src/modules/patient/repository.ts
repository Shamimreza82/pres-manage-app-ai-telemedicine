import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/database';
import { CreatePatientInput, UpdatePatientInput } from './types';
import { PaginationParams } from '../../utils/pagination';

const generatePatientId = () => `PAT-${uuidv4().substring(0, 6).toUpperCase()}`;

export const countPatientsByDoctor = (doctorId: string) =>
  db.patient.count({ where: { doctorId } });

export const findPatientsByDoctor = (doctorId: string, pagination: PaginationParams) => {
  const where: any = { doctorId };
  if (pagination.search) {
    where.OR = [
      { fullName: { contains: pagination.search, mode: 'insensitive' } },
      { patientId: { contains: pagination.search, mode: 'insensitive' } },
      { phone: { contains: pagination.search } },
    ];
  }

  return Promise.all([
    db.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.limit,
      include: { _count: { select: { prescriptions: true, appointments: true } } },
    }),
    db.patient.count({ where }),
  ] as const);
};

export const findPatientById = (id: string, doctorId: string) =>
  db.patient.findFirst({
    where: { id, doctorId },
    include: {
      prescriptions: {
        orderBy: { createdAt: 'desc' },
        include: { medicines: true, investigations: true },
      },
      appointments: { orderBy: { date: 'desc' } },
    },
  });

export const createPatient = (data: CreatePatientInput & { doctorId: string }) =>
  db.patient.create({
    data: {
      ...data,
      patientId: generatePatientId(),
      doctorId: data.doctorId,
    } as any,
  });

export const updatePatient = (id: string, data: UpdatePatientInput & { doctorId?: string }) =>
  db.patient.update({ where: { id }, data: data as any });

export const deletePatient = (id: string) =>
  db.patient.delete({ where: { id } });

export const getSubscriptionByDoctor = (doctorId: string) =>
  db.subscription.findUnique({ where: { doctorId } });
