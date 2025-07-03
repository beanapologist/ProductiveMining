import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as dataManagementSchema from "@shared/data-management-schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const dataManagementPool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Use a separate connection pool for data management
  max: 10,
  idleTimeoutMillis: 30000,
});

export const dataManagementDb = drizzle({ 
  client: dataManagementPool, 
  schema: dataManagementSchema 
});

// Individual database connections for each discovery type
export const discoveryDatabases = {
  riemann_zero: dataManagementDb,
  prime_pattern: dataManagementDb, 
  yang_mills: dataManagementDb,
  navier_stokes: dataManagementDb,
  goldbach_verification: dataManagementDb,
  poincare_conjecture: dataManagementDb,
  birch_swinnerton_dyer: dataManagementDb,
  elliptic_curve_crypto: dataManagementDb,
  lattice_crypto: dataManagementDb,
} as const;

// Discovery type validation
export const isValidDiscoveryType = (type: string): type is keyof typeof discoveryDatabases => {
  return type in discoveryDatabases;
};