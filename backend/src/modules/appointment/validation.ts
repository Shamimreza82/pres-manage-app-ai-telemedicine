import { z } from 'zod';

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  date: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:mm)'),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID').optional(),
  date: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date').optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:mm)').optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  notes: z.string().optional(),
});
