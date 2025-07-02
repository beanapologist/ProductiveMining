import { pgTable, text, serial, integer, real, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const mathematicalWork = pgTable("mathematical_work", {
  id: serial("id").primaryKey(),
  workType: text("work_type").notNull(), // 'riemann_zero', 'prime_pattern', 'qdt_validation'
  difficulty: integer("difficulty").notNull(),
  result: jsonb("result").notNull(),
  verificationData: jsonb("verification_data").notNull(),
  computationalCost: integer("computational_cost").notNull(),
  energyEfficiency: real("energy_efficiency").notNull(),
  scientificValue: real("scientific_value").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  workerId: text("worker_id").notNull(),
  signature: text("signature").notNull(),
});

export const productiveBlocks = pgTable("productive_blocks", {
  id: serial("id").primaryKey(),
  index: integer("index").notNull().unique(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  previousHash: text("previous_hash").notNull(),
  merkleRoot: text("merkle_root").notNull(),
  difficulty: integer("difficulty").notNull(),
  nonce: integer("nonce").notNull(),
  blockHash: text("block_hash").notNull().unique(),
  minerId: text("miner_id").notNull(),
  totalScientificValue: real("total_scientific_value").notNull(),
  energyConsumed: real("energy_consumed").notNull(),
  knowledgeCreated: real("knowledge_created").notNull(),
});

export const blockMathematicalWork = pgTable("block_mathematical_work", {
  id: serial("id").primaryKey(),
  blockId: integer("block_id").references(() => productiveBlocks.id).notNull(),
  workId: integer("work_id").references(() => mathematicalWork.id).notNull(),
});

export const miningOperations = pgTable("mining_operations", {
  id: serial("id").primaryKey(),
  operationType: text("operation_type").notNull(),
  minerId: text("miner_id").notNull(),
  startTime: timestamp("start_time").notNull().defaultNow(),
  estimatedCompletion: timestamp("estimated_completion"),
  progress: real("progress").notNull().default(0),
  currentResult: jsonb("current_result"),
  difficulty: integer("difficulty").notNull(),
  status: text("status").notNull().default('active'), // 'active', 'completed', 'failed'
});

export const networkMetrics = pgTable("network_metrics", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  totalMiners: integer("total_miners").notNull(),
  blocksPerHour: real("blocks_per_hour").notNull(),
  energyEfficiency: real("energy_efficiency").notNull(),
  totalScientificValue: real("total_scientific_value").notNull(),
  co2Saved: real("co2_saved").notNull(),
  networkHealth: real("network_health").notNull(),
});

export const stakers = pgTable("stakers", {
  id: serial("id").primaryKey(),
  stakerId: text("staker_id").notNull().unique(),
  institutionName: text("institution_name").notNull(),
  stakeAmount: real("stake_amount").notNull(),
  validationReputation: real("validation_reputation").notNull().default(1.0),
  totalValidations: integer("total_validations").notNull().default(0),
  correctValidations: integer("correct_validations").notNull().default(0),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const discoveryValidations = pgTable("discovery_validations", {
  id: serial("id").primaryKey(),
  workId: integer("work_id").references(() => mathematicalWork.id).notNull(),
  stakerId: integer("staker_id").references(() => stakers.id).notNull(),
  validationType: text("validation_type").notNull(), // 'approve', 'reject', 'challenge'
  validationData: jsonb("validation_data").notNull(),
  stakeAmount: real("stake_amount").notNull(),
  status: text("status").notNull().default('pending'), // 'pending', 'confirmed', 'slashed'
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Insert schemas
export const insertMathematicalWorkSchema = createInsertSchema(mathematicalWork);
export const insertProductiveBlockSchema = createInsertSchema(productiveBlocks);
export const insertMiningOperationSchema = createInsertSchema(miningOperations);
export const insertNetworkMetricsSchema = createInsertSchema(networkMetrics);
export const insertStakerSchema = createInsertSchema(stakers);
export const insertDiscoveryValidationSchema = createInsertSchema(discoveryValidations);

// Types
export type MathematicalWork = typeof mathematicalWork.$inferSelect;
export type InsertMathematicalWork = z.infer<typeof insertMathematicalWorkSchema>;
export type ProductiveBlock = typeof productiveBlocks.$inferSelect;
export type InsertProductiveBlock = z.infer<typeof insertProductiveBlockSchema>;
export type MiningOperation = typeof miningOperations.$inferSelect;
export type InsertMiningOperation = z.infer<typeof insertMiningOperationSchema>;
export type NetworkMetrics = typeof networkMetrics.$inferSelect;
export type InsertNetworkMetrics = z.infer<typeof insertNetworkMetricsSchema>;
export type Staker = typeof stakers.$inferSelect;
export type InsertStaker = z.infer<typeof insertStakerSchema>;
export type DiscoveryValidation = typeof discoveryValidations.$inferSelect;
export type InsertDiscoveryValidation = z.infer<typeof insertDiscoveryValidationSchema>;

// WebSocket message types
export interface WebSocketMessage {
  type: 'metrics_update' | 'mining_progress' | 'block_mined' | 'discovery_made' | 'initial_data';
  data: any;
}

export interface MiningProgressMessage {
  operationId: number;
  progress: number;
  estimatedCompletion: string;
  currentResult?: any;
}

export interface BlockMinedMessage {
  block: ProductiveBlock;
  mathematicalWork: MathematicalWork[];
}

export interface DiscoveryMessage {
  discovery: MathematicalWork;
  scientificValue: number;
}
