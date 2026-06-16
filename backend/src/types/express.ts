import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  doctorId?: string;
  mrId?: string;
}

export type AuthRequest = Request & { user?: AuthPayload };
