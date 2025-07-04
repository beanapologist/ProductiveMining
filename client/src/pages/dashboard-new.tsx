import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PerformanceSparklineGrid, CompactSparklineRow } from "@/components/performance-sparklines";
import { 
  BarChart3, 
  Brain, 
  Target, 
  Shield, 
  Pickaxe,
  Users,
  Database,
  Zap,
  TrendingUp,
  Award,
  Calculator,
  Activity,
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface MiningOperationData {
  id: number;
  operationType: string;
  difficulty: number;
  workerId: string;
  startTime: string;
  status: string;
  progress: number;
}

interface MathematicalWork {
  id: number;
  workType: string;
  difficulty: number;
  result: any;
  verificationData: any;
  computationalCost: number;
  energyEfficiency: number;
  scientificValue: number;
  workerId: string;
  signature: string;
  timestamp: Date | string;
}

interface NetworkMetrics {
  id: number;
  timestamp: Date;
  totalMiners: number;
  blocksPerHour: number;
  energyEfficiency: number;
  totalScientificValue: number;
  co2Saved: number;
  networkHealth: number;
}

export default function Dashboard() {
  const wsData = useWebSocket();

  const { data: metrics } = useQuery<NetworkMetrics>({
    queryKey: ['/api/metrics'],
    refetchInterval: 3000,
  });

  const { data: allBlocks = [] } = useQuery({
    queryKey: ['/api/blocks'],
    queryFn: () => fetch('/api/blocks?limit=10000').then(res => res.json()),
    refetchInterval: 5000,
  });

  const { data: discoveries = [] } = useQuery<MathematicalWork[]>({
    queryKey: ['/api/discoveries'],
    queryFn: () => fetch('/api/discoveries?limit=10000').then(res => res.json()),
    refetchInterval: 5000,
  });

  const { data: miningOperations = [] } = useQuery<MiningOperationData[]>({
    queryKey: ['/api/mining/operations'],
    refetchInterval: 2000,
  });

  const getWorkTypeLabel = (workType: string) => {
    const labels: { [key: string]: string } = {
      'riemann_zero': 'Riemann Hypothesis',
      'prime_pattern': 'Prime Patterns',
      'yang_mills': 'Yang-Mills Theory',
      'navier_stokes': 'Navier-Stokes',
      'goldbach_verification': 'Goldbach Conjecture',
      'poincare_conjecture': 'Poincaré Conjecture',
      'birch_swinnerton_dyer': 'Birch-Swinnerton-Dyer',
      'elliptic_curve_crypto': 'Elliptic Curve Cryptography'
    };
    return labels[workType] || workType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFormulaDisplay = (workType: string, result: any) => {
    const formulas: { [key: string]: string } = {
      'riemann_zero': 'ζ(s) = 0',
      'prime_pattern': 'p_{n+1} - p_n = 2',
      'yang_mills': 'F_{μν} = ∂_μA_ν - ∂_νA_μ + g[A_μ,A_ν]',
      'navier_stokes': '∂u/∂t + (u·∇)u = -∇p + ν∇²u',
      'goldbach_verification': 'n = p + q',
      'poincare_conjecture': 'π₁(M) = 1 ⟹ M ≅ S³',
      'birch_swinnerton_dyer': 'rank(E) = ord_{s=1}L(E,s)',
      'elliptic_curve_crypto': 'y² = x³ + ax + b'
    };
    return formulas[workType] || 'Mathematical Formula';
  };

  const recentDiscoveries = discoveries.slice(0, 6);
  const activeOperations = miningOperations.filter(op => op.status === 'active');
  const totalScientificValue = discoveries.reduce((sum, d) => sum + (d.scientificValue || 0), 0);
  const averageDifficulty = discoveries.length > 0 
    ? discoveries.reduce((sum, d) => sum + d.difficulty, 0) / discoveries.length
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white">
            <BarChart3 className="mr-3 h-8 w-8 text-blue-400" />
            Productive Mining Platform
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time mathematical discovery dashboard with blockchain mining operations
          </p>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Database className="mr-2 h-5 w-5 text-blue-400" />
              Total Blocks
            </CardTitle>
            <CardDescription className="text-gray-400">
              Blockchain height
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {allBlocks.length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Productive blocks mined
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-400" />
              Discoveries
            </CardTitle>
            <CardDescription className="text-gray-400">
              Mathematical breakthroughs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {discoveries.length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Scientific discoveries made
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Activity className="mr-2 h-5 w-5 text-orange-400" />
              Active Mining
            </CardTitle>
            <CardDescription className="text-gray-400">
              Current operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">
              {activeOperations.length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Operations running
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
              Energy Efficiency
            </CardTitle>
            <CardDescription className="text-gray-400">
              vs Traditional mining
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {metrics?.energyEfficiency?.toFixed(1) || '--'}%
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Energy generation mode
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Performance Sparklines */}
      <PerformanceSparklineGrid className="mb-6" />

      {/* Active Formula Discovery Dashboard */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-yellow-400" />
            Active Formula Discovery Dashboard
          </CardTitle>
          <CardDescription className="text-gray-400">
            Real-time mathematical computations and formula breakthroughs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeOperations.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No active formula computations</p>
              <p className="text-sm text-gray-500 mt-2">Start mining to begin mathematical discoveries</p>
              <Link href="/mining">
                <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                  Start Mining Operation
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeOperations.map((operation) => (
                <div key={operation.id} className="p-4 bg-slate-900/50 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      COMPUTING
                    </Badge>
                    <span className="text-xs text-slate-400">
                      Difficulty: {operation.difficulty}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-white mb-1">
                        {getWorkTypeLabel(operation.operationType)}
                      </div>
                      <div className="text-lg font-mono text-yellow-400 bg-slate-800/50 p-2 rounded border">
                        {getFormulaDisplay(operation.operationType, null)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Progress: {operation.progress}%</span>
                      <span>Worker: {operation.workerId?.split('_')[1]?.slice(-4) || 'Unknown'}</span>
                    </div>
                    
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${operation.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Mathematical Discoveries */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-400" />
                Recent Discoveries
              </div>
              <Link href="/discoveries">
                <Button variant="outline" size="sm" className="text-purple-400 border-purple-400 hover:bg-purple-400/10">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Latest mathematical breakthroughs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentDiscoveries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No discoveries yet</p>
                <p className="text-sm text-gray-500 mt-2">Start mining to make breakthroughs</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDiscoveries.map((discovery) => (
                  <div key={discovery.id} className="p-3 bg-slate-900/30 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs">
                        {getWorkTypeLabel(discovery.workType)}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        ${(discovery.scientificValue || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-mono text-purple-300 mb-1">
                      {getFormulaDisplay(discovery.workType, discovery.result)}
                    </div>
                    <div className="text-xs text-slate-400">
                      Difficulty: {discovery.difficulty} • {new Date(discovery.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Network Performance */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-green-400" />
                Network Performance
              </div>
              <Link href="/security">
                <Button variant="outline" size="sm" className="text-green-400 border-green-400 hover:bg-green-400/10">
                  Security <Shield className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time blockchain metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {metrics?.totalMiners || 10}
                  </div>
                  <div className="text-xs text-slate-400">Active Miners</div>
                </div>
                <div className="p-3 bg-slate-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {metrics?.blocksPerHour || 12}
                  </div>
                  <div className="text-xs text-slate-400">Blocks/Hour</div>
                </div>
              </div>
              
              <div className="p-3 bg-slate-900/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Scientific Value Generated</span>
                  <span className="text-sm font-bold text-green-400">
                    ${totalScientificValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Average Difficulty</span>
                  <span className="text-sm font-bold text-orange-400">
                    {averageDifficulty.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Network Health</span>
                  <span className="text-sm font-bold text-blue-400">
                    {metrics?.networkHealth || 95}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="h-5 w-5 mr-2 text-orange-400" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-gray-400">
            Navigate to key platform sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/mining">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center">
                <Pickaxe className="h-4 w-4 mr-2" />
                Start Mining
              </Button>
            </Link>
            <Link href="/discoveries">
              <Button variant="outline" className="w-full border-purple-400 text-purple-400 hover:bg-purple-400/10">
                <Brain className="h-4 w-4 mr-2" />
                View Discoveries
              </Button>
            </Link>
            <Link href="/validators">
              <Button variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10">
                <Users className="h-4 w-4 mr-2" />
                Validators
              </Button>
            </Link>
            <Link href="/blocks">
              <Button variant="outline" className="w-full border-green-400 text-green-400 hover:bg-green-400/10">
                <Database className="h-4 w-4 mr-2" />
                Block Explorer
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}