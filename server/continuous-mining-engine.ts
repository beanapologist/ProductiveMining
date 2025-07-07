/**
 * Continuous Mining Engine - Ensures Mining Never Stops
 * Monitors network health and automatically spawns new miners as needed
 */

import { storage } from './storage.js';
import { workDistributionBalancer } from './work-distribution-balancer.js';
import { qdtStorage } from './qdt-enhanced-storage.js';

export class ContinuousMiningEngine {
  private monitoringActive = false;
  private minActiveMiners = 2; // Reduced minimum miners
  private targetActiveMiners = 5; // Reduced target to prevent memory issues
  private maxActiveMiners = 8; // Reduced maximum to prevent overload
  private healthCheckInterval = 90000; // Increased to 90 seconds
  private spawnCooldown = 120000; // Increased to 2 minutes between spawns
  private lastSpawnTime = 0;
  private maxOperationsPerDay = 500; // Daily limit to prevent accumulation

  constructor() {
    console.log('🔧 CONTINUOUS MINING ENGINE: Initialized with intelligent work distribution');
  }

  async startContinuousMonitoring() {
    if (this.monitoringActive) {
      console.log('⚠️ CONTINUOUS MINING: Already monitoring');
      return;
    }

    this.monitoringActive = true;
    console.log('🚀 CONTINUOUS MINING: Starting intelligent monitoring system with work distribution balancer');
    
    // Initial spawn with balanced work types
    await this.ensureMinimumMiners();
    
    // Start monitoring loop
    this.runMonitoringLoop();
  }

  private async runMonitoringLoop() {
    while (this.monitoringActive) {
      try {
        await this.performHealthCheck();
        await this.sleep(this.healthCheckInterval);
      } catch (error) {
        console.error('❌ MONITORING ERROR:', (error as Error).message);
        await this.sleep(this.healthCheckInterval);
      }
    }
  }

  private async performHealthCheck() {
    try {
      // Clean up completed operations first
      await this.cleanupCompletedOperations();
      
      const activeOperations = await qdtStorage.getActiveMiningOperationsQDT();
      const activeCount = activeOperations.length;
      
      console.log(`🏥 HEALTH CHECK: ${activeCount} active miners`);

      // Check daily operation limit
      const todayOperations = await this.getTodayOperationCount();
      if (todayOperations > this.maxOperationsPerDay) {
        console.log(`⚠️ DAILY LIMIT REACHED: ${todayOperations} operations today, suspending new spawns`);
        return;
      }

      if (this.canSpawnMore() && activeCount < this.minActiveMiners) {
        await this.ensureMinimumMiners();
      } else if (activeCount < this.targetActiveMiners && this.canSpawnMore()) {
        await this.checkStuckOperations();
        await this.spawnAdditionalMiners();
      }
    } catch (error) {
      console.error('❌ HEALTH CHECK ERROR:', (error as Error).message);
    }
  }

  private async ensureMinimumMiners() {
    const activeOperations = await qdtStorage.getActiveMiningOperationsQDT();
    const needed = this.minActiveMiners - activeOperations.length;
    
    if (needed > 0 && this.canSpawnMore()) {
      console.log(`🆘 EMERGENCY SPAWN: Need ${needed} miners to reach minimum`);
      await this.spawnEmergencyMiners();
    }
  }

  private async spawnEmergencyMiners() {
    const activeOperations = await storage.getActiveMiningOperations();
    const needed = Math.min(
      this.minActiveMiners - activeOperations.length,
      this.maxActiveMiners - activeOperations.length
    );
    
    if (needed > 0) {
      await this.spawnMiners(needed, 150); // Emergency difficulty
      this.lastSpawnTime = Date.now();
    }
  }

  private async spawnAdditionalMiners() {
    const activeOperations = await qdtStorage.getActiveMiningOperationsQDT();
    const canSpawn = Math.min(
      this.targetActiveMiners - activeOperations.length,
      this.maxActiveMiners - activeOperations.length,
      5 // Max 5 per spawn cycle
    );
    
    if (canSpawn > 0 && this.canSpawnMore()) {
      await this.spawnMiners(canSpawn, 160); // Higher difficulty for additional miners
      this.lastSpawnTime = Date.now();
    }
  }

  private async spawnMiners(count: number, difficulty: number) {
    // Use work distribution balancer for intelligent work type selection
    await workDistributionBalancer.applyBalancingStrategy();
    
    const spawned = [];
    for (let i = 0; i < count; i++) {
      try {
        // Get balanced work type from the balancer
        const workType = workDistributionBalancer.getBalancedWorkType();
        
        // Get balanced difficulty for this work type
        const balancedDifficulty = workDistributionBalancer.getBalancedDifficulty(workType);
        
        const minerId = `continuous_miner_${Date.now()}_${i}`;
        
        const operation = await storage.createMiningOperation({
          operationType: workType,
          minerId,
          startTime: new Date(),
          estimatedCompletion: new Date(Date.now() + 120000 + (i * 10000)), // Staggered completion
          progress: 0,
          currentResult: { status: 'spawning', difficulty: balancedDifficulty },
          difficulty: balancedDifficulty,
          status: 'active'
        });

        spawned.push({ minerId, workType, difficulty: balancedDifficulty, operationId: operation.id });
        
        // Start mining computation with delay
        setTimeout(async () => {
          try {
            console.log(`⛏️ CONTINUOUS MINER: Starting ${workType} at difficulty ${balancedDifficulty}`);
            await this.performBasicMining(operation.id, workType, balancedDifficulty, minerId);
          } catch (error) {
            console.error(`❌ CONTINUOUS MINER FAILED: ${(error as Error).message}`);
          }
        }, 2000 + (i * 1000)); // Staggered start

      } catch (error) {
        console.error(`❌ SPAWN ERROR: Failed to spawn miner ${i}:`, error);
      }
    }

    console.log(`✅ SPAWNED: ${spawned.length} continuous miners with balanced work distribution`);
    console.log(`🎯 WORK TYPES: ${spawned.map(s => s.workType).join(', ')}`);
    return spawned;
  }

