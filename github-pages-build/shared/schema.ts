import { pgTable, text, serial, integer, real, timestamp, jsonb, boolean, varchar, decimal, bigint, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const mathematicalWork = pgTable("mathematical_work", {
  id: serial("id").primaryKey(),
  workType: text("work_type").notNull(), // 'riemann_zero', 'prime_pattern', 'qdt_validation'
  difficulty: integer("difficulty").notNull(),
  result: jsonb("result").notNull(),
  verificationData: jsonb("verification_data").notNull(),
  computationalCost: bigint("computational_cost", { mode: "number" }).notNull(),
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
  nonce: bigint("nonce", { mode: "number" }).notNull(),
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

export const immutableRecordsPool = pgTable("immutable_records_pool", {
  id: serial("id").primaryKey(),
  recordType: text("record_type").notNull(), // 'validation_activity', 'consensus_decision', 'stake_slash', 'reputation_update'
  activityHash: text("activity_hash").notNull().unique(), // Cryptographic hash of the activity
  validationId: integer("validation_id").references(() => discoveryValidations.id),
  stakerId: integer("staker_id").references(() => stakers.id).notNull(),
  workId: integer("work_id").references(() => mathematicalWork.id),
  blockId: integer("block_id").references(() => productiveBlocks.id),
  activityData: jsonb("activity_data").notNull(), // Complete immutable record of the activity
  previousRecordHash: text("previous_record_hash"), // Chain previous record for integrity
  merkleRoot: text("merkle_root").notNull(), // Merkle tree root for batch verification
  digitalSignature: text("digital_signature").notNull(), // Cryptographic signature
  consensusParticipants: jsonb("consensus_participants"), // List of validators involved
  reputationImpact: real("reputation_impact").default(0), // Impact on validator reputation
  stakeImpact: real("stake_impact").default(0), // Impact on stake amount
  isVerified: boolean("is_verified").notNull().default(false),
  verificationProof: jsonb("verification_proof"), // Mathematical proof of verification
  immutableSince: timestamp("immutable_since").notNull().defaultNow(),
  lastVerificationCheck: timestamp("last_verification_check").defaultNow(),
});

// Insert schemas
export const insertMathematicalWorkSchema = createInsertSchema(mathematicalWork);
export const insertProductiveBlockSchema = createInsertSchema(productiveBlocks);
export const insertMiningOperationSchema = createInsertSchema(miningOperations);
export const insertNetworkMetricsSchema = createInsertSchema(networkMetrics);
export const insertStakerSchema = createInsertSchema(stakers);
export const insertDiscoveryValidationSchema = createInsertSchema(discoveryValidations);
export const insertImmutableRecordSchema = createInsertSchema(immutableRecordsPool);

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
export type ImmutableRecord = typeof immutableRecordsPool.$inferSelect;
export type InsertImmutableRecord = z.infer<typeof insertImmutableRecordSchema>;

// WebSocket message types
export interface WebSocketMessage {
  type: 'metrics_update' | 'mining_progress' | 'block_mined' | 'discovery_made' | 'initial_data' | 'integrity_update' | 'security_alert' | 'mitigation_deployed' | 'complexity_scaling' | 'enhancement_cycle';
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

// ============ TOKENIZATION SYSTEM ============

// Main token for productive mining blockchain
export const productiveTokens = pgTable("productive_tokens", {
  id: serial("id").primaryKey(),
  tokenSymbol: varchar("token_symbol", { length: 10 }).notNull().default("PROD"),
  tokenName: varchar("token_name", { length: 100 }).notNull().default("Productive Mining Token"),
  totalSupply: bigint("total_supply", { mode: "number" }).notNull().default(0),
  circulatingSupply: bigint("circulating_supply", { mode: "number" }).notNull().default(0),
  currentPrice: decimal("current_price", { precision: 18, scale: 8 }).notNull().default("1.00"),
  marketCap: bigint("market_cap", { mode: "number" }).notNull().default(0),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// User token balances and wallets
export const tokenWallets = pgTable("token_wallets", {
  id: serial("id").primaryKey(),
  walletAddress: varchar("wallet_address", { length: 42 }).notNull().unique(),
  ownerType: varchar("owner_type", { length: 20 }).notNull(), // 'miner', 'validator', 'researcher', 'investor'
  ownerId: varchar("owner_id", { length: 50 }).notNull(),
  prodBalance: bigint("prod_balance", { mode: "number" }).notNull().default(0),
  stakedBalance: bigint("staked_balance", { mode: "number" }).notNull().default(0),
  governanceVotes: integer("governance_votes").notNull().default(0),
  reputationScore: decimal("reputation_score", { precision: 8, scale: 4 }).notNull().default("0.0000"),
  totalEarnings: bigint("total_earnings", { mode: "number" }).notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Discovery-based NFTs for mathematical breakthroughs
export const discoveryNFTs = pgTable("discovery_nfts", {
  id: serial("id").primaryKey(),
  tokenId: bigint("token_id", { mode: "number" }).notNull().unique(),
  workId: integer("work_id").notNull().references(() => mathematicalWork.id),
  ownerWallet: varchar("owner_wallet", { length: 42 }).notNull(),
  mintPrice: bigint("mint_price", { mode: "number" }).notNull(),
  currentValue: bigint("current_value", { mode: "number" }).notNull(),
  royaltyPercentage: decimal("royalty_percentage", { precision: 5, scale: 2 }).notNull().default("5.00"),
  metadata: jsonb("metadata").notNull(), // Contains discovery details, rarity, attributes
  isListed: boolean("is_listed").notNull().default(false),
  listingPrice: bigint("listing_price", { mode: "number" }),
  scientificRarity: varchar("scientific_rarity", { length: 20 }).notNull(), // 'common', 'rare', 'epic', 'legendary'
  mintedAt: timestamp("minted_at").notNull().defaultNow(),
});

// Validation rights tokens for PoS participation
export const validationTokens = pgTable("validation_tokens", {
  id: serial("id").primaryKey(),
  tokenId: bigint("token_id", { mode: "number" }).notNull().unique(),
  stakerId: integer("staker_id").notNull().references(() => stakers.id),
  validationPower: integer("validation_power").notNull(), // Voting weight
  stakeAmount: bigint("stake_amount", { mode: "number" }).notNull(),
  lockedUntil: timestamp("locked_until").notNull(),
  rewardsEarned: bigint("rewards_earned", { mode: "number" }).notNull().default(0),
  validationsCompleted: integer("validations_completed").notNull().default(0),
  consensusAccuracy: decimal("consensus_accuracy", { precision: 5, scale: 2 }).notNull().default("0.00"),
  institutionBond: bigint("institution_bond", { mode: "number" }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'active', 'locked', 'slashed'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Trading and liquidity pools
export const tokenTransactions = pgTable("token_transactions", {
  id: serial("id").primaryKey(),
  transactionHash: varchar("transaction_hash", { length: 66 }).notNull().unique(),
  fromWallet: varchar("from_wallet", { length: 42 }),
  toWallet: varchar("to_wallet", { length: 42 }).notNull(),
  tokenType: varchar("token_type", { length: 20 }).notNull(), // 'PROD', 'NFT', 'VALIDATION'
  tokenId: bigint("token_id", { mode: "number" }),
  amount: bigint("amount", { mode: "number" }).notNull(),
  transactionType: varchar("transaction_type", { length: 20 }).notNull(), // 'mint', 'transfer', 'stake', 'reward'
  gasFee: bigint("gas_fee", { mode: "number" }).notNull().default(0),
  blockNumber: integer("block_number"),
  scientificValue: bigint("scientific_value", { mode: "number" }).default(0),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Governance proposals for protocol changes
export const governanceProposals = pgTable("governance_proposals", {
  id: serial("id").primaryKey(),
  proposalId: bigint("proposal_id", { mode: "number" }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  proposer: varchar("proposer", { length: 42 }).notNull(),
  proposalType: varchar("proposal_type", { length: 30 }).notNull(), // 'protocol_upgrade', 'reward_adjustment', 'validation_rules'
  votingPowerRequired: bigint("voting_power_required", { mode: "number" }).notNull(),
  votesFor: bigint("votes_for", { mode: "number" }).notNull().default(0),
  votesAgainst: bigint("votes_against", { mode: "number" }).notNull().default(0),
  votesAbstain: bigint("votes_abstain", { mode: "number" }).notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'active', 'passed', 'rejected', 'executed'
  votingStartsAt: timestamp("voting_starts_at").notNull(),
  votingEndsAt: timestamp("voting_ends_at").notNull(),
  executionDate: timestamp("execution_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Staking pools and yield farming
export const stakingPools = pgTable("staking_pools", {
  id: serial("id").primaryKey(),
  poolName: varchar("pool_name", { length: 100 }).notNull(),
  poolType: varchar("pool_type", { length: 30 }).notNull(), // 'discovery_mining', 'validation_staking', 'liquidity_provision'
  tokenPair: varchar("token_pair", { length: 20 }).notNull(), // 'PROD-ETH', 'PROD-USDC', 'VALIDATION-PROD'
  totalStaked: bigint("total_staked", { mode: "number" }).notNull().default(0),
  rewardRate: decimal("reward_rate", { precision: 8, scale: 4 }).notNull(), // APY percentage
  poolRewards: bigint("pool_rewards", { mode: "number" }).notNull().default(0),
  minStakeAmount: bigint("min_stake_amount", { mode: "number" }).notNull(),
  lockupPeriod: integer("lockup_period").notNull(), // Days
  isActive: boolean("is_active").notNull().default(true),
  scientificMultiplier: decimal("scientific_multiplier", { precision: 4, scale: 2 }).notNull().default("1.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Market data and price history
export const tokenMarketData = pgTable("token_market_data", {
  id: serial("id").primaryKey(),
  tokenSymbol: varchar("token_symbol", { length: 10 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  volume24h: bigint("volume_24h", { mode: "number" }).notNull().default(0),
  marketCap: bigint("market_cap", { mode: "number" }).notNull(),
  priceChange24h: decimal("price_change_24h", { precision: 8, scale: 4 }).notNull(),
  scientificValueBacked: bigint("scientific_value_backed", { mode: "number" }).notNull().default(0),
  activeMiners: integer("active_miners").notNull().default(0),
  activeValidators: integer("active_validators").notNull().default(0),
  dailyDiscoveries: integer("daily_discoveries").notNull().default(0),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertProductiveTokenSchema = createInsertSchema(productiveTokens);
export const insertTokenWalletSchema = createInsertSchema(tokenWallets);
export const insertDiscoveryNFTSchema = createInsertSchema(discoveryNFTs);
export const insertValidationTokenSchema = createInsertSchema(validationTokens);
export const insertTokenTransactionSchema = createInsertSchema(tokenTransactions);
export const insertGovernanceProposalSchema = createInsertSchema(governanceProposals);
export const insertStakingPoolSchema = createInsertSchema(stakingPools);
export const insertTokenMarketDataSchema = createInsertSchema(tokenMarketData);

export type ProductiveToken = typeof productiveTokens.$inferSelect;
export type InsertProductiveToken = z.infer<typeof insertProductiveTokenSchema>;
export type TokenWallet = typeof tokenWallets.$inferSelect;
export type InsertTokenWallet = z.infer<typeof insertTokenWalletSchema>;
export type DiscoveryNFT = typeof discoveryNFTs.$inferSelect;
export type InsertDiscoveryNFT = z.infer<typeof insertDiscoveryNFTSchema>;
export type ValidationToken = typeof validationTokens.$inferSelect;
export type InsertValidationToken = z.infer<typeof insertValidationTokenSchema>;
export type TokenTransaction = typeof tokenTransactions.$inferSelect;
export type InsertTokenTransaction = z.infer<typeof insertTokenTransactionSchema>;
export type GovernanceProposal = typeof governanceProposals.$inferSelect;
export type InsertGovernanceProposal = z.infer<typeof insertGovernanceProposalSchema>;
export type StakingPool = typeof stakingPools.$inferSelect;
export type InsertStakingPool = z.infer<typeof insertStakingPoolSchema>;
export type TokenMarketData = typeof tokenMarketData.$inferSelect;
export type InsertTokenMarketData = z.infer<typeof insertTokenMarketDataSchema>;

// ============ INSTITUTIONAL VALIDATION PIPELINE ============

// Institutional Validators - Academic and research institutions
export const institutionalValidators = pgTable('institutional_validators', {
  id: serial('id').primaryKey(),
  institutionName: varchar('institution_name', { length: 255 }).notNull(),
  institutionType: varchar('institution_type', { length: 100 }).notNull(), // 'university', 'research_institute', 'government_lab'
  country: varchar('country', { length: 100 }).notNull(),
  specialization: text('specialization').array().notNull(), // Areas of mathematical expertise
  accreditation: varchar('accreditation', { length: 255 }).notNull(),
  contactInfo: jsonb('contact_info').notNull(),
  validatorPublicKey: varchar('validator_public_key', { length: 512 }).notNull().unique(),
  reputation: decimal('reputation', { precision: 10, scale: 4 }).default('100.0000'),
  totalValidations: integer('total_validations').default(0),
  successfulValidations: integer('successful_validations').default(0),
  isActive: boolean('is_active').default(true),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  lastValidation: timestamp('last_validation'),
});

// Individual validation records from institutions
export const institutionalValidations = pgTable('institutional_validations', {
  id: serial('id').primaryKey(),
  workId: integer('work_id').references(() => mathematicalWork.id).notNull(),
  validatorId: integer('validator_id').references(() => institutionalValidators.id).notNull(),
  validationType: varchar('validation_type', { length: 50 }).notNull(), // 'peer_review', 'computational_verification', 'theoretical_analysis'
  validationStatus: varchar('validation_status', { length: 30 }).notNull(), // 'submitted', 'under_review', 'approved', 'rejected', 'requires_revision'
  validationScore: decimal('validation_score', { precision: 5, scale: 2 }), // 0-100 confidence score
  reviewData: jsonb('review_data').notNull(),
  peerReviewers: text('peer_reviewers').array(), // List of expert reviewers
  validationEvidence: jsonb('validation_evidence'), // Supporting mathematical proofs/computations
  digitalSignature: varchar('digital_signature', { length: 512 }).notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at'),
  comments: text('comments'),
  revisionRequests: jsonb('revision_requests'),
});

// Pipeline tracking for multi-stage validation
export const validationPipeline = pgTable('validation_pipeline', {
  id: serial('id').primaryKey(),
  workId: integer('work_id').references(() => mathematicalWork.id).notNull(),
  pipelineStage: varchar('pipeline_stage', { length: 50 }).notNull(), // 'initial_submission', 'institutional_review', 'peer_consensus', 'final_certification'
  currentValidators: integer('current_validators').array().notNull(),
  requiredValidations: integer('required_validations').default(3),
  completedValidations: integer('completed_validations').default(0),
  approvalRate: decimal('approval_rate', { precision: 5, scale: 2 }).default('0.00'),
  pipelineStatus: varchar('pipeline_status', { length: 30 }).default('active'), // 'active', 'completed', 'rejected', 'stalled'
  priority: varchar('priority', { length: 20 }).default('normal'), // 'low', 'normal', 'high', 'critical'
  estimatedCompletion: timestamp('estimated_completion'),
  actualCompletion: timestamp('actual_completion'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActivity: timestamp('last_activity').defaultNow(),
});

// Final certification records
export const certificationRecords = pgTable('certification_records', {
  id: serial('id').primaryKey(),
  workId: integer('work_id').references(() => mathematicalWork.id).notNull(),
  certificationLevel: varchar('certification_level', { length: 30 }).notNull(), // 'preliminary', 'verified', 'certified', 'landmark'
  certifyingInstitutions: integer('certifying_institutions').array().notNull(),
  consensusScore: decimal('consensus_score', { precision: 5, scale: 2 }).notNull(),
  certificateHash: varchar('certificate_hash', { length: 64 }).notNull().unique(),
  mathematicalSignificance: varchar('mathematical_significance', { length: 100 }), // 'breakthrough', 'advancement', 'incremental', 'foundational'
  blockchainRecord: varchar('blockchain_record', { length: 64 }), // Reference to immutable blockchain record
  validityPeriod: integer('validity_period').default(31536000), // Seconds (default 1 year)
  certifiedAt: timestamp('certified_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  revoked: boolean('revoked').default(false),
  revocationReason: text('revocation_reason'),
});

// Insert schemas for institutional validation
export const insertInstitutionalValidatorSchema = createInsertSchema(institutionalValidators);
export const insertInstitutionalValidationSchema = createInsertSchema(institutionalValidations);
export const insertValidationPipelineSchema = createInsertSchema(validationPipeline);
export const insertCertificationRecordSchema = createInsertSchema(certificationRecords);

// Types for institutional validation
export type InstitutionalValidator = typeof institutionalValidators.$inferSelect;
export type InsertInstitutionalValidator = z.infer<typeof insertInstitutionalValidatorSchema>;
export type InstitutionalValidation = typeof institutionalValidations.$inferSelect;
export type InsertInstitutionalValidation = z.infer<typeof insertInstitutionalValidationSchema>;
export type ValidationPipeline = typeof validationPipeline.$inferSelect;
export type InsertValidationPipeline = z.infer<typeof insertValidationPipelineSchema>;
export type CertificationRecord = typeof certificationRecords.$inferSelect;
export type InsertCertificationRecord = z.infer<typeof insertCertificationRecordSchema>;
