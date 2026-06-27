import { AuthRequest } from '../../types/express';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse';
import { catchAsync } from '../../utils/catchAsync';
import * as mrService from './service';

export const getMyProfile = catchAsync(async (req: AuthRequest, res) => {
  const mr = await mrService.getMyProfile(req.user!.userId);
  sendSuccess(res, mr);
});

export const getMrById = catchAsync(async (req: AuthRequest, res) => {
  const mr = await mrService.getMrById(req.params.id as string);
  sendSuccess(res, mr);
});

export const getAllMrs = catchAsync(async (req: AuthRequest, res) => {
  const [mrs, total] = await mrService.getAllMrs(req.query);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  sendPaginated(res, mrs, total, page, limit);
});

export const createMr = catchAsync(async (req: AuthRequest, res) => {
  const result = await mrService.createMr(req.body);
  sendSuccess(res, result, 201);
});

export const updateMr = catchAsync(async (req: AuthRequest, res) => {
  const result = await mrService.updateMr(req.params.id as string, req.body);
  sendSuccess(res, result);
});

export const updateMyProfile = catchAsync(async (req: AuthRequest, res) => {
  const result = await mrService.updateMyProfile(req.user!.userId, req.body);
  sendSuccess(res, result);
});

export const deleteMr = catchAsync(async (req: AuthRequest, res) => {
  const result = await mrService.deleteMr(req.params.id as string);
  sendSuccess(res, result);
});

export const assignDoctors = catchAsync(async (req: AuthRequest, res) => {
  const result = await mrService.assignDoctors(req.params.id as string, req.body);
  sendSuccess(res, result);
});

export const getMyDoctors = catchAsync(async (req: AuthRequest, res) => {
  const [doctors, total] = await mrService.getMyDoctors(req.user!.userId, req.query);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  sendPaginated(res, doctors, total, page, limit);
});

export const getDoctorPatients = catchAsync(async (req: AuthRequest, res) => {
  const patients = await mrService.getDoctorPatients(req.user!.userId, req.params.doctorId as string);
  sendSuccess(res, patients);
});

export const getDoctorPrescriptions = catchAsync(async (req: AuthRequest, res) => {
  const [prescriptions, total] = await mrService.getDoctorPrescriptions(req.user!.userId, req.params.doctorId as string, req.query);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  sendPaginated(res, prescriptions, total, page, limit);
});

export const getAvailableDoctors = catchAsync(async (req: AuthRequest, res) => {
  const doctors = await mrService.getAvailableDoctors();
  sendSuccess(res, doctors);
});

export const getDashboardStats = catchAsync(async (req: AuthRequest, res) => {
  const stats = await mrService.getDashboardStats(req.user!.userId);
  sendSuccess(res, stats);
});

export const getDoctorPrescriptionById = catchAsync(async (req: AuthRequest, res) => {
  const rx = await mrService.getDoctorPrescriptionById(req.user!.userId, req.params.doctorId as string, req.params.id as string);
  sendSuccess(res, rx);
});

export const downloadDoctorPrescriptionPdf = catchAsync(async (req: AuthRequest, res) => {
  const pdf = await mrService.downloadDoctorPrescriptionPdf(req.user!.userId, req.params.doctorId as string, req.params.id as string);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=prescription.pdf`);
  res.send(pdf);
});

export const getMrSubscriptions = catchAsync(async (req: AuthRequest, res) => {
  const result = await mrService.getMrSubscriptionsPaginated(req.user!.userId, req.query);
  res.status(200).json({
    success: true,
    data: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: Math.ceil(result.total / result.limit),
    mr: result.mr,
    platform: result.platform,
  });
});

export const subscribeDoctor = catchAsync(async (req: AuthRequest, res) => {
  const result = await mrService.subscribeDoctor(req.user!.userId, req.params.doctorId as string, req.body);
  sendSuccess(res, result, 201);
});
