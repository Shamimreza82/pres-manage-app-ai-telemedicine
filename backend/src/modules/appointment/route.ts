import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { createAppointmentSchema, updateAppointmentSchema } from './validation';
import * as appointmentController from './controller';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createAppointmentSchema), appointmentController.create);
router.get('/', appointmentController.findAll);
router.get('/today', appointmentController.getToday);
router.patch('/:id', validateBody(updateAppointmentSchema), appointmentController.update);

export default router;
