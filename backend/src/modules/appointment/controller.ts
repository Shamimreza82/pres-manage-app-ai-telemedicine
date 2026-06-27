import { AuthRequest } from '../../types/express';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse';
import { createAuditLog } from '../../utils/auditLogger';
import { catchAsync } from '../../utils/catchAsync';
import * as appointmentService from './service';

export const create = catchAsync(async (req: AuthRequest, res) => {
  const apt = await appointmentService.createAppointmentForDoctor(req.user!.doctorId!, req.body);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'CREATE',
    entity: 'Appointment',
    entityId: apt.id,
    details: { patientId: apt.patientId, date: apt.date },
  });
  sendSuccess(res, apt, 201);
});

export const findAll = catchAsync(async (req: AuthRequest, res) => {
  const [appointments, total] = await appointmentService.getAppointmentsByDoctor(req.user!.doctorId!, req.query);
  const { page, limit } = req.query;
  sendPaginated(res, appointments, total, Number(page) || 1, Number(limit) || 20);
});

export const update = catchAsync(async (req: AuthRequest, res) => {
  const apt = await appointmentService.updateAppointmentForDoctor(req.params.id as string, req.user!.doctorId!, req.body);
  await createAuditLog({ userId: req.user!.userId, action: 'UPDATE', entity: 'Appointment', entityId: apt.id });
  sendSuccess(res, apt);
});

export const getToday = catchAsync(async (req: AuthRequest, res) => {
  const appointments = await appointmentService.getTodayAppointments(req.user!.doctorId!);
  sendSuccess(res, appointments);
});
