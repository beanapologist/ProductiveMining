/**
 * Work Distribution Balancer
 * Ensures balanced mathematical computation across all problem types
 * Addresses the significant skew towards prime pattern work
 */

import { storage } from './storage.js';

interface WorkTypeStats {
  workType: string;
  count: number;
  percentage: number;
  targetPercentage: number;
  priority: 'high' | 'medium' | 'low';
  difficultyBonus: number;
}

interface BalancingStrategy {
  workType: string;
  recommendedMiners: number;
  difficultyRange: [number, number];
  incentiveMultiplier: number;
  priorityReason: string;
}

export class WorkDistributionBalancer {
  private targetDistribution = {
    // Define ideal distribution percentages for mathematical diversity
    'prime_pattern': 15,        // Reduce from current 79.5%
    'riemann_zero': 15,         // Increase from current 15.4%
    'yang_mills': 12,           // Increase from current 0.02%
    'navier_stokes': 12,        // Increase from current 0.01%
    'poincare_conjecture': 10,  // Increase from current 0.03%
    'birch_swinnerton_dyer': 10, // Increase from current 0.03%
    'elliptic_curve_crypto': 8,  // Increase from current 0.05%
    'goldbach_verification': 8,  // Increase from current 0.02%
    'lattice_crypto': 6,        // Increase from current 0.02%
    'collatz_verification': 2,   // Increase from current 0.004%
    'fibonacci_patterns': 1,     // Increase from current 0.004%
    'prime_gap_analysis': 1      // Increase from current 0.004%
  };

  private workTypePriorities = {
    // High priority: Millennium Prize Problems and fundamental mathematics
    'yang_mills': 'high',
    'navier_stokes': 'high', 
    'poincare_conjecture': 'high',
    'birch_swinnerton_dyer': 'high',
    'riemann_zero': 'high',
    
    // Medium priority: Important cryptographic and number theory
    'elliptic_curve_crypto': 'medium',
    'lattice_crypto': 'medium',
    'goldbach_verification': 'medium',
    
    // Lower priority: Already well-represented areas
    'prime_pattern': 'low',
    'collatz_verification': 'low',
    'fibonacci_patterns': 'low',
    'prime_gap_analysis': 'low'
  };

  async getCurrentDistribution(): Promise<WorkTypeStats[]> {
    try {
      // Get work type distribution from database
      const discoveries = await storage.getMathematicalWork(50000); // Large sample
      const totalCount = discoveries.length;
      
      // Count occurrences of each work type
      const workTypeCounts: Record<string, number> = {};
      discoveries.forEach(discovery => {
        const workType = discovery.workType;
        workTypeCounts[workType] = (workTypeCounts[workType] || 0) + 1;
      });

      // Calculate statistics for each work type
      const stats: WorkTypeStats[] = Object.entries(this.targetDistribution).map(([workType, targetPercentage]) => {
        const count = workTypeCounts[workType] || 0;
        const currentPercentage = (count / totalCount) * 100;
        const priority = this.workTypePriorities[workType] as 'high' | 'medium' | 'low';
        
        // Calculate difficulty bonus based on underrepresentation
        const underrepresentationRatio = targetPercentage / Math.max(currentPercentage, 0.1);
        const difficultyBonus = Math.min(underrepresentationRatio * 10, 50); // Cap at 50 point bonus

        return {
          workType,
          count,
          percentage: currentPercentage,
          targetPercentage,
          priority,
          difficultyBonus
        };
      });

      return stats.sort((a, b) => {
        // Sort by priority first, then by underrepresentation
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        return b.difficultyBonus - a.difficultyBonus;
      });

    } catch (error) {
      console.error('Error getting work distribution:', error);
      return [];
    }
  }

  async generateBalancingStrategy(): Promise<BalancingStrategy[]> {
    const currentStats = await this.getCurrentDistribution();
    const strategies: BalancingStrategy[] = [];

    for (const stat of currentStats) {
      const underrepresentationRatio = stat.targetPercentage / Math.max(stat.percentage, 0.1);
      
      let recommendedMiners = 1;
      let difficultyRange: [number, number] = [50, 100];
      let incentiveMultiplier = 1.0;
      let priorityReason = '';

      if (underrepresentationRatio > 10) {
        // Severely underrepresented
        recommendedMiners = 8;
        difficultyRange = [40, 80]; // Lower difficulty to encourage participation
        incentiveMultiplier = 2.5;
        priorityReason = `Critical shortage: ${stat.percentage.toFixed(1)}% vs ${stat.targetPercentage}% target`;
        
      } else if (underrepresentationRatio > 5) {
        // Significantly underrepresented  
        recommendedMiners = 5;
        difficultyRange = [50, 90];
        incentiveMultiplier = 2.0;
        priorityReason = `Major deficit: ${stat.percentage.toFixed(1)}% vs ${stat.targetPercentage}% target`;
        
      } else if (underrepresentationRatio > 2) {
        // Moderately underrepresented
        recommendedMiners = 3;
        difficultyRange = [60, 100];
        incentiveMultiplier = 1.5;
        priorityReason = `Moderate shortage: ${stat.percentage.toFixed(1)}% vs ${stat.targetPercentage}% target`;
        
      } else if (underrepresentationRatio < 0.5) {
        // Overrepresented - reduce activity
        recommendedMiners = 1;
        difficultyRange = [80, 120]; // Higher difficulty to limit volume
        incentiveMultiplier = 0.8;
        priorityReason = `Overrepresented: ${stat.percentage.toFixed(1)}% vs ${stat.targetPercentage}% target`;
        
      } else {
        // Balanced - maintain current level
        recommendedMiners = 2;
        difficultyRange = [60, 100];
        incentiveMultiplier = 1.0;
        priorityReason = `Balanced: ${stat.percentage.toFixed(1)}% vs ${stat.targetPercentage}% target`;
      }

      strategies.push({
        workType: stat.workType,
        recommendedMiners,
        difficultyRange,
        incentiveMultiplier,
        priorityReason
      });
    }

    return strategies;
  }

