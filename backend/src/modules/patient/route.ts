import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { createPatientSchema, updatePatientSchema } from './validation';
import * as patientController from './controller';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createPatientSchema), patientController.create);
router.get('/', patientController.findAll);
router.get('/:id', patientController.findById);
router.put('/:id', validateBody(updatePatientSchema), patientController.update);
router.delete('/:id', patientController.remove);

export default router;
