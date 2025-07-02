import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Shield, 
  TrendingUp, 
  Cpu, 
  Globe,
  Layers,
  Clock,
  Database,
  Settings
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

export default function Dashboard() {
  const { data: metrics } = useQuery<NetworkMetrics>({
    queryKey: ['/api/metrics'],
    refetchInterval: 5000,
  });

  const { data: discoveries } = useQuery({
    queryKey: ['/api/discoveries'],
    refetchInterval: 10000,
  });

  const { data: blocks } = useQuery({
    queryKey: ['/api/blocks'],
    refetchInterval: 15000,
  });

  const { data: operations } = useQuery({
    queryKey: ['/api/mining/operations'],
    refetchInterval: 5000,
  });

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getSystemStatus = () => {
    const activeOps = operations?.filter((op: any) => op.status === 'active')?.length || 0;
    if (activeOps >= 3) return { label: 'OPTIMAL', color: 'text-cyber-green', bg: 'bg-cyber-green/10' };
    if (activeOps >= 1) return { label: 'ACTIVE', color: 'text-cyber-blue', bg: 'bg-cyber-blue/10' };
    return { label: 'STANDBY', color: 'text-cyber-yellow', bg: 'bg-cyber-yellow/10' };
  };

  const systemStatus = getSystemStatus();

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold holographic">Neural Hub</h1>
          <p className="text-gray-400 mt-2">Quantum mathematical mining network status</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={`${systemStatus.bg} ${systemStatus.color} border-current`}>
            <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
            {systemStatus.label}
          </Badge>
          <div className="text-sm text-gray-400">
            <Clock className="h-4 w-4 inline mr-1" />
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Network Power</CardTitle>
            <Zap className="h-4 w-4 text-cyber-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold neon-text mb-2">
              {formatNumber(metrics?.totalScientificValue || 0)}
            </div>
            <p className="text-xs text-gray-400">Scientific units generated</p>
            <div className="mt-3">
              <Progress 
                value={Math.min(100, (metrics?.totalScientificValue || 0) / 1000000 * 100)} 
                className="h-2 progress-cyber"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Miners</CardTitle>
            <Cpu className="h-4 w-4 text-cyber-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-blue mb-2">
              {operations?.filter((op: any) => op.status === 'active').length || 0}
            </div>
            <p className="text-xs text-gray-400">Quantum processors online</p>
            <div className="mt-3 flex space-x-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < (operations?.filter((op: any) => op.status === 'active').length || 0)
                      ? 'bg-cyber-blue status-active'
                      : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Chain Blocks</CardTitle>
            <Database className="h-4 w-4 text-cyber-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-green mb-2">
              {blocks?.length || 0}
            </div>
            <p className="text-xs text-gray-400">Verified mathematical blocks</p>
            <div className="mt-3">
              <div className="text-xs text-cyber-green">
                +{metrics?.blocksPerHour || 0} blocks/hour
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Efficiency Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyber-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyber-purple mb-2">
              {metrics?.energyEfficiency || 0}%
            </div>
            <p className="text-xs text-gray-400">vs traditional mining</p>
            <div className="mt-3">
              <Progress 
                value={metrics?.energyEfficiency || 0} 
                className="h-2 bg-gray-800"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="cyber-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="mr-2 h-5 w-5 text-cyber-blue" />
              Recent Mathematical Discoveries
            </CardTitle>
            <CardDescription className="text-gray-400">
              Latest breakthroughs from the quantum network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {discoveries?.slice(0, 4).map((discovery: any, index: number) => (
              <div key={discovery.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-cyber-green rounded-full status-active"></div>
                  <div>
                    <div className="text-white font-medium">
                      {discovery.workType.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400">
                      Difficulty: {discovery.difficulty} • Worker: {discovery.workerId?.slice(-6)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-cyber-green">
                    +{formatNumber(discovery.scientificValue)} units
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(discovery.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-400">
                <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No discoveries yet. Start quantum mining to begin.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="mr-2 h-5 w-5 text-cyber-purple" />
              System Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">CO₂ Prevented</span>
              <span className="text-cyber-green font-medium">
                {formatNumber(metrics?.co2Saved || 0)} kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Avg Difficulty</span>
              <span className="text-cyber-blue font-medium">
                {metrics?.avgDifficulty?.toFixed(1) || '0.0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Knowledge Units</span>
              <span className="text-cyber-yellow font-medium">
                {formatNumber(metrics?.knowledgeCreated || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Network Uptime</span>
              <span className="text-cyber-green font-medium">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Quantum State</span>
              <span className="text-cyber-purple font-medium">STABLE</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Layers className="mr-2 h-5 w-5 text-cyber-orange" />
            Quantum Network Overview
          </CardTitle>
          <CardDescription className="text-gray-400">
            Real-time mathematical computation replacing wasteful proof-of-work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-900/30 rounded-lg border border-gray-800">
              <div className="text-2xl font-bold text-cyber-blue mb-2">
                {discoveries?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Mathematical Proofs</div>
              <div className="text-xs text-cyber-blue mt-1">Riemann • Prime • Yang-Mills</div>
            </div>
            <div className="text-center p-4 bg-gray-900/30 rounded-lg border border-gray-800">
              <div className="text-2xl font-bold text-cyber-green mb-2">
                {formatNumber((metrics?.totalScientificValue || 0) * 0.1)}
              </div>
              <div className="text-sm text-gray-400">Economic Value</div>
              <div className="text-xs text-cyber-green mt-1">USD Equivalent</div>
            </div>
            <div className="text-center p-4 bg-gray-900/30 rounded-lg border border-gray-800">
              <div className="text-2xl font-bold text-cyber-purple mb-2">
                {(blocks?.length || 0) * 256}KB
              </div>
              <div className="text-sm text-gray-400">Chain Storage</div>
              <div className="text-xs text-cyber-purple mt-1">Mathematical Data</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}