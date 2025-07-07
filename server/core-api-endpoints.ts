/**
 * Core API Endpoints - Clean, organized, and optimized
 * Handles primary blockchain operations with consistent patterns
 */

import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { insertMiningOperationSchema } from "@shared/schema";
import { APIRegistry } from "./api-registry";

export function registerCoreEndpoints(app: Express, apiRegistry: APIRegistry, broadcast: Function) {
  
  // ========== CORE DATA ENDPOINTS ==========
  
  // Get all mathematical discoveries with pagination
  apiRegistry.register({
    path: '/api/discoveries',
    method: 'GET',
    category: 'core',
    description: 'Get mathematical discoveries with optional pagination',
    handler: async (req: Request, res: Response) => {
      const limit = Math.min(parseInt(req.query.limit as string) || 1000, 10000);
      const offset = parseInt(req.query.offset as string) || 0;
      const workType = req.query.workType as string;
      
      console.log(`🔍 DISCOVERIES API: Found discoveries with limit ${limit}`);
      
      let discoveries;
      if (workType) {
        discoveries = await storage.getMathematicalWorkByType(workType, limit);
      } else {
        discoveries = await storage.getRecentMathematicalWork(limit, offset);
      }
      
      res.json(discoveries);
    }
  });

  // Get specific mathematical discovery
  apiRegistry.register({
    path: '/api/discoveries/:id',
    method: 'GET',
    category: 'core',
    description: 'Get specific mathematical discovery by ID',
    handler: async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const discovery = await storage.getMathematicalWorkById(id);
      
      if (!discovery) {
        return APIRegistry.sendError(res, 404, 'Discovery not found');
      }
      
      res.json(discovery);
    }
  });

  // Get all blockchain blocks with pagination
  apiRegistry.register({
    path: '/api/blocks',
    method: 'GET',
    category: 'core',
    description: 'Get blockchain blocks with pagination',
    handler: async (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const blocks = await storage.getAllBlocks(limit, offset);
      res.json(blocks);
    }
  });

  // Get specific block
  apiRegistry.register({
    path: '/api/blocks/:id',
    method: 'GET',
    category: 'core',
    description: 'Get specific block by ID',
    handler: async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const block = await storage.getBlockById(id);
      
      if (!block) {
        return APIRegistry.sendError(res, 404, 'Block not found');
      }
      
      res.json(block);
    }
  });

  // Get mathematical work linked to a specific block
  apiRegistry.register({
    path: '/api/blocks/:id/work',
    method: 'GET',
    category: 'core',
    description: 'Get mathematical work linked to a block',
    handler: async (req: Request, res: Response) => {
      const blockId = parseInt(req.params.id);
      const work = await storage.getMathematicalWorkByBlockId(blockId);
      res.json(work);
    }
  });

  // ========== MINING OPERATIONS ==========

  // Get active mining operations
  apiRegistry.register({
    path: '/api/mining/operations',
    method: 'GET',
    category: 'core',
    description: 'Get active mining operations',
    handler: async (req: Request, res: Response) => {
      const operations = await storage.getActiveMiningOperations();
      res.json(operations);
    }
  });

  // Start new mining operation
  apiRegistry.register({
    path: '/api/mining/start',
    method: 'POST',
    category: 'core',
    description: 'Start new mining operation',
    handler: async (req: Request, res: Response) => {
      const parseResult = insertMiningOperationSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return APIRegistry.sendError(res, 400, 'Invalid mining operation data', parseResult.error.issues);
      }

      console.log('Starting mining with:', parseResult.data);
      
      const operation = await storage.createMiningOperation(parseResult.data);
      
      broadcast({
        type: 'mining_started',
        data: operation
      });

      APIRegistry.sendSuccess(res, operation, 'Mining operation started successfully');
    }
  });

  // ========== NETWORK METRICS ==========

  // Get latest network metrics
  apiRegistry.register({
    path: '/api/metrics',
    method: 'GET',
    category: 'core',
    description: 'Get latest network performance metrics',
    handler: async (req: Request, res: Response) => {
      const metrics = await storage.getLatestNetworkMetrics();
      if (!metrics) {
        return APIRegistry.sendError(res, 404, 'No metrics available');
      }
      res.json(metrics);
    }
  });

  // Get network statistics
  apiRegistry.register({
    path: '/api/statistics',
    method: 'GET',
    category: 'core',
    description: 'Get comprehensive network statistics',
    handler: async (req: Request, res: Response) => {
      const stats = await storage.getNetworkStatistics();
      res.json(stats);
    }
  });

  // ========== VALIDATION SYSTEM ==========

  // Get PoS validations
  apiRegistry.register({
    path: '/api/validations',
    method: 'GET',
    category: 'core',
    description: 'Get Proof-of-Stake validation records',
    handler: async (req: Request, res: Response) => {
      try {
        const limit = parseInt(req.query.limit as string) || 100;
        const validations = await storage.getPosValidations(limit);
        res.json(validations || []);
      } catch (error) {
        console.error('Error fetching validations:', error);
        res.json([]);
      }
    }
  });

  // Submit for validation
  apiRegistry.register({
    path: '/api/validations/submit',
    method: 'POST',
    category: 'core',
    description: 'Submit discovery for PoS validation',
    handler: async (req: Request, res: Response) => {
      const { discoveryId, validatorId } = req.body;
      
      if (!discoveryId || !validatorId) {
        return APIRegistry.sendError(res, 400, 'discoveryId and validatorId are required');
      }

      const validation = await storage.createPosValidation({
        discoveryId,
        validatorId,
        validationResult: 'pending',
        consensusScore: 0,
        timestamp: new Date()
      });

      broadcast({
        type: 'validation_submitted',
        data: validation
      });

      APIRegistry.sendSuccess(res, validation, 'Submitted for validation');
    }
  });

  // ========== RESTART SYSTEM ==========

  // Complete blockchain restart
  apiRegistry.register({
    path: '/api/blockchain/restart',
    method: 'POST',
    category: 'system',
    description: 'Restart blockchain from genesis (development only)',
    handler: async (req: Request, res: Response) => {
      console.log('🔄 BLOCKCHAIN RESTART: Starting complete reset...');
      
      await storage.clearAllData();
      
      // Initialize fresh metrics
      await storage.createNetworkMetrics({
        totalMiners: 0,
        blocksPerHour: 0,
        energyEfficiency: -500,
        totalScientificValue: 0,
        co2Saved: 0,
        networkHealth: 1.0
      });

      broadcast({
        type: 'blockchain_restarted',
        data: { message: 'Blockchain restarted from genesis' }
      });

      APIRegistry.sendSuccess(res, { blocksCleared: true, discovariesCleared: true }, 'Blockchain restarted successfully');
    }
  });
}