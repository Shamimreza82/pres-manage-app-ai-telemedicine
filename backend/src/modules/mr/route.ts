import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { createMrSchema, updateMrSchema, assignDoctorsSchema } from './validation';
import * as mrController from './controller';

const router = Router();

router.use(authenticate);

router.get('/dashboard', authorize('MEDICAL_REPRESENTATIVE'), mrController.getDashboardStats);
router.get('/doctors', authorize('MEDICAL_REPRESENTATIVE'), mrController.getMyDoctors);
router.get('/doctors/:doctorId/patients', authorize('MEDICAL_REPRESENTATIVE'), mrController.getDoctorPatients);
router.get('/doctors/:doctorId/prescriptions', authorize('MEDICAL_REPRESENTATIVE'), mrController.getDoctorPrescriptions);
router.get('/doctors/:doctorId/prescriptions/:id', authorize('MEDICAL_REPRESENTATIVE'), mrController.getDoctorPrescriptionById);
router.get('/doctors/:doctorId/prescriptions/:id/pdf', authorize('MEDICAL_REPRESENTATIVE'), mrController.downloadDoctorPrescriptionPdf);
router.get('/my-profile', mrController.getMyProfile);

router.get('/available-doctors', authorize('SUPER_ADMIN'), mrController.getAvailableDoctors);
router.get('/', authorize('SUPER_ADMIN'), mrController.getAllMrs);
router.get('/:id', authorize('SUPER_ADMIN'), mrController.getMrById);
router.post('/', authorize('SUPER_ADMIN'), validateBody(createMrSchema), mrController.createMr);
router.put('/:id', authorize('SUPER_ADMIN'), validateBody(updateMrSchema), mrController.updateMr);
router.delete('/:id', authorize('SUPER_ADMIN'), mrController.deleteMr);
router.post('/:id/assign', authorize('SUPER_ADMIN'), validateBody(assignDoctorsSchema), mrController.assignDoctors);

export default router;
