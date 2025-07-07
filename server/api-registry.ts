/**
 * Centralized API Registry for Clean Endpoint Management
 * Provides consistent routing, error handling, and documentation
 */

import type { Express, Request, Response } from "express";

interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  handler: (req: Request, res: Response) => Promise<void>;
  description: string;
  category: string;
  authenticated?: boolean;
  rateLimit?: number;
}

interface APICategory {
  name: string;
  description: string;
  endpoints: APIEndpoint[];
}

export class APIRegistry {
  private categories: Map<string, APICategory> = new Map();
  private endpoints: Map<string, APIEndpoint> = new Map();

  constructor() {
    this.initializeCategories();
  }

  private initializeCategories() {
    const categories = [
      { name: 'core', description: 'Core blockchain operations (blocks, discoveries, mining)' },
      { name: 'ai', description: 'AI-powered analysis and enhancement systems' },
      { name: 'security', description: 'Security, validation, and threat detection' },
      { name: 'tokens', description: 'Token economics and wallet management' },
      { name: 'institutional', description: 'Academic validation and institutional systems' },
      { name: 'system', description: 'System monitoring and performance metrics' },
      { name: 'quantum', description: 'Quantum enhancement and QDT memory management' }
    ];

    categories.forEach(cat => {
      this.categories.set(cat.name, { ...cat, endpoints: [] });
    });
  }

  register(endpoint: APIEndpoint): void {
    const key = `${endpoint.method}:${endpoint.path}`;
    this.endpoints.set(key, endpoint);
    
    const category = this.categories.get(endpoint.category);
    if (category) {
      category.endpoints.push(endpoint);
    }
  }

  registerRoutes(app: Express): void {
    this.endpoints.forEach((endpoint, key) => {
      const method = endpoint.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
      
      app[method](endpoint.path, async (req: Request, res: Response) => {
        try {
          await endpoint.handler(req, res);
        } catch (error) {
          console.error(`API Error ${endpoint.method} ${endpoint.path}:`, error);
          res.status(500).json({
            error: 'Internal server error',
            endpoint: endpoint.path,
            timestamp: new Date().toISOString()
          });
        }
      });
    });
  }

  getDocumentation() {
    const docs = {
      version: '2.1.0',
      totalEndpoints: this.endpoints.size,
      categories: Array.from(this.categories.values()).map(cat => ({
        name: cat.name,
        description: cat.description,
        endpointCount: cat.endpoints.length,
        endpoints: cat.endpoints.map(ep => ({
          method: ep.method,
          path: ep.path,
          description: ep.description,
          authenticated: ep.authenticated || false,
          rateLimit: ep.rateLimit
        }))
      })),
      lastUpdated: new Date().toISOString()
    };

    return docs;
  }

  // Helper method for consistent error responses
  static sendError(res: Response, statusCode: number, message: string, details?: any) {
    res.status(statusCode).json({
      error: message,
      details,
      timestamp: new Date().toISOString()
    });
  }

  // Helper method for consistent success responses
  static sendSuccess(res: Response, data: any, message?: string) {
    res.json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    });
  }
}

export const apiRegistry = new APIRegistry();