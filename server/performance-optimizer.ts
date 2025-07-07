/**
 * Performance Optimizer - System Health Management
 * Monitors and optimizes system performance for smooth operation
 */

interface PerformanceMetrics {
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  cpuUsage: {
    user: number;
    system: number;
  };
  responseTime: {
    average: number;
    current: number;
  };
  activeConnections: number;
  apiCallFrequency: {
    per_minute: number;
    per_hour: number;
  };
  queueSize: number;
  cacheHitRate: number;
}

interface OptimizationRecommendation {
  type: 'memory' | 'cpu' | 'network' | 'cache' | 'api';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  action: string;
  estimatedImpact: string;
}

class PerformanceOptimizer {
  private metrics: PerformanceMetrics;
  private recommendations: OptimizationRecommendation[] = [];
  private lastOptimization: Date = new Date();
  private optimizationCount: number = 0;

  constructor() {
    this.metrics = this.getInitialMetrics();
    this.startMonitoring();
  }

  private getInitialMetrics(): PerformanceMetrics {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memoryUsage: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss
      },
      cpuUsage: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      responseTime: {
        average: 150,
        current: 120
      },
      activeConnections: 0,
      apiCallFrequency: {
        per_minute: 0,
        per_hour: 0
      },
      queueSize: 0,
      cacheHitRate: 85.5
    };
  }

  private startMonitoring() {
    setInterval(() => {
      this.updateMetrics();
      this.generateRecommendations();
      this.applyAutoOptimizations();
    }, 10000); // Check every 10 seconds
  }

  private updateMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    this.metrics.memoryUsage = {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss
    };
    
    this.metrics.cpuUsage = {
      user: cpuUsage.user,
      system: cpuUsage.system
    };
    
    // Update response time (simulated for now)
    this.metrics.responseTime.current = Math.random() * 200 + 50;
    this.metrics.responseTime.average = (this.metrics.responseTime.average * 0.9) + (this.metrics.responseTime.current * 0.1);
  }

  private generateRecommendations() {
    this.recommendations = [];
    
    // Memory optimization recommendations
    if (this.metrics.memoryUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
      this.recommendations.push({
        type: 'memory',
        priority: 'high',
        description: 'High memory usage detected',
        action: 'Reduce API polling frequency and clear unused data',
        estimatedImpact: '30-50% memory reduction'
      });
    }
    
    // CPU optimization recommendations
    if (this.metrics.responseTime.average > 300) {
      this.recommendations.push({
        type: 'cpu',
        priority: 'medium',
        description: 'Slow response times detected',
        action: 'Optimize database queries and reduce computation load',
        estimatedImpact: '20-40% performance improvement'
      });
    }
    
    // Network optimization recommendations
    if (this.metrics.apiCallFrequency.per_minute > 60) {
      this.recommendations.push({
        type: 'network',
        priority: 'medium',
        description: 'High API call frequency',
        action: 'Implement request batching and increase cache duration',
        estimatedImpact: '15-25% network load reduction'
      });
    }
    
    // Cache optimization recommendations
    if (this.metrics.cacheHitRate < 80) {
      this.recommendations.push({
        type: 'cache',
        priority: 'low',
        description: 'Low cache hit rate',
        action: 'Improve cache strategy and increase cache size',
        estimatedImpact: '10-20% response time improvement'
      });
    }
  }

  private applyAutoOptimizations() {
    const highPriorityRecommendations = this.recommendations.filter(r => r.priority === 'high' || r.priority === 'critical');
    
    if (highPriorityRecommendations.length > 0) {
      this.optimizationCount++;
      this.lastOptimization = new Date();
      
      // Trigger garbage collection if memory is high
      if (this.metrics.memoryUsage.heapUsed > 500 * 1024 * 1024) {
        if (global.gc) {
          global.gc();
        }
      }
    }
  }

  public getPerformanceReport() {
    return {
      metrics: this.metrics,
      recommendations: this.recommendations,
      status: this.getSystemStatus(),
      lastOptimization: this.lastOptimization,
      optimizationCount: this.optimizationCount,
      timestamp: new Date().toISOString()
    };
  }

  private getSystemStatus(): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    const memoryUsageMB = this.metrics.memoryUsage.heapUsed / (1024 * 1024);
    const responseTime = this.metrics.responseTime.average;
    
    if (memoryUsageMB > 800 || responseTime > 500) return 'critical';
    if (memoryUsageMB > 500 || responseTime > 300) return 'poor';
    if (memoryUsageMB > 300 || responseTime > 200) return 'fair';
    if (memoryUsageMB > 150 || responseTime > 150) return 'good';
    return 'excellent';
  }

  public forceOptimization() {
    this.optimizationCount++;
    this.lastOptimization = new Date();
    
    // Force garbage collection
    if (global.gc) {
      global.gc();
    }
    
    // Clear any internal caches
    this.clearCaches();
    
    return {
      success: true,
      message: 'System optimization completed',
      timestamp: new Date().toISOString()
    };
  }

  private clearCaches() {
    // Clear any internal caches here
    // This would be implementation specific
  }
}

export const performanceOptimizer = new PerformanceOptimizer();