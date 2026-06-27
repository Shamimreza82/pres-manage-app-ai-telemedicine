import { AuthRequest } from '../../types/express';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse';
import { catchAsync } from '../../utils/catchAsync';
import * as doctorService from './service';

const ALLOWED_FIELDS = [
  'fullName', 'degree', 'specialization', 'bmdcRegNo',
  'clinicName', 'clinicAddress', 'phone', 'chamberSchedule',
];

export const getProfile = catchAsync(async (req: AuthRequest, res) => {
  const doctor = await doctorService.getDoctorProfile(req.user!.doctorId!);
  sendSuccess(res, doctor);
});

export const updateProfile = catchAsync(async (req: AuthRequest, res) => {
  const data: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  }
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files.signature?.[0]) data.signatureImg = files.signature[0].filename;
    if (files.logo?.[0]) data.clinicLogo = files.logo[0].filename;
  }
  const doctor = await doctorService.updateDoctorProfile(req.user!.doctorId!, data);
  sendSuccess(res, doctor);
});

export const uploadSignature = catchAsync(async (req: AuthRequest, res) => {
  const result = await doctorService.uploadSignature(req.user!.doctorId!, req.file!.filename);
  sendSuccess(res, { signatureImg: result.signatureImg });
});

export const uploadLogo = catchAsync(async (req: AuthRequest, res) => {
  const result = await doctorService.uploadLogo(req.user!.doctorId!, req.file!.filename);
  sendSuccess(res, { clinicLogo: result.clinicLogo });
});

export const removeSignature = catchAsync(async (req: AuthRequest, res) => {
  const result = await doctorService.removeSignature(req.user!.doctorId!);
  sendSuccess(res, { signatureImg: result.signatureImg });
});

export const removeLogo = catchAsync(async (req: AuthRequest, res) => {
  const result = await doctorService.removeLogo(req.user!.doctorId!);
  sendSuccess(res, { clinicLogo: result.clinicLogo });
});

export const getAllDoctors = catchAsync(async (req: AuthRequest, res) => {
  const [doctors, total] = await doctorService.getAllDoctors(req.query);
  const { page, limit } = req.query;
  sendPaginated(res, doctors, total, Number(page) || 1, Number(limit) || 20);
});

export const getMySubscription = catchAsync(async (req: AuthRequest, res) => {
  const sub = await doctorService.getDoctorSubscription(req.user!.doctorId!);
  sendSuccess(res, sub);
});

export const activatePlan = catchAsync(async (req: AuthRequest, res) => {
  const sub = await doctorService.activateSubscription(req.user!.doctorId!, req.body.planId, req.body.transactionId, req.body.notes);
  sendSuccess(res, sub);
});

export const getPendingSubscriptions = catchAsync(async (req: AuthRequest, res) => {
  const [subs, total] = await doctorService.getPendingSubscriptions(req.query);
  const { page, limit } = req.query;
  sendPaginated(res, subs, total, Number(page) || 1, Number(limit) || 20);
});

export const cancelSubscription = catchAsync(async (req: AuthRequest, res) => {
  const sub = await doctorService.cancelSubscription(req.params.id as string as string);
  sendSuccess(res, sub);
});

export const rejectSubscription = catchAsync(async (req: AuthRequest, res) => {
  const sub = await doctorService.rejectSubscription(req.params.id as string as string);
  sendSuccess(res, sub);
});

export const confirmSubscription = catchAsync(async (req: AuthRequest, res) => {
  const sub = await doctorService.confirmSubscription(req.params.id as string as string);
  sendSuccess(res, sub);
});
