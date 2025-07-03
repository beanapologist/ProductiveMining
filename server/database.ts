/**
 * Database Library - Centralized Database Operations
 * Provides organized access to all database functions for the productive mining platform
 */

import { db } from "./db";
import { 
  mathematicalWork, 
  productiveBlocks, 
  discoveryValidations, 
  stakers, 
  immutableRecordsPool,
  type MathematicalWork,
  type ProductiveBlock,
  type DiscoveryValidation,
  type Staker,
  type ImmutableRecord,
  type InsertMathematicalWork,
  type InsertProductiveBlock,
  type InsertDiscoveryValidation,
  type InsertStaker,
  type InsertImmutableRecord
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export class DatabaseLibrary {
  private static instance: DatabaseLibrary;

  public static getInstance(): DatabaseLibrary {
    if (!DatabaseLibrary.instance) {
      DatabaseLibrary.instance = new DatabaseLibrary();
    }
    return DatabaseLibrary.instance;
  }

  // ===== MATHEMATICAL WORK OPERATIONS =====

  /**
   * Get all mathematical discoveries
   */
  async getAllDiscoveries(): Promise<MathematicalWork[]> {
    return await db.select().from(mathematicalWork).orderBy(desc(mathematicalWork.timestamp));
  }

  /**
   * Get discovery by ID
   */
  async getDiscoveryById(id: number): Promise<MathematicalWork | null> {
    const results = await db.select().from(mathematicalWork).where(eq(mathematicalWork.id, id));
    return results[0] || null;
  }

  /**
   * Create new mathematical discovery
   */
  async createDiscovery(discovery: InsertMathematicalWork): Promise<MathematicalWork> {
    const [newDiscovery] = await db.insert(mathematicalWork).values(discovery).returning();
    return newDiscovery;
  }

  // ===== PRODUCTIVE BLOCKS OPERATIONS =====

  /**
   * Get all productive blocks
   */
  async getAllBlocks(): Promise<ProductiveBlock[]> {
    return await db.select().from(productiveBlocks).orderBy(desc(productiveBlocks.index));
  }

  /**
   * Get block by ID
   */
  async getBlockById(id: number): Promise<ProductiveBlock | null> {
    const results = await db.select().from(productiveBlocks).where(eq(productiveBlocks.id, id));
    return results[0] || null;
  }

  /**
   * Create new productive block
   */
  async createBlock(block: InsertProductiveBlock): Promise<ProductiveBlock> {
    const [newBlock] = await db.insert(productiveBlocks).values(block).returning();
    return newBlock;
  }

  // ===== VALIDATION OPERATIONS =====

  /**
   * Get all validations
   */
  async getAllValidations(): Promise<DiscoveryValidation[]> {
    return await db.select().from(discoveryValidations).orderBy(desc(discoveryValidations.timestamp));
  }

  /**
   * Create new validation
   */
  async createValidation(validation: InsertDiscoveryValidation): Promise<DiscoveryValidation> {
    const [newValidation] = await db.insert(discoveryValidations).values(validation).returning();
    return newValidation;
  }

  // ===== STAKER OPERATIONS =====

  /**
   * Get all stakers
   */
  async getAllStakers(): Promise<Staker[]> {
    return await db.select().from(stakers).orderBy(desc(stakers.validationReputation));
  }

  /**
   * Get staker by staker ID
   */
  async getStakerByStakerId(stakerId: string): Promise<Staker | null> {
    const results = await db.select().from(stakers).where(eq(stakers.stakerId, stakerId));
    return results[0] || null;
  }

  /**
   * Create new staker
   */
  async createStaker(staker: InsertStaker): Promise<Staker> {
    const [newStaker] = await db.insert(stakers).values(staker).returning();
    return newStaker;
  }

  // ===== IMMUTABLE RECORDS OPERATIONS =====

  /**
   * Get all immutable records
   */
  async getAllImmutableRecords(): Promise<ImmutableRecord[]> {
    return await db.select().from(immutableRecordsPool).orderBy(desc(immutableRecordsPool.immutableSince));
  }

  /**
   * Get immutable records by type
   */
  async getImmutableRecordsByType(recordType: string): Promise<ImmutableRecord[]> {
    return await db.select()
      .from(immutableRecordsPool)
      .where(eq(immutableRecordsPool.recordType, recordType))
      .orderBy(desc(immutableRecordsPool.immutableSince));
  }

  /**
   * Create new immutable record
   */
  async createImmutableRecord(record: InsertImmutableRecord): Promise<ImmutableRecord> {
    const [newRecord] = await db.insert(immutableRecordsPool).values(record).returning();
    return newRecord;
  }

  // ===== ANALYTICS AND REPORTING =====

  /**
   * Get complete database export data
   */
  async getCompleteExportData(): Promise<{
    discoveries: MathematicalWork[];
    validations: DiscoveryValidation[];
    immutableRecords: ImmutableRecord[];
    blocks: ProductiveBlock[];
    stakers: Staker[];
    exportMetadata: {
      exportDate: string;
      totalRecords: number;
      dataIntegrity: boolean;
    };
  }> {
    const [discoveries, validations, immutableRecordsData, blocks, stakersData] = await Promise.all([
      this.getAllDiscoveries(),
      this.getAllValidations(),
      this.getAllImmutableRecords(),
      this.getAllBlocks(),
      this.getAllStakers()
    ]);

    const totalRecords = discoveries.length + validations.length + immutableRecordsData.length + blocks.length + stakersData.length;

    return {
      discoveries,
      validations,
      immutableRecords: immutableRecordsData,
      blocks,
      stakers: stakersData,
      exportMetadata: {
        exportDate: new Date().toISOString(),
        totalRecords,
        dataIntegrity: true
      }
    };
  }
}

// Export singleton instance
export const database = DatabaseLibrary.getInstance();