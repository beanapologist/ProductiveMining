# Productive Mining Platform - Mainnet Deployment Guide

## Executive Summary

Comprehensive deployment guide for launching the Productive Mining Platform on mainnet infrastructure. This revolutionary blockchain replaces wasteful proof-of-work mining with productive mathematical computation.

## Pre-Deployment Requirements

### Infrastructure Requirements
- **CPU**: 8+ cores (16+ recommended for mining operations)
- **RAM**: 16GB minimum (32GB+ recommended for QDT optimization)
- **Storage**: 500GB SSD (1TB+ recommended for blockchain data)
- **Network**: High-speed internet with low latency
- **OS**: Ubuntu 20.04+ or compatible Linux distribution

### Software Dependencies
- **Node.js**: v20+ (LTS recommended)
- **PostgreSQL**: v15+ with extensions (uuid-ossp, pgcrypto)
- **Docker**: v24+ (if using containerized deployment)
- **Redis**: v7+ (optional, for caching)
- **Nginx**: Latest (for reverse proxy and load balancing)

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd productive-mining-platform

# Configure environment
cp .env.example .env
# Edit .env with production values

# Deploy with Docker Compose
docker-compose up -d

# Verify deployment
curl http://localhost:5000/api/system/health
```

#### Production Docker Setup
```bash
# Build production image
docker build -t productive-mining:latest .

# Run with production configuration
docker run -d \
  --name productive-mining \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=your_database_url \
  --restart unless-stopped \
  productive-mining:latest
```

### Option 2: Traditional Deployment

#### Installation Steps
```bash
# Install Node.js dependencies
npm ci --only=production

# Build application
npm run build

# Set up database
npm run db:push

# Start application
npm start
```

#### Process Management with PM2
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Save configuration
pm2 save
pm2 startup
```

## Database Configuration

### PostgreSQL Setup
```sql
-- Create database
CREATE DATABASE productive_mining;

-- Create user
CREATE USER productive_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE productive_mining TO productive_user;

-- Run initialization script
\i init.sql
```

### Performance Optimization
```sql
-- Optimize for heavy workloads
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET effective_cache_size = '12GB';
ALTER SYSTEM SET work_mem = '256MB';
ALTER SYSTEM SET maintenance_work_mem = '1GB';
ALTER SYSTEM SET max_connections = 200;

-- Restart PostgreSQL to apply settings
```

## Security Configuration

### Firewall Setup
```bash
# Allow SSH
ufw allow 22

# Allow HTTP/HTTPS
ufw allow 80
ufw allow 443

# Allow application port (if not using reverse proxy)
ufw allow 5000

# Allow PostgreSQL (if external access needed)
ufw allow 5432

# Enable firewall
ufw enable
```

### SSL/TLS Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring and Maintenance

### Health Monitoring
```bash
# System health check
curl http://localhost:5000/api/system/health

# QDT memory status
curl http://localhost:5000/api/qdt/health

# Performance metrics
curl http://localhost:5000/api/metrics

# API overview
curl http://localhost:5000/api/overview
```

### Log Management
```bash
# Application logs
tail -f logs/application.log

# Error logs
tail -f logs/error.log

# QDT memory logs
tail -f logs/qdt-memory.log

# Mining operation logs
tail -f logs/mining.log
```

### Backup Strategy
```bash
# Database backup
pg_dump productive_mining > backup_$(date +%Y%m%d).sql

# Application data backup
tar -czf app_backup_$(date +%Y%m%d).tar.gz data-backups/

# Automated backup script
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

## Performance Optimization

### QDT Memory Management
- Monitor heap usage with `/api/qdt/metrics`
- Adjust `QDT_HEAP_THRESHOLD` based on system memory
- Enable quantum tunneling for aggressive garbage collection
- Configure gravitational funneling for cache optimization

### Mining Operations
- Set appropriate difficulty range (50-180 for production)
- Limit active miners based on system capacity
- Monitor mathematical discovery generation rate
- Balance work distribution across 9 computation types

### API Performance
- Use Redis for caching frequently accessed data
- Implement rate limiting for public endpoints
- Enable gzip compression
- Use CDN for static assets

## Troubleshooting

### Common Issues

#### Memory Issues
```bash
# Check QDT status
curl http://localhost:5000/api/qdt/health

# Monitor heap usage
node --inspect server/index.js

# Adjust memory limits
export NODE_OPTIONS="--max-old-space-size=8192"
```

#### Database Connection Issues
```bash
# Test database connection
psql -h localhost -U productive_user -d productive_mining

# Check connection pool
curl http://localhost:5000/api/system/health

# Monitor active connections
SELECT count(*) FROM pg_stat_activity;
```

#### API Errors
```bash
# Check API status
curl http://localhost:5000/api/overview

# Test specific endpoints
curl http://localhost:5000/api/discoveries?limit=10

# Monitor error logs
tail -f logs/error.log
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple application instances
- Implement session affinity for WebSocket connections
- Use shared database and Redis instances

### Vertical Scaling
- Increase CPU cores for mathematical computations
- Add more RAM for QDT memory optimization
- Use faster SSD storage for database operations
- Optimize PostgreSQL configuration for hardware

## Support and Maintenance

### Regular Maintenance Tasks
- Monitor system resources daily
- Review application logs weekly
- Update dependencies monthly
- Backup database and application data regularly
- Test disaster recovery procedures quarterly

### Performance Monitoring
- Track mathematical discovery generation rate
- Monitor energy efficiency metrics (-565% target)
- Analyze API response times
- Review security threat detection logs

### Updates and Upgrades
- Test updates in staging environment first
- Use rolling updates for zero-downtime deployment
- Backup before applying major updates
- Monitor system stability after updates

## Contact and Support

For deployment assistance and technical support:
- Review complete documentation in project repository
- Monitor system metrics and logs
- Follow best practices for security and performance
- Maintain regular backups and disaster recovery plans