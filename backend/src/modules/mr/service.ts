import { hashPassword } from '../../utils/password';
import { notFound, badRequest } from '../../utils/errors';
import { getPaginationParams } from '../../utils/pagination';
import { db } from '../../config/database';
import { env } from '../../config/env';
import * as repo from './repository';
import { CreateMrInput, UpdateMrInput, AssignDoctorsInput, SubscribeDoctorInput } from './types';
import { Request } from 'express';
import { generatePrescriptionPDF } from '../prescription/pdf';
import type { Prisma } from '@prisma/client';

export const getMyProfile = async (userId: string) => {
  const mr = await repo.findMrByUserId(userId);
  if (!mr) throw notFound('MR profile not found');
  return mr;
};

export const getMrById = async (id: string) => {
  const mr = await repo.findMrById(id);
  if (!mr) throw notFound('MR not found');
  return mr;
};

export const getAllMrs = (query: Request['query']) => {
  const pagination = getPaginationParams(query);
  const filters = {
    status: query.status as string | undefined,
    verified: query.verified as string | undefined,
    role: query.role as string | undefined,
  };
  return repo.findAllMrs(pagination, filters);
};

export const createMr = async (input: CreateMrInput) => {
  const existing = await repo.findMrByEmail(input.email);
  if (existing) throw badRequest('Email already registered');

  const hashed = await hashPassword(input.password);

  const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const user = await tx.user.create({
      data: {
        email: input.email,
        password: hashed,
        role: 'MEDICAL_REPRESENTATIVE',
        isVerified: true,
        mr: {
          create: {
            fullName: input.fullName,
            phone: input.phone,
            company: input.company,
            department: input.department,
            designation: input.designation,
          },
        },
      },
      include: { mr: true },
    });
    return user;
  });

  return result;
};

export const updateMr = async (id: string, input: UpdateMrInput) => {
  const mr = await repo.findMrById(id);
  if (!mr) throw notFound('MR not found');
  return repo.updateMr(id, input);
};

export const updateMyProfile = async (userId: string, input: UpdateMrInput) => {
  const mr = await repo.findMrByUserId(userId);
  if (!mr) throw notFound('MR profile not found');
  return repo.updateMr(mr.id, input);
};

export const deleteMr = async (id: string) => {
  const mr = await repo.findMrById(id);
  if (!mr) throw notFound('MR not found');
  await db.user.delete({ where: { id: mr.userId } });
  return { message: 'MR deleted successfully' };
};

export const assignDoctors = async (mrId: string, input: AssignDoctorsInput) => {
  const mr = await repo.findMrById(mrId);
  if (!mr) throw notFound('MR not found');
  await repo.assignDoctors(mrId, input.doctorIds);
  return repo.findMrById(mrId);
};

export const getMyDoctors = async (userId: string, query: Request['query']) => {
  const mr = await repo.findMrByUserId(userId);
  if (!mr) throw notFound('MR profile not found');
  const pagination = getPaginationParams(query);
  return repo.getMyDoctorsPaginated(mr.id, pagination);
};

export const getDoctorPatients = async (mrUserId: string, doctorId: string) => {
  const mr = await repo.findMrByUserId(mrUserId);
  if (!mr) throw notFound('MR profile not found');
  const assigned = mr.doctors.some((d: { doctorId: string }) => d.doctorId === doctorId);
  if (!assigned) throw badRequest('Doctor is not assigned to you');
  return repo.getDoctorPatients(doctorId);
};

export const getDoctorPrescriptions = async (mrUserId: string, doctorId: string, query: Request['query']) => {
  const mr = await repo.findMrByUserId(mrUserId);
  if (!mr) throw notFound('MR profile not found');
  const assigned = mr.doctors.some((d: { doctorId: string }) => d.doctorId === doctorId);
  if (!assigned) throw badRequest('Doctor is not assigned to you');
  const pagination = getPaginationParams(query);
  return repo.getDoctorPrescriptions(doctorId, pagination);
};

export const getAvailableDoctors = () => repo.findDoctorsForAssignment();

export const getDashboardStats = async (userId: string) => {
  const mr = await repo.findMrByUserId(userId);
  if (!mr) throw notFound('MR profile not found');
  type MrDoctorAssignment = typeof mr.doctors[number];
  const doctorIds = mr.doctors.map((d: MrDoctorAssignment) => d.doctorId);
  const totalDoctors = doctorIds.length;
  const todaysPrescriptions = doctorIds.length > 0
    ? await repo.getTodaysPrescriptionsByDoctors(doctorIds)
    : 0;
  const totalPrescriptions = mr.doctors.reduce(
    (sum: number, d: MrDoctorAssignment) => sum + (d.doctor._count?.prescriptions || 0), 0
  );
  return { totalDoctors, todaysPrescriptions, totalPrescriptions };
};

