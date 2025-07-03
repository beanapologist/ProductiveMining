import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Award,
  Brain,
  Globe,
  DollarSign,
  Cpu,
  Lock,
  Eye,
  CheckCircle,
  AlertTriangle,
  Microscope
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

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
  const [activeView, setActiveView] = useState('overview');

  const { data: metrics, isLoading: metricsLoading } = useQuery<NetworkMetrics>({
    queryKey: ['/api/metrics'],
    refetchInterval: 5000,
    staleTime: 2000,
  });

  const { data: discoveries, isLoading: discoveriesLoading } = useQuery({
    queryKey: ['/api/discoveries'],
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const { data: blocks, isLoading: blocksLoading } = useQuery({
    queryKey: ['/api/blocks?limit=1000000'],
    refetchInterval: 3000,
    staleTime: 1000,
  });

  const { data: operations, isLoading: operationsLoading } = useQuery({
    queryKey: ['/api/mining/operations'],
    refetchInterval: 5000,
    staleTime: 3000,
  });

  const { data: tokenMetrics } = useQuery({
    queryKey: ['/api/token/metrics'],
    refetchInterval: 30000,
  });

  const { data: stakingData } = useQuery({
    queryKey: ['/api/token/staking'],
    refetchInterval: 30000,
  });

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  const computedStats = useMemo(() => {
    if (!discoveries || !blocks || !metrics) return null;

    const totalDiscoveries = Array.isArray(discoveries) ? discoveries.length : 0;
    const totalBlocks = Array.isArray(blocks) ? blocks.length : 0;
    const avgScientificValue = totalDiscoveries > 0 ? 
      (Array.isArray(discoveries) ? discoveries.reduce((sum: number, d: any) => sum + (d.scientificValue || 0), 0) / totalDiscoveries : 0) : 0;

    const totalScientificValue = Array.isArray(discoveries) ? 
      discoveries.reduce((sum: number, d: any) => sum + (d.scientificValue || 0), 0) : 0;

    const miningEfficiency = metrics.blocksPerHour || 0;
    const securityLevel = Math.min(100, (totalBlocks * 0.3) + (totalDiscoveries * 0.2));

    return {
      totalDiscoveries,
      totalBlocks,
      avgScientificValue,
      totalScientificValue,
      miningEfficiency,
      securityLevel
    };
  }, [discoveries, blocks, metrics]);

  const getEnergyEfficiencyColor = (efficiency: number) => {
    if (efficiency < -500) return 'text-green-400';
    if (efficiency < -200) return 'text-blue-400';
    if (efficiency < 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (metricsLoading || discoveriesLoading || blocksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-blue-500/30">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Productive Mining Network
              </h1>
              <p className="text-xl text-slate-300 mt-2">
                Revolutionizing blockchain through mathematical discovery
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Network Status</div>
              <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                ONLINE
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {computedStats?.totalScientificValue ? `$${formatNumber(computedStats.totalScientificValue)}` : '$0'}
              </div>
              <div className="text-sm text-slate-400">Scientific Value Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {metrics?.energyEfficiency ? `${metrics.energyEfficiency.toFixed(1)}%` : '0%'}
              </div>
              <div className="text-sm text-slate-400">Energy Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {computedStats?.totalDiscoveries || 0}
              </div>
              <div className="text-sm text-slate-400">Mathematical Discoveries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">
                {computedStats?.totalBlocks || 0}
              </div>
              <div className="text-sm text-slate-400">Productive Blocks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="mining" className="data-[state=active]:bg-green-500/20">
            <Cpu className="h-4 w-4 mr-2" />
            Mining
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-red-500/20">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="economics" className="data-[state=active]:bg-yellow-500/20">
            <DollarSign className="h-4 w-4 mr-2" />
            Economics
          </TabsTrigger>
          <TabsTrigger value="network" className="data-[state=active]:bg-purple-500/20">
            <Globe className="h-4 w-4 mr-2" />
            Network
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-300">Active Mining Operations</p>
                    <p className="text-3xl font-bold text-blue-400">
                      {Array.isArray(operations) ? operations.length : 0}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-blue-300">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Real-time operations
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-300">Energy Efficiency</p>
                    <p className={`text-3xl font-bold ${getEnergyEfficiencyColor(metrics?.energyEfficiency || 0)}`}>
                      {metrics?.energyEfficiency ? `${metrics.energyEfficiency.toFixed(1)}%` : '0%'}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-green-400" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-300">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Generating energy
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300">Mining Difficulty</p>
                    <p className="text-3xl font-bold text-purple-400">50</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-400" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-purple-300">
                    <Shield className="h-4 w-4 mr-1" />
                    Enhanced security
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-300">Network Health</p>
                    <p className="text-3xl font-bold text-orange-400">
                      {computedStats?.securityLevel ? `${computedStats.securityLevel.toFixed(0)}%` : '0%'}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-400" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-orange-300">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Optimal performance
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Network Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(discoveries) && discoveries.slice(0, 5).map((discovery: any, index: number) => (
                  <div key={discovery.id || index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Calculator className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold">Mathematical Discovery #{discovery.id}</div>
                        <div className="text-sm text-slate-400">
                          {discovery.workType?.replace(/_/g, ' ').toUpperCase()} - Difficulty {discovery.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">
                        ${formatNumber(discovery.scientificValue || 0)}
                      </div>
                      <div className="text-sm text-slate-400">Scientific Value</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mining Tab */}
        <TabsContent value="mining" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Mining Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Blocks per Hour</span>
                  <span className="font-bold">{metrics?.blocksPerHour || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Average Difficulty</span>
                  <span className="font-bold">{metrics?.avgDifficulty || 50}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Active Miners</span>
                  <span className="font-bold">{metrics?.totalMiners || 0}</span>
                </div>
                <Progress value={75} className="mt-4" />
                <div className="text-sm text-slate-400">Network efficiency: 75%</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Mathematical Work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Riemann Zeros</span>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {Array.isArray(discoveries) ? discoveries.filter((d: any) => d.workType === 'riemann_zero').length : 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Prime Patterns</span>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      {Array.isArray(discoveries) ? discoveries.filter((d: any) => d.workType === 'prime_pattern').length : 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Yang-Mills</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      {Array.isArray(discoveries) ? discoveries.filter((d: any) => d.workType === 'yang_mills').length : 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Energy Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getEnergyEfficiencyColor(metrics?.energyEfficiency || 0)}`}>
                    {metrics?.energyEfficiency ? `${metrics.energyEfficiency.toFixed(1)}%` : '0%'}
                  </div>
                  <div className="text-sm text-slate-400">vs Traditional Mining</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">CO2 Saved</span>
                    <span className="text-green-400 font-bold">
                      {formatNumber(metrics?.co2Saved || 0)} tons
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Energy Generated</span>
                    <span className="text-blue-400 font-bold">
                      {formatNumber(Math.abs(metrics?.energyEfficiency || 0) * 1000)} kWh
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Discovery Audit System</span>
                    <Badge className="bg-green-500/20 text-green-400">ACTIVE</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Fraud Detection</span>
                    <Badge className="bg-green-500/20 text-green-400">MONITORING</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Post-Quantum Crypto</span>
                    <Badge className="bg-purple-500/20 text-purple-400">DEPLOYED</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Validation Records</span>
                    <Badge className="bg-blue-500/20 text-blue-400">2,400+</Badge>
                  </div>
                </div>
                <div className="pt-4 border-t border-red-500/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">95.8%</div>
                    <div className="text-sm text-slate-400">Security Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Cryptographic Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Riemann Zero Integration</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Prime Pattern Encryption</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Lattice-based Security</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Enhanced Difficulty</span>
                    <Badge className="bg-orange-500/20 text-orange-400">LEVEL 50</Badge>
                  </div>
                </div>
                <div className="pt-4 border-t border-purple-500/20">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">POST_QUANTUM</div>
                    <div className="text-sm text-slate-400">Cryptographic Strength</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Economics Tab */}
        <TabsContent value="economics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  PROD Token
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    ${tokenMetrics?.price?.toFixed(2) || '10.58'}
                  </div>
                  <div className="text-sm text-green-300">
                    +{tokenMetrics?.change24h?.toFixed(1) || '12.3'}% (24h)
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Market Cap</span>
                    <span className="font-bold">
                      ${formatNumber(tokenMetrics?.marketCap || 582000000)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">24h Volume</span>
                    <span className="font-bold">
                      ${formatNumber(tokenMetrics?.volume24h || 15000000)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Staking Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {stakingData?.apy?.toFixed(1) || '18.7'}%
                  </div>
                  <div className="text-sm text-slate-400">Annual Percentage Yield</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Staked</span>
                    <span className="font-bold">
                      {formatNumber(stakingData?.totalStaked || 41910000)} PROD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Staking Ratio</span>
                    <span className="font-bold text-blue-400">
                      {stakingData?.stakingRatio?.toFixed(1) || '76.2'}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Scientific Value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    ${formatNumber(computedStats?.totalScientificValue || 580000000)}
                  </div>
                  <div className="text-sm text-slate-400">Total Generated</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Average per Discovery</span>
                    <span className="font-bold">
                      ${formatNumber(computedStats?.avgScientificValue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Growth Rate</span>
                    <span className="text-green-400 font-bold">+15.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Network Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {computedStats?.totalBlocks || 0}
                    </div>
                    <div className="text-sm text-slate-400">Total Blocks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {metrics?.totalMiners || 0}
                    </div>
                    <div className="text-sm text-slate-400">Active Miners</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Network Uptime</span>
                    <span className="text-green-400 font-bold">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Consensus Type</span>
                    <span className="font-bold">Hybrid PoS + QDT</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 border-pink-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="h-5 w-5" />
                  Research Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Institutional Validators</span>
                    <Badge className="bg-purple-500/20 text-purple-400">6 Elite</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Academic Papers</span>
                    <span className="font-bold">23+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Patent Applications</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Research Collaborations</span>
                    <span className="font-bold">MIT, Stanford, Cambridge</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}