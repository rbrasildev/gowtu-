// Configuração do PM2 para produção na VPS.
// Uso: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "gowtu",
      cwd: "/opt/gowtu",
      script: "npm",
      args: "start", // -> next start -p 3005
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      watch: false,
    },
  ],
};
