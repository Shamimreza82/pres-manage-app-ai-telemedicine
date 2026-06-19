export interface CreateMrInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  company: string;
  department?: string;
  designation?: string;
}

export interface UpdateMrInput {
  fullName?: string;
  phone?: string;
  company?: string;
  department?: string;
  designation?: string;
}

export interface AssignDoctorsInput {
  doctorIds: string[];
}

export interface SubscribeDoctorInput {
  planId: string;
  transactionId?: string;
  notes?: string;
}
