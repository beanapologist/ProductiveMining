# Productive Mining Platform: Implementation Guide

## Quick Start Guide

This guide provides step-by-step instructions for setting up, deploying, and scaling the Productive Mining Platform from prototype to production.

## Prerequisites

### System Requirements
- **Node.js**: 20.x or higher
- **PostgreSQL**: 15.x or higher
- **RAM**: 16GB minimum (32GB recommended)
- **Storage**: 1TB SSD minimum
- **Network**: 1Gbps connection recommended

### Development Tools
```bash
# Required tools
npm install -g typescript tsx drizzle-kit
npm install -g pm2 # For production process management

# Optional but recommended
npm install -g @neon/cli # For Neon database management
```

## Local Development Setup

### 1. Environment Configuration
```bash
# Clone repository
git clone <repository-url>
cd productive-mining-platform

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 2. Environment Variables
```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/productive_mining"
PGDATABASE="productive_mining"
PGHOST="localhost"
PGPORT="5432"
PGUSER="postgres"
PGPASSWORD="your_password"

# Application Configuration
NODE_ENV="development"
PORT="5000"

# Security (generate secure values)
SESSION_SECRET="your-256-bit-secret"

# Optional: External Services
OPENAI_API_KEY="your-openai-key" # For enhanced AI features
```

### 3. Database Setup
```bash
# Create database
createdb productive_mining

# Run database migrations
npm run db:push

# Verify tables are created
psql productive_mining -c "\dt"
```

### 4. Start Development Server
```bash
# Start the application
npm run dev

# Verify startup
curl http://localhost:5000/api/metrics

