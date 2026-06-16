import { getPaginationParams } from '../../utils/pagination';
import { Request } from 'express';
import * as repo from './repository';

export const getDoctorDashboardStats = async (doctorId: string) => {
  const [totalPatients, totalPrescriptions, monthlyAppointments, monthlyPrescriptions, monthlyData] =
    await repo.getDoctorStats(doctorId);
  return { totalPatients, totalPrescriptions, monthlyAppointments, monthlyPrescriptions, monthlyData };
};

export const getAdminDashboardStats = async () => {
  const [totalDoctors, activeDoctors, totalPatients, totalPrescriptions, revenue, planDist, statusDist] =
    await repo.getAdminStats();
  return {
    totalDoctors,
    activeDoctors,
    totalPatients,
    totalPrescriptions,
    totalRevenue: revenue._sum.amount || 0,
    planDistribution: planDist,
    subscriptionStatusDistribution: statusDist,
  };
};

export const getDoctorSubscription = (doctorId: string) =>
  repo.getSubscriptionByDoctor(doctorId);

export const getActivityLogs = (query: Request['query']) => {
  const pagination = getPaginationParams(query);
  return repo.getAuditLogs(pagination);
};

export const getAdminDoctors = (query: Request['query']) => {
  const pagination = getPaginationParams(query);
  return repo.getAllDoctorsForAdmin(pagination);
};

export const getAdminUsers = (query: Request['query']) => {
  const pagination = getPaginationParams(query);
  return repo.getAllUsers(pagination);
};

export const getAdminSubscriptions = (query: Request['query']) => {
  const pagination = getPaginationParams(query);
  return repo.getAllSubscriptions(pagination);
};

export const getAdminPatients = (query: Request['query']) => {
  const pagination = getPaginationParams(query);
  return repo.getAllPatientsForAdmin(pagination);
};
