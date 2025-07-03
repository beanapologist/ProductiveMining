/**
 * Manual PoS Audit Script
 * Creates immutable records for missing validation activities
 */

import { activatePoSValidation } from './activate-pos-validation';
import { posAuditEngine } from './pos-audit-engine';

export async function runManualAudit() {
  console.log('🔧 MANUAL PoS AUDIT: Starting comprehensive validation audit...');
  
  try {
    // First, activate PoS validation for new discoveries
    console.log('\n=== PHASE 1: Activating PoS Validation ===');
    const activationResult = await activatePoSValidation();
    
    // Then, run comprehensive audit to ensure all records are created
    console.log('\n=== PHASE 2: Comprehensive Audit ===');
    const auditResult = await posAuditEngine.performComprehensiveAudit();
    
    console.log('\n🎯 MANUAL AUDIT COMPLETE:');
    console.log(`🔄 Activation: ${activationResult.validationsCreated} validations, ${activationResult.recordsCreated} records`);
    console.log(`📊 Audit: ${auditResult.recordsCreated} additional records created`);
    console.log(`✅ Total validations: ${auditResult.totalValidations}`);
    
    return {
      success: true,
      activation: activationResult,
      audit: auditResult
    };
    
  } catch (error) {
    console.error('❌ Manual audit failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Self-executing for development
if (require.main === module) {
  runManualAudit().then(result => {
    console.log('\n📋 Final Result:', result);
    process.exit(result.success ? 0 : 1);
  });
}