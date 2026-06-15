import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import { validateBody } from '../../middlewares/validate';
import { updateDoctorSchema } from './validation';
import * as doctorController from './controller';

const router = Router();

router.use(authenticate);

router.get('/profile', doctorController.getProfile);
router.put('/profile', upload.fields([
  { name: 'signature', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
]), doctorController.updateProfile);
router.post('/upload-signature', upload.single('signature'), doctorController.uploadSignature);
router.post('/upload-logo', upload.single('logo'), doctorController.uploadLogo);

export default router;
