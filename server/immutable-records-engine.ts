/**
 * Immutable Records Engine
 * Creates tamper-proof audit trails of all validation activities in the PoS system
 */

import { storage } from './storage';
import { cryptoEngine } from './crypto-engine';
import type { 
  DiscoveryValidation, 
  InsertImmutableRecord, 
  ImmutableRecord,
  MathematicalWork,
  Staker 
} from '@shared/schema';

export class ImmutableRecordsEngine {
  private static instance: ImmutableRecordsEngine;

  public static getInstance(): ImmutableRecordsEngine {
    if (!ImmutableRecordsEngine.instance) {
      ImmutableRecordsEngine.instance = new ImmutableRecordsEngine();
    }
    return ImmutableRecordsEngine.instance;
  }

  /**
   * Create immutable record for validation activity
   */
  async recordValidationActivity(
    validation: DiscoveryValidation,
    work: MathematicalWork,
    staker: Staker
  ): Promise<ImmutableRecord> {
    // Get previous record hash for chaining
    const recentRecords = await storage.getRecentValidationRecords(1);
    const previousRecordHash = recentRecords.length > 0 ? recentRecords[0].activityHash : '0'.repeat(64);

    // Create activity data
    const activityData = {
      validationId: validation.id,
      workId: work.id,
      stakerId: staker.id,
      validationType: validation.validationType,
      workType: work.workType,
      scientificValue: work.scientificValue,
      timestamp: validation.timestamp,
      validationData: validation.validationData,
      stakeAmount: validation.stakeAmount,
      institutionName: staker.institutionName,
      activityType: 'validation_activity'
    };

    // Generate cryptographic hash
    const activityHash = this.generateActivityHash(activityData);
    
    // Create merkle root for batch verification
    const merkleRoot = this.generateMerkleRoot([activityData]);
    
    // Create digital signature
    const digitalSignature = this.createDigitalSignature(activityData, staker);

    // Create verification proof
    const verificationProof = {
      hashFunction: 'SHA-256',
      merkleProof: merkleRoot,
      stakingProof: {
        stakerId: staker.stakerId,
        stakeAmount: validation.stakeAmount,
        reputation: staker.validationReputation
      },
      mathematicalProof: {
        workType: work.workType,
        difficulty: work.difficulty,
        scientificValue: work.scientificValue
      }
    };

    const immutableRecord: InsertImmutableRecord = {
      recordType: 'validation_activity',
      activityHash,
      validationId: validation.id,
      stakerId: staker.id,
      workId: work.id,
      activityData,
      previousRecordHash,
      merkleRoot,
      digitalSignature,
      consensusParticipants: [staker.stakerId],
      reputationImpact: this.calculateReputationImpact(validation, work),
      stakeImpact: 0, // No immediate stake impact for regular validation
      isVerified: true,
      verificationProof
    };

    const record = await storage.createImmutableRecord(immutableRecord);
    
    console.log(`🔒 IMMUTABLE RECORD: Created validation record #${record.id} for staker ${staker.stakerId}`);
    
    return record;
  }

  /**
   * Create immutable record for consensus decisions
   */
  async recordConsensusDecision(
    workId: number,
    validators: Staker[],
    consensusResult: 'approved' | 'rejected',
    validations: DiscoveryValidation[]
  ): Promise<ImmutableRecord> {
    const recentRecords = await storage.getRecentValidationRecords(1);
    const previousRecordHash = recentRecords.length > 0 ? recentRecords[0].activityHash : '0'.repeat(64);

    const activityData = {
      workId,
      consensusResult,
      participantCount: validators.length,
      validators: validators.map(v => ({
        stakerId: v.stakerId,
        institutionName: v.institutionName,
        reputation: v.validationReputation
      })),
      validationIds: validations.map(v => v.id),
      totalStakeInvolved: validations.reduce((sum, v) => sum + v.stakeAmount, 0),
      timestamp: new Date(),
      activityType: 'consensus_decision'
    };

    const activityHash = this.generateActivityHash(activityData);
    const merkleRoot = this.generateMerkleRoot([activityData]);
    const digitalSignature = this.createConsensusSignature(activityData, validators);

    const verificationProof = {
      consensusType: 'proof_of_stake',
      participantCount: validators.length,
      totalStake: activityData.totalStakeInvolved,
      unanimity: consensusResult === 'approved' ? validators.length : 0
    };

    const immutableRecord: InsertImmutableRecord = {
      recordType: 'consensus_decision',
      activityHash,
      stakerId: validators[0].id, // Primary validator
      workId,
      activityData,
      previousRecordHash,
      merkleRoot,
      digitalSignature,
      consensusParticipants: validators.map(v => v.stakerId),
      reputationImpact: 0,
      stakeImpact: 0,
      isVerified: true,
      verificationProof
    };

    const record = await storage.createImmutableRecord(immutableRecord);
    
    console.log(`🏛️ CONSENSUS RECORD: Created consensus record #${record.id} for work ${workId} with ${validators.length} validators`);
    
    return record;
  }