# Access web interface
open http://localhost:5000
```

## Production Deployment

### 1. Infrastructure Setup

#### Docker Deployment
```dockerfile
# Production Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres
    restart: unless-stopped
    
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: productive_mining
      POSTGRES_USER: ${PGUSER}
      POSTGRES_PASSWORD: ${PGPASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 2. Database Migration
```bash
# Production database setup
npm run db:push

# Create initial admin user
npm run seed:admin

# Verify deployment
npm run health-check
```

### 3. Process Management
```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'productive-mining',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Scaling Configuration

### 1. Load Balancer Setup (Nginx)
```nginx
# /etc/nginx/sites-available/productive-mining
upstream productive_mining {
    least_conn;
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
    server 127.0.0.1:5003;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://productive_mining;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 2. Database Scaling
```sql
-- Create read replicas
-- Master-slave configuration for read scaling

-- Optimize for mining operations
CREATE INDEX CONCURRENTLY idx_mathematical_work_performance 
ON mathematical_work(work_type, difficulty, timestamp DESC);

CREATE INDEX CONCURRENTLY idx_mining_operations_active 
ON mining_operations(status, created_at) 
WHERE status = 'active';

-- Partition large tables by date
CREATE TABLE mathematical_work_2025 PARTITION OF mathematical_work
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### 3. Monitoring Setup
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"

volumes:
  grafana_data:
```

## Security Implementation

### 1. SSL/TLS Setup
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Firewall Configuration
```bash
# UFW firewall setup
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 5432  # PostgreSQL (if external)
sudo ufw deny 5000   # Block direct app access
```

### 3. Security Headers
```javascript
// Add to Express middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## API Integration Guide

### 1. Authentication Setup
```javascript
// API authentication middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 2. Rate Limiting
```javascript
// Rate limiting configuration
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

const miningLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit mining operations
  message: 'Mining rate limit exceeded'
});

app.use('/api/', apiLimiter);
app.use('/api/mining/start', miningLimiter);
```

### 3. WebSocket Configuration
```javascript
// Production WebSocket setup
const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      level: 3
    }
  },
  maxPayload: 1024 * 1024 // 1MB max message size
});

wss.on('connection', (ws, req) => {
  // Connection rate limiting
  const ip = req.socket.remoteAddress;
  if (connectionCount[ip] > 10) {
    ws.close(1008, 'Too many connections');
    return;
  }
  
  // Heartbeat mechanism
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
});

// Heartbeat interval
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);
```

## Performance Optimization

### 1. Database Optimization
```sql
-- Performance tuning for PostgreSQL
-- postgresql.conf optimizations

shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
work_mem = 4MB

-- Query optimization
ANALYZE mathematical_work;
ANALYZE productive_blocks;
ANALYZE mining_operations;

-- Vacuum scheduling
-- Add to crontab: 0 2 * * * psql -d productive_mining -c "VACUUM ANALYZE;"
```

### 2. Application Caching
```javascript
// Redis caching layer
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Cache middleware
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    const originalSend = res.json;
    res.json = function(data) {
      client.setex(key, duration, JSON.stringify(data));
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Apply caching to appropriate routes
app.get('/api/discoveries', cacheMiddleware(60), getDiscoveries);
app.get('/api/blocks', cacheMiddleware(30), getBlocks);
```

### 3. Connection Pooling
```javascript
// Database connection pooling
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxUses: 7500 // Rotate connections
});

// Connection health check
setInterval(async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
  } catch (error) {
    console.error('Database health check failed:', error);
  }
}, 60000);
```

## Maintenance Procedures

### 1. Backup Strategy
```bash
#!/bin/bash
# backup.sh - Daily backup script

DB_NAME="productive_mining"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump $DB_NAME | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"

# File system backup
tar -czf "$BACKUP_DIR/files_backup_$DATE.tar.gz" \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=logs \
  /path/to/application

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

# Upload to cloud storage
aws s3 cp "$BACKUP_DIR/db_backup_$DATE.sql.gz" s3://your-backup-bucket/
```

### 2. Log Management
```bash
# Logrotate configuration
# /etc/logrotate.d/productive-mining

/path/to/app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 3. Health Monitoring
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {}
  };
  
  try {
    // Database check
    await pool.query('SELECT 1');
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'degraded';
  }
  
  try {
    // Redis check
    await client.ping();
    health.services.redis = 'healthy';
  } catch (error) {
    health.services.redis = 'unhealthy';
    health.status = 'degraded';
  }
  
  // Mining engine check
  health.services.mining = activeMiningOperations > 0 ? 'active' : 'idle';
  
  res.status(health.status === 'ok' ? 200 : 503).json(health);
});
```

## Troubleshooting Guide

### Common Issues

#### 1. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
psql -c "SELECT count(*) FROM pg_stat_activity;"

# Check logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

#### 2. High Memory Usage
```bash
# Monitor memory usage
htop
free -h

# Check Node.js memory
node --inspect app.js
# Open chrome://inspect in Chrome

# PM2 memory monitoring
pm2 monit
```

#### 3. WebSocket Connection Issues
```bash
# Test WebSocket connection
wscat -c ws://localhost:8080

# Check nginx WebSocket config
sudo nginx -t
sudo systemctl reload nginx

# Monitor WebSocket connections
netstat -an | grep :8080
```

### Performance Issues

#### 1. Slow Database Queries
```sql
-- Enable query logging
SET log_statement = 'all';
SET log_min_duration_statement = 1000;

-- Analyze slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

#### 2. High CPU Usage
```bash
# Monitor CPU usage
top -p $(pgrep -f "node")

# Profile Node.js application
node --prof app.js
node --prof-process isolate-*.log > processed.txt

# Check PM2 CPU usage
pm2 show productive-mining
```

## Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates installed
- [ ] Firewall rules configured
- [ ] Backup procedures tested
- [ ] Monitoring dashboards setup

### Deployment Steps
- [ ] Create database backup
- [ ] Deploy application code
- [ ] Run database migrations
- [ ] Update environment variables
- [ ] Restart application services
- [ ] Verify health endpoints
- [ ] Test critical functionality
- [ ] Monitor error logs

### Post-deployment
- [ ] Performance monitoring active
- [ ] Error tracking functional
- [ ] Backup verification
- [ ] User acceptance testing
- [ ] Documentation updated
- [ ] Team notification sent

## Support and Maintenance

### Monitoring Dashboards
- **Application Metrics**: http://your-domain:3000 (Grafana)
- **System Metrics**: http://your-domain:9090 (Prometheus)
- **Database Metrics**: Built into admin dashboard
- **Log Analysis**: Centralized logging system

### Emergency Contacts
- **Database Issues**: DBA Team
- **Application Issues**: Development Team  
- **Infrastructure Issues**: DevOps Team
- **Security Issues**: Security Team

### Escalation Procedures
1. **Level 1**: Automated alerts and basic troubleshooting
2. **Level 2**: Manual intervention and advanced debugging
3. **Level 3**: Architecture team and external support

---

*Implementation Guide Version: 1.0*  
*Last Updated: July 5, 2025*  
*Status: Production Ready*