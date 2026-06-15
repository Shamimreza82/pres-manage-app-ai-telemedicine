import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../types/express';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse';
import { createAuditLog } from '../../utils/auditLogger';
import * as patientService from './service';

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const patient = await patientService.createPatientForDoctor(req.user!.doctorId!, req.body);
    await createAuditLog({
      userId: req.user!.userId,
      action: 'CREATE',
      entity: 'Patient',
      entityId: patient.id,
      details: { patientName: patient.fullName },
    });
    sendSuccess(res, patient, 201);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [patients, total] = await patientService.getPatientsByDoctor(req.user!.doctorId!, req.query);
    const { page, limit } = req.query;
    sendPaginated(res, patients, total, Number(page) || 1, Number(limit) || 20);
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const patient = await patientService.getPatientById(req.params.id as string, req.user!.doctorId!);
    sendSuccess(res, patient);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const patient = await patientService.updatePatientForDoctor(req.params.id as string, req.user!.doctorId!, req.body);
    await createAuditLog({
      userId: req.user!.userId,
      action: 'UPDATE',
      entity: 'Patient',
      entityId: patient.id,
    });
    sendSuccess(res, patient);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await patientService.deletePatientForDoctor(req.params.id as string, req.user!.doctorId!);
    await createAuditLog({
      userId: req.user!.userId,
      action: 'DELETE',
      entity: 'Patient',
      entityId: req.params.id as string,
    });
    sendSuccess(res, { message: 'Patient deleted successfully' });
  } catch (error) {
    next(error);
  }
};
