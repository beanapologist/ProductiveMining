import { 
  mathematicalWork, 
  productiveBlocks, 
  blockMathematicalWork, 
  miningOperations, 
  networkMetrics,
  type MathematicalWork, 
  type ProductiveBlock, 
  type MiningOperation, 
  type NetworkMetrics,
  type InsertMathematicalWork,
  type InsertProductiveBlock,
  type InsertMiningOperation,
  type InsertNetworkMetrics
} from "@shared/schema";

export interface IStorage {
  // Mathematical work
  getMathematicalWork(id: number): Promise<MathematicalWork | undefined>;
  createMathematicalWork(work: InsertMathematicalWork): Promise<MathematicalWork>;
  getRecentMathematicalWork(limit?: number): Promise<MathematicalWork[]>;

  // Blocks
  getBlock(id: number): Promise<ProductiveBlock | undefined>;
  getBlockByIndex(index: number): Promise<ProductiveBlock | undefined>;
  createBlock(block: InsertProductiveBlock): Promise<ProductiveBlock>;
  getRecentBlocks(limit?: number): Promise<ProductiveBlock[]>;
  getBlockWithMathematicalWork(blockId: number): Promise<{ block: ProductiveBlock; work: MathematicalWork[] } | undefined>;

  // Mining operations
  getMiningOperation(id: number): Promise<MiningOperation | undefined>;
  createMiningOperation(operation: InsertMiningOperation): Promise<MiningOperation>;
  updateMiningOperation(id: number, updates: Partial<MiningOperation>): Promise<MiningOperation | undefined>;
  getActiveMiningOperations(): Promise<MiningOperation[]>;

  // Network metrics
  getLatestNetworkMetrics(): Promise<NetworkMetrics | undefined>;
  createNetworkMetrics(metrics: InsertNetworkMetrics): Promise<NetworkMetrics>;
  getNetworkMetricsHistory(hours: number): Promise<NetworkMetrics[]>;
}

export class MemStorage implements IStorage {
  private mathematicalWorkStore: Map<number, MathematicalWork>;
  private blocksStore: Map<number, ProductiveBlock>;
  private blockWorkRelations: Map<number, number[]>; // blockId -> workIds
  private miningOperationsStore: Map<number, MiningOperation>;
  private networkMetricsStore: Map<number, NetworkMetrics>;
  private currentId: number;

  constructor() {
    this.mathematicalWorkStore = new Map();
    this.blocksStore = new Map();
    this.blockWorkRelations = new Map();
    this.miningOperationsStore = new Map();
    this.networkMetricsStore = new Map();
    this.currentId = 1;

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create some sample mathematical work
    const sampleWork1: MathematicalWork = {
      id: this.currentId++,
      workType: 'riemann_zero',
      difficulty: 8,
      result: { zeroIndex: 2847, zeroValue: { real: 0.5, imag: 14.1347251417 }, precision: 1e-15 },
      verificationData: { verified: true, institutionId: 'mit.edu' },
      computationalCost: 8000,
      energyEfficiency: 1247.5,
      scientificValue: 4200.0,
      timestamp: new Date(),
      workerId: 'research.mit.edu',
      signature: 'a7b2c8f9e1d3a5c6b8e0f2a4c7d9e1b3f5a8c2e4d7b9f1a3c5e8b0d2f4a6c9e'
    };

    const sampleWork2: MathematicalWork = {
      id: this.currentId++,
      workType: 'prime_pattern',
      difficulty: 12,
      result: { patternType: 'twin', primes: [10007, 10009], gap: 2 },
      verificationData: { verified: true, patternsFound: 73 },
      computationalCost: 12000,
      energyEfficiency: 891.3,
      scientificValue: 3650.0,
      timestamp: new Date(),
      workerId: 'stanford.quantum.lab',
      signature: 'b8c3d9f0e2d4a6c7b9e1f3a5c8d0e2b4f6a9c3e5d8b0f2a4c7e9b1d3f5a8c2e'
    };

    const sampleWork3: MathematicalWork = {
      id: this.currentId++,
      workType: 'qdt_validation',
      difficulty: 15,
      result: { validationType: 'energy_conservation', error: 2.3e-12, score: 0.999997 },
      verificationData: { verified: true, constraints: ['energy', 'coupling', 'balance'] },
      computationalCost: 15000,
      energyEfficiency: 762.1,
      scientificValue: 4997.0,
      timestamp: new Date(),
      workerId: 'cern.theory.division',
      signature: 'c9d4e0f1e3d5a7c8b0e2f4a6c9d1e3b5f7a0c4e6d9b1f3a5c8e0b2d4f6a9c3e'
    };

    this.mathematicalWorkStore.set(sampleWork1.id, sampleWork1);
    this.mathematicalWorkStore.set(sampleWork2.id, sampleWork2);
    this.mathematicalWorkStore.set(sampleWork3.id, sampleWork3);

    // Create sample block
    const sampleBlock: ProductiveBlock = {
      id: this.currentId++,
      index: 847392,
      timestamp: new Date(),
      previousHash: '0000000000000000000847a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      merkleRoot: '8e3f1a5c9b2d4f7a0c6e9b1d3f5a8c2e4d7b9f1a3c5e8b0d2f4a6c9e1b3f5a8c',
      difficulty: 12,
      nonce: 2847392,
      blockHash: '4a7b2c8f9e1d3a5c6b8e0f2a4c7d9e1b3f5a8c2e4d7b9f1a3c5e8b0d2f4a6c9e',
      minerId: 'mit.quantum.lab',
      totalScientificValue: 12847.0,
      energyConsumed: 0.23,
      knowledgeCreated: 1.0
    };

    this.blocksStore.set(sampleBlock.id, sampleBlock);
    this.blockWorkRelations.set(sampleBlock.id, [sampleWork1.id, sampleWork2.id, sampleWork3.id]);

    // Create sample mining operations
    const activeOperation1: MiningOperation = {
      id: this.currentId++,
      operationType: 'riemann_zero',
      minerId: 'research.mit.edu',
      startTime: new Date(Date.now() - 300000), // 5 minutes ago
      estimatedCompletion: new Date(Date.now() + 180000), // 3 minutes from now
      progress: 0.87,
      currentResult: { zeroIndex: 2848, currentPrecision: 1e-12 },
      difficulty: 8,
      status: 'active'
    };

    const activeOperation2: MiningOperation = {
      id: this.currentId++,
      operationType: 'prime_pattern',
      minerId: 'stanford.quantum.lab',
      startTime: new Date(Date.now() - 600000), // 10 minutes ago
      estimatedCompletion: new Date(Date.now() + 720000), // 12 minutes from now
      progress: 0.23,
      currentResult: { patternType: 'twin', searchRange: [1000000, 10000000] },
      difficulty: 12,
      status: 'active'
    };

    const activeOperation3: MiningOperation = {
      id: this.currentId++,
      operationType: 'qdt_validation',
      minerId: 'cern.theory.division',
      startTime: new Date(Date.now() - 120000), // 2 minutes ago
      estimatedCompletion: new Date(Date.now() + 60000), // 1 minute from now
      progress: 0.95,
      currentResult: { validationType: 'coupling_constraints', currentError: 1.8e-13 },
      difficulty: 15,
      status: 'active'
    };

    this.miningOperationsStore.set(activeOperation1.id, activeOperation1);
    this.miningOperationsStore.set(activeOperation2.id, activeOperation2);
    this.miningOperationsStore.set(activeOperation3.id, activeOperation3);

    // Create sample network metrics
    const currentMetrics: NetworkMetrics = {
      id: this.currentId++,
      timestamp: new Date(),
      totalMiners: 12853,
      blocksPerHour: 847,
      energyEfficiency: 1247.0,
      totalScientificValue: 2400000.0,
      co2Saved: 847.0,
      networkHealth: 0.998
    };

    this.networkMetricsStore.set(currentMetrics.id, currentMetrics);
  }

