import { db } from './db';
import { mathematicalWork, discoveryValidations, productiveBlocks } from '@shared/schema';
import { eq, desc, count, sql, and, gte, lte } from 'drizzle-orm';

export interface DiscoveryAuditResult {
  discoveryId: number;
  workType: string;
  securityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  auditFlags: string[];
  validationMetrics: {
    totalValidations: number;
    approvalRate: number;
    consensusStrength: number;
    validatorDiversity: number;
  };
  mathematicalIntegrity: {
    formulaValidation: boolean;
    computationVerification: boolean;
    cryptographicSignature: boolean;
    independentVerification: boolean;
  };
  recommendations: string[];
}

export class DiscoveryAuditEngine {
  private static instance: DiscoveryAuditEngine;

  public static getInstance(): DiscoveryAuditEngine {
    if (!DiscoveryAuditEngine.instance) {
      DiscoveryAuditEngine.instance = new DiscoveryAuditEngine();
    }
    return DiscoveryAuditEngine.instance;
  }

  /**
   * Comprehensive audit of all mathematical discoveries
   */
  async auditAllDiscoveries(): Promise<{
    totalDiscoveries: number;
    auditedDiscoveries: number;
    securityDistribution: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
    overallSecurityScore: number;
    flaggedDiscoveries: DiscoveryAuditResult[];
    recommendations: string[];
  }> {
    console.log('🔍 DISCOVERY AUDIT: Starting comprehensive security audit...');

    // Get all discoveries
    const discoveries = await db.select()
      .from(mathematicalWork)
      .orderBy(desc(mathematicalWork.timestamp));

    const auditResults: DiscoveryAuditResult[] = [];
    let totalSecurityScore = 0;
    const securityDistribution = { low: 0, medium: 0, high: 0, critical: 0 };

    // Audit each discovery
    for (const discovery of discoveries) {
      const auditResult = await this.auditSingleDiscovery(discovery.id);
      auditResults.push(auditResult);
      totalSecurityScore += auditResult.securityScore;

      // Count by risk level
      switch (auditResult.riskLevel) {
        case 'LOW': securityDistribution.low++; break;
        case 'MEDIUM': securityDistribution.medium++; break;
        case 'HIGH': securityDistribution.high++; break;
        case 'CRITICAL': securityDistribution.critical++; break;
      }
    }

    // Calculate overall security score
    const overallSecurityScore = discoveries.length > 0 ? totalSecurityScore / discoveries.length : 0;

    // Get flagged discoveries (medium risk and above)
    const flaggedDiscoveries = auditResults.filter(result => 
      result.riskLevel === 'MEDIUM' || result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL'
    );

    // Generate overall recommendations
    const recommendations = this.generateOverallRecommendations(auditResults, overallSecurityScore);

    console.log(`🔍 DISCOVERY AUDIT: Completed audit of ${discoveries.length} discoveries`);
    console.log(`📊 Overall Security Score: ${overallSecurityScore.toFixed(2)}/100`);
    console.log(`🚨 Flagged Discoveries: ${flaggedDiscoveries.length}`);

    return {
      totalDiscoveries: discoveries.length,
      auditedDiscoveries: auditResults.length,
      securityDistribution,
      overallSecurityScore,
      flaggedDiscoveries,
      recommendations
    };
  }

