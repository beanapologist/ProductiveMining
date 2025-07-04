// Mock API service for GitHub Pages deployment
// Simulates backend responses with realistic data

export const mockApi = {
  // Dashboard metrics
  async getMetrics() {
    return {
      activeMiners: 9,
      blocksPerHour: 11,
      energyEfficiency: -635.41,
      scientificValue: 71975,
      totalDiscoveries: 82,
      networkHashrate: 1440,
      quantumCoherence: 70.0,
      validationAccuracy: 94.7,
      securityScore: 100
    };
  },

  // Mathematical discoveries
  async getDiscoveries() {
    return Array.from({ length: 82 }, (_, i) => ({
      id: i + 1,
      workType: ['riemann_zero', 'prime_pattern', 'yang_mills', 'goldbach_verification', 'navier_stokes'][i % 5],
      difficulty: 150 + (i % 50),
      scientificValue: Math.floor(Math.random() * 2000) + 1200,
      result: {
        formula: `ζ(s) = 0 at s = ${(0.5 + Math.random() * 14).toFixed(3)} + ${(Math.random() * 100).toFixed(3)}i`,
        precision: Math.floor(Math.random() * 15) + 10,
        computationTime: Math.floor(Math.random() * 300) + 60
      },
      verified: true,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
      minerId: `miner-${Math.floor(Math.random() * 10) + 1}`
    }));
  },

  // Blocks
  async getBlocks() {
    return Array.from({ length: 227 }, (_, i) => ({
      id: i + 1,
      index: i,
      previousHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      merkleRoot: `0x${Math.random().toString(16).substr(2, 64)}`,
      difficulty: 150 + (i % 50),
      totalScientificValue: Math.floor(Math.random() * 50000) + 10000,
      energyConsumed: Math.random() * 0.5 + 0.1,
      knowledgeCreated: Math.floor(Math.random() * 10) + 1,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 60).toISOString(),
      minerId: `miner-${Math.floor(Math.random() * 10) + 1}`
    }));
  },

  // Mining operations
  async getMiningOperations() {
    return [];
  },

  // PoS validators
  async getValidators() {
    return [
      {
        id: 'validator-mit-001',
        name: 'MIT Research Validator',
        stakeAmount: 125000,
        reputation: 98.5,
        validatedBlocks: 156,
        status: 'active',
        uptime: 99.8,
        lastActivity: new Date().toISOString()
      },
      {
        id: 'validator-stanford-001',
        name: 'Stanford AI Lab',
        stakeAmount: 98000,
        reputation: 97.2,
        validatedBlocks: 142,
        status: 'active',
        uptime: 99.6,
        lastActivity: new Date().toISOString()
      }
    ];
  },

  // PoR status
  async getProofOfResearchStatus() {
    return {
      activeValidators: 6,
      totalValidations: 0,
      recentValidations: 0,
      averageQualityScore: 0,
      queueLength: 0,
      consensusThreshold: 0.75,
      qualityThreshold: 70,
      lastActivity: new Date().toISOString()
    };
  },

  // PoR validators
  async getResearchValidators() {
    return [
      {
        id: 'validator-mit-001',
        name: 'Dr. Sarah Chen',
        institution: 'MIT',
        researchFields: ['Number Theory', 'Computational Mathematics'],
        publicationCount: 127,
        hIndex: 42,
        reputation: 98.5,
        validationAccuracy: 96.8,
        totalValidations: 1247,
        lastActive: new Date().toISOString()
      },
      {
        id: 'validator-stanford-002',
        name: 'Prof. Michael Rodriguez',
        institution: 'Stanford University',
        researchFields: ['Quantum Field Theory', 'Mathematical Physics'],
        publicationCount: 89,
        hIndex: 38,
        reputation: 97.2,
        validationAccuracy: 95.3,
        totalValidations: 892,
        lastActive: new Date().toISOString()
      }
    ];
  },

  // Token metrics
  async getTokenMetrics() {
    return {
      price: 10.58,
      priceChange24h: 12.3,
      marketCap: 582000000,
      volume24h: 24500000,
      circulatingSupply: 55000000,
      totalSupply: 100000000
    };
  },

  // Wallet data
  async getWalletData() {
    return {
      address: '0x742d35Cc6Ba8D8E2C21c7...',
      balance: {
        liquid: 2847,
        staked: 5200,
        total: 8047
      },
      nfts: 8,
      portfolioValue: 96955
    };
  }
};

// Override fetch for GitHub Pages
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  
  window.fetch = async (url: string | URL | Request, options?: RequestInit) => {
    const urlString = url.toString();
    
    // Intercept API calls and return mock data
    if (urlString.includes('/api/metrics')) {
      return new Response(JSON.stringify(await mockApi.getMetrics()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/api/discoveries')) {
      return new Response(JSON.stringify(await mockApi.getDiscoveries()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/api/blocks')) {
      return new Response(JSON.stringify(await mockApi.getBlocks()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/api/mining/operations')) {
      return new Response(JSON.stringify(await mockApi.getMiningOperations()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/api/validators')) {
      return new Response(JSON.stringify(await mockApi.getValidators()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/api/proof-of-research/status')) {
      return new Response(JSON.stringify(await mockApi.getProofOfResearchStatus()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/api/proof-of-research/validators')) {
      return new Response(JSON.stringify(await mockApi.getResearchValidators()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/api/token/metrics')) {
      return new Response(JSON.stringify(await mockApi.getTokenMetrics()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/api/wallet')) {
      return new Response(JSON.stringify(await mockApi.getWalletData()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return empty arrays for other API endpoints
    if (urlString.includes('/api/')) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Fallback to original fetch for other requests
    return originalFetch(url, options);
  };
}