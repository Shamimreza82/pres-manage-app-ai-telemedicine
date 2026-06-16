export interface CreateMrInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface UpdateMrInput {
  fullName?: string;
  phone?: string;
}

export interface AssignDoctorsInput {
  doctorIds: string[];
}
