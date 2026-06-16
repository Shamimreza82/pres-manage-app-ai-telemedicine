import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { createPatientSchema, updatePatientSchema, createAppointmentSchema, updateAppointmentSchema, createReceptionistByDoctorSchema } from './validation';
import * as receptionistController from './controller';

const router = Router();

router.use(authenticate);

// SUPER_ADMIN endpoints
router.get('/', authorize('SUPER_ADMIN'), receptionistController.getAll);
router.post('/', authorize('SUPER_ADMIN'), receptionistController.createReceptionist);
router.delete('/:id', authorize('SUPER_ADMIN'), receptionistController.remove);

// DOCTOR endpoints (manage own receptionists)
router.get('/my', authorize('DOCTOR'), receptionistController.getMyReceptionists);
router.post('/my', authorize('DOCTOR'), validateBody(createReceptionistByDoctorSchema), receptionistController.createReceptionistByDoctor);
router.delete('/my/:id', authorize('DOCTOR'), receptionistController.deleteMyReceptionist);

// RECEPTIONIST endpoints
router.get('/dashboard', authorize('RECEPTIONIST'), receptionistController.getDashboardStats);

router.get('/patients', authorize('RECEPTIONIST'), receptionistController.getPatients);
router.post('/patients', authorize('RECEPTIONIST'), validateBody(createPatientSchema), receptionistController.createPatient);
router.get('/patients/:id', authorize('RECEPTIONIST'), receptionistController.getPatientById);
router.put('/patients/:id', authorize('RECEPTIONIST'), validateBody(updatePatientSchema), receptionistController.updatePatient);

router.get('/appointments', authorize('RECEPTIONIST'), receptionistController.getAppointments);
router.post('/appointments', authorize('RECEPTIONIST'), validateBody(createAppointmentSchema), receptionistController.createAppointment);
router.get('/appointments/today', authorize('RECEPTIONIST'), receptionistController.getTodayAppointments);
router.patch('/appointments/:id', authorize('RECEPTIONIST'), validateBody(updateAppointmentSchema), receptionistController.updateAppointment);

router.get('/prescriptions', authorize('RECEPTIONIST'), receptionistController.getPrescriptions);
router.get('/prescriptions/:id', authorize('RECEPTIONIST'), receptionistController.getPrescriptionById);
router.get('/prescriptions/:id/pdf', authorize('RECEPTIONIST'), receptionistController.downloadPrescriptionPdf);

export default router;
