export interface User {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "DOCTOR" | "RECEPTIONIST" | "MEDICAL_REPRESENTATIVE";
  isActive: boolean;
  doctor?: Doctor;
  createdAt: string;
}

export interface Doctor {
  id: string;
  fullName: string;
  degree: string[];
  specialization: string[];
  bmdcRegNo: string;
  clinicName: string;
  clinicAddress: string;
  phone: string;
  signatureImg?: string;
  clinicLogo?: string;
  chamberSchedule?: any;
  isProfileComplete: boolean;
  email?: string;
}

export interface Patient {
  id: string;
  patientId: string;
  fullName: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: string;
  weight?: number;
  height?: number;
  phone?: string;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  previousDiseases?: string;
  emergencyContact?: string;
  createdAt: string;
  _count?: { prescriptions: number; appointments: number };
}

export interface Medicine {
  id?: string;
  name: string;
  strength?: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Investigation {
  id?: string;
  name: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  prescriptionNo: string;
  doctorId: string;
  patientId: string;
  symptoms?: string;
  chiefComplaint?: string;
  diagnosis?: string;
  diagnosisNotes?: string;
  bloodPressure?: string;
  pulseRate?: string;
  temperature?: string;
  oxygenSaturation?: string;
  medicines: Medicine[];
  investigations: Investigation[];
  advice?: string;
  foodAdvice?: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  notes?: string;
  patient?: { id: string; fullName: string; patientId: string; phone?: string };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DashboardStats {
  totalPatients: number;
  totalPrescriptions: number;
  todayAppointments: number;
  monthlyPrescriptions: number;
  monthlyData: number[];
}