export const getDoctorPrescriptionById = async (mrUserId: string, doctorId: string, prescriptionId: string) => {
  const mr = await repo.findMrByUserId(mrUserId);
  if (!mr) throw notFound('MR profile not found');
  const assigned = mr.doctors.some((d: { doctorId: string }) => d.doctorId === doctorId);
  if (!assigned) throw badRequest('Doctor is not assigned to you');
  const doctorIds = mr.doctors.map((d: { doctorId: string }) => d.doctorId);
  const rx = await repo.findPrescriptionForMr(prescriptionId, doctorIds);
  if (!rx) throw notFound('Prescription not found');
  return rx;
};

export const downloadDoctorPrescriptionPdf = async (mrUserId: string, doctorId: string, prescriptionId: string) => {
  const rx = await getDoctorPrescriptionById(mrUserId, doctorId, prescriptionId);
  const pdfData = { ...rx, createdAt: rx.createdAt.toISOString(), updatedAt: rx.updatedAt?.toISOString() };
  return generatePrescriptionPDF(pdfData);
};

export const getMrSubscriptions = async (userId: string) => {
  const mr = await repo.findMrByUserId(userId);
  if (!mr) throw notFound('MR profile not found');

  const plans = await db.plan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } });

  return mr.doctors.map((assignment: any) => ({
    doctor: assignment.doctor,
    subscription: null,
    plans,
  }));
};

export const getMrSubscriptionsPaginated = async (userId: string, query: Request['query']) => {
  const mr = await repo.findMrByUserId(userId);
  if (!mr) throw notFound('MR profile not found');

  const pagination = getPaginationParams(query);
  const [doctors, total] = await repo.getMrDoctorsPaginatedWithSubs(mr.id, pagination);

  const doctorIds = doctors.map((d: { id: string }) => d.id);

  const subscriptions = await db.subscription.findMany({
    where: { doctorId: { in: doctorIds } },
    include: {
      plan: true,
      payments: { where: { paidByMrId: mr.id }, orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  const plans = await db.plan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } });

  const data = doctors.map((doctor: any) => {
    const sub = subscriptions.find((s: any) => s.doctorId === doctor.id);
    return { doctor, subscription: sub || null, plans };
  });

  return {
    data, total, page: pagination.page, limit: pagination.limit,
    mr: { fullName: mr.fullName, phone: mr.phone, company: mr.company },
    platform: { name: env.platform.companyName, address: env.platform.address, phone: env.platform.phone },
  };
};

export const subscribeDoctor = async (mrUserId: string, doctorId: string, input: SubscribeDoctorInput) => {
  const mr = await repo.findMrByUserId(mrUserId);
  if (!mr) throw notFound('MR profile not found');

  const assigned = mr.doctors.some((d: { doctorId: string }) => d.doctorId === doctorId);
  if (!assigned) throw badRequest('Doctor is not assigned to you');

  const plan = await db.plan.findUnique({ where: { id: input.planId } });
  if (!plan) throw badRequest('Plan not found');
  if (!plan.isActive) throw badRequest('Plan is not available');

  const endDate = plan.duration ? new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000) : null;
  const isPaid = plan.price > 0;
  const status = isPaid ? 'PENDING' : 'ACTIVE';

  const sub = await db.subscription.upsert({
    where: { doctorId },
    update: {
      planId: plan.id,
      status,
      patientLimit: plan.patientLimit,
      prescriptionLimit: plan.prescriptionLimit,
      startDate: new Date(),
      endDate,
    },
    create: {
      doctorId,
      planId: plan.id,
      status,
      patientLimit: plan.patientLimit,
      prescriptionLimit: plan.prescriptionLimit,
      startDate: new Date(),
      endDate,
    },
    include: { plan: true },
  });

  if (isPaid && input.transactionId) {
    await db.payment.create({
      data: {
        subscriptionId: sub.id,
        amount: plan.price,
        currency: 'BDT',
        status: 'PENDING',
        paymentMethod: 'MANUAL',
        transactionId: input.transactionId,
        paidByMrId: mr.id,
        notes: input.notes,
      },
    });
  }

  return sub;
};
