/**
 * Complexity Scaling Engine
 * Intelligent difficulty progression system for productive mining
 * Analyzes network performance and mathematical breakthrough patterns
 */

interface NetworkMetrics {
  currentDifficulty: number;
  averageBlockTime: number;
  recentBreakthroughs: number;
  networkHashrate: number;
  activeMiners: number;
  scientificValueGenerated: number;
  energyEfficiency: number;
}

interface ComplexityAnalysis {
  recommendedDifficulty: number;
  scalingFactor: number;
  reasoning: string[];
  performanceScore: number;
  nextMilestone: number;
  adaptiveParameters: {
    workTypeOptimization: Record<string, number>;
    emergentComplexity: number;
    breakthroughPotential: number;
  };
}

export class ComplexityScalingEngine {
  private static instance: ComplexityScalingEngine;
  private baselineDifficulty = 300;
  private maxDifficulty = 800;
  private scalingHistory: Array<{
    timestamp: Date;
    difficulty: number;
    performance: number;
    breakthroughs: number;
  }> = [];

  public static getInstance(): ComplexityScalingEngine {
    if (!ComplexityScalingEngine.instance) {
      ComplexityScalingEngine.instance = new ComplexityScalingEngine();
    }
    return ComplexityScalingEngine.instance;
  }

  /**
   * Analyze current network performance and recommend optimal difficulty scaling
   */
  async analyzeComplexityProgression(): Promise<ComplexityAnalysis> {
    const networkMetrics = await this.collectNetworkMetrics();
    const performanceScore = this.calculateNetworkPerformanceScore(networkMetrics);
    
    // Advanced complexity scaling algorithms
    const scalingFactor = this.calculateOptimalScalingFactor(networkMetrics, performanceScore);
    const recommendedDifficulty = Math.min(
      Math.max(networkMetrics.currentDifficulty * scalingFactor, this.baselineDifficulty),
      this.maxDifficulty
    );

    const reasoning = this.generateScalingReasoning(networkMetrics, scalingFactor, performanceScore);
    const nextMilestone = this.calculateNextComplexityMilestone(recommendedDifficulty);
    
    const analysis: ComplexityAnalysis = {
      recommendedDifficulty: Math.round(recommendedDifficulty),
      scalingFactor,
      reasoning,
      performanceScore,
      nextMilestone,
      adaptiveParameters: {
        workTypeOptimization: await this.analyzeWorkTypePerformance(),
        emergentComplexity: this.calculateEmergentComplexity(networkMetrics),
        breakthroughPotential: this.assessBreakthroughPotential(networkMetrics)
      }
    };

    // Record scaling decision for historical analysis
    this.recordScalingDecision(analysis, networkMetrics);
    
    return analysis;
  }

  /**
   * Collect comprehensive network performance metrics
   */
  private async collectNetworkMetrics(): Promise<NetworkMetrics> {
    const { database } = await import('./database');
    
    // Get recent blocks for analysis
    const recentBlocks = await database.getAllBlocks();
    const recentDiscoveries = await database.getAllDiscoveries();
    
    // Calculate current network state
    const currentDifficulty = recentBlocks.length > 0 
      ? Math.max(...recentBlocks.map(b => b.difficulty || 150))
      : 150;
    
    // Calculate average block time (last 10 blocks)
    const last10Blocks = recentBlocks.slice(-10);
    const averageBlockTime = this.calculateAverageBlockTime(last10Blocks);
    
    // Count recent mathematical breakthroughs
    const recentBreakthroughs = recentDiscoveries.filter(d => 
      new Date(d.timestamp).getTime() > Date.now() - 3600000 // Last hour
    ).length;
    
    // Estimate network metrics
    const networkHashrate = this.estimateNetworkHashrate(recentBlocks);
    const activeMiners = this.countActiveMiners(recentBlocks);
    const scientificValueGenerated = recentDiscoveries.reduce((sum, d) => sum + (d.scientificValue || 0), 0);
    const energyEfficiency = this.calculateEnergyEfficiency(recentBlocks);

    return {
      currentDifficulty,
      averageBlockTime,
      recentBreakthroughs,
      networkHashrate,
      activeMiners,
      scientificValueGenerated,
      energyEfficiency
    };
  }

  /**
   * Calculate network performance score (0-100)
   */
  private calculateNetworkPerformanceScore(metrics: NetworkMetrics): number {
    const factors = {
      blockTimeOptimality: this.scoreBlockTime(metrics.averageBlockTime), // Target: 2-3 minutes
      breakthroughRate: Math.min(metrics.recentBreakthroughs * 10, 100), // More breakthroughs = better
      minerParticipation: Math.min(metrics.activeMiners * 12.5, 100), // Target: 8+ miners
      energyEfficiency: Math.min(Math.abs(metrics.energyEfficiency) / 10, 100), // Higher efficiency = better
      scientificValue: Math.min(metrics.scientificValueGenerated / 1000000, 100) // $1M+ = excellent
    };

    // Weighted average of performance factors
    const weights = {
      blockTimeOptimality: 0.25,
      breakthroughRate: 0.30,
      minerParticipation: 0.20,
      energyEfficiency: 0.15,
      scientificValue: 0.10
    };

    return Object.entries(factors).reduce((score, [factor, value]) => 
      score + (value * weights[factor as keyof typeof weights]), 0
    );
  }

