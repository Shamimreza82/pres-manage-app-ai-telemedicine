export interface CreatePlanInput {
  name: string;
  description?: string;
  price: number;
  patientLimit: number;
  prescriptionLimit: number;
  duration: number;
}

export interface UpdatePlanInput {
  name?: string;
  description?: string;
  price?: number;
  patientLimit?: number;
  prescriptionLimit?: number;
  duration?: number;
  isActive?: boolean;
}
