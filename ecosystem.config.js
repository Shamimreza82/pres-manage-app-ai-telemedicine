module.exports = {
  apps: [
    {
      name: 'pres-backend',
      script: 'dist/server.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_size: '10M',
      retain: 7,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'pres-frontend',
      script: 'npm',
      args: 'start -- -p 3030',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      error_file: './logs/pm2-frontend-error.log',
      out_file: './logs/pm2-frontend-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_size: '10M',
      retain: 7,
      env: {
        NODE_ENV: 'production',
        PORT: '3030',
      },
    },
  ],
};
