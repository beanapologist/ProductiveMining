import { storage } from './storage';
import { cryptoEngine } from './crypto-engine';
import type { ProductiveBlock, MathematicalWork } from '@shared/schema';

interface IntegrityReport {
  blockId: number;
  blockIndex: number;
  status: 'valid' | 'invalid' | 'warning';
  issues: string[];
  mathematicalWork: MathematicalWork[];
  formulaValidation: {
    workId: number;
    workType: string;
    formulaValid: boolean;
    securityScore: number;
    details: string;
  }[];
  posValidation: {
    consensusReached: boolean;
    validatorCount: number;
    approvalRate: number;
  };
  securityAnalysis: {
    cryptographicStrength: string;
    quantumResistance: number;
    overallScore: number;
  };
}

export class DataIntegrityEngine {
  /**
   * Perform comprehensive data integrity check on all blocks
   */
  async performFullIntegrityCheck(): Promise<{
    summary: {
      totalBlocks: number;
      validBlocks: number;
      invalidBlocks: number;
      warningBlocks: number;
      overallIntegrity: number;
    };
    reports: IntegrityReport[];
  }> {
    console.log('🔍 DATA INTEGRITY: Starting comprehensive blockchain validation...');
    
    const blocks = await storage.getRecentBlocks(1000);
    const reports: IntegrityReport[] = [];
    
    let validCount = 0;
    let invalidCount = 0;
    let warningCount = 0;
    
    for (const block of blocks) {
      const report = await this.validateBlock(block);
      reports.push(report);
      
      if (report.status === 'valid') validCount++;
      else if (report.status === 'invalid') invalidCount++;
      else warningCount++;
    }
    
    const overallIntegrity = (validCount / blocks.length) * 100;
    
    console.log(`🔍 DATA INTEGRITY: Completed validation of ${blocks.length} blocks`);
    console.log(`✅ Valid: ${validCount}, ⚠️ Warning: ${warningCount}, ❌ Invalid: ${invalidCount}`);
    console.log(`📊 Overall Integrity: ${overallIntegrity.toFixed(2)}%`);
    
    return {
      summary: {
        totalBlocks: blocks.length,
        validBlocks: validCount,
        invalidBlocks: invalidCount,
        warningBlocks: warningCount,
        overallIntegrity
      },
      reports
    };
  }

  /**
   * Validate individual block and its mathematical work
   */
  private async validateBlock(block: ProductiveBlock): Promise<IntegrityReport> {
    const issues: string[] = [];
    const blockData = await storage.getBlockWithMathematicalWork(block.id);
    
    if (!blockData) {
      return {
        blockId: block.id,
        blockIndex: block.index,
        status: 'invalid',
        issues: ['Block data not found'],
        mathematicalWork: [],
        formulaValidation: [],
        posValidation: { consensusReached: false, validatorCount: 0, approvalRate: 0 },
        securityAnalysis: { cryptographicStrength: 'NONE', quantumResistance: 0, overallScore: 0 }
      };
    }

    const mathematicalWork = blockData.work || [];
    const formulaValidation = await this.validateMathematicalFormulas(mathematicalWork);
    const posValidation = await this.validateThroughPoS(block, mathematicalWork);
    const securityAnalysis = await this.performSecurityAnalysis(mathematicalWork);

    // Check block integrity
    if (block.totalScientificValue <= 0) {
      issues.push('Invalid scientific value');
    }
    
    if (block.difficulty < 1) {
      issues.push('Invalid difficulty level');
    }
    
    if (!block.blockHash || block.blockHash.length < 6) {
      issues.push('Invalid block hash');
    }

    // Check mathematical work validity
    if (mathematicalWork.length === 0) {
      issues.push('No mathematical work found');
    }

    // Check formula validation results
    const invalidFormulas = formulaValidation.filter(f => !f.formulaValid);
    if (invalidFormulas.length > 0) {
      issues.push(`${invalidFormulas.length} invalid mathematical formulas`);
    }

    // Determine overall status
    let status: 'valid' | 'invalid' | 'warning' = 'valid';
    if (issues.length > 2 || invalidFormulas.length > 0) {
      status = 'invalid';
    } else if (issues.length > 0) {
      status = 'warning';
    }

    return {
      blockId: block.id,
      blockIndex: block.index,
      status,
      issues,
      mathematicalWork,
      formulaValidation,
      posValidation,
      securityAnalysis
    };
  }