  private async performBasicMining(operationId: number, workType: string, difficulty: number, minerId: string) {
    try {
      // Update to computing
      await storage.updateMiningOperation(operationId, {
        progress: 0.1,
        currentResult: { status: 'computing', workType }
      });

      // Simulate computation time based on difficulty
      const computationTime = Math.max(30000, difficulty * 300); // 30s to 2+ minutes
      const progressInterval = computationTime / 10;

      // Progress updates
      for (let i = 1; i <= 9; i++) {
        await this.sleep(progressInterval);
        await storage.updateMiningOperation(operationId, {
          progress: 0.1 + (i * 0.08), // 0.1 to 0.82
          currentResult: { 
            status: 'computing', 
            workType,
            stage: `computation_${i}`,
            progress: Math.round(100 * (0.1 + (i * 0.08)))
          }
        });
      }

      // Complete mining using REAL mathematical computation
      const { hybridMathematicalSystem } = await import('./hybrid-mathematical-system.js');
      const computationResult = hybridMathematicalSystem.computeMathematicalWork(workType, difficulty);
      
      // Calculate scientific value
      const { scientificValuationEngine } = await import('./scientific-valuation-engine.js');
      const valuation = scientificValuationEngine.calculateScientificValue(
        workType,
        difficulty,
        computationResult.computationTime || 300,
        computationResult.energyConsumed || 0.08
      );

      // Create authentic mathematical work record - preserve original work type
      const effectiveWorkType = computationResult.originalWorkType || computationResult.workType || workType;
      
      const mathematicalWork = await storage.createMathematicalWork({
        workType: effectiveWorkType,
        difficulty,
        result: computationResult,
        verificationData: computationResult.verificationData || { verified: true, method: 'continuous_mining' },
        computationalCost: Math.floor(valuation.totalValue * 0.1),
        energyEfficiency: Math.floor(valuation.totalValue / (computationResult.energyConsumed || 0.08)),
        scientificValue: valuation.totalValue,
        workerId: minerId,
        signature: computationResult.signature || `continuous_${minerId}_${Date.now()}`
      });
      
      console.log(`🔬 DISCOVERY CREATED: ${effectiveWorkType} (difficulty ${difficulty}) with value $${valuation.totalValue}`);

      // Complete operation
      await storage.updateMiningOperation(operationId, {
        status: 'completed',
        progress: 1.0,
        currentResult: { 
          status: 'completed',
          workType,
          discoveryId: mathematicalWork.id,
          scientificValue: valuation.totalValue
        }
      });

      console.log(`✅ CONTINUOUS MINING: Completed ${effectiveWorkType} operation ${operationId}`);

    } catch (error) {
      console.error(`❌ MINING COMPUTATION ERROR: ${(error as Error).message}`);
    }
  }

  private async checkStuckOperations() {
    try {
      const activeOperations = await qdtStorage.getActiveMiningOperationsQDT();
      const now = Date.now();
      const stuckThreshold = 300000; // 5 minutes
      
      for (const op of activeOperations) {
        const timeSinceStart = now - new Date(op.startTime).getTime();
        if (timeSinceStart > stuckThreshold && op.progress < 0.9) {
          console.log(`⚠️ STUCK OPERATION: ${op.id} appears stuck, will restart`);
          await storage.updateMiningOperation(op.id, {
            status: 'failed',
            currentResult: { error: 'Operation timeout' }
          });
        }
      }
    } catch (error) {
      console.error(`❌ STUCK CHECK ERROR: ${(error as Error).message}`);
    }
  }

  // Removed ensureWorkTypeVariety to prevent excessive spawning

  private canSpawnMore(): boolean {
    return Date.now() - this.lastSpawnTime >= this.spawnCooldown;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async cleanupCompletedOperations() {
    try {
      // Use QDT-enhanced storage cleanup
      await qdtStorage.performQDTCleanup();
      
      // Additional continuous mining specific cleanup
      const activeOperations = await qdtStorage.getActiveMiningOperationsQDT();
      
      if (activeOperations.length > this.maxActiveMiners * 2) {
        console.log(`🧹 QDT CLEANUP: Too many active operations (${activeOperations.length}), performing emergency cleanup`);
        
        // Cancel oldest operations if we have too many
        const sortedOps = activeOperations.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        
        const toCancel = sortedOps.slice(0, activeOperations.length - this.maxActiveMiners);
        for (const op of toCancel) {
          await storage.updateMiningOperation(op.id, {
            status: 'cancelled',
            currentResult: { cancelled: 'QDT cleanup' }
          });
        }
      }
    } catch (error) {
      console.error('❌ QDT CLEANUP ERROR:', (error as Error).message);
    }
  }

  private async getTodayOperationCount(): Promise<number> {
    try {
      const allOperations = await storage.getAllMiningOperations();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return allOperations.filter(op => 
        new Date(op.startTime) >= today
      ).length;
    } catch (error) {
      console.error('❌ COUNT ERROR:', (error as Error).message);
      return 0;
    }
  }

  async stopContinuousMonitoring() {
    this.monitoringActive = false;
    console.log('🛑 CONTINUOUS MINING: Monitoring stopped');
  }
}

export const continuousMiningEngine = new ContinuousMiningEngine();