import { z } from 'zod';

export const createMrSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(5, 'Phone number is required'),
});

export const updateMrSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(5).optional(),
});

export const assignDoctorsSchema = z.object({
  doctorIds: z.array(z.string().uuid()).min(1, 'At least one doctor must be selected'),
});
