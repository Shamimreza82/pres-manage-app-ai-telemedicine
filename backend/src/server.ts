import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import * as Sentry from '@sentry/node';

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT_EXCEPTION', { err });
  Sentry.captureException(err, { tags: { process: 'uncaughtException' } });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED_REJECTION', { err: reason });
  Sentry.captureException(reason, { tags: { process: 'unhandledRejection' } });
});

app.listen(env.port, () => {
  logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
});
