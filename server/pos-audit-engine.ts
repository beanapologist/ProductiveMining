/**
 * Proof of Stake Audit Engine
 * Audits blockchain validation activities and ensures immutable record integrity
 */

import { storage } from './storage';
import { immutableRecordsEngine } from './immutable-records-engine';
import type { 
  DiscoveryValidation, 
  MathematicalWork,
  Staker,
  ImmutableRecord 
} from '@shared/schema';

export interface PoSAuditReport {
  timestamp: string;
  totalValidations: number;
  validationsWithRecords: number;
  validationsWithoutRecords: number;
  consensusBreakdown: {
    approved: number;
    rejected: number;
    pending: number;
  };
  recordsCreated: number;
  auditResults: {
    validationId: number;
    workId: number;
    stakerId: string;
    status: string;
    hadRecord: boolean;
    recordCreated: boolean;
    workType: string;
  }[];
}

export class PoSAuditEngine {
  private static instance: PoSAuditEngine;

  public static getInstance(): PoSAuditEngine {
    if (!PoSAuditEngine.instance) {
      PoSAuditEngine.instance = new PoSAuditEngine();
    }
    return PoSAuditEngine.instance;
  }

  /**
   * Perform comprehensive PoS validation audit and create missing immutable records
   */
  async performComprehensiveAudit(): Promise<PoSAuditReport> {
    console.log('🔍 PoS AUDIT: Starting comprehensive blockchain validation audit...');
    
    // Get all existing immutable records
    const existingRecords = await storage.getRecentValidationRecords(200);
    const recordedValidationIds = new Set(
      existingRecords
        .filter(r => r.validationId)
        .map(r => r.validationId!)
    );

    // Get all stakeholders and their validations
    const allStakers = await storage.getActiveStakers();
    const allValidations: DiscoveryValidation[] = [];
    
    for (const staker of allStakers) {
      const stakerValidations = await storage.getStakerValidations(staker.id);
      allValidations.push(...stakerValidations);
    }

    // Sort validations by ID for consistent processing
    allValidations.sort((a, b) => a.id - b.id);

    console.log(`🔍 PoS AUDIT: Found ${allValidations.length} total validations`);
    console.log(`🔍 PoS AUDIT: Found ${recordedValidationIds.size} existing immutable records`);

    // Identify validations without immutable records
    const validationsWithoutRecords = allValidations.filter(
      v => !recordedValidationIds.has(v.id)
    );

    console.log(`🔍 PoS AUDIT: Found ${validationsWithoutRecords.length} validations missing immutable records`);

    // Consensus breakdown
    const consensusBreakdown = {
      approved: allValidations.filter(v => v.status === 'approved').length,
      rejected: allValidations.filter(v => v.status === 'rejected').length,
      pending: allValidations.filter(v => v.status === 'pending').length
    };

    // Create immutable records for missing validations
    const auditResults = [];
    let recordsCreated = 0;

    for (const validation of validationsWithoutRecords) {
      try {
        // Get the mathematical work and staker for this validation
        const work = await storage.getMathematicalWork(validation.workId);
        const staker = await storage.getStaker(validation.stakerId);

        if (work && staker) {
          // Create immutable record for this validation
          await immutableRecordsEngine.recordValidationActivity(validation, work, staker);
          recordsCreated++;
          
          console.log(`✅ PoS AUDIT: Created immutable record for validation ${validation.id} (${validation.status})`);
          
          auditResults.push({
            validationId: validation.id,
            workId: validation.workId,
            stakerId: staker.stakerId,
            status: validation.status,
            hadRecord: false,
            recordCreated: true,
            workType: work.workType
          });
        } else {
          console.log(`❌ PoS AUDIT: Missing work or staker data for validation ${validation.id}`);
          auditResults.push({
            validationId: validation.id,
            workId: validation.workId,
            stakerId: 'unknown',
            status: validation.status,
            hadRecord: false,
            recordCreated: false,
            workType: 'unknown'
          });
        }
      } catch (error) {
        console.error(`❌ PoS AUDIT: Failed to create record for validation ${validation.id}:`, error);
        auditResults.push({
          validationId: validation.id,
          workId: validation.workId,
          stakerId: 'error',
          status: validation.status,
          hadRecord: false,
          recordCreated: false,
          workType: 'error'
        });
      }
    }

    // Add existing validations to audit results
    for (const validation of allValidations) {
      if (recordedValidationIds.has(validation.id)) {
        const work = await storage.getMathematicalWork(validation.workId);
        const staker = await storage.getStaker(validation.stakerId);
        
        auditResults.push({
          validationId: validation.id,
          workId: validation.workId,
          stakerId: staker?.stakerId || 'unknown',
          status: validation.status,
          hadRecord: true,
          recordCreated: false,
          workType: work?.workType || 'unknown'
        });
      }
    }

    const report: PoSAuditReport = {
      timestamp: new Date().toISOString(),
      totalValidations: allValidations.length,
      validationsWithRecords: recordedValidationIds.size + recordsCreated,
      validationsWithoutRecords: validationsWithoutRecords.length - recordsCreated,
      consensusBreakdown,
      recordsCreated,
      auditResults: auditResults.sort((a, b) => a.validationId - b.validationId)
    };

    console.log(`🔍 PoS AUDIT: Audit complete!`);
    console.log(`📊 Total Validations: ${report.totalValidations}`);
    console.log(`✅ With Records: ${report.validationsWithRecords}`);
    console.log(`❌ Missing Records: ${report.validationsWithoutRecords}`);
    console.log(`🆕 Records Created: ${report.recordsCreated}`);
    console.log(`📈 Consensus: ${consensusBreakdown.approved} approved, ${consensusBreakdown.rejected} rejected, ${consensusBreakdown.pending} pending`);

    return report;
  }

