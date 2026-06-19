export interface Mr {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  company: string;
  department?: string;
  designation?: string;
  user?: { id: string; email: string; isActive: boolean; createdAt: string };
  doctors?: DoctorAssignment[];
  _count?: { doctors: number };
}

export interface DoctorAssignment {
  id: string;
  doctorId: string;
  doctor: {
    id: string;
    fullName: string;
    clinicName: string;
    degree?: string[];
    specialization?: string[];
    phone?: string;
    user?: { email: string; isActive: boolean };
    _count?: { patients: number; prescriptions: number };
  };
}

export interface CreateMrInput {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  company: string;
  department?: string;
  designation?: string;
}

export interface AssignDoctorsInput {
  doctorIds: string[];
}

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

export interface MrSubscription {
  doctor: {
    id: string;
    fullName: string;
    clinicName: string;
    degree?: string[];
    specialization?: string[];
    phone?: string;
    bmdcRegNo?: string;
    _count?: { patients: number; prescriptions: number };
  };
  subscription: {
    id: string;
    planId: string;
    status: string;
    patientLimit: number;
    prescriptionLimit: number;
    startDate: string;
    endDate: string | null;
    plan: Plan;
    payments?: Array<{ id: string; transactionId: string; status: string; amount: number; notes?: string }>;
  } | null;
  plans: Plan[];
}
