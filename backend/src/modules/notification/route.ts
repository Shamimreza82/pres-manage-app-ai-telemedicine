import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import * as notificationController from './controller';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getAll);
router.get('/unread', notificationController.getUnread);
router.patch('/:id/read', notificationController.markRead);

export default router;
