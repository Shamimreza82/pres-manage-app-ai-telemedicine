import { AuthRequest } from '../../types/express';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse';
import { createAuditLog } from '../../utils/auditLogger';
import { catchAsync } from '../../utils/catchAsync';
import * as patientService from './service';

export const create = catchAsync(async (req: AuthRequest, res) => {
  const patient = await patientService.createPatientForDoctor(req.user!.doctorId!, req.body);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'CREATE',
    entity: 'Patient',
    entityId: patient.id,
    details: { patientName: patient.fullName },
  });
  sendSuccess(res, patient, 201);
});

export const findAll = catchAsync(async (req: AuthRequest, res) => {
  const [patients, total] = await patientService.getPatientsByDoctor(req.user!.doctorId!, req.query);
  const { page, limit } = req.query;
  sendPaginated(res, patients, total, Number(page) || 1, Number(limit) || 20);
});

export const findById = catchAsync(async (req: AuthRequest, res) => {
  const patient = await patientService.getPatientById(req.params.id as string, req.user!.doctorId!);
  sendSuccess(res, patient);
});

export const update = catchAsync(async (req: AuthRequest, res) => {
  const patient = await patientService.updatePatientForDoctor(req.params.id as string, req.user!.doctorId!, req.body);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'UPDATE',
    entity: 'Patient',
    entityId: patient.id,
  });
  sendSuccess(res, patient);
});

export const remove = catchAsync(async (req: AuthRequest, res) => {
  await patientService.deletePatientForDoctor(req.params.id as string, req.user!.doctorId!);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'DELETE',
    entity: 'Patient',
    entityId: req.params.id as string,
  });
  sendSuccess(res, { message: 'Patient deleted successfully' });
});
