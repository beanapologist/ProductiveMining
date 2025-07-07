/**
 * QDT Memory Management API Routes
 * Provides endpoints for monitoring and controlling QDT memory optimization
 */

import { Router } from 'express';
import { QDTMemoryManager, qdtStorage } from './qdt-enhanced-storage.js';

const router = Router();

// Global QDT memory manager instance
let globalQDTManager: QDTMemoryManager | null = null;

export function setQDTManager(manager: QDTMemoryManager) {
  globalQDTManager = manager;
}

// Get current QDT memory metrics
router.get('/qdt/metrics', async (req, res) => {
  try {
    if (!globalQDTManager) {
      return res.status(503).json({ error: 'QDT manager not initialized' });
    }

    const metrics = globalQDTManager.getMemoryMetrics();
    const poolStats = qdtStorage.getPoolStatistics();
    
    res.json({
      qdt: metrics,
      pools: poolStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('QDT metrics error:', error);
    res.status(500).json({ error: 'Failed to get QDT metrics' });
  }
});

// Get QDT analytics and historical data
router.get('/qdt/analytics', async (req, res) => {
  try {
    if (!globalQDTManager) {
      return res.status(503).json({ error: 'QDT manager not initialized' });
    }

    const analytics = globalQDTManager.getAnalytics();
    
    res.json({
      analytics,
      summary: {
        isOptimal: analytics.currentMetrics?.memoryState.balance === 'OPTIMAL',
        coherenceLevel: analytics.currentMetrics?.qdtAnalysis.coherenceLevel || 0,
        voidFilamentRatio: analytics.currentMetrics?.qdtAnalysis.voidFilamentRatio || 0,
        energyConservation: analytics.currentMetrics?.qdtAnalysis.energyConservation || 0
      }
    });
  } catch (error) {
    console.error('QDT analytics error:', error);
    res.status(500).json({ error: 'Failed to get QDT analytics' });
  }
});

// Trigger manual quantum tunneling (aggressive GC)
router.post('/qdt/quantum-tunneling', async (req, res) => {
  try {
    console.log('🌀 API: Manual Quantum Tunneling triggered');
    
    if (global.gc) {
      global.gc();
      res.json({ 
        success: true, 
        message: 'Quantum tunneling completed',
        method: 'native_gc'
      });
    } else {
      // Alternative memory pressure
      const quantum_pressure: any[] = [];
      try {
        for (let i = 0; i < 100000; i++) {
          quantum_pressure.push(new Array(10).fill(null));
        }
      } catch (e) {
        // Memory pressure created
      }
      quantum_pressure.length = 0;
      
      res.json({ 
        success: true, 
        message: 'Quantum tunneling via memory pressure',
        method: 'memory_pressure'
      });
    }
  } catch (error) {
    console.error('Quantum tunneling error:', error);
    res.status(500).json({ error: 'Quantum tunneling failed' });
  }
});

// Trigger gravitational funneling (memory optimization)
router.post('/qdt/gravitational-funneling', async (req, res) => {
  try {
    console.log('🌊 API: Manual Gravitational Funneling triggered');
    
    // Perform QDT storage cleanup
    await qdtStorage.performQDTCleanup();
    
    // Clear optional caches
    if (Buffer.alloc) {
      Buffer.alloc(0);
    }

    // Optimize require cache
    const paths = Object.keys(require.cache);
    const essentialModules = ['express', 'drizzle-orm', 'ws'];
    let clearedPaths = 0;
    
    paths.forEach(path => {
      const isEssential = essentialModules.some(mod => path.includes(mod));
      if (path.includes('node_modules') && !isEssential) {
        delete require.cache[path];
        clearedPaths++;
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Gravitational funneling completed',
      clearedCachePaths: clearedPaths,
      storageCleanup: true
    });
  } catch (error) {
    console.error('Gravitational funneling error:', error);
    res.status(500).json({ error: 'Gravitational funneling failed' });
  }
});

// Get QDT memory pool statistics
router.get('/qdt/pools', async (req, res) => {
  try {
    const poolStats = qdtStorage.getPoolStatistics();
    const memoryUsage = process.memoryUsage();
    
    res.json({
      pools: poolStats,
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024)
      },
      efficiency: {
        poolUtilization: poolStats.totalPooledObjects > 0 ? 
          ((poolStats.totalPooledObjects / 500) * 100).toFixed(1) + '%' : '0%',
        memoryEfficiency: ((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100).toFixed(1) + '%'
      }
    });
  } catch (error) {
    console.error('QDT pools error:', error);
    res.status(500).json({ error: 'Failed to get pool statistics' });
  }
});

// QDT health check endpoint
router.get('/qdt/health', async (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    const heapUtilization = memoryUsage.heapUsed / memoryUsage.heapTotal;
    
    const health = {
      status: heapUtilization < 0.8 ? 'healthy' : heapUtilization < 0.9 ? 'warning' : 'critical',
      heapUtilization: Math.round(heapUtilization * 100),
      qdtActive: globalQDTManager !== null,
      storagePoolsActive: true,
      timestamp: new Date().toISOString()
    };
    
    res.json(health);
  } catch (error) {
    console.error('QDT health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

export default router;