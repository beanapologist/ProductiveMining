/**
 * Token & Economic API Endpoints - Clean token economics integration
 * Handles PROD tokens, NFTs, wallets, and economic metrics
 */

import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { APIRegistry } from "./api-registry";

export function registerTokenEndpoints(app: Express, apiRegistry: APIRegistry, broadcast: Function) {
  
  // ========== TOKEN METRICS ==========
  
  // Get comprehensive token metrics
  apiRegistry.register({
    path: '/api/token/metrics',
    method: 'GET',
    category: 'tokens',
    description: 'Get comprehensive token market metrics',
    handler: async (req: Request, res: Response) => {
      const discoveries = await storage.getRecentMathematicalWork(100);
      const totalScientificValue = discoveries.reduce((sum, d) => sum + d.scientificValue, 0);
      
      // Calculate dynamic token metrics based on network performance
      const basePrice = 10.58;
      const marketImpact = Math.min(totalScientificValue / 100000, 2.0);
      const currentPrice = basePrice + marketImpact;
      
      const tokenMetrics = {
        price: parseFloat(currentPrice.toFixed(2)),
        change24h: (marketImpact * 5).toFixed(1),
        marketCap: Math.floor(currentPrice * 55000000),
        volume24h: Math.floor(45200000 + Math.random() * 10000000),
        circulatingSupply: 55000000,
        totalSupply: 100000000,
        stakingRatio: 76.2,
        stakingRewards: 18.7,
        holders: 28450 + Math.floor(Math.random() * 1000),
        discoveryNFTs: discoveries.length,
        lastUpdated: new Date().toISOString()
      };
      
      res.json(tokenMetrics);
    }
  });

  // Get staking information
  apiRegistry.register({
    path: '/api/token/staking',
    method: 'GET',
    category: 'tokens',
    description: 'Get staking metrics and rewards information',
    handler: async (req: Request, res: Response) => {
      const stakingInfo = {
        totalStaked: 41910000, // 76.2% of circulating supply
        stakingRatio: 76.2,
        averageAPY: 18.7,
        stakingRewards: {
          daily: 0.051,
          weekly: 0.36,
          monthly: 1.56,
          yearly: 18.7
        },
        validatorCount: 13,
        minStakeAmount: 1000,
        unbondingPeriod: 21, // days
        compoundingFrequency: 'daily',
        lastRewardDistribution: new Date().toISOString()
      };
      
      res.json(stakingInfo);
    }
  });

  // Get Discovery NFT collection
  apiRegistry.register({
    path: '/api/token/nfts',
    method: 'GET',
    category: 'tokens',
    description: 'Get Discovery NFT collection and marketplace data',
    handler: async (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 50;
      const discoveries = await storage.getRecentMathematicalWork(limit);
      
      const nfts = discoveries.map(discovery => ({
        id: `NFT_${discovery.id}`,
        discoveryId: discovery.id,
        name: `${discovery.workType.replace('_', ' ').toUpperCase()} Discovery #${discovery.id}`,
        description: `Mathematical breakthrough in ${discovery.workType} with difficulty ${discovery.difficulty}`,
        image: `https://api.placeholder.com/400x400/0066cc/ffffff?text=${discovery.workType.charAt(0).toUpperCase()}`,
        attributes: {
          workType: discovery.workType,
          difficulty: discovery.difficulty,
          scientificValue: discovery.scientificValue,
          computationalCost: discovery.computationalCost,
          energyEfficiency: discovery.energyEfficiency,
          timestamp: discovery.timestamp
        },
        rarity: getRarity(discovery.difficulty),
        floorPrice: Math.max(discovery.scientificValue * 0.1, 100),
        lastSale: discovery.scientificValue * (0.8 + Math.random() * 0.4),
        holder: discovery.workerId || 'anonymous',
        verified: true
      }));
      
      const collectionStats = {
        totalNFTs: nfts.length,
        floorPrice: Math.min(...nfts.map(n => n.floorPrice)),
        totalVolume: nfts.reduce((sum, n) => sum + n.lastSale, 0),
        uniqueHolders: new Set(nfts.map(n => n.holder)).size,
        averagePrice: nfts.reduce((sum, n) => sum + n.lastSale, 0) / nfts.length
      };
      
      res.json({ nfts, collectionStats });
    }
  });

  // ========== WALLET MANAGEMENT ==========

  // Get wallet portfolio information
  apiRegistry.register({
    path: '/api/wallet/portfolio',
    method: 'GET',
    category: 'tokens',
    description: 'Get comprehensive wallet portfolio data',
    handler: async (req: Request, res: Response) => {
      const discoveries = await storage.getRecentMathematicalWork(8);
      const tokenMetrics = await getTokenMetrics();
      
      // Calculate realistic portfolio based on mining activity
      const totalDiscoveries = discoveries.length;
      const totalScientificValue = discoveries.reduce((sum, d) => sum + d.scientificValue, 0);
      
      // Portfolio allocation based on actual mining results
      const prodTokens = Math.floor(totalScientificValue * 0.3); // 30% of scientific value as tokens
      const stakedTokens = Math.floor(prodTokens * 0.65); // 65% staked
      const liquidTokens = prodTokens - stakedTokens;
      
      const portfolio = {
        totalValue: Math.floor(prodTokens * tokenMetrics.price),
        assets: {
          liquidPROD: {
            amount: liquidTokens,
            value: Math.floor(liquidTokens * tokenMetrics.price),
            percentage: ((liquidTokens / prodTokens) * 100).toFixed(1)
          },
          stakedPROD: {
            amount: stakedTokens,
            value: Math.floor(stakedTokens * tokenMetrics.price),
            percentage: ((stakedTokens / prodTokens) * 100).toFixed(1),
            apy: 18.7,
            dailyRewards: Math.floor(stakedTokens * 0.000512) // 18.7% APY daily
          },
          discoveryNFTs: {
            count: totalDiscoveries,
            estimatedValue: Math.floor(totalScientificValue * 0.7),
            percentage: ((totalScientificValue * 0.7) / (prodTokens * tokenMetrics.price + totalScientificValue * 0.7) * 100).toFixed(1),
            recentDiscoveries: discoveries.slice(0, 3).map(d => ({
              id: d.id,
              type: d.workType,
              value: d.scientificValue,
              rarity: getRarity(d.difficulty)
            }))
          }
        },
        earnings: {
          totalMined: totalScientificValue,
          todaysMining: discoveries.filter(d => 
            new Date(d.timestamp || new Date()).toDateString() === new Date().toDateString()
          ).reduce((sum, d) => sum + d.scientificValue, 0),
          stakingRewards: Math.floor(stakedTokens * 0.000512),
          nftAppreciation: Math.floor(totalScientificValue * 0.1)
        },
        walletAddress: '0x742d35Cc6475C6078E2BfA0B96b3C056E7DdDBa7',
        lastUpdated: new Date().toISOString()
      };
      
      res.json(portfolio);
    }
  });

  // Create new wallet
  apiRegistry.register({
    path: '/api/wallet/create',
    method: 'POST',
    category: 'tokens',
    description: 'Create new token wallet for user',
    handler: async (req: Request, res: Response) => {
      const { ownerType = 'researcher', ownerId = 'user_001' } = req.body;
      
      const walletAddress = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
      
      const wallet = {
        address: walletAddress,
        ownerType,
        ownerId,
        prodBalance: 1000, // Initial allocation
        stakedBalance: 0,
        nftCount: 0,
        reputationScore: 100.0,
        createdAt: new Date().toISOString()
      };
      
      broadcast({
        type: 'wallet_created',
        data: wallet
      });
      
      APIRegistry.sendSuccess(res, wallet, 'Wallet created successfully');
    }
  });

  // ========== COMMUNITY & COLLABORATION ==========

  // Get community collaboration metrics
  apiRegistry.register({
    path: '/api/community/collaboration',
    method: 'GET',
    category: 'tokens',
    description: 'Get community collaboration projects and rewards',
    handler: async (req: Request, res: Response) => {
      const collaboration = {
        activeProjects: [
          {
            id: 'quantum_research_01',
            name: 'Quantum Error Correction Enhancement',
            participants: 47,
            totalRewards: 50000,
            status: 'active',
            progress: 73,
            leadResearcher: 'Dr. Sarah Chen',
            estimatedCompletion: '2025-08-15'
          },
          {
            id: 'riemann_collective_02',
            name: 'Collaborative Riemann Hypothesis Research',
            participants: 34,
            totalRewards: 75000,
            status: 'active',
            progress: 45,
            leadResearcher: 'Prof. Michael Torres',
            estimatedCompletion: '2025-09-30'
          }
        ],
        topCollaborators: [
          { userId: 'researcher_001', name: 'Dr. Alex Kim', contributions: 234, rewards: 12500, reputation: 98.7 },
          { userId: 'researcher_002', name: 'Dr. Maria Garcia', contributions: 189, rewards: 9800, reputation: 97.2 },
          { userId: 'researcher_003', name: 'Dr. James Wilson', contributions: 167, rewards: 8900, reputation: 96.8 }
        ],
        rewardDistribution: {
          totalDistributed: 450000,
          currentWeek: 15600,
          participationBonus: 5000,
          qualityMultiplier: 1.3
        },
        communityMetrics: {
          activeMembers: 234,
          weeklyContributions: 89,
          averageRewardPerContribution: 175,
          communityScore: 94.2
        }
      };
      
      res.json(collaboration);
    }
  });
}

// Helper functions
async function getTokenMetrics() {
  const discoveries = await storage.getRecentMathematicalWork(100);
  const totalScientificValue = discoveries.reduce((sum, d) => sum + d.scientificValue, 0);
  const basePrice = 10.58;
  const marketImpact = Math.min(totalScientificValue / 100000, 2.0);
  
  return {
    price: parseFloat((basePrice + marketImpact).toFixed(2)),
    marketCap: Math.floor((basePrice + marketImpact) * 55000000)
  };
}

function getRarity(difficulty: number): string {
  if (difficulty >= 200) return 'Legendary';
  if (difficulty >= 150) return 'Epic';
  if (difficulty >= 100) return 'Rare';
  if (difficulty >= 50) return 'Uncommon';
  return 'Common';
}