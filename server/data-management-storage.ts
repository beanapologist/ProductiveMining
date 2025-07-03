import { eq, desc, and, gte, lte, count, sql } from "drizzle-orm";
import { dataManagementDb } from "./data-management-db";
import * as schema from "@shared/data-management-schema";
import type {
  DiscoveryType,
  AnyDiscovery,
  InsertRiemannZeroDiscovery,
  InsertPrimePatternDiscovery,
  InsertYangMillsDiscovery,
  InsertNavierStokesDiscovery,
  InsertGoldbachDiscovery,
  InsertPoincareeDiscovery,
  InsertBirchSwinnertonDyerDiscovery,
  InsertEllipticCurveCryptoDiscovery,
  InsertLatticeCryptoDiscovery,
} from "@shared/data-management-schema";

export class DataManagementStorage {
  private static instance: DataManagementStorage;

  public static getInstance(): DataManagementStorage {
    if (!DataManagementStorage.instance) {
      DataManagementStorage.instance = new DataManagementStorage();
    }
    return DataManagementStorage.instance;
  }

  // Get all discovery types with counts
  async getDiscoveryTypesOverview(): Promise<{
    type: DiscoveryType;
    name: string;
    count: number;
    totalValue: number;
    avgDifficulty: number;
    description: string;
  }[]> {
    const discoveryTypes = [
      {
        type: "riemann_zero" as const,
        name: "Riemann Zero Discoveries",
        table: schema.riemannZeroDiscoveries,
        description: "Zeros of the Riemann zeta function - critical for understanding prime distribution"
      },
      {
        type: "prime_pattern" as const,
        name: "Prime Pattern Discoveries",
        table: schema.primePatternDiscoveries,
        description: "Twin primes, cousin primes, and other prime number patterns"
      },
      {
        type: "yang_mills" as const,
        name: "Yang-Mills Theory",
        table: schema.yangMillsDiscoveries,
        description: "Gauge field theory solutions and mass gap discoveries"
      },
      {
        type: "navier_stokes" as const,
        name: "Navier-Stokes Solutions",
        table: schema.navierStokesDiscoveries,
        description: "Fluid dynamics equations and turbulence modeling"
      },
      {
        type: "goldbach_verification" as const,
        name: "Goldbach Verification",
        table: schema.goldbachDiscoveries,
        description: "Verifying Goldbach's conjecture for even numbers"
      },
      {
        type: "poincare_conjecture" as const,
        name: "Poincaré Conjecture",
        table: schema.poincareeDiscoveries,
        description: "Topological analysis of 3-manifolds and geometrization"
      },
      {
        type: "birch_swinnerton_dyer" as const,
        name: "Birch-Swinnerton-Dyer",
        table: schema.birchSwinnertonDyerDiscoveries,
        description: "Elliptic curve L-functions and arithmetic geometry"
      },
      {
        type: "elliptic_curve_crypto" as const,
        name: "Elliptic Curve Cryptography",
        table: schema.ellipticCurveCryptoDiscoveries,
        description: "Cryptographic applications of elliptic curves"
      },
      {
        type: "lattice_crypto" as const,
        name: "Lattice Cryptography",
        table: schema.latticeCryptoDiscoveries,
        description: "Post-quantum cryptography using lattice problems"
      },
    ];

    const results = await Promise.all(
      discoveryTypes.map(async (discoveryType) => {
        const stats = await dataManagementDb
          .select({
            count: count(),
            totalValue: sql<number>`COALESCE(SUM(${discoveryType.table.scientificValue}), 0)`,
            avgDifficulty: sql<number>`COALESCE(AVG(${discoveryType.table.difficulty}), 0)`,
          })
          .from(discoveryType.table);

        return {
          type: discoveryType.type,
          name: discoveryType.name,
          count: stats[0]?.count || 0,
          totalValue: stats[0]?.totalValue || 0,
          avgDifficulty: Math.round(stats[0]?.avgDifficulty || 0),
          description: discoveryType.description,
        };
      })
    );

    return results;
  }

  // Get discoveries by type with pagination
  async getDiscoveriesByType(
    type: DiscoveryType,
    limit: number = 50,
    offset: number = 0
  ): Promise<AnyDiscovery[]> {
    const table = schema.discoveryTables[type];
    
    const discoveries = await dataManagementDb
      .select()
      .from(table)
      .orderBy(desc(table.timestamp))
      .limit(limit)
      .offset(offset);

    return discoveries;
  }