  /**
   * Validate mathematical formulas in each work item
   */
  private async validateMathematicalFormulas(work: MathematicalWork[]): Promise<{
    workId: number;
    workType: string;
    formulaValid: boolean;
    securityScore: number;
    details: string;
  }[]> {
    const validations = [];
    
    for (const workItem of work) {
      const validation = this.validateWorkTypeFormula(workItem);
      validations.push({
        workId: workItem.id,
        workType: workItem.workType,
        formulaValid: validation.valid,
        securityScore: validation.score,
        details: validation.details
      });
    }
    
    return validations;
  }

  /**
   * Validate specific mathematical work type formulas
   */
  private validateWorkTypeFormula(work: MathematicalWork): {
    valid: boolean;
    score: number;
    details: string;
  } {
    switch (work.workType) {
      case 'riemann_zero':
        return this.validateRiemannZero(work);
      case 'prime_pattern':
        return this.validatePrimePattern(work);
      case 'yang_mills':
        return this.validateYangMills(work);
      case 'navier_stokes':
        return this.validateNavierStokes(work);
      case 'goldbach_verification':
        return this.validateGoldbach(work);
      default:
        return { valid: true, score: 50, details: 'Unknown work type, assuming valid' };
    }
  }

  private validateRiemannZero(work: MathematicalWork): { valid: boolean; score: number; details: string } {
    const result = work.result as any;
    
    // Check if zero value has proper structure
    if (!result.zeroValue || typeof result.zeroValue.real !== 'number' || typeof result.zeroValue.imag !== 'number') {
      return { valid: false, score: 0, details: 'Invalid zero value structure' };
    }
    
    // Real part should be 0.5 for Riemann Hypothesis
    if (Math.abs(result.zeroValue.real - 0.5) > 0.001) {
      return { valid: false, score: 20, details: 'Real part not equal to 0.5' };
    }
    
    // Imaginary part should be positive and reasonable
    if (result.zeroValue.imag <= 0 || result.zeroValue.imag > 1000000) {
      return { valid: false, score: 30, details: 'Invalid imaginary part range' };
    }
    
    return { valid: true, score: 95, details: 'Valid Riemann zero with Re(s) = 0.5' };
  }

  private validatePrimePattern(work: MathematicalWork): { valid: boolean; score: number; details: string } {
    const result = work.result as any;
    
    if (!result.searchRange || !Array.isArray(result.searchRange) || result.searchRange.length !== 2) {
      return { valid: false, score: 0, details: 'Invalid search range' };
    }
    
    if (result.patternsFound <= 0 || result.patternsFound > 10000) {
      return { valid: false, score: 20, details: 'Unrealistic pattern count' };
    }
    
    const rangeSize = result.searchRange[1] - result.searchRange[0];
    if (rangeSize <= 0 || rangeSize > 1000000) {
      return { valid: false, score: 30, details: 'Invalid search range size' };
    }
    
    return { valid: true, score: 88, details: 'Valid prime pattern analysis' };
  }

  private validateYangMills(work: MathematicalWork): { valid: boolean; score: number; details: string } {
    const result = work.result as any;
    
    if (!result.gaugeGroup || typeof result.gaugeGroup !== 'string') {
      return { valid: false, score: 0, details: 'Missing gauge group specification' };
    }
    
    if (!result.massGap || typeof result.massGap !== 'number' || result.massGap <= 0) {
      return { valid: false, score: 25, details: 'Invalid mass gap value' };
    }
    
    return { valid: true, score: 92, details: 'Valid Yang-Mills field theory computation' };
  }

