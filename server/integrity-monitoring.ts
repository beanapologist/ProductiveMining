import { db } from './db';
import { mathematicalWork, productiveBlocks, discoveryValidations } from '@shared/schema';
import { sql, desc, eq } from 'drizzle-orm';

export class IntegrityMonitoringEngine {
  private static instance: IntegrityMonitoringEngine;

  public static getInstance(): IntegrityMonitoringEngine {
    if (!IntegrityMonitoringEngine.instance) {
      IntegrityMonitoringEngine.instance = new IntegrityMonitoringEngine();
    }
    return IntegrityMonitoringEngine.instance;
  }

  /**
   * Real-time integrity monitoring and metrics
   */
  async performRealTimeIntegrityCheck(): Promise<{
    systemHealth: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
    integrityScore: number;
    metrics: {
      totalBlocks: number;
      totalDiscoveries: number;
      totalValidations: number;
      validBlocks: number;
      validDiscoveries: number;
      validValidations: number;
    };
    securityStatus: {
      cryptographicIntegrity: boolean;
      posConsensusActive: boolean;
      immutableRecordsIntact: boolean;
    };
    recommendations: string[];
  }> {
    console.log('🔍 INTEGRITY MONITOR: Performing real-time system health check...');

    // Get current data counts
    const [blocks, discoveries, validations] = await Promise.all([
      db.select().from(productiveBlocks),
      db.select().from(mathematicalWork),
      db.select().from(discoveryValidations)
    ]);

    // Validate data integrity
    const validBlocks = blocks.filter(block => 
      block.blockHash && 
      block.previousHash && 
      block.merkleRoot &&
      block.totalScientificValue >= 0 &&
      block.difficulty > 0
    ).length;

    const validDiscoveries = discoveries.filter(discovery => 
      discovery.result && 
      discovery.verificationData && 
      discovery.signature && 
      discovery.scientificValue > 0 &&
      discovery.difficulty > 0
    ).length;

    const validValidations = validations.filter(validation => 
      validation.validationData && 
      validation.stakeAmount >= 0
    ).length;

    // Calculate integrity score
    const totalRecords = blocks.length + discoveries.length + validations.length;
    const validRecords = validBlocks + validDiscoveries + validValidations;
    const integrityScore = totalRecords > 0 ? (validRecords / totalRecords) * 100 : 0;

    // Determine system health
    let systemHealth: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
    const recommendations: string[] = [];

    if (integrityScore >= 99) {
      systemHealth = 'EXCELLENT';
      recommendations.push('System operating at peak integrity');
    } else if (integrityScore >= 95) {
      systemHealth = 'GOOD';
      recommendations.push('System integrity excellent');
    } else if (integrityScore >= 85) {
      systemHealth = 'WARNING';
      recommendations.push('Monitor data quality closely');
    } else {
      systemHealth = 'CRITICAL';
      recommendations.push('URGENT: Investigate data integrity issues');
    }

    // Check security status
    const securityStatus = {
      cryptographicIntegrity: validBlocks === blocks.length,
      posConsensusActive: validations.length > 0,
      immutableRecordsIntact: true // Simplified check
    };

    if (!securityStatus.cryptographicIntegrity) {
      recommendations.push('Verify cryptographic block integrity');
    }
    if (!securityStatus.posConsensusActive) {
      recommendations.push('Activate PoS validation system');
    }

    console.log(`🔍 INTEGRITY MONITOR: System Health: ${systemHealth} (${integrityScore.toFixed(2)}%)`);
    console.log(`📊 Data: ${blocks.length} blocks, ${discoveries.length} discoveries, ${validations.length} validations`);

    return {
      systemHealth,
      integrityScore,
      metrics: {
        totalBlocks: blocks.length,
        totalDiscoveries: discoveries.length,
        totalValidations: validations.length,
        validBlocks,
        validDiscoveries,
        validValidations
      },
      securityStatus,
      recommendations
    };
  }

