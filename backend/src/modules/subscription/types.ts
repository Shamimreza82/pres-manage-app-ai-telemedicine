export interface SubscriptionStats {
  totalDoctors: number;
  activeDoctors: number;
  totalPatients: number;
  totalPrescriptions: number;
  totalRevenue: number;
  planDistribution: Array<{ plan: string; _count: number }>;
}
