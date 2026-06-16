import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { createPrescriptionSchema, updatePrescriptionSchema } from './validation';
import * as prescriptionController from './controller';

const router = Router();

router.use(authenticate, authorize('DOCTOR'));

router.post('/', validateBody(createPrescriptionSchema), prescriptionController.create);
router.get('/', prescriptionController.findAll);
router.get('/:id', prescriptionController.findById);
router.put('/:id', prescriptionController.update);
router.delete('/:id', prescriptionController.remove);
router.get('/:id/pdf', prescriptionController.downloadPdf);
router.get('/:id/print', prescriptionController.printPdf);

export default router;
