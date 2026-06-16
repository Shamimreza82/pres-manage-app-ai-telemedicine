import { z } from 'zod';

export const createReceptionistSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(5, 'Invalid phone number'),
  doctorId: z.string().uuid(),
});

export const createReceptionistByDoctorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(5, 'Invalid phone number'),
});

export const createPatientSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().int().positive('Age must be a positive number'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']).optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  phone: z.string().min(5, 'Invalid phone number').optional(),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  previousDiseases: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  date: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:mm)'),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  notes: z.string().optional(),
});
