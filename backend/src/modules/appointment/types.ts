export interface CreateAppointmentInput {
  patientId: string;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateAppointmentInput {
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
}
