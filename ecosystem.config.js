module.exports = {
    apps: [
      {
        name: 'whatsapp-dashboard',
        exec_mode: 'cluster',
        instances: 'max',
        script: '.output/server/index.mjs',
        env: {
          NUXT_PORT: 3000,
          HOST: '0.0.0.0',
          NODE_ENV: 'production'
        },
        env_development: {
          NUXT_PORT: 3000,
          HOST: '0.0.0.0',
          NODE_ENV: 'development'
        }
      }
    ]
  }