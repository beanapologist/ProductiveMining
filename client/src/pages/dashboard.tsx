import { useState, useMemo } from 'react';
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

  const { data: metrics, isLoading: metricsLoading } = useQuery<NetworkMetrics>({
    queryKey: ['/api/metrics'],
    refetchInterval: 5000,
    staleTime: 2000, // Keep data fresh for 2 seconds
  });

  const { data: discoveries, isLoading: discoveriesLoading } = useQuery({
    queryKey: ['/api/discoveries'],
    refetchInterval: 10000,
    staleTime: 5000, // Keep data fresh for 5 seconds
  });

  const { data: blocks, isLoading: blocksLoading } = useQuery({
    queryKey: ['/api/blocks?limit=1000000'],
    refetchInterval: 3000,
    staleTime: 1000, // Keep data fresh for 1 second
    gcTime: 30000, // Keep in cache for 30 seconds
  });

  const { data: operations, isLoading: operationsLoading } = useQuery({
    queryKey: ['/api/mining/operations'],
    refetchInterval: 5000,
    staleTime: 3000, // Keep data fresh for 3 seconds
  });

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  // Memoized calculations for better performance
  const computedStats = useMemo(() => {
    if (!discoveries || !blocks || !metrics) return null;

    const totalDiscoveries = Array.isArray(discoveries) ? discoveries.length : 0;
    const totalBlocks = Array.isArray(blocks) ? blocks.length : 0;
    const avgScientificValue = totalDiscoveries > 0 ? 
      (Array.isArray(discoveries) ? discoveries.reduce((sum: number, d: any) => sum + (d.scientificValue || 0), 0) / totalDiscoveries : 0) : 0;

    const totalScientificValue = Array.isArray(discoveries) ? 
      discoveries.reduce((sum: number, d: any) => sum + (d.scientificValue || 0), 0) : 0;

    const playerLevel = getPlayerLevel(totalScientificValue);
    const nextLevelReq = getNextLevelRequirement(totalScientificValue);
    const progressToNext = ((totalScientificValue % 100000) / 100000) * 100;
    const achievements = getAchievementCount(metrics);
    const comboMultiplier = getComboMultiplier(metrics?.knowledgeCreated || 0);
    
    // Calculate discovery rate (discoveries per hour)
    const currentTime = new Date();
    const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
    const recentDiscoveries = Array.isArray(discoveries) ? discoveries.filter((d: any) => {
      const discoveryTime = new Date(d.timestamp || d.createdAt);
      return discoveryTime >= oneHourAgo;
    }) : [];
    const discoveryRate = recentDiscoveries.length;

    return {
      totalDiscoveries,
      totalBlocks,
      avgScientificValue,
      totalScientificValue,
      playerLevel,
      nextLevelReq,
      progressToNext,
      achievements,
      comboMultiplier,
      discoveryRate: Math.max(0, discoveryRate) // Ensure non-negative
    };
  }, [discoveries, blocks, metrics]);

  if (metricsLoading || discoveriesLoading || blocksLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="game-card p-8 text-center">
          <div className="animate-spin text-6xl mb-4">⚡</div>
          <h2 className="text-xl font-bold text-blue-400">Loading Neural Hub...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Player Stats */}
        <div className="game-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                🧠 Research Neural Hub
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="player-level">
                  Level {computedStats?.playerLevel || 1} Researcher
                </div>
                <div className="achievement-badge">
                  🏆 {computedStats?.achievements || 0} Achievements
                </div>
              </div>
            </div>
            <div className="coin-counter">
              <div className="text-3xl font-bold text-yellow-400">
                💰 {formatNumber(computedStats?.totalScientificValue || 0)}
              </div>
              <div className="text-sm text-yellow-200">Research Coins</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="xp-bar-container">
            <div className="flex justify-between text-sm mb-1">
              <span>Level {computedStats?.playerLevel || 1}</span>
              <span>Level {(computedStats?.playerLevel || 1) + 1}</span>
            </div>
            <div className="xp-bar">
              <div 
                className="xp-progress" 
                style={{ width: `${computedStats?.progressToNext || 0}%` }}
              ></div>
            </div>
            <div className="text-center text-xs mt-1 text-slate-400">
              {formatNumber(computedStats?.totalScientificValue || 0)} / {formatNumber(computedStats?.nextLevelReq || 100000)} Research Points
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Operations */}
          <div className="game-card stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">{Array.isArray(operations) ? operations.length : 0}</div>
            <div className="stat-label">Active Operations</div>
            <div className="stat-description">
              <Activity className="h-4 w-4 text-blue-400" />
              <span>Quantum mining in progress</span>
            </div>
          </div>

          {/* Discovery Rate */}
          <div className="game-card stat-card">
            <div className="stat-icon">🔬</div>
            <div className="stat-value">{computedStats?.discoveryRate || 0}/hr</div>
            <div className="stat-label">Discovery Rate</div>
            <div className="stat-description">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span>Mathematical breakthroughs</span>
            </div>
          </div>

          {/* Energy Efficiency */}
          <div className="game-card stat-card">
            <div className="stat-icon">🌿</div>
            <div className="stat-value energy-positive">
              {metrics?.energyEfficiency ? `${metrics.energyEfficiency.toFixed(1)}%` : '0%'}
            </div>
            <div className="stat-label">Energy Efficiency</div>
            <div className="stat-description">
              <Zap className="h-4 w-4 text-green-400" />
              <span>vs Traditional Mining</span>
            </div>
          </div>

          {/* Combo Multiplier */}
          <div className="game-card stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value combo-multiplier">x{computedStats?.comboMultiplier || 1}</div>
            <div className="stat-label">Knowledge Combo</div>
            <div className="stat-description">
              <Flame className="h-4 w-4 text-orange-400" />
              <span>Research multiplier</span>
            </div>
          </div>
        </div>

        {/* Gaming-style Metric Gems */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="metric-gem gem-blue">
            <div className="gem-icon">💎</div>
            <div className="gem-value">{computedStats?.totalBlocks || 0}</div>
            <div className="gem-label">Data Blocks</div>
          </div>
          
          <div className="metric-gem gem-purple">
            <div className="gem-icon">🧮</div>
            <div className="gem-value">{computedStats?.totalDiscoveries || 0}</div>
            <div className="gem-label">Discoveries</div>
          </div>
          
          <div className="metric-gem gem-green">
            <div className="gem-icon">⚡</div>
            <div className="gem-value">{metrics?.blocksPerHour || 0}/hr</div>
            <div className="gem-label">Block Rate</div>
          </div>
          
          <div className="metric-gem gem-orange">
            <div className="gem-icon">🎯</div>
            <div className="gem-value">50</div>
            <div className="gem-label">Difficulty</div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="game-card">
          <div className="card-header">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              Recent Mathematical Discoveries
            </h3>
          </div>
          <div className="space-y-3 mt-4">
            {Array.isArray(discoveries) && discoveries.slice(0, 8).map((discovery: any, index: number) => (
              <div key={discovery.id || index} className="leaderboard-row">
                <div className="rank-badge">#{discovery.id}</div>
                <div className="player-info">
                  <div className="player-name">
                    {discovery.workType?.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div className="player-level">Difficulty {discovery.difficulty}</div>
                </div>
                <div className="player-score">
                  💰 {formatNumber(discovery.scientificValue || 0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="game-card">
            <div className="card-header">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                Network Performance
              </h3>
            </div>
            <div className="space-y-4 mt-4">
              <div className="progress-bar-container">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Mining Efficiency</span>
                  <span className="text-blue-400">85%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div className="progress-bar-container">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Network Security</span>
                  <span className="text-green-400">96%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-green-400" style={{ width: '96%' }}></div>
                </div>
              </div>
              
              <div className="progress-bar-container">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Discovery Quality</span>
                  <span className="text-purple-400">92%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-purple-400" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="game-card">
            <div className="card-header">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-400" />
                Security Status
              </h3>
            </div>
            <div className="space-y-3 mt-4">
              <div className="security-item">
                <div className="security-icon">🔒</div>
                <div className="security-info">
                  <div className="security-name">Post-Quantum Crypto</div>
                  <div className="security-status active">ACTIVE</div>
                </div>
              </div>
              
              <div className="security-item">
                <div className="security-icon">🛡️</div>
                <div className="security-info">
                  <div className="security-name">Discovery Audit System</div>
                  <div className="security-status active">MONITORING</div>
                </div>
              </div>
              
              <div className="security-item">
                <div className="security-icon">🔍</div>
                <div className="security-info">
                  <div className="security-name">Fraud Detection</div>
                  <div className="security-status active">SCANNING</div>
                </div>
              </div>
              
              <div className="security-item">
                <div className="security-icon">⚡</div>
                <div className="security-info">
                  <div className="security-name">Real-time Validation</div>
                  <div className="security-status active">ONLINE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}