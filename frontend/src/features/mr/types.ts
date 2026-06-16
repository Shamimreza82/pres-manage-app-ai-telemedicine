export interface Mr {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
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
    degree?: string;
    specialization?: string;
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
}

export interface AssignDoctorsInput {
  doctorIds: string[];
}
