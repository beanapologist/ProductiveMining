import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMiningOperationSchema, type WebSocketMessage, type MiningProgressMessage, type BlockMinedMessage } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store active WebSocket connections
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to WebSocket');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected from WebSocket');
    });

    // Send initial data
    sendInitialData(ws);
  });

  // Broadcast function
  function broadcast(message: WebSocketMessage) {
    const data = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  async function sendInitialData(ws: WebSocket) {
    try {
      const metrics = await storage.getLatestNetworkMetrics();
      const operations = await storage.getActiveMiningOperations();
      const blocks = await storage.getRecentBlocks(5);

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'initial_data',
          data: { metrics, operations, blocks }
        }));
      }
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  // API Routes

  // Get network metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getLatestNetworkMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Get recent blocks
  app.get("/api/blocks", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const blocks = await storage.getRecentBlocks(limit);
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blocks" });
    }
  });

  // Get block by index with mathematical work
  app.get("/api/blocks/:index", async (req, res) => {
    try {
      const index = parseInt(req.params.index);
      const block = await storage.getBlockByIndex(index);
      if (!block) {
        return res.status(404).json({ error: "Block not found" });
      }

      const blockWithWork = await storage.getBlockWithMathematicalWork(block.id);
      res.json(blockWithWork);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch block" });
    }
  });

  // Get active mining operations
  app.get("/api/mining/operations", async (req, res) => {
    try {
      const operations = await storage.getActiveMiningOperations();
      res.json(operations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mining operations" });
    }
  });

  // Start new mining operation
  app.post("/api/mining/start", async (req, res) => {
    try {
      const operationData = insertMiningOperationSchema.parse(req.body);
      const operation = await storage.createMiningOperation(operationData);
      
      // Broadcast new operation
      broadcast({
        type: 'mining_progress',
        data: operation
      });

      res.json(operation);
    } catch (error) {
      res.status(400).json({ error: "Invalid operation data" });
    }
  });

  // Get recent mathematical discoveries
  app.get("/api/discoveries", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const discoveries = await storage.getRecentMathematicalWork(limit);
      res.json(discoveries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch discoveries" });
    }
  });

  // Simulate mining progress updates
  setInterval(async () => {
    try {
      const operations = await storage.getActiveMiningOperations();
      
      for (const operation of operations) {
        // Simulate progress
        const progressIncrement = Math.random() * 0.05; // 0-5% progress per update
        const newProgress = Math.min(operation.progress + progressIncrement, 1.0);
        
        const updatedOperation = await storage.updateMiningOperation(operation.id, {
          progress: newProgress,
          status: newProgress >= 1.0 ? 'completed' : 'active'
        });

        if (updatedOperation) {
          broadcast({
            type: 'mining_progress',
            data: updatedOperation
          });

          // If operation completed, create discovery
          if (newProgress >= 1.0 && operation.status === 'active') {
            const discovery = await storage.createMathematicalWork({
              workType: operation.operationType,
              difficulty: operation.difficulty,
              result: operation.currentResult || {},
              verificationData: { verified: true },
              computationalCost: operation.difficulty * 1000,
              energyEfficiency: Math.random() * 1000 + 500,
              scientificValue: Math.random() * 5000 + 1000,
              workerId: operation.minerId,
              signature: Math.random().toString(36).substring(2, 66)
            });

            broadcast({
              type: 'discovery_made',
              data: discovery
            });
          }
        }
      }

      // Update network metrics periodically
      const currentMetrics = await storage.getLatestNetworkMetrics();
      if (currentMetrics) {
        const updatedMetrics = await storage.createNetworkMetrics({
          totalMiners: currentMetrics.totalMiners + Math.floor(Math.random() * 20 - 10),
          blocksPerHour: currentMetrics.blocksPerHour + Math.floor(Math.random() * 10 - 5),
          energyEfficiency: currentMetrics.energyEfficiency + Math.random() * 50 - 25,
          totalScientificValue: currentMetrics.totalScientificValue + Math.random() * 10000,
          co2Saved: currentMetrics.co2Saved + Math.random() * 10,
          networkHealth: Math.min(Math.max(currentMetrics.networkHealth + (Math.random() * 0.004 - 0.002), 0.95), 1.0)
        });

        broadcast({
          type: 'metrics_update',
          data: updatedMetrics
        });
      }

    } catch (error) {
      console.error('Error in mining simulation:', error);
    }
  }, 3000); // Update every 3 seconds

  return httpServer;
}
