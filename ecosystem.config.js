// Configuração do PM2 para produção na VPS.
// Roda o binário do Next DIRETAMENTE (sem "npm start"), para que o PM2
// gerencie o processo real do servidor e o encerre no reload/restart
// (evita processo órfão segurando a porta 3005).
// Uso: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "gowtu",
      cwd: "/opt/gowtu",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3005",
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
