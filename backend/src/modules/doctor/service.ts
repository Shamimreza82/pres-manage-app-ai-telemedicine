import { notFound } from '../../utils/errors';
import { getPaginationParams } from '../../utils/pagination';
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

export const getAllDoctors = (query: Request['query']) => {
  const pagination = getPaginationParams(query);
  return repo.findAllDoctors(pagination);
};

export const toggleDoctorStatus = async (userId: string) => {
  const user = await repo.toggleUserStatus(userId, true);
  if (!user) throw notFound('User not found');
  return repo.toggleUserStatus(userId, !user.isActive);
};
