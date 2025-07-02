import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Pickaxe, Database, Brain, TrendingUp, Zap, Award, Activity, Globe, Cpu } from "lucide-react";

export default function Dashboard() {
  const { 
    isConnected, 
    metrics, 
    blocks,
    discoveries,
    operations
  } = useWebSocket();

  const { data: initialMetrics } = useQuery({
    queryKey: ["/api/metrics"],
    enabled: !metrics
  });

  const { data: initialBlocks = [] } = useQuery({
    queryKey: ["/api/blocks"],
    enabled: !blocks || blocks.length === 0
  });

  const { data: initialDiscoveries = [] } = useQuery({
    queryKey: ["/api/discoveries"],
    enabled: !discoveries || discoveries.length === 0
  });

  const currentMetrics = metrics || initialMetrics;
  const currentBlocks = blocks && blocks.length > 0 ? blocks : (initialBlocks as any[] || []);
  const currentDiscoveries = discoveries && discoveries.length > 0 ? discoveries : (initialDiscoveries as any[] || []);
  const activeOperations = operations?.filter(op => op.status === 'active') || [];

  const latestBlock = currentBlocks[0];
  const latestDiscovery = currentDiscoveries[0];

  return (
    <div className="text-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧮 Productive Mining Platform
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Real mathematical breakthroughs powering the blockchain
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-2 ${isConnected ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400'}`}
            >
              <Activity className="h-4 w-4 mr-2" />
              {isConnected ? 'Live Network' : 'Connecting...'}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 border-blue-400 text-blue-400">
              <Globe className="h-4 w-4 mr-2" />
              {currentBlocks.length} Blocks
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 border-purple-400 text-purple-400">
              <Brain className="h-4 w-4 mr-2" />
              {currentDiscoveries.length} Discoveries
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Mining */}
          <Card className="pm-card border-orange-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-400 flex items-center">
                <Pickaxe className="h-5 w-5 mr-2" />
                Active Mining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {activeOperations.length}
              </div>
              <div className="text-sm text-slate-400">
                Operations running
              </div>
            </CardContent>
          </Card>

          {/* Latest Block */}
          <Card className="pm-card border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Latest Block
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                #{latestBlock?.index || 0}
              </div>
              <div className="text-sm text-slate-400">
                Scientific Value: ${latestBlock?.totalScientificValue?.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          {/* Energy Efficiency */}
          <Card className="pm-card border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Energy Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {currentMetrics?.co2Saved?.toFixed(1) || '0.0'}kg
              </div>
              <div className="text-sm text-slate-400">
                CO₂ vs Bitcoin
              </div>
            </CardContent>
          </Card>

          {/* Scientific Impact */}
          <Card className="pm-card border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Scientific Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                ${currentMetrics?.totalScientificValue?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-slate-400">
                Knowledge created
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Latest Discovery */}
          <Card className="pm-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-400" />
                Latest Discovery
              </CardTitle>
              <CardDescription>Most recent mathematical breakthrough</CardDescription>
            </CardHeader>
            <CardContent>
              {latestDiscovery ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">
                      {latestDiscovery.workType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Verified ✓
                    </Badge>
                  </div>
                  <div className="text-slate-400">
                    Scientific Value: ${latestDiscovery.scientificValue?.toLocaleString()}
                  </div>
                  <div className="text-slate-400 text-sm">
                    Difficulty: {latestDiscovery.difficulty} | Energy: {latestDiscovery.energyEfficiency}x efficient
                  </div>
                </div>
              ) : (
                <div className="text-slate-400">No discoveries yet</div>
              )}
              <div className="mt-4">
                <Link href="/discoveries">
                  <Button variant="outline" className="w-full">
                    View All Discoveries
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Network Health */}
          <Card className="pm-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Cpu className="h-5 w-5 mr-2 text-green-400" />
                Network Health
              </CardTitle>
              <CardDescription>Real-time network performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Network Status</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Blocks/Hour</span>
                  <span className="text-white font-semibold">
                    {currentMetrics?.blocksPerHour || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Energy Efficiency</span>
                  <span className="text-green-400 font-semibold">
                    {currentMetrics?.energyEfficiency || 0}x vs Bitcoin
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Active Miners</span>
                  <span className="text-white font-semibold">
                    {currentMetrics?.totalMiners || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/mining">
            <Card className="pm-card hover:border-orange-500/50 transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-orange-500/20">
                    <Pickaxe className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Start Mining</h3>
                    <p className="text-slate-400">Begin mathematical computations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/blocks">
            <Card className="pm-card hover:border-blue-500/50 transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Database className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Explore Blocks</h3>
                    <p className="text-slate-400">Browse the blockchain</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/discoveries">
            <Card className="pm-card hover:border-purple-500/50 transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-purple-500/20">
                    <Brain className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">View Discoveries</h3>
                    <p className="text-slate-400">See mathematical breakthroughs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}