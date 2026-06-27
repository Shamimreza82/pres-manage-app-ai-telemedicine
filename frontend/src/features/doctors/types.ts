export interface PublicDoctor {
  id: string;
  fullName: string;
  degree: string[];
  specialization: string[];
  bmdcRegNo?: string;
  clinicName: string;
  clinicAddress: string;
  phone: string;
  chamberSchedule?: unknown;
  clinicLogo?: string;
  signatureImg?: string;
  email?: string;
}
