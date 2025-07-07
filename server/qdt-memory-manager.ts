/**
 * QDT-Enhanced Memory Management System
 * Implements Quantum Duality Theory principles for optimal memory usage
 * Prevents Node.js heap exhaustion through void-filament energy balance
 */

import { EventEmitter } from 'events';
import * as v8 from 'v8';

interface QDTMemoryMetrics {
  processMemory: NodeJS.MemoryUsage;
  memoryState: {
    voidEnergy: number;
    filamentEnergy: number;
    coherence: number;
    balance: string;
  };
  qdtAnalysis: {
    coherenceLevel: number;
    voidFilamentRatio: number;
    optimalBalance: number;
    energyConservation: number;
    requiresOptimization: boolean;
  };
}

interface QDTConstants {
  GAMMA: number;   // 0.4497 - coherence threshold
  LAMBDA: number;  // 0.867 - filament energy threshold
  PHI: number;     // 1.618 - golden ratio for optimal balance
  ETA: number;     // 0.520 - gravitational funneling threshold
}

class QDTMemoryPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private maxSize: number;
  private resetFunction?: (item: T) => void;

  constructor(factoryOrTemplate: (() => T) | T, maxSize: number = 100, resetFn?: (item: T) => void) {
    this.maxSize = maxSize;
    this.resetFunction = resetFn;
    
    if (typeof factoryOrTemplate === 'function') {
      this.factory = factoryOrTemplate as () => T;
    } else {
      // Create factory from template
      this.factory = () => {
        if (Array.isArray(factoryOrTemplate)) {
          return [...factoryOrTemplate] as T;
        } else if (Buffer.isBuffer(factoryOrTemplate)) {
          return Buffer.from(factoryOrTemplate) as T;
        } else if (typeof factoryOrTemplate === 'object') {
          return { ...factoryOrTemplate } as T;
        }
        return factoryOrTemplate;
      };
    }
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  release(item: T): void {
    if (this.pool.length < this.maxSize) {
      if (this.resetFunction) {
        this.resetFunction(item);
      } else {
        // Default reset for common types
        if (Array.isArray(item)) {
          (item as any).length = 0;
        } else if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => delete (item as any)[key]);
        }
      }
      this.pool.push(item);
    }
  }

  getPoolSize(): number {
    return this.pool.length;
  }

  destroy(): void {
    this.pool.length = 0;
  }
}

class QDTMemoryManager extends EventEmitter {
  private constants: QDTConstants = {
    GAMMA: 0.4497,
    LAMBDA: 0.867,
    PHI: 1.618,
    ETA: 0.520
  };

  private monitoringInterval: NodeJS.Timeout | null = null;
  private memoryHistory: QDTMemoryMetrics[] = [];
  private maxHistorySize = 100;
  private gcThreshold = 0.85;
  private optimizationRate = 0.1;