  /**
   * Audit specific work for PoS consensus
   */
  async auditWorkConsensus(workId: number): Promise<{
    workId: number;
    totalValidations: number;
    consensusReached: boolean;
    finalDecision: 'approved' | 'rejected' | 'pending';
    validatorBreakdown: {
      stakerId: string;
      institutionName: string;
      status: string;
      stakeAmount: number;
      hasImmutableRecord: boolean;
    }[];
    consensusWeight: {
      approvedStake: number;
      rejectedStake: number;
      totalStake: number;
      approvalPercentage: number;
    };
  }> {
    const validations = await storage.getValidationsForWork(workId);
    const existingRecords = await storage.getRecentValidationRecords(100);
    const recordedValidationIds = new Set(
      existingRecords
        .filter(r => r.validationId)
        .map(r => r.validationId!)
    );

    let totalApprovedStake = 0;
    let totalRejectedStake = 0;
    let totalStake = 0;
    
    const validatorBreakdown = [];

    for (const validation of validations) {
      const staker = await storage.getStaker(validation.stakerId);
      if (staker) {
        totalStake += validation.stakeAmount;
        
        if (validation.status === 'approved') {
          totalApprovedStake += validation.stakeAmount;
        } else if (validation.status === 'rejected') {
          totalRejectedStake += validation.stakeAmount;
        }

        validatorBreakdown.push({
          stakerId: staker.stakerId,
          institutionName: staker.institutionName,
          status: validation.status,
          stakeAmount: validation.stakeAmount,
          hasImmutableRecord: recordedValidationIds.has(validation.id)
        });
      }
    }

    const approvalPercentage = totalStake > 0 ? (totalApprovedStake / totalStake) * 100 : 0;
    const consensusReached = approvalPercentage >= 51 || (100 - approvalPercentage) >= 51;
    
    let finalDecision: 'approved' | 'rejected' | 'pending' = 'pending';
    if (consensusReached) {
      finalDecision = approvalPercentage >= 51 ? 'approved' : 'rejected';
    }

    return {
      workId,
      totalValidations: validations.length,
      consensusReached,
      finalDecision,
      validatorBreakdown,
      consensusWeight: {
        approvedStake: totalApprovedStake,
        rejectedStake: totalRejectedStake,
        totalStake,
        approvalPercentage: Math.round(approvalPercentage * 100) / 100
      }
    };
  }

  /**
   * Create consensus decision immutable record for completed work
   */
  async recordConsensusDecision(workId: number): Promise<ImmutableRecord | null> {
    const consensusResult = await this.auditWorkConsensus(workId);
    
    if (consensusResult.consensusReached) {
      const validations = await storage.getValidationsForWork(workId);
      const validators: Staker[] = [];
      
      for (const validation of validations) {
        const staker = await storage.getStaker(validation.stakerId);
        if (staker) {
          validators.push(staker);
        }
      }

      if (validators.length > 0) {
        return await immutableRecordsEngine.recordConsensusDecision(
          workId,
          validators,
          consensusResult.finalDecision,
          validations
        );
      }
    }
    
    return null;
  }
}

export const posAuditEngine = PoSAuditEngine.getInstance();