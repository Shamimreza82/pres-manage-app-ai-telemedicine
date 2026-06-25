export interface CreateAppointmentInput {
  patientId: string;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateAppointmentInput {
  patientId?: string;
  date?: string;
  time?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
}