  /**
   * Calculate optimal scaling factor based on network state
   */
  private calculateOptimalScalingFactor(metrics: NetworkMetrics, performanceScore: number): number {
    let scalingFactor = 1.0;

    // Performance-based scaling
    if (performanceScore > 80) {
      // High performance: increase complexity
      scalingFactor += 0.15;
    } else if (performanceScore > 60) {
      // Good performance: moderate increase
      scalingFactor += 0.08;
    } else if (performanceScore < 40) {
      // Poor performance: reduce complexity
      scalingFactor -= 0.10;
    }

    // Breakthrough-based scaling
    if (metrics.recentBreakthroughs > 5) {
      // Many breakthroughs: network can handle higher complexity
      scalingFactor += 0.12;
    }

    // Block time adjustment
    if (metrics.averageBlockTime < 90) { // Too fast
      scalingFactor += 0.10;
    } else if (metrics.averageBlockTime > 240) { // Too slow
      scalingFactor -= 0.08;
    }

    // Miner participation adjustment
    if (metrics.activeMiners > 10) {
      scalingFactor += 0.05;
    } else if (metrics.activeMiners < 5) {
      scalingFactor -= 0.08;
    }

    // Historical performance consideration
    const historicalTrend = this.analyzeHistoricalTrend();
    scalingFactor += historicalTrend * 0.05;

    // Ensure reasonable bounds
    return Math.max(0.85, Math.min(1.25, scalingFactor));
  }

  /**
   * Generate human-readable reasoning for scaling decision
   */
  private generateScalingReasoning(
    metrics: NetworkMetrics, 
    scalingFactor: number, 
    performanceScore: number
  ): string[] {
    const reasoning: string[] = [];

    reasoning.push(`Network performance score: ${performanceScore.toFixed(1)}/100`);
    reasoning.push(`Current difficulty: ${metrics.currentDifficulty}, scaling factor: ${scalingFactor.toFixed(3)}`);

    if (performanceScore > 80) {
      reasoning.push("Excellent network performance enables complexity increase");
    } else if (performanceScore < 40) {
      reasoning.push("Performance concerns suggest reducing complexity");
    }

    if (metrics.recentBreakthroughs > 5) {
      reasoning.push(`High breakthrough rate (${metrics.recentBreakthroughs}/hour) supports higher difficulty`);
    }

    if (metrics.averageBlockTime < 90) {
      reasoning.push("Fast block times indicate network can handle higher complexity");
    } else if (metrics.averageBlockTime > 240) {
      reasoning.push("Slow block times suggest reducing difficulty for optimal mining");
    }

    if (metrics.activeMiners > 8) {
      reasoning.push(`Strong miner participation (${metrics.activeMiners} active miners)`);
    } else {
      reasoning.push(`Limited miner participation (${metrics.activeMiners} miners) requires careful scaling`);
    }

    return reasoning;
  }

  /**
   * Analyze performance by mathematical work type
   */
  private async analyzeWorkTypePerformance(): Promise<Record<string, number>> {
    const { database } = await import('./database');
    const discoveries = await database.getAllDiscoveries();
    
    const workTypePerformance: Record<string, number> = {};
    const workTypeCounts: Record<string, number> = {};
    
    discoveries.forEach(d => {
      if (!workTypePerformance[d.workType]) {
        workTypePerformance[d.workType] = 0;
        workTypeCounts[d.workType] = 0;
      }
      workTypePerformance[d.workType] += d.scientificValue || 0;
      workTypeCounts[d.workType]++;
    });

    // Calculate average scientific value per work type
    Object.keys(workTypePerformance).forEach(workType => {
      if (workTypeCounts[workType] > 0) {
        workTypePerformance[workType] = workTypePerformance[workType] / workTypeCounts[workType];
      }
    });

    return workTypePerformance;
  }

  /**
   * Calculate emergent complexity factor
   */
  private calculateEmergentComplexity(metrics: NetworkMetrics): number {
    // Complex mathematical relationship considering multiple factors
    const complexityFactor = 
      (metrics.recentBreakthroughs * 0.3) +
      (metrics.networkHashrate / 1000 * 0.2) +
      (metrics.energyEfficiency / 100 * 0.25) +
      (metrics.scientificValueGenerated / 10000000 * 0.25);
    
    return Math.min(complexityFactor, 2.0);
  }