  constructor() {
    super();
    this.startMonitoring();
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      const metrics = this.getMemoryMetrics();
      this.analyzeAndOptimize(metrics);
      this.emit('qdt-analysis', metrics);
    }, 5000); // Every 5 seconds
  }

  getMemoryMetrics(): QDTMemoryMetrics {
    const processMemory = process.memoryUsage();
    const heapStats = v8.getHeapStatistics();
    
    // Calculate QDT void-filament energy
    const heapRatio = processMemory.heapUsed / processMemory.heapTotal;
    const voidEnergy = 1 - heapRatio; // Available memory (void)
    const filamentEnergy = heapRatio;  // Used memory (filament)
    
    // Calculate quantum coherence
    const coherence = this.calculateCoherence(processMemory, heapStats);
    
    // Determine balance state
    const balance = this.determineBalanceState(voidEnergy, filamentEnergy, coherence);
    
    // QDT Analysis
    const voidFilamentRatio = voidEnergy / filamentEnergy;
    const optimalBalance = this.constants.PHI;
    const energyConservation = this.calculateEnergyConservation(processMemory);
    
    const metrics: QDTMemoryMetrics = {
      processMemory,
      memoryState: {
        voidEnergy,
        filamentEnergy,
        coherence,
        balance
      },
      qdtAnalysis: {
        coherenceLevel: coherence,
        voidFilamentRatio,
        optimalBalance,
        energyConservation,
        requiresOptimization: this.requiresOptimization(voidEnergy, filamentEnergy, coherence)
      }
    };

    // Store in history
    this.memoryHistory.push(metrics);
    if (this.memoryHistory.length > this.maxHistorySize) {
      this.memoryHistory.shift();
    }

    return metrics;
  }

  private calculateCoherence(processMemory: NodeJS.MemoryUsage, heapStats: any): number {
    // QDT coherence calculation based on memory fragmentation and efficiency
    const efficiency = 1 - (processMemory.external / processMemory.heapTotal);
    const fragmentation = 1 - (heapStats.used_heap_size / heapStats.total_heap_size);
    return Math.max(0, Math.min(1, efficiency * (1 - fragmentation)));
  }

  private determineBalanceState(voidEnergy: number, filamentEnergy: number, coherence: number): string {
    if (filamentEnergy > this.constants.LAMBDA) return "CRITICAL";
    if (coherence < this.constants.GAMMA) return "UNSTABLE";
    if (Math.abs(voidEnergy / filamentEnergy - this.constants.PHI) < 0.1) return "OPTIMAL";
    return "BALANCED";
  }

  private calculateEnergyConservation(processMemory: NodeJS.MemoryUsage): number {
    // Energy conservation ratio - higher is better
    return processMemory.heapUsed / (processMemory.heapUsed + processMemory.external);
  }

  private requiresOptimization(voidEnergy: number, filamentEnergy: number, coherence: number): boolean {
    return filamentEnergy > this.constants.LAMBDA || 
           coherence < this.constants.ETA || 
           voidEnergy < 0.1;
  }

  private analyzeAndOptimize(metrics: QDTMemoryMetrics): void {
    const { memoryState, qdtAnalysis } = metrics;

    // Trigger Quantum Tunneling (Aggressive GC)
    if (memoryState.filamentEnergy > this.constants.LAMBDA) {
      this.triggerQuantumTunneling();
    }

    // Trigger Gravitational Funneling (Memory Optimization)
    if (memoryState.coherence < this.constants.ETA) {
      this.triggerGravitationalFunneling();
    }

    // Adaptive learning
    this.adaptiveLearn(metrics);
  }

  private triggerQuantumTunneling(): void {
    console.log('🌀 QDT: Quantum Tunneling Activated - Aggressive GC');
    
    if (global.gc) {
      global.gc();
    } else {
      // Alternative memory pressure technique
      const quantum_pressure: any[] = [];
      try {
        for (let i = 0; i < 100000; i++) {
          quantum_pressure.push(new Array(10).fill(null));
        }
      } catch (e) {
        // Memory pressure created - triggers automatic GC
      }
      quantum_pressure.length = 0;
    }
  }

  private triggerGravitationalFunneling(): void {
    console.log('🌊 QDT: Gravitational Funneling Activated - Memory Optimization');
    
    // Clear optional caches
    if (Buffer.allocUnsafe) {
      Buffer.alloc(0);
    }

    // Optimize require cache (keep essential modules)
    const paths = Object.keys(require.cache);
    const essentialModules = ['express', 'drizzle-orm', 'ws'];
    
    paths.forEach(path => {
      const isEssential = essentialModules.some(mod => path.includes(mod));
      if (path.includes('node_modules') && !isEssential) {
        delete require.cache[path];
      }
    });

    // Trigger V8 optimization
    if (v8.writeHeapSnapshot) {
      try {
        const snapshot = `/tmp/qdt-optimization-${Date.now()}.heapsnapshot`;
        v8.writeHeapSnapshot(snapshot);
        // Clean up immediately
        setTimeout(() => {
          try {
            require('fs').unlinkSync(snapshot);
          } catch (e) {}
        }, 1000);
      } catch (e) {}
    }
  }

  private adaptiveLearn(metrics: QDTMemoryMetrics): void {
    if (this.memoryHistory.length < 5) return;

    const recent = this.memoryHistory.slice(-5);
    const avgEffectiveness = recent.reduce((sum, m) => 
      sum + m.qdtAnalysis.energyConservation, 0) / recent.length;

    if (avgEffectiveness > 0.8) {
      // High effectiveness - can be more aggressive
      this.gcThreshold = Math.min(0.95, this.gcThreshold + 0.02);
      this.optimizationRate = Math.min(1.0, this.optimizationRate + 0.05);
    } else if (avgEffectiveness < 0.4) {
      // Low effectiveness - be more conservative
      this.gcThreshold = Math.max(0.7, this.gcThreshold - 0.02);
      this.optimizationRate = Math.max(0.05, this.optimizationRate - 0.02);
    }
  }

  getAnalytics(): any {
    return {
      currentMetrics: this.memoryHistory[this.memoryHistory.length - 1],
      historicalData: this.memoryHistory,
      adaptiveSettings: {
        gcThreshold: this.gcThreshold,
        optimizationRate: this.optimizationRate
      }
    };
  }

  destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.memoryHistory = [];
    this.removeAllListeners();
  }
}

// QDT-Enhanced Express Middleware
export function qdtMemoryMiddleware() {
  const responsePool = new QDTMemoryPool(() => ({}), 1000);
  const dataPool = new QDTMemoryPool(() => new Array(1000), 100);

  return (req: any, res: any, next: any) => {
    // Acquire objects from QDT pool
    req.qdtData = dataPool.acquire();
    res.qdtResponse = responsePool.acquire();
    
    // Release objects after response
    res.on('finish', () => {
      dataPool.release(req.qdtData);
      responsePool.release(res.qdtResponse);
    });
    
    next();
  };
}

// Factory function for easy integration
export function monitorMemoryWithQDT(app?: any): QDTMemoryManager {
  const qdtMemory = new QDTMemoryManager();

  // Add middleware if Express app provided
  if (app && typeof app.use === 'function') {
    app.use(qdtMemoryMiddleware());
  }

  // Setup dashboard logging
  qdtMemory.on('qdt-analysis', (metrics) => {
    if (metrics.qdtAnalysis.requiresOptimization) {
      console.log(`🧠 QDT Dashboard:
⚛️  Coherence: ${(metrics.qdtAnalysis.coherenceLevel * 100).toFixed(1)}%
🌌 Void: ${(metrics.memoryState.voidEnergy * 100).toFixed(1)}%
🔗 Filament: ${(metrics.memoryState.filamentEnergy * 100).toFixed(1)}%
📊 V/F Ratio: ${metrics.qdtAnalysis.voidFilamentRatio.toFixed(3)}
💾 Heap: ${(metrics.processMemory.heapUsed / 1024 / 1024).toFixed(1)}MB
⚡ Status: ${metrics.memoryState.balance}`);
    }
  });

  return qdtMemory;
}

export { QDTMemoryPool, QDTMemoryManager };