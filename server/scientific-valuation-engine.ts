/**
 * Scientific Valuation Engine
 * Provides realistic and fair valuation of mathematical discoveries based on 
 * computational effort, difficulty, and actual research impact
 */

export interface ScientificValuation {
  baseValue: number;
  difficultyMultiplier: number;
  computationalEffortValue: number;
  researchImpactValue: number;
  totalValue: number;
  reasoning: string[];
}

export class ScientificValuationEngine {
  private static instance: ScientificValuationEngine;

  public static getInstance(): ScientificValuationEngine {
    if (!ScientificValuationEngine.instance) {
      ScientificValuationEngine.instance = new ScientificValuationEngine();
    }
    return ScientificValuationEngine.instance;
  }

  /**
   * Calculate realistic scientific value for mathematical work
   * Based on actual computational effort and research significance
   */
  public calculateScientificValue(
    workType: string,
    difficulty: number,
    computationTime: number, // in seconds
    energyConsumed: number, // in kWh
    qualityMetrics?: any
  ): ScientificValuation {
    // Base values represent real-world research funding equivalents
    const baseValues = this.getBaseResearchValues();
    const baseValue = baseValues[workType] || baseValues.default;

    // Difficulty scaling (logarithmic, not exponential)
    const difficultyMultiplier = 1 + Math.log10(Math.max(difficulty, 1)) * 0.3;

    // Computational effort value based on actual compute costs
    const computationalEffortValue = this.calculateComputationalValue(
      computationTime, 
      energyConsumed, 
      difficulty
    );

    // Research impact value based on problem significance
    const researchImpactValue = this.calculateResearchImpact(workType, difficulty);

    // Total value is sum of components (not multiplication to avoid inflation)
    const totalValue = Math.round(
      baseValue + 
      computationalEffortValue + 
      researchImpactValue + 
      (baseValue * (difficultyMultiplier - 1))
    );

    const reasoning = [
      `Base research value for ${workType}: $${baseValue}`,
      `Computational effort: $${computationalEffortValue} (${computationTime}s computation)`,
      `Research significance: $${researchImpactValue}`,
      `Difficulty bonus: ${((difficultyMultiplier - 1) * 100).toFixed(1)}% for difficulty ${difficulty}`
    ];

    return {
      baseValue,
      difficultyMultiplier,
      computationalEffortValue,
      researchImpactValue,
      totalValue,
      reasoning
    };
  }

  /**
   * Base research values equivalent to real academic funding
   * Based on typical research grants and computational resources
   */
  private getBaseResearchValues(): Record<string, number> {
    return {
      // Values in USD, based on realistic research computation costs
      riemann_zero: 800,            // $800 - Advanced number theory research
      prime_pattern: 600,           // $600 - Computational number theory
      yang_mills: 1200,            // $1.2K - Theoretical physics (Millennium Prize)
      navier_stokes: 1000,         // $1K - Applied mathematics (Millennium Prize)
      poincare_conjecture: 900,    // $900 - Topology research (Solved Millennium Prize)
      goldbach_verification: 500,  // $500 - Number theory verification
      birch_swinnerton_dyer: 850,  // $850 - Algebraic geometry (Millennium Prize)
      elliptic_curve_crypto: 700,  // $700 - Applied cryptography
      lattice_crypto: 650,         // $650 - Post-quantum cryptography
      default: 400                 // $400 - General mathematical research
    };
  }

  /**
   * Calculate value based on actual computational resources used
   * Uses real-world cloud computing costs and energy prices
   */
  private calculateComputationalValue(
    computationTime: number,
    energyConsumed: number,
    difficulty: number
  ): number {
    // Compute cost based on AWS/Google Cloud pricing (~$0.10/hour for compute)
    const computeHours = computationTime / 3600;
    const computeCost = computeHours * 0.10;

    // Energy cost based on average electricity prices (~$0.12/kWh)
    const energyCost = energyConsumed * 0.12;

    // Research multiplier for complex work (2x-5x for high-difficulty problems)
    const researchMultiplier = 1 + (Math.log10(Math.max(difficulty, 1)) * 0.8);

    return Math.round((computeCost + energyCost) * researchMultiplier);
  }

  /**
   * Calculate research impact value based on problem significance
   * Considers real-world applications and theoretical importance
   */
  private calculateResearchImpact(workType: string, difficulty: number): number {
    const impactFactors: Record<string, number> = {
      riemann_zero: 200,           // High theoretical importance
      prime_pattern: 150,          // Cryptographic applications
      yang_mills: 300,            // Millennium Prize problem
      navier_stokes: 250,         // Engineering applications
      poincare_conjecture: 225,   // Fundamental topology
      goldbach_verification: 100, // Classical number theory
      birch_swinnerton_dyer: 175, // Modern algebraic geometry
      elliptic_curve_crypto: 125, // Practical cryptography
      lattice_crypto: 110,        // Quantum-resistant crypto
      default: 75
    };

    const baseFactor = impactFactors[workType] || impactFactors.default;
    
    // Scale with difficulty but keep reasonable bounds (reduced scaling)
    const difficultyScale = Math.min(1 + (difficulty / 400), 1.5);
    
    return Math.round(baseFactor * difficultyScale);
  }

  /**
   * Validate that scientific values are within reasonable bounds
   */
  public validateScientificValue(value: number): {
    isValid: boolean;
    adjustedValue: number;
    warnings: string[];
  } {
    const warnings: string[] = [];
    let adjustedValue = value;
    let isValid = true;

    // Maximum reasonable value for a single discovery: $50K
    const MAX_SINGLE_DISCOVERY = 50000;
    if (value > MAX_SINGLE_DISCOVERY) {
      adjustedValue = MAX_SINGLE_DISCOVERY;
      warnings.push(`Value capped at $${MAX_SINGLE_DISCOVERY} (was $${value})`);
      isValid = false;
    }

    // Minimum reasonable value: $100
    const MIN_SINGLE_DISCOVERY = 100;
    if (value < MIN_SINGLE_DISCOVERY) {
      adjustedValue = MIN_SINGLE_DISCOVERY;
      warnings.push(`Value raised to minimum $${MIN_SINGLE_DISCOVERY} (was $${value})`);
      isValid = false;
    }

    return {
      isValid,
      adjustedValue,
      warnings
    };
  }

  /**
   * Calculate total scientific value for multiple discoveries
   * Applies diminishing returns to prevent inflation
   */
  public calculateAggregateValue(discoveries: Array<{ scientificValue: number }> | undefined): {
    totalValue: number;
    averageValue: number;
    adjustedTotal: number;
    diminishingFactor: number;
  } {
    // Handle undefined or empty arrays
    if (!discoveries || !Array.isArray(discoveries) || discoveries.length === 0) {
      return {
        totalValue: 0,
        averageValue: 0,
        adjustedTotal: 0,
        diminishingFactor: 1
      };
    }

    const rawTotal = discoveries.reduce((sum, d) => sum + (d?.scientificValue || 0), 0);
    const count = discoveries.length;
    const averageValue = count > 0 ? rawTotal / count : 0;

    // Apply diminishing returns for large numbers of discoveries
    // Prevents unrealistic total values
    const diminishingFactor = count > 0 ? Math.log10(count + 1) / Math.log10(count + 10) : 1;
    const adjustedTotal = Math.round(rawTotal * diminishingFactor);

    return {
      totalValue: rawTotal,
      averageValue: Math.round(averageValue),
      adjustedTotal,
      diminishingFactor
    };
  }
}

export const scientificValuationEngine = ScientificValuationEngine.getInstance();