  // Get discovery by ID and type
  async getDiscoveryById(type: DiscoveryType, id: number): Promise<AnyDiscovery | null> {
    const table = schema.discoveryTables[type];
    
    const [discovery] = await dataManagementDb
      .select()
      .from(table)
      .where(eq(table.id, id));

    return discovery || null;
  }

  // Create discovery based on type
  async createDiscovery(type: DiscoveryType, data: any): Promise<AnyDiscovery> {
    const table = schema.discoveryTables[type];
    
    const [discovery] = await dataManagementDb
      .insert(table)
      .values(data)
      .returning();

    return discovery;
  }

  // Get discovery statistics by type
  async getDiscoveryStatsByType(type: DiscoveryType): Promise<{
    total: number;
    totalValue: number;
    avgDifficulty: number;
    avgComputationTime: number;
    recentCount: number;
    difficultyDistribution: { range: string; count: number }[];
  }> {
    const table = schema.discoveryTables[type];
    
    // Get basic stats
    const [basicStats] = await dataManagementDb
      .select({
        total: count(),
        totalValue: sql<number>`COALESCE(SUM(${table.scientificValue}), 0)`,
        avgDifficulty: sql<number>`COALESCE(AVG(${table.difficulty}), 0)`,
        avgComputationTime: sql<number>`COALESCE(AVG(${table.computationTime}), 0)`,
      })
      .from(table);

    // Get recent discoveries (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [recentStats] = await dataManagementDb
      .select({
        recentCount: count(),
      })
      .from(table)
      .where(gte(table.timestamp, oneDayAgo));

    // Get difficulty distribution
    const difficultyRanges = [
      { range: "0-50", min: 0, max: 50 },
      { range: "51-100", min: 51, max: 100 },
      { range: "101-150", min: 101, max: 150 },
      { range: "151-200", min: 151, max: 200 },
      { range: "200+", min: 201, max: 9999 },
    ];

    const difficultyDistribution = await Promise.all(
      difficultyRanges.map(async (range) => {
        const [result] = await dataManagementDb
          .select({
            count: count(),
          })
          .from(table)
          .where(
            and(
              gte(table.difficulty, range.min),
              lte(table.difficulty, range.max)
            )
          );
        
        return {
          range: range.range,
          count: result?.count || 0,
        };
      })
    );

    return {
      total: basicStats?.total || 0,
      totalValue: basicStats?.totalValue || 0,
      avgDifficulty: Math.round(basicStats?.avgDifficulty || 0),
      avgComputationTime: Math.round(basicStats?.avgComputationTime || 0),
      recentCount: recentStats?.recentCount || 0,
      difficultyDistribution,
    };
  }

  // Initialize tables with sample data for testing
  async initializeSampleData(): Promise<void> {
    // This would typically migrate existing data from the main system
    // For now, let's create a few sample entries to test the system
    
    try {
      // Check if we already have data
      const [existingData] = await dataManagementDb
        .select({ count: count() })
        .from(schema.riemannZeroDiscoveries);

      if (existingData.count > 0) {
        console.log("Sample data already exists, skipping initialization");
        return;
      }

      // Create sample Riemann zero discovery
      await dataManagementDb.insert(schema.riemannZeroDiscoveries).values({
        discoveryId: "riemann_sample_001",
        minerId: "miner_001",
        difficulty: 150,
        scientificValue: 15000,
        energyConsumed: 2.5,
        computationTime: 3600,
        zeroValue: { real: 0.5, imaginary: 14.134725 },
        precision: 1e-12,
        iterations: 1000000,
        formula: "ζ(s) = 0 where s = σ + it",
        zetaFunctionValue: { real: 0.0, imaginary: 0.0 },
        verificationMethod: "numerical_verification",
        independentVerification: true,
      });

      // Create sample prime pattern discovery
      await dataManagementDb.insert(schema.primePatternDiscoveries).values({
        discoveryId: "prime_sample_001",
        minerId: "miner_002",
        difficulty: 120,
        scientificValue: 12000,
        energyConsumed: 1.8,
        computationTime: 2400,
        patternType: "twin_prime",
        primeNumbers: [41, 43],
        patternLength: 2,
        gapAnalysis: { gaps: [2], average: 2 },
        conjectureRelation: "Twin Prime Conjecture",
        distributionMetrics: { density: 0.15, spacing: 2 },
      });

      console.log("Sample data initialized successfully");
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }
}

export const dataManagementStorage = DataManagementStorage.getInstance();