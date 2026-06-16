import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import * as controller from './controller';
import { createPlanSchema, updatePlanSchema } from './validation';

const router = Router();
router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorize('SUPER_ADMIN'), validateBody(createPlanSchema), controller.create);
router.put('/:id', authorize('SUPER_ADMIN'), validateBody(updatePlanSchema), controller.update);
router.delete('/:id', authorize('SUPER_ADMIN'), controller.remove);

export default router;
