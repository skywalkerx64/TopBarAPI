module.exports = {
  apps: [
    {
      name: "topbar-adonis",
      script: "build/bin/server.js",
      instances: 1,
      autorestart: true,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        ENV_PATH: ".env",
      }
    }
  ]
};