  async getMathematicalWork(id: number): Promise<MathematicalWork | undefined> {
    return this.mathematicalWorkStore.get(id);
  }

  async createMathematicalWork(work: InsertMathematicalWork): Promise<MathematicalWork> {
    const id = this.currentId++;
    const newWork: MathematicalWork = { ...work, id, timestamp: new Date() };
    this.mathematicalWorkStore.set(id, newWork);
    return newWork;
  }

  async getRecentMathematicalWork(limit = 10): Promise<MathematicalWork[]> {
    return Array.from(this.mathematicalWorkStore.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getBlock(id: number): Promise<ProductiveBlock | undefined> {
    return this.blocksStore.get(id);
  }

  async getBlockByIndex(index: number): Promise<ProductiveBlock | undefined> {
    return Array.from(this.blocksStore.values()).find(block => block.index === index);
  }

  async createBlock(block: InsertProductiveBlock): Promise<ProductiveBlock> {
    const id = this.currentId++;
    const newBlock: ProductiveBlock = { ...block, id, timestamp: new Date() };
    this.blocksStore.set(id, newBlock);
    return newBlock;
  }

  async getRecentBlocks(limit = 10): Promise<ProductiveBlock[]> {
    return Array.from(this.blocksStore.values())
      .sort((a, b) => b.index - a.index)
      .slice(0, limit);
  }

  async getBlockWithMathematicalWork(blockId: number): Promise<{ block: ProductiveBlock; work: MathematicalWork[] } | undefined> {
    const block = this.blocksStore.get(blockId);
    if (!block) return undefined;

    const workIds = this.blockWorkRelations.get(blockId) || [];
    const work = workIds.map(id => this.mathematicalWorkStore.get(id)).filter(Boolean) as MathematicalWork[];

    return { block, work };
  }

  async getMiningOperation(id: number): Promise<MiningOperation | undefined> {
    return this.miningOperationsStore.get(id);
  }

  async createMiningOperation(operation: InsertMiningOperation): Promise<MiningOperation> {
    const id = this.currentId++;
    const newOperation: MiningOperation = { ...operation, id, startTime: new Date() };
    this.miningOperationsStore.set(id, newOperation);
    return newOperation;
  }

  async updateMiningOperation(id: number, updates: Partial<MiningOperation>): Promise<MiningOperation | undefined> {
    const operation = this.miningOperationsStore.get(id);
    if (!operation) return undefined;

    const updatedOperation = { ...operation, ...updates };
    this.miningOperationsStore.set(id, updatedOperation);
    return updatedOperation;
  }

  async getActiveMiningOperations(): Promise<MiningOperation[]> {
    return Array.from(this.miningOperationsStore.values())
      .filter(op => op.status === 'active')
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  async getLatestNetworkMetrics(): Promise<NetworkMetrics | undefined> {
    const metrics = Array.from(this.networkMetricsStore.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return metrics[0];
  }

  async createNetworkMetrics(metrics: InsertNetworkMetrics): Promise<NetworkMetrics> {
    const id = this.currentId++;
    const newMetrics: NetworkMetrics = { ...metrics, id, timestamp: new Date() };
    this.networkMetricsStore.set(id, newMetrics);
    return newMetrics;
  }

  async getNetworkMetricsHistory(hours: number): Promise<NetworkMetrics[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.networkMetricsStore.values())
      .filter(metrics => metrics.timestamp >= cutoff)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