  /**
   * Assess potential for mathematical breakthroughs at current complexity
   */
  private assessBreakthroughPotential(metrics: NetworkMetrics): number {
    const baselinePotential = 0.5;
    const difficultyBonus = (metrics.currentDifficulty - 100) / 200; // Higher difficulty = more potential
    const breakthroughMomentum = Math.min(metrics.recentBreakthroughs / 10, 0.3);
    const networkStrength = Math.min(metrics.activeMiners / 20, 0.2);
    
    return Math.min(baselinePotential + difficultyBonus + breakthroughMomentum + networkStrength, 1.0);
  }

  /**
   * Calculate next complexity milestone
   */
  private calculateNextComplexityMilestone(currentDifficulty: number): number {
    const milestones = [150, 175, 200, 225, 250, 275, 300];
    return milestones.find(m => m > currentDifficulty) || 300;
  }

  /**
   * Helper methods for metric calculations
   */
  private calculateAverageBlockTime(blocks: any[]): number {
    if (blocks.length < 2) return 120; // Default 2 minutes
    
    const timeDiffs = blocks.slice(1).map((block, i) => {
      const currentTime = new Date(block.timestamp).getTime();
      const previousTime = new Date(blocks[i].timestamp).getTime();
      return currentTime - previousTime;
    });
    
    const averageMs = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
    return averageMs / 1000; // Return in seconds
  }

  private scoreBlockTime(averageSeconds: number): number {
    const targetTime = 150; // 2.5 minutes target
    const variance = Math.abs(averageSeconds - targetTime);
    return Math.max(0, 100 - (variance / targetTime * 100));
  }

  private estimateNetworkHashrate(blocks: any[]): number {
    // Simplified hashrate estimation based on difficulty and block times
    const avgDifficulty = blocks.length > 0 
      ? blocks.reduce((sum, b) => sum + (b.difficulty || 150), 0) / blocks.length
      : 150;
    return avgDifficulty * 1000; // Simplified calculation
  }

  private countActiveMiners(blocks: any[]): number {
    const recentBlocks = blocks.slice(-20); // Last 20 blocks
    const uniqueMiners = new Set(recentBlocks.map(b => b.minerId));
    return uniqueMiners.size;
  }

  private calculateEnergyEfficiency(blocks: any[]): number {
    if (blocks.length === 0) return -500; // Default efficiency
    
    const totalEnergyConsumed = blocks.reduce((sum, b) => sum + (b.energyConsumed || 0), 0);
    const totalScientificValue = blocks.reduce((sum, b) => sum + (b.totalScientificValue || 0), 0);
    
    if (totalEnergyConsumed === 0) return -1000; // Perfect efficiency (energy generation)
    return -(totalScientificValue / totalEnergyConsumed) * 100; // Negative = energy generation
  }

  private analyzeHistoricalTrend(): number {
    if (this.scalingHistory.length < 3) return 0;
    
    const recent = this.scalingHistory.slice(-3);
    const performanceTrend = recent[2].performance - recent[0].performance;
    const breakthroughTrend = recent[2].breakthroughs - recent[0].breakthroughs;
    
    return (performanceTrend + breakthroughTrend * 10) / 200; // Normalized trend
  }

  private recordScalingDecision(analysis: ComplexityAnalysis, metrics: NetworkMetrics): void {
    this.scalingHistory.push({
      timestamp: new Date(),
      difficulty: analysis.recommendedDifficulty,
      performance: analysis.performanceScore,
      breakthroughs: metrics.recentBreakthroughs
    });

    // Keep only recent history
    if (this.scalingHistory.length > 50) {
      this.scalingHistory = this.scalingHistory.slice(-30);
    }
  }

  /**
   * Apply optimal difficulty scaling to network
   */
  async applyComplexityScaling(): Promise<{
    previousDifficulty: number;
    newDifficulty: number;
    analysis: ComplexityAnalysis;
    applied: boolean;
  }> {
    const analysis = await this.analyzeComplexityProgression();
    const metrics = await this.collectNetworkMetrics();
    
    const previousDifficulty = metrics.currentDifficulty;
    const newDifficulty = analysis.recommendedDifficulty;
    
    // Only apply scaling if significant change is recommended
    const shouldApply = Math.abs(newDifficulty - previousDifficulty) >= 5;
    
    if (shouldApply) {
      console.log(`🔧 COMPLEXITY SCALING: ${previousDifficulty} → ${newDifficulty} (${analysis.scalingFactor.toFixed(3)}x)`);
      console.log(`📊 Performance Score: ${analysis.performanceScore.toFixed(1)}/100`);
      console.log(`🎯 Next Milestone: ${analysis.nextMilestone}`);
      analysis.reasoning.forEach(reason => console.log(`   - ${reason}`));
    }
    
    return {
      previousDifficulty,
      newDifficulty,
      analysis,
      applied: shouldApply
    };
  }
}

export const complexityScalingEngine = ComplexityScalingEngine.getInstance();