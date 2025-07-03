/**
 * Manual PoS Audit Script
 * Creates immutable records for missing validation activities
 */

import { storage } from './storage';
import { immutableRecordsEngine } from './immutable-records-engine';

export async function runManualAudit() {
  console.log('🔍 MANUAL AUDIT: Starting comprehensive validation audit...');
  
  try {
    // Get missing validation activities that need immutable records
    const missingValidations = [
      { id: 46, workId: 140, stakerId: 6 }, // approved - validator_3
      { id: 47, workId: 140, stakerId: 5 }, // rejected - validator_2  
      { id: 48, workId: 140, stakerId: 4 }  // rejected - validator_1
    ];

    let recordsCreated = 0;

    for (const validationInfo of missingValidations) {
      try {
        // Get full validation data
        const allValidations = await storage.getValidationsForWork(validationInfo.workId);
        const validation = allValidations.find(v => v.id === validationInfo.id);
        
        if (!validation) {
          console.log(`❌ AUDIT: Validation ${validationInfo.id} not found`);
          continue;
        }

        // Get work and staker data
        const work = await storage.getMathematicalWork(validation.workId);
        const staker = await storage.getStaker(validation.stakerId);

        if (work && staker) {
          console.log(`🔧 AUDIT: Creating immutable record for validation ${validation.id} (${validation.status}) by ${staker.stakerId}`);
          
          // Create immutable record
          await immutableRecordsEngine.recordValidationActivity(validation, work, staker);
          recordsCreated++;
          
          console.log(`✅ AUDIT: Successfully created immutable record for validation ${validation.id}`);
        } else {
          console.log(`❌ AUDIT: Missing work or staker data for validation ${validation.id}`);
        }
      } catch (error) {
        console.error(`❌ AUDIT: Failed to process validation ${validationInfo.id}:`, error);
      }
    }

    // Check final state
    const finalRecords = await storage.getRecentValidationRecords(50);
    console.log(`\n📊 AUDIT COMPLETE:`);
    console.log(`✅ Records created: ${recordsCreated}`);
    console.log(`📝 Total immutable records: ${finalRecords.length}`);
    console.log(`🎯 Validation records: ${finalRecords.filter(r => r.recordType === 'validation_activity').length}`);
    
    return {
      recordsCreated,
      totalRecords: finalRecords.length,
      validationRecords: finalRecords.filter(r => r.recordType === 'validation_activity').length
    };
    
  } catch (error) {
    console.error('Manual audit failed:', error);
    throw error;
  }
}