module.exports = {
  apps: [
    {
      name: "olivias-shelf",
      cwd: "/root/apps/olivias-shelf",
      script: ".output/server/index.mjs",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "3046",
        NITRO_HOST: "127.0.0.1",
        NITRO_PORT: "3046",
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
    },
  ],
};
