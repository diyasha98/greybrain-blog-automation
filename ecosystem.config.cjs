module.exports = {
  apps: [
    {
      name: 'skids-newsletter-automation', // Name of your application
      script: 'dist/index.js', // Full path to your entry script
      instances: 1, // Adjust based on your requirements
      exec_mode: 'fork', // Or 'cluster' if you want to use clustering
      interpreter: 'node',
      watch: false, // Enable or disable watching for file changes
      autorestart: true, // Enable automatic restart
    },
  ],
};
