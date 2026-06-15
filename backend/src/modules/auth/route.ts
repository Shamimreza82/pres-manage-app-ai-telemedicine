import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema } from './validation';
import * as authController from './controller';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh-token', validateBody(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, validateBody(changePasswordSchema), authController.changePassword);
router.get('/me', authenticate, authController.getMe);

export default router;
