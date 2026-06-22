import { notFound, badRequest } from '../../utils/errors';
import { getPaginationParams } from '../../utils/pagination';
import { db } from '../../config/database';
import * as repo from './repository';
import { UpdateDoctorInput } from './types';
import { Request } from 'express';

export const getDoctorProfile = (doctorId: string) =>
  repo.findDoctorById(doctorId);

export const updateDoctorProfile = async (doctorId: string, input: UpdateDoctorInput) => {
  const doctor = await repo.findDoctorById(doctorId);
  if (!doctor) throw notFound('Doctor not found');
  return repo.updateDoctor(doctorId, input);
};

export const uploadSignature = async (doctorId: string, filename: string) => {
  const doctor = await repo.findDoctorById(doctorId);
  if (!doctor) throw notFound('Doctor not found');
  return repo.updateSignature(doctorId, filename);
};

export const uploadLogo = async (doctorId: string, filename: string) => {
  const doctor = await repo.findDoctorById(doctorId);
  if (!doctor) throw notFound('Doctor not found');
  return repo.updateLogo(doctorId, filename);
};

export const removeSignature = async (doctorId: string) => {
  const doctor = await repo.findDoctorById(doctorId);
  if (!doctor) throw notFound('Doctor not found');
  return repo.removeSignature(doctorId);
};

export const removeLogo = async (doctorId: string) => {
  const doctor = await repo.findDoctorById(doctorId);
  if (!doctor) throw notFound('Doctor not found');
  return repo.removeLogo(doctorId);
};

export const getAllDoctors = (query: Request['query']) => {
  const pagination = getPaginationParams(query);
  return repo.findAllDoctors(pagination);
};

export const getDoctorSubscription = (doctorId: string) =>
  db.subscription.findUnique({
    where: { doctorId },
    include: { plan: true },
  });

export const activateSubscription = async (doctorId: string, planId: string, transactionId?: string, notes?: string) => {
  const plan = await db.plan.findUnique({ where: { id: planId } });
  if (!plan) throw badRequest('Plan not found');
  if (!plan.isActive) throw badRequest('Plan is not available');

  const endDate = plan.duration ? new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000) : null;
  const isPaid = plan.price > 0;
  const status = isPaid ? 'PENDING' : 'ACTIVE';

  const sub = await db.subscription.upsert({
    where: { doctorId },
    update: {
      planId,
      status,
      patientLimit: plan.patientLimit,
      prescriptionLimit: plan.prescriptionLimit,
      startDate: new Date(),
      endDate,
    },
    create: {
      doctorId,
      planId,
      status,
      patientLimit: plan.patientLimit,
      prescriptionLimit: plan.prescriptionLimit,
      startDate: new Date(),
      endDate,
    },
    include: { plan: true },
  });

  if (isPaid && transactionId) {
    await db.payment.create({
      data: {
        subscriptionId: sub.id,
        amount: plan.price,
        currency: 'BDT',
        status: 'PENDING',
        paymentMethod: 'MANUAL',
        transactionId,
        notes,
      },
    });
  }

  return sub;
};

export const getPendingSubscriptions = (query: Request['query']) => {
  const pagination = getPaginationParams(query);
  const where: any = { status: 'PENDING' };
  if (pagination.search) {
    where.OR = [
      { doctor: { fullName: { contains: pagination.search, mode: 'insensitive' } } },
      { doctor: { clinicName: { contains: pagination.search, mode: 'insensitive' } } },
      { doctor: { bmdcRegNo: { contains: pagination.search, mode: 'insensitive' } } },
      { payments: { some: { transactionId: { contains: pagination.search, mode: 'insensitive' } } } },
    ];
  }
  return Promise.all([
    db.subscription.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      include: {
        doctor: { select: { id: true, fullName: true, clinicName: true, phone: true } },
        plan: true,
        payments: { where: { status: 'PENDING' }, select: { id: true, transactionId: true, amount: true, currency: true, notes: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.subscription.count({ where }),
  ] as const);
};

export const rejectSubscription = async (subscriptionId: string) => {
  const sub = await db.subscription.findUnique({ where: { id: subscriptionId } });
  if (!sub) throw notFound('Subscription not found');
  if (sub.status !== 'PENDING') throw badRequest('Subscription is not pending');

  await db.payment.updateMany({
    where: { subscriptionId, status: 'PENDING' },
    data: { status: 'REJECTED' },
  });

  return db.subscription.update({
    where: { id: subscriptionId },
    data: { status: 'CANCELLED' },
    include: { plan: true, doctor: { select: { id: true, fullName: true, clinicName: true } } },
  });
};

export const cancelSubscription = async (subscriptionId: string) => {
  const sub = await db.subscription.findUnique({ where: { id: subscriptionId } });
  if (!sub) throw notFound('Subscription not found');
  if (sub.status === 'CANCELLED') throw badRequest('Subscription is already cancelled');

  return db.subscription.update({
    where: { id: subscriptionId },
    data: { status: 'CANCELLED' },
    include: { plan: true, doctor: { select: { id: true, fullName: true, clinicName: true } } },
  });
};

export const confirmSubscription = async (subscriptionId: string) => {
  const sub = await db.subscription.findUnique({ where: { id: subscriptionId }, include: { payments: true } });
  if (!sub) throw notFound('Subscription not found');
  if (sub.status !== 'PENDING') throw badRequest('Subscription is not pending');

  await db.payment.updateMany({
    where: { subscriptionId, status: 'PENDING' },
    data: { status: 'COMPLETED' },
  });

  return db.subscription.update({
    where: { id: subscriptionId },
    data: { status: 'ACTIVE' },
    include: { plan: true, doctor: { select: { id: true, fullName: true, clinicName: true } } },
  });
};

