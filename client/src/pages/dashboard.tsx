import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Calculator, 
  Shield, 
  TrendingUp, 
  Cpu, 
  Users,
  Database,
  Clock,
  Zap,
  BarChart3
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
    if (activeOps >= 3) return { label: 'High Performance', color: 'text-math-green', indicator: 'status-active' };
    if (activeOps >= 1) return { label: 'Active Computing', color: 'text-math-blue', indicator: 'status-active' };
    return { label: 'Standby', color: 'text-math-yellow', indicator: 'status-pending' };
  };

  const systemStatus = getSystemStatus();

  const getWorkTypeBadgeClass = (workType: string) => {
    switch (workType) {
      case 'riemann_zero': return 'badge-riemann';
      case 'prime_pattern': return 'badge-prime';
      case 'yang_mills': return 'badge-yang-mills';
      case 'elliptic_curve_crypto': return 'badge-elliptic';
      default: return 'badge-riemann';
    }
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

  return (
    <div className="min-h-screen p-6 space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Computation Dashboard</h1>
          <p className="text-muted-foreground mt-2">Mathematical mining network overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className={`${systemStatus.color} border-current`}>
            <div className={`status-indicator ${systemStatus.indicator} mr-2`}></div>
            {systemStatus.label}
          </Badge>
          <div className="text-sm text-muted-foreground">
            <Clock className="h-4 w-4 inline mr-1" />
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="computation-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="compute-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scientific Value</CardTitle>
            <Calculator className="h-4 w-4 text-math-green" />
          </CardHeader>
          <CardContent>
            <div className="metric-value text-3xl font-bold text-math-green mb-2">
              {formatNumber(metrics?.totalScientificValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Mathematical units generated</p>
            <div className="mt-3">
              <Progress 
                value={Math.min(100, (metrics?.totalScientificValue || 0) / 1000000 * 100)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="compute-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Computers</CardTitle>
            <Cpu className="h-4 w-4 text-math-blue" />
          </CardHeader>
          <CardContent>
            <div className="metric-value text-3xl font-bold text-math-blue mb-2">
              {operations?.filter((op: any) => op.status === 'active').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Computing mathematical proofs</p>
            <div className="mt-3 flex space-x-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < (operations?.filter((op: any) => op.status === 'active').length || 0)
                      ? 'status-active'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="compute-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blockchain</CardTitle>
            <Database className="h-4 w-4 text-math-purple" />
          </CardHeader>
          <CardContent>
            <div className="metric-value text-3xl font-bold text-math-purple mb-2">
              {blocks?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Mathematical blocks</p>
            <div className="mt-3">
              <div className="text-xs text-math-purple">
                +{metrics?.blocksPerHour || 0} blocks/hour
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="compute-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-math-orange" />
          </CardHeader>
          <CardContent>
            <div className="metric-value text-3xl font-bold text-math-orange mb-2">
              {metrics?.energyEfficiency || 0}%
            </div>
            <p className="text-xs text-muted-foreground">vs traditional mining</p>
            <div className="mt-3">
              <Progress 
                value={metrics?.energyEfficiency || 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="compute-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="mr-2 h-5 w-5 text-math-blue" />
              Recent Mathematical Research
            </CardTitle>
            <CardDescription>
              Latest computational discoveries and proofs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {discoveries?.slice(0, 5).map((discovery: any) => (
              <div key={discovery.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="status-indicator status-active"></div>
                  <div>
                    <div className="text-white font-medium">
                      {formatWorkType(discovery.workType)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Difficulty: {discovery.difficulty} • Worker: {discovery.workerId?.slice(-6)}
                    </div>
                  </div>
                  <Badge className={`computation-badge ${getWorkTypeBadgeClass(discovery.workType)}`}>
                    {discovery.workType.split('_')[0]}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="metric-value text-sm text-math-green">
                    +{formatNumber(discovery.scientificValue)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(discovery.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No mathematical work completed yet.</p>
                <p className="text-sm">Start mining to begin generating discoveries.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="compute-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="mr-2 h-5 w-5 text-math-green" />
              Network Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">CO₂ Saved</span>
              <span className="metric-value text-math-green">
                {formatNumber(metrics?.co2Saved || 0)} kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Difficulty</span>
              <span className="metric-value text-math-blue">
                {metrics?.avgDifficulty?.toFixed(1) || '0.0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Knowledge Units</span>
              <span className="metric-value text-math-yellow">
                {formatNumber(metrics?.knowledgeCreated || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Research Areas</span>
              <span className="metric-value text-math-purple">
                {new Set(discoveries?.map((d: any) => d.workType)).size || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Network Health</span>
              <span className="metric-value text-math-green">Optimal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Computational Summary */}
      <Card className="compute-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="mr-2 h-5 w-5 text-math-yellow" />
            Mathematical Mining Overview
          </CardTitle>
          <CardDescription>
            Productive computation replacing wasteful proof-of-work algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted/20 rounded-lg border">
              <div className="metric-value text-2xl font-bold text-math-blue mb-2">
                {discoveries?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Proofs Generated</div>
              <div className="text-xs text-math-blue mt-1">Mathematical theorems</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg border">
              <div className="metric-value text-2xl font-bold text-math-green mb-2">
                ${formatNumber((metrics?.totalScientificValue || 0) * 0.001)}
              </div>
              <div className="text-sm text-muted-foreground">Research Value</div>
              <div className="text-xs text-math-green mt-1">Economic equivalent</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg border">
              <div className="metric-value text-2xl font-bold text-math-purple mb-2">
                {(blocks?.length || 0) * 512}MB
              </div>
              <div className="text-sm text-muted-foreground">Data Storage</div>
              <div className="text-xs text-math-purple mt-1">Mathematical records</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg border">
              <div className="metric-value text-2xl font-bold text-math-orange mb-2">
                {operations?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Operations</div>
              <div className="text-xs text-math-orange mt-1">Computation jobs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}