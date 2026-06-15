import { badRequest, notFound } from '../../utils/errors';
import { getPaginationParams } from '../../utils/pagination';
import * as repo from './repository';
import { CreatePatientInput, UpdatePatientInput, PatientQuery } from './types';
import { Request } from 'express';

export const createPatientForDoctor = async (doctorId: string, input: CreatePatientInput) => {
  const subscription = await repo.getSubscriptionByDoctor(doctorId);
  if (!subscription) throw badRequest('No subscription found');

  const count = await repo.countPatientsByDoctor(doctorId);
  if (count >= subscription.patientLimit) {
    throw badRequest('Patient limit reached. Upgrade your subscription.');
  }

  return repo.createPatient({ ...input, doctorId });
};

export const getPatientsByDoctor = async (doctorId: string, query: Request['query']) => {
  const pagination = getPaginationParams(query);
  return repo.findPatientsByDoctor(doctorId, pagination);
};

export const getPatientById = async (id: string, doctorId: string) => {
  const patient = await repo.findPatientById(id, doctorId);
  if (!patient) throw notFound('Patient not found');
  return patient;
};

export const updatePatientForDoctor = async (id: string, doctorId: string, input: UpdatePatientInput) => {
  const patient = await repo.findPatientById(id, doctorId);
  if (!patient) throw notFound('Patient not found');
  return repo.updatePatient(id, doctorId, input);
};

export const deletePatientForDoctor = async (id: string, doctorId: string) => {
  const patient = await repo.findPatientById(id, doctorId);
  if (!patient) throw notFound('Patient not found');
  await repo.deletePatient(id);
};
