import { AuthRequest } from '../../types/express';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse';
import { createAuditLog } from '../../utils/auditLogger';
import { catchAsync } from '../../utils/catchAsync';
import * as prescriptionService from './service';
import { generatePrescriptionPDF } from './pdf';

export const create = catchAsync(async (req: AuthRequest, res) => {
  const rx = await prescriptionService.createPrescriptionForDoctor(req.user!.doctorId!, req.body);
  await createAuditLog({
    userId: req.user!.userId,
    action: 'CREATE',
    entity: 'Prescription',
    entityId: rx.id,
    details: { prescriptionNo: rx.prescriptionNo },
  });
  sendSuccess(res, rx, 201);
});

export const findAll = catchAsync(async (req: AuthRequest, res) => {
  const [prescriptions, total] = await prescriptionService.getPrescriptionsByDoctor(req.user!.doctorId!, req.query);
  const { page, limit } = req.query;
  sendPaginated(res, prescriptions, total, Number(page) || 1, Number(limit) || 20);
});

export const findById = catchAsync(async (req: AuthRequest, res) => {
  const rx = await prescriptionService.getPrescriptionById(req.params.id as string, req.user!.doctorId!);
  sendSuccess(res, rx);
});

export const update = catchAsync(async (req: AuthRequest, res) => {
  const rx = await prescriptionService.updatePrescriptionForDoctor(req.params.id as string, req.user!.doctorId!, req.body);
  await createAuditLog({ userId: req.user!.userId, action: 'UPDATE', entity: 'Prescription', entityId: rx.id });
  sendSuccess(res, rx);
});

export const remove = catchAsync(async (req: AuthRequest, res) => {
  await prescriptionService.deletePrescriptionForDoctor(req.params.id as string, req.user!.doctorId!);
  await createAuditLog({ userId: req.user!.userId, action: 'DELETE', entity: 'Prescription', entityId: req.params.id as string });
  sendSuccess(res, { message: 'Prescription deleted' });
});

const sendPdf = async (req: AuthRequest, disposition: string) => {
  const rx = await prescriptionService.getPrescriptionById(req.params.id as string, req.user!.doctorId!);
  const pdfData = { ...rx, createdAt: rx.createdAt.toISOString(), updatedAt: rx.updatedAt?.toISOString() };
  const pdf = await generatePrescriptionPDF(pdfData);
  const res = req.res!;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', disposition + `; filename=prescription-${rx.prescriptionNo}.pdf`);
  res.send(pdf);
};

export const downloadPdf = catchAsync(async (req: AuthRequest, res) => {
  await sendPdf(req, 'attachment');
});

export const printPdf = catchAsync(async (req: AuthRequest, res) => {
  await sendPdf(req, 'inline');
});
