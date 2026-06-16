export interface AdminDashboardStats {
  totalDoctors: number;
  activeDoctors: number;
  pendingApprovals: number;
  totalPatients: number;
  totalPrescriptions: number;
  totalAppointments: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  annualRevenue: number;
  newDoctorsThisMonth: number;
  newPatientsThisMonth: number;
  prescriptionsThisMonth: number;
  planDistribution: Array<{ plan: string; _count: number }>;
  monthlyRevenueData: number[];
  monthlyDoctorsData: number[];
  monthlyPrescriptionsData: number[];
}

export interface DoctorWithDetails {
  id: string;
  userId: string;
  fullName: string;
  degree: string;
  specialization: string;
  bmdcRegNo: string | null;
  clinicName: string;
  clinicAddress: string;
  phone: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  subscriptionPlan: string;
  subscriptionStatus: string;
  patientCount: number;
  prescriptionCount: number;
  appointmentCount: number;
}
