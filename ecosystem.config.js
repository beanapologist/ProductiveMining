// PM2 Ecosystem Configuration for Productive Mining Platform
module.exports = {
  apps: [
    {
      name: 'productive-mining',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        QDT_ENABLED: true,
        QDT_HEAP_THRESHOLD: 85,
        MINING_DIFFICULTY_MIN: 50,
        MINING_DIFFICULTY_MAX: 180,
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL: process.env.DATABASE_URL,
        PORT: 5000,
      },
      // Monitoring and restart settings
      min_uptime: '10s',
      max_restarts: 5,
      max_memory_restart: '2G',
      
      // Logging
      log_file: 'logs/combined.log',
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced settings
      kill_timeout: 5000,
      listen_timeout: 10000,
      wait_ready: true,
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Auto restart on file changes (development only)
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'data-backups'],
      
      // Graceful shutdown
      kill_retry_time: 100,
      pmx: true,
      
      // Resource limits
      node_args: '--max-old-space-size=4096',
      
      // Cron restart (restart every day at 2 AM)
      cron_restart: '0 2 * * *',
      
      // Merge logs
      merge_logs: true,
      
      // Time zone
      time: true,
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['production-server-1', 'production-server-2'],
      ref: 'origin/main',
      repo: 'https://github.com/your-username/productive-mining-platform.git',
      path: '/var/www/productive-mining',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci --only=production && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    },

    staging: {
      user: 'deploy',
      host: 'staging-server',
      ref: 'origin/develop',
      repo: 'https://github.com/your-username/productive-mining-platform.git',
      path: '/var/www/productive-mining-staging',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging'
      }
    }
  }
};