  /**
   * Audit a single discovery for security vulnerabilities
   */
  async auditSingleDiscovery(discoveryId: number): Promise<DiscoveryAuditResult> {
    // Get discovery data
    const [discovery] = await db.select()
      .from(mathematicalWork)
      .where(eq(mathematicalWork.id, discoveryId));

    if (!discovery) {
      throw new Error(`Discovery ${discoveryId} not found`);
    }

    // Get validation data
    const validations = await db.select()
      .from(discoveryValidations)
      .where(eq(discoveryValidations.workId, discoveryId));

    // Calculate validation metrics
    const validationMetrics = this.calculateValidationMetrics(validations);

    // Check mathematical integrity
    const mathematicalIntegrity = this.checkMathematicalIntegrity(discovery);

    // Calculate security score and detect risks
    const { securityScore, riskLevel, auditFlags } = this.calculateSecurityScore(
      discovery,
      validationMetrics,
      mathematicalIntegrity
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(auditFlags, riskLevel);

    return {
      discoveryId,
      workType: discovery.workType,
      securityScore,
      riskLevel,
      auditFlags,
      validationMetrics,
      mathematicalIntegrity,
      recommendations
    };
  }

  /**
   * Calculate validation metrics for consensus analysis
   */
  private calculateValidationMetrics(validations: any[]): {
    totalValidations: number;
    approvalRate: number;
    consensusStrength: number;
    validatorDiversity: number;
  } {
    const totalValidations = validations.length;
    
    if (totalValidations === 0) {
      return {
        totalValidations: 0,
        approvalRate: 0,
        consensusStrength: 0,
        validatorDiversity: 0
      };
    }

    // Calculate approval rate
    const approvedValidations = validations.filter(v => v.decision === 'approved').length;
    const approvalRate = (approvedValidations / totalValidations) * 100;

    // Calculate consensus strength (based on validation count and consistency)
    const consensusStrength = Math.min(100, (totalValidations * 10) + (approvalRate > 50 ? 20 : 0));

    // Calculate validator diversity (unique validator IDs)
    const uniqueValidators = new Set(validations.map(v => v.stakerId)).size;
    const validatorDiversity = Math.min(100, (uniqueValidators / Math.max(1, totalValidations)) * 100);

    return {
      totalValidations,
      approvalRate,
      consensusStrength,
      validatorDiversity
    };
  }

  /**
   * Check mathematical integrity of discovery
   */
  private checkMathematicalIntegrity(discovery: any): {
    formulaValidation: boolean;
    computationVerification: boolean;
    cryptographicSignature: boolean;
    independentVerification: boolean;
  } {
    // Parse verification data
    let verificationData;
    try {
      verificationData = typeof discovery.verificationData === 'string' 
        ? JSON.parse(discovery.verificationData) 
        : discovery.verificationData;
    } catch {
      verificationData = {};
    }

    return {
      formulaValidation: this.validateFormula(discovery.workType, discovery.result),
      computationVerification: verificationData?.verified === true,
      cryptographicSignature: Boolean(discovery.signature && discovery.signature.length > 10),
      independentVerification: verificationData?.independentVerification === true
    };
  }

  /**
   * Validate mathematical formulas based on work type
   */
  private validateFormula(workType: string, result: string): boolean {
    try {
      const resultData = typeof result === 'string' ? JSON.parse(result) : result;
      
      switch (workType) {
        case 'riemann_zero':
          return resultData?.zeroValue?.real !== undefined && 
                 resultData?.zeroValue?.imaginary !== undefined &&
                 Math.abs(resultData.zeroValue.real - 0.5) < 0.1; // Critical line check

        case 'prime_pattern':
          return resultData?.primes?.length > 0 &&
                 Array.isArray(resultData.primes) &&
                 resultData.pattern?.type;

        case 'yang_mills':
          return resultData?.gaugeFactor !== undefined &&
                 resultData?.fieldStrength !== undefined &&
                 resultData.gaugeFactor > 0;

        case 'navier_stokes':
          return resultData?.velocity !== undefined &&
                 resultData?.pressure !== undefined &&
                 resultData?.continuity !== undefined;

        case 'goldbach_verification':
          return resultData?.evenNumber > 2 &&
                 resultData?.primeSum?.length === 2 &&
                 resultData.verified === true;

        default:
          return resultData !== null && typeof resultData === 'object';
      }
    } catch {
      return false;
    }
  }

  /**
   * Calculate comprehensive security score
   */
  private calculateSecurityScore(
    discovery: any,
    validationMetrics: any,
    mathematicalIntegrity: any
  ): {
    securityScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    auditFlags: string[];
  } {
    let score = 0;
    const auditFlags: string[] = [];

    // Mathematical integrity (40 points)
    const integrityScore = Object.values(mathematicalIntegrity).filter(Boolean).length * 10;
    score += integrityScore;

    if (!mathematicalIntegrity.formulaValidation) {
      auditFlags.push('Invalid mathematical formula detected');
    }
    if (!mathematicalIntegrity.cryptographicSignature) {
      auditFlags.push('Weak or missing cryptographic signature');
    }

    // Validation consensus (30 points)
    const consensusScore = Math.min(30, validationMetrics.consensusStrength * 0.3);
    score += consensusScore;

    if (validationMetrics.totalValidations < 3) {
      auditFlags.push('Insufficient validation coverage');
    }
    if (validationMetrics.approvalRate < 50) {
      auditFlags.push('Low consensus approval rate');
    }

    // Scientific value validation (20 points)
    const scientificValue = discovery.scientificValue || 0;
    const valueScore = Math.min(20, Math.log10(Math.max(1, scientificValue)) * 2);
    score += valueScore;

    if (scientificValue < 1000) {
      auditFlags.push('Unusually low scientific value');
    }

    // Difficulty and effort validation (10 points)
    const difficultyScore = Math.min(10, discovery.difficulty * 0.2);
    score += difficultyScore;

    if (discovery.difficulty < 10) {
      auditFlags.push('Low computational difficulty');
    }

    // Determine risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (score >= 85) riskLevel = 'LOW';
    else if (score >= 70) riskLevel = 'MEDIUM';
    else if (score >= 50) riskLevel = 'HIGH';
    else riskLevel = 'CRITICAL';

    return { securityScore: score, riskLevel, auditFlags };
  }

  /**
   * Generate security recommendations
   */
  private generateRecommendations(auditFlags: string[], riskLevel: string): string[] {
    const recommendations: string[] = [];

    if (auditFlags.includes('Invalid mathematical formula detected')) {
      recommendations.push('Require independent mathematical verification');
    }
    if (auditFlags.includes('Weak or missing cryptographic signature')) {
      recommendations.push('Implement stronger cryptographic signing');
    }
    if (auditFlags.includes('Insufficient validation coverage')) {
      recommendations.push('Increase minimum validator requirements');
    }
    if (auditFlags.includes('Low consensus approval rate')) {
      recommendations.push('Review validation criteria and processes');
    }

    if (riskLevel === 'CRITICAL') {
      recommendations.push('URGENT: Quarantine discovery pending security review');
    } else if (riskLevel === 'HIGH') {
      recommendations.push('Enhanced monitoring and validation required');
    }

    return recommendations;
  }

  /**
   * Generate overall system recommendations
   */
  private generateOverallRecommendations(auditResults: DiscoveryAuditResult[], overallScore: number): string[] {
    const recommendations: string[] = [];

    const criticalCount = auditResults.filter(r => r.riskLevel === 'CRITICAL').length;
    const highRiskCount = auditResults.filter(r => r.riskLevel === 'HIGH').length;

    if (overallScore < 70) {
      recommendations.push('System-wide security enhancement required');
    }
    if (criticalCount > 0) {
      recommendations.push(`${criticalCount} critical security issues require immediate attention`);
    }
    if (highRiskCount > auditResults.length * 0.1) {
      recommendations.push('High percentage of high-risk discoveries detected');
    }

    // Check for common patterns
    const commonFlags = this.findCommonAuditFlags(auditResults);
    if (commonFlags.length > 0) {
      recommendations.push(`Common issues found: ${commonFlags.join(', ')}`);
    }

    return recommendations;
  }

  /**
   * Find common audit flags across discoveries
   */
  private findCommonAuditFlags(auditResults: DiscoveryAuditResult[]): string[] {
    const flagCounts: { [key: string]: number } = {};
    
    auditResults.forEach(result => {
      result.auditFlags.forEach(flag => {
        flagCounts[flag] = (flagCounts[flag] || 0) + 1;
      });
    });

    // Return flags that appear in >20% of discoveries
    const threshold = auditResults.length * 0.2;
    return Object.entries(flagCounts)
      .filter(([, count]) => count > threshold)
      .map(([flag]) => flag);
  }

  /**
   * Real-time fraud detection for new discoveries
   */
  async detectDiscoveryFraud(discoveryId: number): Promise<{
    isFraudulent: boolean;
    confidence: number;
    fraudIndicators: string[];
    riskFactors: string[];
  }> {
    const auditResult = await this.auditSingleDiscovery(discoveryId);
    
    const fraudIndicators: string[] = [];
    const riskFactors: string[] = [];
    
    // Check for fraud patterns
    if (auditResult.securityScore < 30) {
      fraudIndicators.push('Extremely low security score');
    }
    if (auditResult.validationMetrics.totalValidations === 0) {
      fraudIndicators.push('No validation consensus');
    }
    if (!auditResult.mathematicalIntegrity.formulaValidation) {
      fraudIndicators.push('Invalid mathematical computation');
    }
    if (!auditResult.mathematicalIntegrity.cryptographicSignature) {
      fraudIndicators.push('Missing or invalid signature');
    }

    // Risk factor analysis
    if (auditResult.validationMetrics.approvalRate < 25) {
      riskFactors.push('Very low approval rate');
    }
    if (auditResult.validationMetrics.validatorDiversity < 50) {
      riskFactors.push('Limited validator diversity');
    }

    const isFraudulent = fraudIndicators.length >= 2;
    const confidence = Math.min(95, (fraudIndicators.length * 30) + (riskFactors.length * 10));

    return {
      isFraudulent,
      confidence,
      fraudIndicators,
      riskFactors
    };
  }
}

export const discoveryAuditEngine = DiscoveryAuditEngine.getInstance();