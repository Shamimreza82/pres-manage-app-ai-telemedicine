import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../types/express';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse';
import * as appointmentService from './service';

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apt = await appointmentService.createAppointmentForDoctor(req.user!.doctorId!, req.body);
    sendSuccess(res, apt, 201);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [appointments, total] = await appointmentService.getAppointmentsByDoctor(req.user!.doctorId!, req.query);
    const { page, limit } = req.query;
    sendPaginated(res, appointments, total, Number(page) || 1, Number(limit) || 20);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apt = await appointmentService.updateAppointmentForDoctor(req.params.id as string, req.user!.doctorId!, req.body);
    sendSuccess(res, apt);
  } catch (error) {
    next(error);
  }
};

export const getToday = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const appointments = await appointmentService.getTodayAppointments(req.user!.doctorId!);
    sendSuccess(res, appointments);
  } catch (error) {
    next(error);
  }
};
