import { pgTable, serial, varchar, text, timestamp, integer, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base discovery interface for common fields
const baseDiscoveryFields = {
  id: serial("id").primaryKey(),
  discoveryId: varchar("discovery_id", { length: 255 }).notNull().unique(),
  minerId: varchar("miner_id", { length: 255 }).notNull(),
  difficulty: integer("difficulty").notNull(),
  scientificValue: real("scientific_value").notNull(),
  energyConsumed: real("energy_consumed").notNull(),
  computationTime: integer("computation_time").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("completed"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  blockId: integer("block_id"),
  verificationHash: varchar("verification_hash", { length: 255 }),
  cryptographicSignature: text("cryptographic_signature"),
};

// Riemann Zero Discoveries Database
export const riemannZeroDiscoveries = pgTable("riemann_zero_discoveries", {
  ...baseDiscoveryFields,
  // Riemann-specific fields
  zeroValue: jsonb("zero_value").notNull(), // { real: number, imaginary: number }
  precision: integer("precision").notNull(),
  iterations: integer("iterations").notNull(),
  formula: text("formula").notNull(),
  zetaFunctionValue: jsonb("zeta_function_value"), // { real: number, imaginary: number }
  verificationMethod: varchar("verification_method", { length: 100 }),
  independentVerification: boolean("independent_verification").default(false),
});

// Prime Pattern Discoveries Database
export const primePatternDiscoveries = pgTable("prime_pattern_discoveries", {
  ...baseDiscoveryFields,
  // Prime pattern specific fields
  patternType: varchar("pattern_type", { length: 100 }).notNull(), // twin_prime, cousin_prime, etc.
  primeNumbers: jsonb("prime_numbers").notNull(), // array of primes
  patternLength: integer("pattern_length").notNull(),
  gapAnalysis: jsonb("gap_analysis"), // gap patterns between primes
  conjectureRelation: varchar("conjecture_relation", { length: 200 }),
  distributionMetrics: jsonb("distribution_metrics"),
});

// Yang-Mills Theory Discoveries Database
export const yangMillsDiscoveries = pgTable("yang_mills_discoveries", {
  ...baseDiscoveryFields,
  // Yang-Mills specific fields
  gaugeGroup: varchar("gauge_group", { length: 100 }).notNull(),
  fieldEquations: jsonb("field_equations").notNull(),
  massGap: real("mass_gap"),
  gaugeInvariance: boolean("gauge_invariance").notNull(),
  actionFunctional: text("action_functional"),
  symmetryBreaking: jsonb("symmetry_breaking"),
  quantumCorrections: jsonb("quantum_corrections"),
});

// Navier-Stokes Discoveries Database
export const navierStokesDiscoveries = pgTable("navier_stokes_discoveries", {
  ...baseDiscoveryFields,
  // Navier-Stokes specific fields
  fluidProperties: jsonb("fluid_properties").notNull(), // viscosity, density, etc.
  boundaryConditions: jsonb("boundary_conditions").notNull(),
  velocityField: jsonb("velocity_field").notNull(),
  pressureField: jsonb("pressure_field"),
  turbulenceModel: varchar("turbulence_model", { length: 100 }),
  reynoldsNumber: real("reynolds_number"),
  existenceProof: text("existence_proof"),
  smoothnessAnalysis: jsonb("smoothness_analysis"),
});

// Goldbach Verification Discoveries Database
export const goldbachDiscoveries = pgTable("goldbach_discoveries", {
  ...baseDiscoveryFields,
  // Goldbach specific fields
  evenNumber: integer("even_number").notNull(),
  primePair: jsonb("prime_pair").notNull(), // [prime1, prime2]
  verificationRange: jsonb("verification_range"), // { start: number, end: number }
  algorithmUsed: varchar("algorithm_used", { length: 100 }),
  counterexampleSearch: boolean("counterexample_search").default(false),
  statisticalAnalysis: jsonb("statistical_analysis"),
});

// Poincaré Conjecture Discoveries Database
export const poincareeDiscoveries = pgTable("poincare_discoveries", {
  ...baseDiscoveryFields,
  // Poincaré specific fields
  manifoldDimension: integer("manifold_dimension").notNull(),
  topologicalInvariants: jsonb("topological_invariants").notNull(),
  ricciFlow: jsonb("ricci_flow"),
  surgeryOperations: jsonb("surgery_operations"),
  fundamentalGroup: text("fundamental_group"),
  geometrizationProgress: real("geometrization_progress"),
});

// Birch-Swinnerton-Dyer Discoveries Database
export const birchSwinnertonDyerDiscoveries = pgTable("birch_swinnerton_dyer_discoveries", {
  ...baseDiscoveryFields,
  // BSD specific fields
  ellipticCurve: text("elliptic_curve").notNull(),
  lFunction: jsonb("l_function").notNull(),
  rank: integer("rank"),
  torsionGroup: jsonb("torsion_group"),
  regulator: real("regulator"),
  tateShafarerichGroup: jsonb("tate_shafarevich_group"),
  conjecturalFormula: text("conjectural_formula"),
});

// Elliptic Curve Cryptography Discoveries Database
export const ellipticCurveCryptoDiscoveries = pgTable("elliptic_curve_crypto_discoveries", {
  ...baseDiscoveryFields,
  // ECC specific fields
  curveEquation: text("curve_equation").notNull(),
  fieldCharacteristic: integer("field_characteristic").notNull(),
  basePoint: jsonb("base_point").notNull(), // { x: number, y: number }
  orderOfGroup: integer("order_of_group"),
  cofactor: integer("cofactor"),
  securityLevel: integer("security_level"), // in bits
  discreteLogComplexity: real("discrete_log_complexity"),
  implementationEfficiency: jsonb("implementation_efficiency"),
});

// Lattice Cryptography Discoveries Database
export const latticeCryptoDiscoveries = pgTable("lattice_crypto_discoveries", {
  ...baseDiscoveryFields,
  // Lattice crypto specific fields
  latticeMatrix: jsonb("lattice_matrix").notNull(),
  latticeDimension: integer("lattice_dimension").notNull(),
  shortestVector: jsonb("shortest_vector"),
  latticeReduction: varchar("lattice_reduction", { length: 100 }), // LLL, BKZ, etc.
  approximationFactor: real("approximation_factor"),
  quantumResistance: boolean("quantum_resistance").default(true),
  worstCaseReduction: boolean("worst_case_reduction").default(false),
});

// Export insert schemas for each discovery type
export const insertRiemannZeroSchema = createInsertSchema(riemannZeroDiscoveries).omit({ id: true, timestamp: true });
export const insertPrimePatternSchema = createInsertSchema(primePatternDiscoveries).omit({ id: true, timestamp: true });
export const insertYangMillsSchema = createInsertSchema(yangMillsDiscoveries).omit({ id: true, timestamp: true });
export const insertNavierStokesSchema = createInsertSchema(navierStokesDiscoveries).omit({ id: true, timestamp: true });
export const insertGoldbachSchema = createInsertSchema(goldbachDiscoveries).omit({ id: true, timestamp: true });
export const insertPoincareeSchema = createInsertSchema(poincareeDiscoveries).omit({ id: true, timestamp: true });
export const insertBirchSwinnertonDyerSchema = createInsertSchema(birchSwinnertonDyerDiscoveries).omit({ id: true, timestamp: true });
export const insertEllipticCurveCryptoSchema = createInsertSchema(ellipticCurveCryptoDiscoveries).omit({ id: true, timestamp: true });
export const insertLatticeCryptoSchema = createInsertSchema(latticeCryptoDiscoveries).omit({ id: true, timestamp: true });

// Export types
export type RiemannZeroDiscovery = typeof riemannZeroDiscoveries.$inferSelect;
export type PrimePatternDiscovery = typeof primePatternDiscoveries.$inferSelect;
export type YangMillsDiscovery = typeof yangMillsDiscoveries.$inferSelect;
export type NavierStokesDiscovery = typeof navierStokesDiscoveries.$inferSelect;
export type GoldbachDiscovery = typeof goldbachDiscoveries.$inferSelect;
export type PoincareeDiscovery = typeof poincareeDiscoveries.$inferSelect;
export type BirchSwinnertonDyerDiscovery = typeof birchSwinnertonDyerDiscoveries.$inferSelect;
export type EllipticCurveCryptoDiscovery = typeof ellipticCurveCryptoDiscoveries.$inferSelect;
export type LatticeCryptoDiscovery = typeof latticeCryptoDiscoveries.$inferSelect;

export type InsertRiemannZeroDiscovery = z.infer<typeof insertRiemannZeroSchema>;
export type InsertPrimePatternDiscovery = z.infer<typeof insertPrimePatternSchema>;
export type InsertYangMillsDiscovery = z.infer<typeof insertYangMillsSchema>;
export type InsertNavierStokesDiscovery = z.infer<typeof insertNavierStokesSchema>;
export type InsertGoldbachDiscovery = z.infer<typeof insertGoldbachSchema>;
export type InsertPoincareeDiscovery = z.infer<typeof insertPoincareeSchema>;
export type InsertBirchSwinnertonDyerDiscovery = z.infer<typeof insertBirchSwinnertonDyerSchema>;
export type InsertEllipticCurveCryptoDiscovery = z.infer<typeof insertEllipticCurveCryptoSchema>;
export type InsertLatticeCryptoDiscovery = z.infer<typeof insertLatticeCryptoSchema>;

// Discovery type union for general operations
export type AnyDiscovery = 
  | RiemannZeroDiscovery 
  | PrimePatternDiscovery 
  | YangMillsDiscovery 
  | NavierStokesDiscovery 
  | GoldbachDiscovery 
  | PoincareeDiscovery 
  | BirchSwinnertonDyerDiscovery 
  | EllipticCurveCryptoDiscovery 
  | LatticeCryptoDiscovery;

// Discovery type mapping for database operations
export const discoveryTables = {
  riemann_zero: riemannZeroDiscoveries,
  prime_pattern: primePatternDiscoveries,
  yang_mills: yangMillsDiscoveries,
  navier_stokes: navierStokesDiscoveries,
  goldbach_verification: goldbachDiscoveries,
  poincare_conjecture: poincareeDiscoveries,
  birch_swinnerton_dyer: birchSwinnertonDyerDiscoveries,
  elliptic_curve_crypto: ellipticCurveCryptoDiscoveries,
  lattice_crypto: latticeCryptoDiscoveries,
} as const;

export type DiscoveryType = keyof typeof discoveryTables;