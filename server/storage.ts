import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  mathematicalWork,
  productiveBlocks,
  blockMathematicalWork,
  miningOperations,
  networkMetrics,
  stakers,
  discoveryValidations,
  type MathematicalWork,
  type InsertMathematicalWork,
  type ProductiveBlock,
  type InsertProductiveBlock,
  type MiningOperation,
  type InsertMiningOperation,
  type NetworkMetrics,
  type InsertNetworkMetrics,
  type Staker,
  type InsertStaker,
  type DiscoveryValidation,
  type InsertDiscoveryValidation
} from "@shared/schema";

// Storage interface
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

  // Stakers and validation
  getStaker(id: number): Promise<Staker | undefined>;
  getStakerByStakerId(stakerId: string): Promise<Staker | undefined>;
  createStaker(staker: InsertStaker): Promise<Staker>;
  getActiveStakers(): Promise<Staker[]>;
  updateStakerReputation(stakerId: number, reputation: number): Promise<Staker | undefined>;
  
  // Discovery validation
  createDiscoveryValidation(validation: InsertDiscoveryValidation): Promise<DiscoveryValidation>;
  getValidationsForWork(workId: number): Promise<DiscoveryValidation[]>;
  updateValidationStatus(validationId: number, status: string): Promise<DiscoveryValidation | undefined>;
  getStakerValidations(stakerId: number): Promise<DiscoveryValidation[]>;
}

// Clean database storage implementation - no sample data
export class DatabaseStorage implements IStorage {
  
  // Mathematical work methods
  async getMathematicalWork(id: number): Promise<MathematicalWork | undefined> {
    const [work] = await db.select().from(mathematicalWork).where(eq(mathematicalWork.id, id));
    return work || undefined;
  }

  async createMathematicalWork(work: InsertMathematicalWork): Promise<MathematicalWork> {
    const [newWork] = await db
      .insert(mathematicalWork)
      .values(work)
      .returning();
    return newWork;
  }

  async getRecentMathematicalWork(limit = 10): Promise<MathematicalWork[]> {
    return await db
      .select()
      .from(mathematicalWork)
      .orderBy(desc(mathematicalWork.timestamp))
      .limit(limit);
  }

  // Block methods
  async getBlock(id: number): Promise<ProductiveBlock | undefined> {
    const [block] = await db.select().from(productiveBlocks).where(eq(productiveBlocks.id, id));
    return block || undefined;
  }

  async getBlockByIndex(index: number): Promise<ProductiveBlock | undefined> {
    const [block] = await db.select().from(productiveBlocks).where(eq(productiveBlocks.index, index));
    return block || undefined;
  }

  async createBlock(block: InsertProductiveBlock): Promise<ProductiveBlock> {
    const [newBlock] = await db
      .insert(productiveBlocks)
      .values(block)
      .returning();
    return newBlock;
  }

  async getRecentBlocks(limit = 10): Promise<ProductiveBlock[]> {
    return await db
      .select()
      .from(productiveBlocks)
      .orderBy(desc(productiveBlocks.timestamp))
      .limit(limit);
  }

  async getBlockWithMathematicalWork(blockId: number): Promise<{ block: ProductiveBlock; work: MathematicalWork[] } | undefined> {
    const block = await this.getBlock(blockId);
    if (!block) return undefined;

    const workRelations = await db
      .select({ workId: blockMathematicalWork.workId })
      .from(blockMathematicalWork)
      .where(eq(blockMathematicalWork.blockId, blockId));

    const workIds = workRelations.map(r => r.workId);
    const work = await db
      .select()
      .from(mathematicalWork)
      .where(eq(mathematicalWork.id, workIds[0])); // Simplified for now

    return { block, work };
  }

  // Mining operation methods
  async getMiningOperation(id: number): Promise<MiningOperation | undefined> {
    const [operation] = await db.select().from(miningOperations).where(eq(miningOperations.id, id));
    return operation || undefined;
  }

  async createMiningOperation(operation: InsertMiningOperation): Promise<MiningOperation> {
    const [newOperation] = await db
      .insert(miningOperations)
      .values(operation)
      .returning();
    return newOperation;
  }

  async updateMiningOperation(id: number, updates: Partial<MiningOperation>): Promise<MiningOperation | undefined> {
    const [updatedOperation] = await db
      .update(miningOperations)
      .set(updates)
      .where(eq(miningOperations.id, id))
      .returning();
    return updatedOperation || undefined;
  }

  async getActiveMiningOperations(): Promise<MiningOperation[]> {
    return await db
      .select()
      .from(miningOperations)
      .where(eq(miningOperations.status, 'active'))
      .orderBy(desc(miningOperations.startTime));
  }

  // Network metrics methods
  async getLatestNetworkMetrics(): Promise<NetworkMetrics | undefined> {
    const [metrics] = await db
      .select()
      .from(networkMetrics)
      .orderBy(desc(networkMetrics.timestamp))
      .limit(1);
    return metrics || undefined;
  }

  async createNetworkMetrics(metrics: InsertNetworkMetrics): Promise<NetworkMetrics> {
    const [newMetrics] = await db
      .insert(networkMetrics)
      .values(metrics)
      .returning();
    return newMetrics;
  }

  async getNetworkMetricsHistory(hours: number): Promise<NetworkMetrics[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await db
      .select()
      .from(networkMetrics)
      .where(eq(networkMetrics.timestamp, cutoff)) // Simplified
      .orderBy(desc(networkMetrics.timestamp));
  }

  // Staker methods
  async getStaker(id: number): Promise<Staker | undefined> {
    const [staker] = await db.select().from(stakers).where(eq(stakers.id, id));
    return staker || undefined;
  }

  async getStakerByStakerId(stakerId: string): Promise<Staker | undefined> {
    const [staker] = await db.select().from(stakers).where(eq(stakers.stakerId, stakerId));
    return staker || undefined;
  }

  async createStaker(staker: InsertStaker): Promise<Staker> {
    const [newStaker] = await db
      .insert(stakers)
      .values(staker)
      .returning();
    return newStaker;
  }

  async getActiveStakers(): Promise<Staker[]> {
    return await db
      .select()
      .from(stakers)
      .orderBy(desc(stakers.validationReputation));
  }

  async updateStakerReputation(stakerId: number, reputation: number): Promise<Staker | undefined> {
    const [updatedStaker] = await db
      .update(stakers)
      .set({ validationReputation: reputation })
      .where(eq(stakers.id, stakerId))
      .returning();
    return updatedStaker || undefined;
  }

  // Discovery validation methods
  async createDiscoveryValidation(validation: InsertDiscoveryValidation): Promise<DiscoveryValidation> {
    const [newValidation] = await db
      .insert(discoveryValidations)
      .values(validation)
      .returning();
    return newValidation;
  }

  async getValidationsForWork(workId: number): Promise<DiscoveryValidation[]> {
    return await db
      .select()
      .from(discoveryValidations)
      .where(eq(discoveryValidations.workId, workId))
      .orderBy(desc(discoveryValidations.timestamp));
  }

  async updateValidationStatus(validationId: number, status: string): Promise<DiscoveryValidation | undefined> {
    const [updatedValidation] = await db
      .update(discoveryValidations)
      .set({ status })
      .where(eq(discoveryValidations.id, validationId))
      .returning();
    return updatedValidation || undefined;
  }

  async getStakerValidations(stakerId: number): Promise<DiscoveryValidation[]> {
    return await db
      .select()
      .from(discoveryValidations)
      .where(eq(discoveryValidations.stakerId, stakerId))
      .orderBy(desc(discoveryValidations.timestamp));
  }
}

export const storage = new DatabaseStorage();