export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  patientLimit: number;
  prescriptionLimit: number;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
