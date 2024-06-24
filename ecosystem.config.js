module.exports = {
    apps: [
      {
        name: 'mi-chatbot',
        script: 'index.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      }
    ]
  };
  