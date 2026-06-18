import { z } from 'zod';

export const updateDoctorSchema = z.object({
  fullName: z.string().min(2).optional(),
  degree: z.array(z.string().min(1)).optional(),
  specialization: z.array(z.string().min(1)).optional(),
  bmdcRegNo: z.string().min(2).optional(),
  clinicName: z.string().min(2).optional(),
  clinicAddress: z.string().min(2).optional(),
  phone: z.string().min(5).optional(),
  chamberSchedule: z.any().optional(),
});
