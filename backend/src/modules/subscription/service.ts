import * as repo from './repository';

export const getDoctorDashboardStats = async (doctorId: string) => {
  const [totalPatients, totalPrescriptions, monthlyAppointments, monthlyPrescriptions, monthlyData] =
    await repo.getDoctorStats(doctorId);
  return { totalPatients, totalPrescriptions, monthlyAppointments, monthlyPrescriptions, monthlyData };
};

export const getAdminDashboardStats = async () => {
  const [totalDoctors, activeDoctors, totalPatients, totalPrescriptions, revenue, planDist] =
    await repo.getAdminStats();
  return {
    totalDoctors,
    activeDoctors,
    totalPatients,
    totalPrescriptions,
    totalRevenue: revenue._sum.amount || 0,
    planDistribution: planDist,
  };
};

export const getDoctorSubscription = (doctorId: string) =>
  repo.getSubscriptionByDoctor(doctorId);

export const getActivityLogs = () => repo.getAuditLogs();
