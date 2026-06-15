export interface DoctorDashboardData {
  totalPatients: number;
  totalPrescriptions: number;
  monthlyAppointments: number;
  monthlyPrescriptions: number;
  monthlyData: number[];
}

export interface AdminDashboardData {
  totalDoctors: number;
  activeDoctors: number;
  totalPatients: number;
  totalPrescriptions: number;
  totalRevenue: number;
  planDistribution: Array<{ plan: string; _count: number }>;
}
