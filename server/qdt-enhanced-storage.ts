/**
 * QDT-Enhanced Storage System
 * Optimizes database operations using memory pools and quantum principles
 */

import { QDTMemoryPool } from './qdt-memory-manager.js';
import { storage } from './storage.js';

class QDTEnhancedStorage {
  private queryPool: QDTMemoryPool<any>;
  private resultPool: QDTMemoryPool<any[]>;
  private objectPool: QDTMemoryPool<any>;
  private bufferPool: QDTMemoryPool<any[]>;

  constructor() {
    // Initialize QDT memory pools for different data types
    this.queryPool = new QDTMemoryPool(() => ({}), 100);
    this.resultPool = new QDTMemoryPool(() => [], 50);
    this.objectPool = new QDTMemoryPool(() => ({}), 200);
    this.bufferPool = new QDTMemoryPool(() => new Array(1000), 20);

    console.log('🗃️ QDT-Enhanced Storage: Initialized with memory pools');
  }

  // Enhanced block operations
  async getAllBlocksQDT(limit: number = 100): Promise<any[]> {
    const queryObj = this.queryPool.acquire();
    const resultArray = this.resultPool.acquire();
    
    try {
      // Use pooled objects for query
      queryObj.limit = limit;
      queryObj.orderBy = 'timestamp DESC';
      
      const blocks = await storage.getAllBlocks(limit);
      
      // Use pooled result array
      resultArray.length = 0;
      resultArray.push(...blocks);
      
      return [...resultArray]; // Return copy, not pooled object
    } finally {
      this.queryPool.release(queryObj);
      this.resultPool.release(resultArray);
    }
  }

  // Enhanced discovery operations
  async getAllMathematicalWorkQDT(limit: number = 1000): Promise<any[]> {
    const queryObj = this.queryPool.acquire();
    const resultArray = this.resultPool.acquire();
    
    try {
      queryObj.limit = limit;
      queryObj.orderBy = 'timestamp DESC';
      
      const discoveries = await storage.getAllMathematicalWork(limit);
      
      resultArray.length = 0;
      resultArray.push(...discoveries);
      
      return [...resultArray];
    } finally {
      this.queryPool.release(queryObj);
      this.resultPool.release(resultArray);
    }
  }

  // Enhanced mining operations
  async getActiveMiningOperationsQDT(): Promise<any[]> {
    const resultArray = this.resultPool.acquire();
    
    try {
      const operations = await storage.getActiveMiningOperations();
      
      resultArray.length = 0;
      resultArray.push(...operations);
      
      return [...resultArray];
    } finally {
      this.resultPool.release(resultArray);
    }
  }

  // Memory-optimized creation methods
  async createMathematicalWorkQDT(data: any): Promise<any> {
    const workingObj = this.objectPool.acquire();
    
    try {
      // Copy data to pooled object
      Object.assign(workingObj, data);
      
      const result = await storage.createMathematicalWork(workingObj);
      return result;
    } finally {
      this.objectPool.release(workingObj);
    }
  }

  async createBlockQDT(data: any): Promise<any> {
    const workingObj = this.objectPool.acquire();
    
    try {
      Object.assign(workingObj, data);
      
      const result = await storage.createBlock(workingObj);
      return result;
    } finally {
      this.objectPool.release(workingObj);
    }
  }

  // QDT memory cleanup for large datasets
  async performQDTCleanup(): Promise<void> {
    console.log('🧹 QDT Storage: Performing memory cleanup');
    
    // Clean up old completed operations
    const operations = await storage.getAllMiningOperations();
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const oldCompleted = operations.filter(op => 
      op.status === 'completed' && 
      new Date(op.startTime).getTime() < oneHourAgo
    );

    if (oldCompleted.length > 20) {
      console.log(`🧹 QDT Cleanup: Archiving ${oldCompleted.length} old operations`);
      // Keep only 20 most recent completed operations
      for (const op of oldCompleted.slice(0, -20)) {
        if (storage.deleteMiningOperation) {
          await storage.deleteMiningOperation(op.id);
        }
      }
    }
  }

  // Get pool statistics
  getPoolStatistics(): any {
    return {
      queryPool: this.queryPool.getPoolSize(),
      resultPool: this.resultPool.getPoolSize(),
      objectPool: this.objectPool.getPoolSize(),
      bufferPool: this.bufferPool.getPoolSize(),
      totalPooledObjects: this.queryPool.getPoolSize() + 
                         this.resultPool.getPoolSize() + 
                         this.objectPool.getPoolSize() + 
                         this.bufferPool.getPoolSize()
    };
  }

  // Destroy all pools
  destroy(): void {
    this.queryPool.destroy();
    this.resultPool.destroy();
    this.objectPool.destroy();
    this.bufferPool.destroy();
    console.log('🗃️ QDT-Enhanced Storage: Memory pools destroyed');
  }
}

export const qdtStorage = new QDTEnhancedStorage();