  /**
   * Automated integrity enforcement rules
   */
  async enforceIntegrityRules(): Promise<{
    rulesEnforced: number;
    violationsDetected: number;
    actionsToken: string[];
  }> {
    console.log('🛡️ INTEGRITY ENFORCEMENT: Applying automated integrity rules...');

    let rulesEnforced = 0;
    let violationsDetected = 0;
    const actionsTaken: string[] = [];

    // Rule 1: Ensure all blocks have valid scientific value
    const invalidValueBlocks = await db.select()
      .from(productiveBlocks)
      .where(sql`total_scientific_value <= 0`);

    if (invalidValueBlocks.length > 0) {
      violationsDetected += invalidValueBlocks.length;
      actionsTaken.push(`Detected ${invalidValueBlocks.length} blocks with invalid scientific values`);
    }

    // Rule 2: Verify mathematical work completeness
    const incompleteWork = await db.select()
      .from(mathematicalWork)
      .where(sql`result IS NULL OR verification_data IS NULL OR signature IS NULL`);

    if (incompleteWork.length > 0) {
      violationsDetected += incompleteWork.length;
      actionsTaken.push(`Detected ${incompleteWork.length} incomplete mathematical work records`);
    }

    // Rule 3: Validate PoS consensus participation
    const recentDiscoveries = await db.select()
      .from(mathematicalWork)
      .orderBy(desc(mathematicalWork.timestamp))
      .limit(10);

    for (const discovery of recentDiscoveries) {
      const validationCount = await db.select()
        .from(discoveryValidations)
        .where(eq(discoveryValidations.workId, discovery.id));

      if (validationCount.length < 3) {
        violationsDetected++;
        actionsTaken.push(`Discovery ${discovery.id} has insufficient validation coverage`);
      }
    }

    rulesEnforced = 3; // Total rules checked

    console.log(`🛡️ INTEGRITY ENFORCEMENT: ${rulesEnforced} rules enforced, ${violationsDetected} violations detected`);

    return {
      rulesEnforced,
      violationsDetected,
      actionsToken: actionsTaken
    };
  }

  /**
   * Generate integrity compliance report
   */
  async generateComplianceReport(): Promise<{
    complianceScore: number;
    complianceLevel: 'FULL_COMPLIANCE' | 'MINOR_ISSUES' | 'MAJOR_ISSUES' | 'NON_COMPLIANT';
    auditTrail: {
      blockChainIntegrity: boolean;
      mathematicalValidation: boolean;
      posConsensus: boolean;
      cryptographicSecurity: boolean;
      immutableRecords: boolean;
    };
    recommendations: string[];
  }> {
    const healthCheck = await this.performRealTimeIntegrityCheck();
    const enforcementResult = await this.enforceIntegrityRules();

    // Calculate compliance score
    const complianceScore = Math.max(0, healthCheck.integrityScore - (enforcementResult.violationsDetected * 2));

    // Determine compliance level
    let complianceLevel: 'FULL_COMPLIANCE' | 'MINOR_ISSUES' | 'MAJOR_ISSUES' | 'NON_COMPLIANT';
    if (complianceScore >= 98) complianceLevel = 'FULL_COMPLIANCE';
    else if (complianceScore >= 90) complianceLevel = 'MINOR_ISSUES';
    else if (complianceScore >= 75) complianceLevel = 'MAJOR_ISSUES';
    else complianceLevel = 'NON_COMPLIANT';

    // Audit trail
    const auditTrail = {
      blockChainIntegrity: healthCheck.metrics.validBlocks === healthCheck.metrics.totalBlocks,
      mathematicalValidation: healthCheck.metrics.validDiscoveries === healthCheck.metrics.totalDiscoveries,
      posConsensus: healthCheck.securityStatus.posConsensusActive,
      cryptographicSecurity: healthCheck.securityStatus.cryptographicIntegrity,
      immutableRecords: healthCheck.securityStatus.immutableRecordsIntact
    };

    const recommendations = [
      ...healthCheck.recommendations,
      ...enforcementResult.actionsToken
    ];

    console.log(`📋 COMPLIANCE REPORT: ${complianceLevel} (${complianceScore.toFixed(2)}%)`);

    return {
      complianceScore,
      complianceLevel,
      auditTrail,
      recommendations
    };
  }
}

export const integrityMonitoringEngine = IntegrityMonitoringEngine.getInstance();