module.exports = {
  apps: [
    {
      name: 'lld-webhook',
      script: './scripts/webhook-server.cjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
        WEBHOOK_PORT: 54280,
        WEBHOOK_PASSWORD: 'LLD-Front-Webhook-Password', // 在服务器上配置实际的密码
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/lld_cms/webhook-error.log',
      out_file: '/var/log/lld_cms/webhook-out.log',
      merge_logs: true,
    },
  ],
};
