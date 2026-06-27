import { AuthRequest } from '../../types/express';
import { sendSuccess } from '../../utils/apiResponse';
import { createAuditLog } from '../../utils/auditLogger';
import { catchAsync } from '../../utils/catchAsync';
import * as authService from './service';
import * as repo from './repository';

export const register = catchAsync(async (req: AuthRequest, res) => {
  const { email, password, fullName, role } = req.body;
  const result = await authService.registerUser({ email, password, fullName, role });
  sendSuccess(res, result, 201);
});

export const login = catchAsync(async (req: AuthRequest, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  await createAuditLog({
    userId: result.user.id,
    action: 'LOGIN',
    entity: 'User',
    entityId: result.user.id,
    ipAddress: req.ip,
  });
  sendSuccess(res, result);
}, async (req, _res, error) => {
  await createAuditLog({
    action: 'LOGIN_FAILED',
    entity: 'User',
    details: { email: req.body.email, error: (error as Error).message },
    ipAddress: req.ip,
  }).catch(() => {});
});

export const refreshToken = catchAsync(async (req: AuthRequest, res) => {
  const tokens = await authService.refreshUserToken(req.body.refreshToken);
  sendSuccess(res, tokens);
});

export const logout = catchAsync(async (req: AuthRequest, res) => {
  if (req.user) await authService.logoutUser(req.user.userId);
  sendSuccess(res, { message: 'Logged out successfully' });
});

export const changePassword = catchAsync(async (req: AuthRequest, res) => {
  await authService.changeUserPassword(req.user!.userId, req.body.currentPassword, req.body.newPassword);
  sendSuccess(res, { message: 'Password changed successfully' });
});

export const getMe = catchAsync(async (req: AuthRequest, res) => {
  const user = await repo.findUserById(req.user!.userId);
  const { password, refreshToken, ...safeUser } = user!;
  sendSuccess(res, safeUser);
});