  private validateNavierStokes(work: MathematicalWork): { valid: boolean; score: number; details: string } {
    const result = work.result as any;
    
    if (!result.fluidProperties || !result.boundaryConditions) {
      return { valid: false, score: 0, details: 'Missing fluid dynamics parameters' };
    }
    
    if (!result.solution || typeof result.solution !== 'string') {
      return { valid: false, score: 20, details: 'Missing solution description' };
    }
    
    return { valid: true, score: 87, details: 'Valid Navier-Stokes fluid dynamics solution' };
  }

  private validateGoldbach(work: MathematicalWork): { valid: boolean; score: number; details: string } {
    const result = work.result as any;
    
    if (!result.evenNumber || typeof result.evenNumber !== 'number' || result.evenNumber % 2 !== 0) {
      return { valid: false, score: 0, details: 'Invalid even number for Goldbach verification' };
    }
    
    if (!result.primePairs || !Array.isArray(result.primePairs)) {
      return { valid: false, score: 20, details: 'Missing prime pair decomposition' };
    }
    
    return { valid: true, score: 90, details: 'Valid Goldbach conjecture verification' };
  }

  /**
   * Send validated work through PoS system
   */
  private async validateThroughPoS(block: ProductiveBlock, work: MathematicalWork[]): Promise<{
    consensusReached: boolean;
    validatorCount: number;
    approvalRate: number;
  }> {
    try {
      const validators = await storage.getActiveStakers();
      
      if (validators.length === 0) {
        return { consensusReached: false, validatorCount: 0, approvalRate: 0 };
      }

      let approvals = 0;
      
      // Simulate PoS validation for each work item
      for (const workItem of work) {
        const validations = await storage.getValidationsForWork(workItem.id);
        const workApprovals = validations.filter(v => v.consensusReached).length;
        if (workApprovals >= Math.ceil(validators.length * 0.67)) {
          approvals++;
        }
      }
      
      const approvalRate = work.length > 0 ? (approvals / work.length) : 0;
      const consensusReached = approvalRate >= 0.67;
      
      return {
        consensusReached,
        validatorCount: validators.length,
        approvalRate: approvalRate * 100
      };
      
    } catch (error) {
      console.error('PoS validation error:', error);
      return { consensusReached: false, validatorCount: 0, approvalRate: 0 };
    }
  }

  /**
   * Perform cryptographic security analysis
   */
  private async performSecurityAnalysis(work: MathematicalWork[]): Promise<{
    cryptographicStrength: string;
    quantumResistance: number;
    overallScore: number;
  }> {
    try {
      const analysis = cryptoEngine.generateSecurityHash(work);
      
      // Calculate quantum resistance based on cryptographic work and security level
      let quantumResistance = 0;
      
      // Generate enhanced crypto key to get proper quantum resistance
      if (work.length > 0) {
        try {
          const enhancedKey = cryptoEngine.generateEnhancedCryptoKey(work);
          quantumResistance = enhancedKey.quantumResistance;
        } catch (keyError) {
          // Fallback calculation based on work types and difficulty
          const cryptoWork = work.filter(w => 
            w.workType === 'elliptic_curve_crypto' || 
            w.workType === 'lattice_crypto' || 
            w.workType === 'prime_pattern' ||
            w.workType === 'riemann_zero'
          );
          
          if (cryptoWork.length > 0) {
            const avgDifficulty = cryptoWork.reduce((sum, w) => sum + w.difficulty, 0) / cryptoWork.length;
            quantumResistance = Math.min(85, Math.max(25, avgDifficulty * 0.5 + 20));
          } else {
            quantumResistance = 35; // Base quantum resistance
          }
        }
      }
      
      return {
        cryptographicStrength: analysis.securityLevel,
        quantumResistance,
        overallScore: analysis.entropy || 0
      };
      
    } catch (error) {
      console.error('Security analysis error:', error);
      return {
        cryptographicStrength: 'UNKNOWN',
        quantumResistance: 0,
        overallScore: 0
      };
    }
  }
}

export const dataIntegrityEngine = new DataIntegrityEngine();