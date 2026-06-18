/** PM2 生产进程配置 — 部署目录默认 /var/www/ghammerwinery */
module.exports = {
  apps: [
    {
      name: "ghammerwinery",
      cwd: "/var/www/ghammerwinery",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      time: true,
    },
  ],
};
