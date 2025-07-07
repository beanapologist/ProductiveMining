#!/bin/bash

# Productive Mining Platform - Production Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    command -v node >/dev/null 2>&1 || error "Node.js is not installed"
    command -v npm >/dev/null 2>&1 || error "npm is not installed"
    command -v docker >/dev/null 2>&1 || error "Docker is not installed"
    command -v docker-compose >/dev/null 2>&1 || error "Docker Compose is not installed"
    
    # Check Node.js version
    NODE_VERSION=$(node --version | sed 's/v//')
    REQUIRED_VERSION="20.0.0"
    
    if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
        error "Node.js version $REQUIRED_VERSION or higher is required (current: $NODE_VERSION)"
    fi
    
    success "Prerequisites check passed"
}

# Environment setup
setup_environment() {
    log "Setting up environment for $ENVIRONMENT..."
    
    if [ ! -f ".env.$ENVIRONMENT" ]; then
        warning "Environment file .env.$ENVIRONMENT not found, using .env.example"
        cp .env.example ".env.$ENVIRONMENT"
    fi
    
    # Load environment variables
    export $(grep -v '^#' ".env.$ENVIRONMENT" | xargs)
    
    success "Environment setup complete"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        npm ci --only=production
    else
        npm ci
    fi
    
    success "Dependencies installed"
}

# Run tests
run_tests() {
    if [ "$ENVIRONMENT" != "production" ]; then
        log "Running tests..."
        npm test
        success "Tests passed"
    else
        log "Skipping tests in production deployment"
    fi
}

# Build application
build_application() {
    log "Building application..."
    
    npm run build
    
    # Verify build
    if [ ! -d "dist" ]; then
        error "Build failed - dist directory not found"
    fi
    
    success "Application built successfully"
}

# Database setup
setup_database() {
    log "Setting up database..."
    
    # Check database connection
    if ! npm run db:check 2>/dev/null; then
        warning "Database connection failed, attempting to create database..."
        npm run db:create 2>/dev/null || true
    fi
    
    # Run migrations
    npm run db:push
    
    success "Database setup complete"
}

# Docker deployment
deploy_docker() {
    log "Deploying with Docker..."
    
    # Build Docker image
    docker build -t productive-mining:$ENVIRONMENT .
    
    # Deploy based on environment
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.prod.yml up -d
    else
        docker-compose up -d
    fi
    
    success "Docker deployment complete"
}

# Health check
health_check() {
    log "Running health checks..."
    
    # Wait for service to start
    sleep 10
    
    # Check system health
    if curl -f http://localhost:5000/api/system/health >/dev/null 2>&1; then
        success "System health check passed"
    else
        error "System health check failed"
    fi
    
    # Check QDT memory management
    if curl -f http://localhost:5000/api/qdt/health >/dev/null 2>&1; then
        success "QDT memory health check passed"
    else
        warning "QDT memory health check failed"
    fi
    
    # Check API endpoints
    if curl -f http://localhost:5000/api/overview >/dev/null 2>&1; then
        success "API endpoints health check passed"
    else
        warning "API endpoints health check failed"
    fi
}

# Backup before deployment
backup_data() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Creating backup before deployment..."
        
        BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        
        # Database backup
        if [ -n "$DATABASE_URL" ]; then
            pg_dump "$DATABASE_URL" > "$BACKUP_DIR/database.sql" 2>/dev/null || warning "Database backup failed"
        fi
        
        # Application data backup
        if [ -d "data-backups" ]; then
            cp -r data-backups "$BACKUP_DIR/" 2>/dev/null || warning "Data backup failed"
        fi
        
        success "Backup created at $BACKUP_DIR"
    fi
}

# Cleanup old deployments
cleanup() {
    log "Cleaning up old deployments..."
    
    # Remove old Docker images
    docker image prune -f >/dev/null 2>&1 || true
    
    # Remove old backups (keep last 10)
    if [ -d "backups" ]; then
        ls -t backups/ | tail -n +11 | xargs -I {} rm -rf "backups/{}" 2>/dev/null || true
    fi
    
    success "Cleanup complete"
}

# Monitor deployment
monitor_deployment() {
    log "Monitoring deployment..."
    
    # Show real-time logs for 30 seconds
    timeout 30 docker-compose logs -f app 2>/dev/null || true
    
    # Show deployment summary
    echo ""
    log "Deployment Summary:"
    echo "  Environment: $ENVIRONMENT"
    echo "  Timestamp: $(date)"
    echo "  System Health: $(curl -s http://localhost:5000/api/system/health | jq -r '.status' 2>/dev/null || echo 'unknown')"
    echo "  QDT Status: $(curl -s http://localhost:5000/api/qdt/health | jq -r '.status' 2>/dev/null || echo 'unknown')"
    echo "  Discovery Count: $(curl -s http://localhost:5000/api/discoveries | jq '. | length' 2>/dev/null || echo 'unknown')"
    echo ""
}

# Main deployment function
main() {
    cd "$PROJECT_DIR"
    
    log "Starting Productive Mining Platform deployment..."
    
    check_prerequisites
    setup_environment
    backup_data
    install_dependencies
    run_tests
    build_application
    setup_database
    deploy_docker
    health_check
    cleanup
    monitor_deployment
    
    success "🎉 Deployment completed successfully!"
    
    echo ""
    echo "🔗 Application URLs:"
    echo "  Main Dashboard: http://localhost:5000"
    echo "  API Overview: http://localhost:5000/api/overview"
    echo "  System Health: http://localhost:5000/api/system/health"
    echo "  App Architecture: http://localhost:5000/app"
    echo ""
    
    log "Deployment logs are available in the container logs"
    log "Run 'docker-compose logs -f' to view real-time logs"
}

# Handle script interruption
trap 'error "Deployment interrupted"' INT TERM

# Run main function
main "$@"