  async applyBalancingStrategy(): Promise<void> {
    const strategies = await this.generateBalancingStrategy();
    
    console.log('\n🎯 WORK DISTRIBUTION BALANCING STRATEGY:');
    console.log('========================================');
    
    for (const strategy of strategies) {
      console.log(`\n📊 ${strategy.workType.toUpperCase()}:`);
      console.log(`   Recommended Miners: ${strategy.recommendedMiners}`);
      console.log(`   Difficulty Range: ${strategy.difficultyRange[0]}-${strategy.difficultyRange[1]}`);
      console.log(`   Incentive Multiplier: ${strategy.incentiveMultiplier}x`);
      console.log(`   Reason: ${strategy.priorityReason}`);
    }
    
    console.log('\n✅ Balancing strategy calculated and logged');
  }

  getBalancedWorkType(): string {
    // Simple weighted selection for immediate use
    const underrepresentedTypes = [
      'yang_mills', 'navier_stokes', 'poincare_conjecture', 
      'birch_swinnerton_dyer', 'elliptic_curve_crypto',
      'goldbach_verification', 'lattice_crypto'
    ];
    
    // Randomly select from underrepresented types 70% of the time
    if (Math.random() < 0.7) {
      return underrepresentedTypes[Math.floor(Math.random() * underrepresentedTypes.length)];
    }
    
    // Otherwise return a standard type
    const allTypes = [
      'riemann_zero', 'prime_pattern', 'yang_mills', 'navier_stokes',
      'goldbach_verification', 'poincare_conjecture', 'birch_swinnerton_dyer',
      'elliptic_curve_crypto', 'lattice_crypto'
    ];
    
    return allTypes[Math.floor(Math.random() * allTypes.length)];
  }

  getBalancedDifficulty(workType: string): number {
    const strategies = {
      // Underrepresented types get lower difficulty to encourage participation
      'yang_mills': [40, 80],
      'navier_stokes': [40, 80], 
      'poincare_conjecture': [45, 85],
      'birch_swinnerton_dyer': [45, 85],
      'elliptic_curve_crypto': [50, 90],
      'goldbach_verification': [50, 90],
      'lattice_crypto': [50, 90],
      
      // Overrepresented types get higher difficulty
      'prime_pattern': [80, 120],
      'riemann_zero': [60, 100]
    };
    
    const range = strategies[workType] || [60, 100];
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  async getDetailedReport(): Promise<string> {
    const currentStats = await this.getCurrentDistribution();
    const strategies = await this.generateBalancingStrategy();
    
    let report = '\n📊 WORK DISTRIBUTION ANALYSIS REPORT\n';
    report += '=====================================\n\n';
    
    report += '🎯 CURRENT vs TARGET DISTRIBUTION:\n';
    report += '─'.repeat(50) + '\n';
    
    for (const stat of currentStats) {
      const status = stat.percentage > stat.targetPercentage * 1.5 ? '⚠️  OVER' : 
                    stat.percentage < stat.targetPercentage * 0.5 ? '🔴 UNDER' : '✅ OK';
      
      report += `${status} ${stat.workType.padEnd(25)} `;
      report += `${stat.count.toString().padStart(6)} (${stat.percentage.toFixed(1)}% vs ${stat.targetPercentage}% target)\n`;
    }
    
    report += '\n🚀 RECOMMENDED ACTIONS:\n';
    report += '─'.repeat(50) + '\n';
    
    const highPriorityActions = strategies.filter(s => s.incentiveMultiplier > 1.5);
    for (const action of highPriorityActions) {
      report += `⭐ ${action.workType}: Deploy ${action.recommendedMiners} miners, `;
      report += `difficulty ${action.difficultyRange[0]}-${action.difficultyRange[1]}, `;
      report += `${action.incentiveMultiplier}x rewards\n`;
      report += `   Reason: ${action.priorityReason}\n\n`;
    }
    
    return report;
  }
}

export const workDistributionBalancer = new WorkDistributionBalancer();