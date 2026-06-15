import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import * as subscriptionController from './controller';

const router = Router();

router.use(authenticate);

router.get('/doctor', authorize('DOCTOR'), subscriptionController.getDoctorDashboard);
router.get('/admin', authorize('SUPER_ADMIN'), subscriptionController.getAdminDashboard);
router.get('/my', subscriptionController.getMySubscription);
router.get('/logs', authorize('SUPER_ADMIN'), subscriptionController.getLogs);

export default router;
