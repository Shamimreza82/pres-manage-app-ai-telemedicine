import { z } from 'zod';

export const patientSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().int().positive('Age must be a positive number'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']).optional(),
  weight: z.coerce.number().positive().optional(),
  height: z.coerce.number().positive().optional(),
  phone: z.string().length(11, 'Phone must be exactly 11 characters').optional().or(z.literal('')),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  previousDiseases: z.string().optional(),
  emergencyContact: z.string().optional(),
});