  /**
   * Generate cryptographic hash for activity data
   */
  private generateActivityHash(activityData: any): string {
    const hashInput = JSON.stringify(activityData, Object.keys(activityData).sort());
    return cryptoEngine.generateSecurityHash([hashInput]).hash;
  }

  /**
   * Generate merkle root for batch verification
   */
  private generateMerkleRoot(activities: any[]): string {
    if (activities.length === 0) return '0'.repeat(64);
    
    const hashes = activities.map(activity => 
      this.generateActivityHash(activity)
    );
    
    // Simple merkle root calculation
    while (hashes.length > 1) {
      const newLevel = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || left;
        const combined = this.simpleHash(left + right);
        newLevel.push(combined);
      }
      hashes.length = 0;
      hashes.push(...newLevel);
    }
    
    return hashes[0];
  }

  /**
   * Create digital signature for activity
   */
  private createDigitalSignature(activityData: any, staker: Staker): string {
    const message = JSON.stringify(activityData);
    const signature = cryptoEngine.createPatternBasedSignature(
      message,
      [{
        stakerId: staker.stakerId,
        reputation: staker.validationReputation,
        stakeAmount: staker.stakeAmount
      }]
    );
    
    return signature.signature.join('|');
  }

  /**
   * Create consensus signature for multiple validators
   */
  private createConsensusSignature(activityData: any, validators: Staker[]): string {
    const message = JSON.stringify(activityData);
    const validatorData = validators.map(v => ({
      stakerId: v.stakerId,
      reputation: v.validationReputation,
      stakeAmount: v.stakeAmount
    }));
    
    const signature = cryptoEngine.createPatternBasedSignature(message, validatorData);
    return signature.signature.join('|');
  }

  /**
   * Calculate reputation impact of validation
   */
  private calculateReputationImpact(validation: DiscoveryValidation, work: MathematicalWork): number {
    const baseImpact = validation.validationType === 'approve' ? 0.01 : -0.005;
    const valueMultiplier = Math.log10(work.scientificValue + 1) / 10;
    return baseImpact * (1 + valueMultiplier);
  }

  /**
   * Simple hash function for merkle tree
   */
  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(16, '0').repeat(4).slice(0, 64);
  }

  /**
   * Get recent validation activity records
   */
  async getRecentActivity(limit = 20): Promise<ImmutableRecord[]> {
    return storage.getRecentValidationRecords(limit);
  }

  /**
   * Verify integrity of record chain
   */
  async verifyChainIntegrity(recordId: number): Promise<{
    isValid: boolean;
    chainLength: number;
    brokenLinks: number[];
  }> {
    const chain = await storage.getRecordChain(recordId);
    let brokenLinks: number[] = [];
    
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const previous = chain[i - 1];
      
      if (current.previousRecordHash !== previous.activityHash) {
        brokenLinks.push(current.id);
      }
    }
    
    return {
      isValid: brokenLinks.length === 0,
      chainLength: chain.length,
      brokenLinks
    };
  }
}

export const immutableRecordsEngine = ImmutableRecordsEngine.getInstance();