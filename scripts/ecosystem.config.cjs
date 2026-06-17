module.exports = {
  apps: [
    {
      name: 'lld-webhook',
      script: './scripts/webhook-server.cjs',
      cwd: '/opt/lld_cms', // 补充工作目录，避免相对路径异常
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M', // 部署过程涉及 pnpm install + vite build，需预留足够内存
      env: {
        NODE_ENV: 'production',
        WEBHOOK_PORT: 54280,
        // 密码从环境变量读取，不再硬编码
        // 部署时通过以下方式设置：
        //   1. 在服务器上创建 /opt/lld_cms/.env 文件：WEBHOOK_PASSWORD=your-password
        //   2. 或在 shell 中 export WEBHOOK_PASSWORD=your-password
        //   3. 或通过 PM2 命令：pm2 set lld-webhook:WEBHOOK_PASSWORD your-password
        WEBHOOK_PASSWORD: process.env.WEBHOOK_PASSWORD,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/lld_cms/webhook-error.log',
      out_file: '/var/log/lld_cms/webhook-out.log',
      merge_logs: true,
    },
  ],
};
