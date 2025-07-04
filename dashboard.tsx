import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Trophy, 
  Clock, 
  Target, 
  BarChart3, 
  Shield, 
  Star, 
  Gem,
  Crown,
  Activity,
  TrendingUp,
  Users,
  Database,
  Brain,
  Gamepad2,
  Calculator,
  DollarSign,
  Globe,
  ExternalLink,
  ArrowRight
} from "lucide-react";

interface MiningOperationData {
  id: number;
  operationType: string;
  difficulty: number;
  workerId: string;
  startTime: string;
  status: string;
  progress: number;
  estimatedCompletion: string;
  currentPhase: string;
  computationData?: {
    iterations: number;
    currentValue: any;
    precision: number;
  };
}

interface MathematicalWork {
  id: number;
  workType: string;
  difficulty: number;
  result: any;
  scientificValue: number;
  timestamp: string;
}

interface ProductiveBlock {
  id: number;
  index: number;
  timestamp: string;
  mathematicalWork: MathematicalWork[];
  totalScientificValue: number;
}

interface NetworkMetrics {
  activeMiners: number;
  totalBlocks: number;
  totalScientificValue: number;
  energyEfficiency: number;
  networkHashrate: number;
  avgBlockTime: number;
  knowledgeCreated: number;
  blocksPerHour: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(0);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Dashboard() {
  const { discoveries, blocks, metrics } = useWebSocket();

  const { data: allDiscoveries = [] } = useQuery({
    queryKey: ["/api/discoveries"],
    queryFn: () => fetch("/api/discoveries?limit=1000").then(res => res.json()),
    refetchInterval: 5000,
  });

  const { data: allBlocks = [] } = useQuery({
    queryKey: ["/api/blocks"],
    refetchInterval: 5000,
  });

  const { data: allMetrics } = useQuery({
    queryKey: ["/api/metrics"],
    refetchInterval: 2000,
  });

  const { data: miningOperations = [] } = useQuery<MiningOperationData[]>({
    queryKey: ["/api/mining/operations"],
    refetchInterval: 2000,
  });

  // Calculate computed statistics
  const computedStats = {
    totalDiscoveries: allDiscoveries.length || 0,
    totalBlocks: allBlocks.length || 0,
    totalScientificValue: allDiscoveries.reduce((sum: number, d: any) => sum + (d.scientificValue || 0), 0),
    recentDiscoveries: allDiscoveries.slice(-10) || [],
    activeOperations: miningOperations.filter(op => op.status === 'active').length || 0,
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="pm-header-gradient text-center mb-12">
        <h1 className="text-5xl pm-text-gradient mb-4">
          Productive Mining Dashboard
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Real-time network statistics and mathematical discovery tracking
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(computedStats.totalScientificValue)}
            </div>
            <div className="text-sm text-slate-300">Mining Value Generated</div>
            <div className="text-xs text-green-300 mt-1">Total scientific worth</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-400">
              {metrics?.activeMiners || 0}
            </div>
            <div className="text-sm text-slate-300">Active Miners</div>
            <div className="text-xs text-blue-300 mt-1">Computing discoveries</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Database className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-400">
              {computedStats.totalBlocks}
            </div>
            <div className="text-sm text-slate-300">Productive Blocks</div>
            <div className="text-xs text-purple-300 mt-1">Beyond Bitcoin waste</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30">
          <CardContent className="p-6 text-center">
            <Calculator className="h-8 w-8 text-orange-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-orange-400">
              {computedStats.totalDiscoveries}
            </div>
            <div className="text-sm text-slate-300">Mathematical Discoveries</div>
            <div className="text-xs text-orange-300 mt-1">Real breakthroughs</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Discoveries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              Recent Mathematical Discoveries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.isArray(allDiscoveries) && allDiscoveries.slice(-5).map((discovery: any, index: number) => (
              <div key={discovery.id || index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    #{discovery.id}
                  </Badge>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {discovery.workType?.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-400">
                      Difficulty {discovery.difficulty}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400">
                    {formatCurrency(discovery.scientificValue || 0)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(discovery.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            <Link href="/discoveries" className="w-full">
              <div className="flex items-center justify-center gap-2 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition-colors text-blue-400">
                <span>View All Discoveries</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Activity className="h-6 w-6 text-green-400" />
              Network Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="text-lg font-bold text-cyan-400">
                  {metrics?.blocksPerHour || 0}/hr
                </div>
                <div className="text-xs text-slate-400">Block Rate</div>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="text-lg font-bold text-yellow-400">
                  50
                </div>
                <div className="text-xs text-slate-400">Difficulty</div>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="text-lg font-bold text-purple-400">
                  {computedStats.activeOperations}
                </div>
                <div className="text-xs text-slate-400">Active Operations</div>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="text-lg font-bold text-green-400">
                  {metrics?.energyEfficiency || 0}%
                </div>
                <div className="text-xs text-slate-400">Energy Efficiency</div>
              </div>
            </div>
            <div className="space-y-2">
              <Link href="/mining" className="w-full">
                <div className="flex items-center justify-center gap-2 p-3 bg-green-600/20 rounded-lg border border-green-500/30 hover:bg-green-600/30 transition-colors text-green-400">
                  <span>Start Mining</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/blocks" className="w-full">
                <div className="flex items-center justify-center gap-2 p-3 bg-purple-600/20 rounded-lg border border-purple-500/30 hover:bg-purple-600/30 transition-colors text-purple-400">
                  <span>View Block Explorer</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/validators" className="w-full">
          <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30 hover:bg-indigo-600/30 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
              <div className="text-xl font-bold text-indigo-400">PoS Validators</div>
              <div className="text-sm text-slate-300">Validation network</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/security" className="w-full">
          <Card className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border-red-500/30 hover:bg-red-600/30 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <div className="text-xl font-bold text-red-400">Security Audit</div>
              <div className="text-sm text-slate-300">System security</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/wallet" className="w-full">
          <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30 hover:bg-yellow-600/30 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Gem className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-xl font-bold text-yellow-400">Research Vault</div>
              <div className="text-sm text-slate-300">Token portfolio</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}