import { AuthRequest } from '../../types/express';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse';
import { createAuditLog } from '../../utils/auditLogger';
import { catchAsync } from '../../utils/catchAsync';
import * as receptionistService from './service';

export const getDashboardStats = catchAsync(async (req: AuthRequest, res) => {
  const stats = await receptionistService.getDashboardStats(req.user!.userId);
  sendSuccess(res, stats);
});

export const getPatients = catchAsync(async (req: AuthRequest, res) => {
  const [patients, total] = await receptionistService.getPatientsByDoctor(req.user!.userId, req.query);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  sendPaginated(res, patients, total, page, limit);
});

export const getPatientById = catchAsync(async (req: AuthRequest, res) => {
  const patient = await receptionistService.getPatientById(req.user!.userId, req.params.id as string);
  sendSuccess(res, patient);
});

export const createPatient = catchAsync(async (req: AuthRequest, res) => {
  const patient = await receptionistService.createPatientForDoctor(req.user!.userId, req.body);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'CREATE',
    entity: 'Patient',
    entityId: patient.id,
    details: { patientName: patient.fullName },
  });
  sendSuccess(res, patient, 201);
});

export const updatePatient = catchAsync(async (req: AuthRequest, res) => {
  const patient = await receptionistService.updatePatientForDoctor(req.user!.userId, req.params.id as string, req.body);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'UPDATE',
    entity: 'Patient',
    entityId: patient.id,
  });
  sendSuccess(res, patient);
});

export const getAppointments = catchAsync(async (req: AuthRequest, res) => {
  const [appointments, total] = await receptionistService.getAppointmentsByDoctor(req.user!.userId, req.query);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  sendPaginated(res, appointments, total, page, limit);
});

export const getAppointmentById = catchAsync(async (req: AuthRequest, res) => {
  const apt = await receptionistService.getAppointmentById(req.user!.userId, req.params.id as string);
  sendSuccess(res, apt);
});

export const getTodayAppointments = catchAsync(async (req: AuthRequest, res) => {
  const appointments = await receptionistService.getTodayAppointments(req.user!.userId);
  sendSuccess(res, appointments);
});

export const createAppointment = catchAsync(async (req: AuthRequest, res) => {
  const apt = await receptionistService.createAppointmentForDoctor(req.user!.userId, req.body);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'CREATE',
    entity: 'Appointment',
    entityId: apt.id,
    details: { patientId: apt.patientId, date: apt.date },
  });
  sendSuccess(res, apt, 201);
});

export const updateAppointment = catchAsync(async (req: AuthRequest, res) => {
  const apt = await receptionistService.updateAppointmentForDoctor(req.user!.userId, req.params.id as string, req.body);
  await createAuditLog({ userId: req.user!.userId, action: 'UPDATE', entity: 'Appointment', entityId: apt.id });
  sendSuccess(res, apt);
});

export const getPrescriptions = catchAsync(async (req: AuthRequest, res) => {
  const [prescriptions, total] = await receptionistService.getPrescriptionsByDoctor(req.user!.userId, req.query);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  sendPaginated(res, prescriptions, total, page, limit);
});

export const getPrescriptionById = catchAsync(async (req: AuthRequest, res) => {
  const rx = await receptionistService.getPrescriptionById(req.user!.userId, req.params.id as string);
  sendSuccess(res, rx);
});

export const downloadPrescriptionPdf = catchAsync(async (req: AuthRequest, res) => {
  const pdf = await receptionistService.downloadPrescriptionPdf(req.user!.userId, req.params.id as string);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=prescription.pdf`);
  res.send(pdf);
});

export const getAll = catchAsync(async (req: AuthRequest, res) => {
  const [receptionists, total] = await receptionistService.getAllReceptionists(req.query);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  sendPaginated(res, receptionists, total, page, limit);
});

export const createReceptionist = catchAsync(async (req: AuthRequest, res) => {
  const result = await receptionistService.createReceptionist(req.body);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'CREATE',
    entity: 'Receptionist',
    entityId: result.id,
    details: { email: result.email },
  });
  sendSuccess(res, result, 201);
});

export const remove = catchAsync(async (req: AuthRequest, res) => {
  const result = await receptionistService.deleteReceptionist(req.params.id as string);
  await createAuditLog({ userId: req.user!.userId, action: 'DELETE', entity: 'Receptionist', entityId: req.params.id as string });
  sendSuccess(res, result);
});

export const getMyReceptionists = catchAsync(async (req: AuthRequest, res) => {
  const [receptionists, total] = await receptionistService.getMyReceptionists(req.user!.userId, req.query);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  sendPaginated(res, receptionists, total, page, limit);
});

export const createReceptionistByDoctor = catchAsync(async (req: AuthRequest, res) => {
  const result = await receptionistService.createReceptionistByDoctor(req.user!.userId, req.body);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'CREATE',
    entity: 'Receptionist',
    entityId: result.id,
    details: { email: result.email },
  });
  sendSuccess(res, result, 201);
});

export const deleteMyReceptionist = catchAsync(async (req: AuthRequest, res) => {
  const result = await receptionistService.deleteMyReceptionist(req.user!.userId, req.params.id as string);
  await createAuditLog({ userId: req.user!.userId, action: 'DELETE', entity: 'Receptionist', entityId: req.params.id as string });
  sendSuccess(res, result);
});

export const toggleMyReceptionistStatus = catchAsync(async (req: AuthRequest, res) => {
  const result = await receptionistService.toggleMyReceptionistStatus(req.user!.userId, req.params.id as string);
  await createAuditLog({ userId: req.user!.userId, action: 'UPDATE', entity: 'Receptionist', entityId: req.params.id as string, details: { isActive: result.isActive } });
  sendSuccess(res, result);
});

export const updateMyReceptionist = catchAsync(async (req: AuthRequest, res) => {
  const result = await receptionistService.updateMyReceptionist(req.user!.userId, req.params.id as string, req.body);
  await createAuditLog({ userId: req.user!.userId, action: 'UPDATE', entity: 'Receptionist', entityId: req.params.id as string });
  sendSuccess(res, result);
});

export const resetReceptionistPassword = catchAsync(async (req: AuthRequest, res) => {
  const { newPassword } = req.body;
  const result = await receptionistService.resetReceptionistPassword(req.user!.userId, req.params.id as string, newPassword);
  await createAuditLog({ userId: req.user!.userId, action: 'UPDATE', entity: 'Receptionist', entityId: req.params.id as string, details: { action: 'reset_password' } });
  sendSuccess(res, result);
});
