import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';

import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Module routes
import authRoutes from './modules/auth/route';
import doctorRoutes from './modules/doctor/route';
import patientRoutes from './modules/patient/route';
import prescriptionRoutes from './modules/prescription/route';
import appointmentRoutes from './modules/appointment/route';
import notificationRoutes from './modules/notification/route';
import subscriptionRoutes from './modules/subscription/route';

const app = express();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', subscriptionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
