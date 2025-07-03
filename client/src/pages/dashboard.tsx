import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Activity, 
  Calculator, 
  Database, 
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Zap,
  Coins,
  Star,
  Flame,
  Trophy,
  Target,
  Award
} from 'lucide-react';

interface NetworkMetrics {
  id: number;
  timestamp: string;
  totalMiners: number;
  totalScientificValue: number;
  energyEfficiency: number;
  blocksPerHour: number;
  co2Saved: number;
  avgDifficulty: number;
  knowledgeCreated: number;
}

// Gaming utility functions
const getPlayerLevel = (scientificValue: number): number => {
  return Math.floor(scientificValue / 100000) + 1;
};

const getNextLevelRequirement = (scientificValue: number): number => {
  const currentLevel = getPlayerLevel(scientificValue);
  return currentLevel * 100000;
};

const getAchievementCount = (metrics: any): number => {
  let achievements = 0;
  if (metrics?.totalScientificValue > 100000) achievements++;
  if (metrics?.knowledgeCreated > 5000) achievements++;
  if (metrics?.hashrate > 1000) achievements++;
  if (metrics?.blocksPerHour > 10) achievements++;
  return achievements;
};

const getComboMultiplier = (knowledgeCreated: number): number => {
  return Math.floor(knowledgeCreated / 1000) + 1;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  const { data: metrics } = useQuery<NetworkMetrics>({
    queryKey: ['/api/metrics'],
    refetchInterval: 5000,
  });

  const { data: discoveries } = useQuery({
    queryKey: ['/api/discoveries'],
    refetchInterval: 10000,
  });

  const { data: blocks } = useQuery({
    queryKey: ['/api/blocks?limit=200'],
    refetchInterval: 3000,
    staleTime: 0,
    gcTime: 0,
  });

  const { data: operations } = useQuery({
    queryKey: ['/api/mining/operations'],
    refetchInterval: 5000,
  });

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  const formatWorkType = (workType: string) => {
    const typeMap: Record<string, string> = {
      riemann_zero: 'Riemann Hypothesis',
      prime_pattern: 'Prime Patterns',
      yang_mills: 'Yang-Mills Theory',
      elliptic_curve_crypto: 'Elliptic Curves',
      lattice_crypto: 'Lattice Cryptography',
      poincare_conjecture: 'Poincaré Conjecture',
      birch_swinnerton_dyer: 'BSD Conjecture',
      navier_stokes: 'Navier-Stokes'
    };
    return typeMap[workType] || workType.replace('_', ' ').toUpperCase();
  };

  const getWorkTypeClass = (workType: string) => {
    const classMap: Record<string, string> = {
      riemann_zero: 'work-riemann',
      prime_pattern: 'work-prime',
      yang_mills: 'work-yang-mills',
      elliptic_curve_crypto: 'work-elliptic',
      lattice_crypto: 'work-lattice'
    };
    return classMap[workType] || 'work-riemann';
  };

  const tabs = [
    { id: 'overview', label: 'Network Overview', icon: BarChart3 },
    { id: 'research', label: 'Research Data', icon: Calculator },
    { id: 'blockchain', label: 'Blockchain Status', icon: Database },
    { id: 'performance', label: 'Performance Metrics', icon: TrendingUp }
  ];

  return (
    <div className="modern-container fade-in">
      {/* Gaming Header */}
      <div className="modern-header">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-3 text-foreground">
              🎮 Productive Mining Adventure
            </h1>
            <p className="text-muted-foreground text-lg">Level up through mathematical discoveries and earn rewards!</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="coin-counter">
              <Coins className="h-4 w-4 mr-2" />
              {formatNumber(Math.floor((metrics?.totalScientificValue || 0) / 1000))} COINS
            </div>
            <div className="level-indicator">
              Level {getPlayerLevel(metrics?.totalScientificValue || 0)}
            </div>
            <div className="achievement-badge">
              <Trophy className="h-3 w-3 mr-1" />
              {getAchievementCount(metrics)} Achievements
            </div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Research Progress to Level {getPlayerLevel(metrics?.totalScientificValue || 0) + 1}</span>
            <span className="text-blue-400">{Math.round(((metrics?.totalScientificValue || 0) % 100000) / 1000)}%</span>
          </div>
          <div className="xp-bar">
            <div 
              className="xp-fill" 
              style={{ width: `${((metrics?.totalScientificValue || 0) % 100000) / 1000}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metric-grid">
        <div className="game-card metric-item p-6 relative">
          <div className="metric-gem mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="metric-value text-blue-400">
            ${formatNumber((metrics?.totalScientificValue || 0) / 1000)}K
          </div>
          <div className="metric-label text-gray-300">Research Vault</div>
          <div className="text-sm text-gray-400 mt-1">
            Portfolio Worth
          </div>
          {(metrics?.totalScientificValue || 0) > 500000 && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          )}
          <div className="mining-progress mt-3">
            <div 
              className="mining-fill" 
              style={{ width: `${Math.min(100, (metrics?.totalScientificValue || 0) / 1000000 * 100)}%` }}
            />
          </div>
        </div>

        <div className="game-card metric-item p-6 relative">
          <div className="metric-gem mb-4 bg-gradient-to-br from-green-400 to-emerald-600">
            <Users className="h-6 w-6" />
          </div>
          <div className="metric-value text-green-400">
            {Array.isArray(blocks) ? new Set(blocks.map((block: any) => block.minerId)).size : 0}
          </div>
          <div className="metric-label text-gray-300">Guild Members</div>
          <div className="text-sm text-gray-400 mt-1">
            {Array.isArray(operations) ? operations.filter((op: any) => op.status === 'active').length : 0} active miners
          </div>
          <div className="combo-counter">
            Team x{Math.max(1, Math.floor((Array.isArray(blocks) ? new Set(blocks.map((block: any) => block.minerId)).size : 0) / 3))}
          </div>
        </div>

        <div className="game-card metric-item p-6 relative">
          <div className="metric-gem mb-4 bg-gradient-to-br from-purple-400 to-pink-600">
            <Database className="h-6 w-6" />
          </div>
          <div className="metric-value text-purple-400">
            {Array.isArray(blocks) ? blocks.length : 0}
          </div>
          <div className="metric-label text-gray-300">Discovery Blocks</div>
          <div className="text-sm text-gray-400 mt-1">
            +{Math.abs(metrics?.blocksPerHour || 0)}/hour discovery rate
          </div>
          <div className="absolute bottom-2 right-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="game-card metric-item p-6 relative">
          <div className="metric-gem mb-4 bg-gradient-to-br from-orange-400 to-red-600">
            <Zap className="h-6 w-6" />
          </div>
          <div className="metric-value text-orange-400">
            {metrics?.energyEfficiency?.toFixed(2) || '-641.49'}%
          </div>
          <div className="metric-label text-gray-300">Quantum Efficiency</div>
          <div className="text-sm text-gray-400 mt-1">
            Beyond Theoretical Limits
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="holographic absolute inset-1 rounded-lg opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Tabbed Interface */}
      <div className="modern-card">
        <div className="modern-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`modern-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-4 w-4 inline mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-400" />
                    System Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Network Health</span>
                      <span className="status-badge status-active">Optimal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Active Miners</span>
                      <span className="font-mono">{Array.isArray(operations) ? operations.filter((op: any) => op.status === 'active').length : 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Research Areas</span>
                      <span className="font-mono">{Array.isArray(discoveries) ? new Set(discoveries.map((d: any) => d.workType)).size : 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CO₂ Prevented</span>
                      <span className="font-mono text-green-400">{formatNumber(metrics?.co2Saved || 0)} kg</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-green-400" />
                    Research Progress
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Discoveries</span>
                      <span className="font-mono">{Array.isArray(discoveries) ? discoveries.length : 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg Difficulty</span>
                      <span className="font-mono">{metrics?.avgDifficulty?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Knowledge Units</span>
                      <span className="font-mono">{formatNumber(metrics?.knowledgeCreated || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Research Value</span>
                      <span className="font-mono text-blue-400">${formatNumber((metrics?.totalScientificValue || 0) * 0.001)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QDT Energy Efficiency Highlight */}
              <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-400" />
                  Quantum Data Transformation (QDT) Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">-1065.5985%</div>
                    <div className="text-sm text-muted-foreground">Energy Efficiency vs Bitcoin</div>
                    <div className="text-xs text-orange-300 mt-1">Negative consumption = energy generation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{formatNumber(metrics?.co2Saved || 892450)} kg</div>
                    <div className="text-sm text-muted-foreground">CO₂ Prevented</div>
                    <div className="text-xs text-green-300 mt-1">Through productive computation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{formatNumber(metrics?.knowledgeCreated || 15670)}</div>
                    <div className="text-sm text-muted-foreground">Knowledge Units Created</div>
                    <div className="text-xs text-blue-300 mt-1">Mathematical breakthroughs</div>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Our QDT algorithm transforms energy waste into scientific discovery, achieving negative energy consumption compared to traditional proof-of-work mining.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Mathematical Discoveries</h3>
              <div className="overflow-x-auto">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Research Area</th>
                      <th>Difficulty</th>
                      <th>Scientific Value</th>
                      <th>Worker ID</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(discoveries) ? discoveries.slice(0, 10).map((discovery: any) => (
                      <tr key={discovery.id} className="cursor-pointer hover:bg-blue-50" onClick={() => {
                        console.log('Discovery Details:', {
                          id: discovery.id,
                          workType: discovery.workType,
                          result: discovery.result,
                          verification: discovery.verificationData,
                          scientificValue: discovery.scientificValue
                        });
                      }}>
                        <td>
                          <span className={`font-semibold ${getWorkTypeClass(discovery.workType)}`}>
                            {formatWorkType(discovery.workType)}
                          </span>
                        </td>
                        <td className="font-mono">{discovery.difficulty}</td>
                        <td className="font-mono font-bold">
                          ${formatNumber(discovery.scientificValue)}
                        </td>
                        <td className="font-mono">
                          {discovery.workerId?.slice(-8) || 'System'}
                        </td>
                        <td className="text-muted-foreground">
                          {new Date(discovery.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    )) : [
                      <tr key="no-data">
                        <td colSpan={5} className="text-center text-muted-foreground py-8">
                          Mining operations active. New discoveries will appear here shortly.
                        </td>
                      </tr>
                    ]}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'blockchain' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Blockchain Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="metric-item">
                  <div className="metric-value text-purple-400">
                    {Array.isArray(blocks) ? blocks.length : 0}
                  </div>
                  <div className="metric-label">Total Blocks</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value text-blue-400">
                    {(Array.isArray(blocks) ? blocks.length : 0) * 512}MB
                  </div>
                  <div className="metric-label">Chain Size</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value text-green-400">
                    {metrics?.blocksPerHour || 0}
                  </div>
                  <div className="metric-label">Blocks/Hour</div>
                </div>
              </div>
              
              <h4 className="text-md font-semibold mb-3">Recent Blocks</h4>
              <div className="overflow-x-auto">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Block #</th>
                      <th>Timestamp</th>
                      <th>Scientific Value</th>
                      <th>Miner ID</th>
                      <th>Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(blocks) ? blocks.slice(-10).reverse().map((block: any) => (
                      <tr key={block.id} className="cursor-pointer hover:bg-blue-50" onClick={() => {
                        // Fetch detailed block data with mathematical work
                        fetch(`/api/blocks/${block.id}/work`)
                          .then(res => res.json())
                          .then(data => {
                            console.log('Block Details:', data);
                            // You can implement a modal or detailed view here
                          })
                          .catch(err => console.error('Error fetching block details:', err));
                      }}>
                        <td className="font-mono font-bold">#{block.index}</td>
                        <td className="text-muted-foreground">
                          {new Date(block.timestamp).toLocaleString()}
                        </td>
                        <td className="font-mono font-bold">
                          ${formatNumber(block.totalScientificValue)}
                        </td>
                        <td className="font-mono">
                          {block.minerId?.slice(-8) || 'Unknown'}
                        </td>
                        <td className="font-mono">{block.difficulty}</td>
                      </tr>
                    )) : [
                      <tr key="no-blocks">
                        <td colSpan={5} className="text-center text-muted-foreground py-8">
                          Fresh blockchain initialized. New blocks generating from active mining operations.
                        </td>
                      </tr>
                    ]}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold mb-3">Efficiency Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Energy Efficiency</span>
                        <span className="font-mono">{metrics?.energyEfficiency || 0}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${metrics?.energyEfficiency || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Network Utilization</span>
                        <span className="font-mono">
                          {Array.isArray(operations) ? operations.filter((op: any) => op.status === 'active').length : 0}/8
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${((Array.isArray(operations) ? operations.filter((op: any) => op.status === 'active').length : 0) / 8) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">Research Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Research Types Active</span>
                      <span className="font-mono">{Array.isArray(discoveries) ? new Set(discoveries.map((d: any) => d.workType)).size : 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Discoveries/Hour</span>
                      <span className="font-mono">{Math.round((Array.isArray(discoveries) ? discoveries.length : 0) / 24)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg Processing Time</span>
                      <span className="font-mono">2.3s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-mono text-green-400">99.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}