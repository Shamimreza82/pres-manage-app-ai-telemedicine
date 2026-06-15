import { badRequest, notFound } from '../../utils/errors';
import { getPaginationParams } from '../../utils/pagination';
import * as repo from './repository';
import { CreatePrescriptionInput, UpdatePrescriptionInput } from './types';
import { Request } from 'express';

export const createPrescriptionForDoctor = async (doctorId: string, input: CreatePrescriptionInput) => {
  const subscription = await repo.getSubscriptionByDoctor(doctorId);
  if (!subscription) throw badRequest('No subscription found');

  const count = await repo.countPrescriptionsByDoctor(doctorId);
  if (count >= subscription.prescriptionLimit) {
    throw badRequest('Prescription limit reached. Upgrade your subscription.');
  }

  const patient = await repo.getPatientByDoctor(input.patientId, doctorId);
  if (!patient) throw notFound('Patient not found');

  return repo.createPrescription({ ...input, doctorId });
};

export const getPrescriptionsByDoctor = async (doctorId: string, query: Request['query']) => {
  const pagination = getPaginationParams(query);
  return repo.findPrescriptionsByDoctor(doctorId, pagination);
};

export const getPrescriptionById = async (id: string, doctorId: string) => {
  const rx = await repo.findPrescriptionById(id, doctorId);
  if (!rx) throw notFound('Prescription not found');
  return rx;
};

export const updatePrescriptionForDoctor = async (id: string, doctorId: string, input: UpdatePrescriptionInput) => {
  const rx = await repo.findPrescriptionById(id, doctorId);
  if (!rx) throw notFound('Prescription not found');
  return repo.updatePrescription(id, { ...input, doctorId });
};

export const deletePrescriptionForDoctor = async (id: string, doctorId: string) => {
  const rx = await repo.findPrescriptionById(id, doctorId);
  if (!rx) throw notFound('Prescription not found');
  await repo.deletePrescription(id);
};
