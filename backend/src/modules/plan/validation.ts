import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0, 'Price must be >= 0'),
  patientLimit: z.number().int().min(0, 'Patient limit must be >= 0'),
  prescriptionLimit: z.number().int().min(0, 'Prescription limit must be >= 0'),
  duration: z.number().int().min(1, 'Duration must be >= 1 day'),
});

export const updatePlanSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  price: z.number().min(0).optional(),
  patientLimit: z.number().int().min(0).optional(),
  prescriptionLimit: z.number().int().min(0).optional(),
  duration: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
});
