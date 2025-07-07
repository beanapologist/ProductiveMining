/**
 * Clean Routes Configuration - Organized API Architecture
 * Uses modular endpoint registration for maintainable code
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMiningOperationSchema, type WebSocketMessage } from "@shared/schema";

// Import modular endpoint registrations
import { APIRegistry } from "./api-registry";
import { registerCoreEndpoints } from "./core-api-endpoints";
import { registerSecurityEndpoints } from "./security-api-endpoints";
import { registerTokenEndpoints } from "./token-api-endpoints";
import { registerSystemEndpoints } from "./system-api-endpoints";

// Import QDT routes
import qdtRoutes, { setQDTManager } from "./qdt-api-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize network metrics if none exist
  const existingMetrics = await storage.getLatestNetworkMetrics();
  if (!existingMetrics) {
    await storage.createNetworkMetrics({
      totalMiners: 1,
      blocksPerHour: 0,
      energyEfficiency: -500,
      totalScientificValue: 0,
      co2Saved: 0,
      networkHealth: 1.0
    });
  }

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  // Initialize API Registry
  const apiRegistry = new APIRegistry();

  // WebSocket Management
  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to WebSocket');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });

    sendInitialData(ws);
  });

  // Broadcast function for real-time updates
  function broadcast(message: WebSocketMessage) {
    const data = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  // Send initial data to new WebSocket connections
  async function sendInitialData(ws: WebSocket) {
    try {
      const [blocks, discoveries, operations, metrics] = await Promise.all([
        storage.getAllBlocks(10),
        storage.getRecentMathematicalWork(20),
        storage.getActiveMiningOperations(),
        storage.getLatestNetworkMetrics()
      ]);

      ws.send(JSON.stringify({
        type: 'initial_data',
        data: { blocks, discoveries, operations, metrics }
      }));
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  // Register QDT Memory Management routes
  app.use('/api', qdtRoutes);
  const qdtMemory = app.get('qdtMemory');
  if (qdtMemory) {
    setQDTManager(qdtMemory);
  }

  // Register modular endpoint categories
  registerCoreEndpoints(app, apiRegistry, broadcast);
  registerSecurityEndpoints(app, apiRegistry, broadcast);
  registerTokenEndpoints(app, apiRegistry, broadcast);
  registerSystemEndpoints(app, apiRegistry, broadcast);

  // Apply all registered routes to the Express app
  apiRegistry.registerRoutes(app);

  // Legacy compatibility endpoints (to be deprecated)
  app.get('/api/about', (req, res) => {
    res.redirect('/api/overview');
  });

  // WebSocket cleanup and maintenance
  setInterval(async () => {
    try {
      // Clean disconnected WebSocket clients
      const disconnectedClients = Array.from(clients).filter(ws => 
        ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING
      );
      
      disconnectedClients.forEach(client => clients.delete(client));
      
      if (disconnectedClients.length > 0) {
        console.log(`🧹 WEBSOCKET CLEANUP: Removed ${disconnectedClients.length} disconnected clients`);
      }

      // Clean old network metrics (keep only last 100 entries)
      const { db } = await import('./db');
      const { networkMetrics } = await import('@shared/schema');
      const { sql } = await import('drizzle-orm');
      
      const metricsCount = await db.select({ count: sql`count(*)` }).from(networkMetrics);
      const currentCount = Number(metricsCount[0]?.count || 0);
      
      if (currentCount > 100) {
        await db.execute(sql`
          DELETE FROM ${networkMetrics} 
          WHERE id NOT IN (
            SELECT id FROM ${networkMetrics} 
            ORDER BY timestamp DESC 
            LIMIT 100
          )
        `);
        console.log(`🧹 METRICS CLEANUP: Trimmed to 100 recent metrics (was ${currentCount})`);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }, 3 * 60 * 1000); // Every 3 minutes

  console.log(`✅ API CLEANUP COMPLETE: ${apiRegistry.getDocumentation().totalEndpoints} endpoints registered across ${apiRegistry.getDocumentation().categories.length} categories`);
  
  return httpServer;
}