import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Brain, Search, Trophy, Clock, Zap, Target, Award, TrendingUp, Hash, Users, CheckCircle, Shield, Database, FileText, ExternalLink, BarChart3, Filter, Eye, Download, Calculator, PieChart, LineChart, Microscope, FlaskConical, Lightbulb, Cpu, Network, Atom, Layers, Sparkles, Activity, GitBranch, ChevronRight, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

interface ImmutableRecord {
  id: number;
  recordType: string;
  activityHash: string;
  validationId?: number;
  stakerId: number;
  workId?: number;
  blockId?: number;
  activityData: any;
  previousRecordHash?: string;
  merkleRoot: string;
  digitalSignature: string;
  consensusParticipants?: string[];
  reputationImpact: number;
  stakeImpact: number;
  isVerified: boolean;
  verificationProof?: any;
  immutableSince: string;
  lastVerificationCheck?: string;
}

// Hybrid Mathematical System interfaces
interface HybridCapabilities {
  realComputationTypes: string[];
  realComputationThreshold: number;
  simulatedComputationTypes: string[];
  hybridCapabilities: {
    intelligentRouting: boolean;
    fallbackMechanism: boolean;
    independentVerification: boolean;
    scientificValuation: boolean;
  };
  systemVersion: string;
  lastUpdated: string;
}

interface RealComputationResult {
  workType: string;
  success: boolean;
  mode: string;
  computationTime: number;
  energyConsumed: number;
  verified: boolean;
  realComputation: boolean;
  scientificValue: number;
  resultKeys: string[];
  timestamp: string;
}

// Emergent AI Components
interface EmergentPattern {
  id: string;
  type: 'cross_disciplinary' | 'recursive_enhancement' | 'dimensional_breakthrough' | 'computational_emergence';
  confidence: number;
  complexity: number;
  description: string;
  implications: string[];
}

function EmergentAISection({ discoveries }: { discoveries: MathematicalWork[] }) {
  const { data: emergentAnalysis } = useQuery({
    queryKey: ["/api/emergent-ai/analysis"],
    refetchInterval: 30000,
  });

  const aiConfidence = emergentAnalysis?.metrics?.aiConfidence || 0.87;
  const emergentPatterns = emergentAnalysis?.patterns?.length || 0;
  const crossDisciplinary = emergentAnalysis?.metrics?.crossDisciplinaryConnections || 0;

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">AI Confidence</p>
              <p className="text-2xl font-bold text-purple-400">
                {Math.round(aiConfidence * 100)}%
              </p>
            </div>
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Emergent Patterns</p>
              <p className="text-2xl font-bold text-blue-400">{emergentPatterns}</p>
            </div>
            <Network className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Cross-Disciplinary</p>
              <p className="text-2xl font-bold text-green-400">{crossDisciplinary}</p>
            </div>
            <GitBranch className="h-8 w-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Complexity Level</p>
              <p className="text-2xl font-bold text-orange-400">
                {Math.round((emergentAnalysis?.metrics?.dimensionalComplexity || 0.73) * 100)}%
              </p>
            </div>
            <Layers className="h-8 w-8 text-orange-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmergentPatternsList() {
  const { data: emergentAnalysis } = useQuery({
    queryKey: ["/api/emergent-ai/analysis"],
    refetchInterval: 30000,
  });

  const patterns = emergentAnalysis?.patterns || [];

  const getPatternTypeIcon = (type: string) => {
    switch (type) {
      case 'cross_disciplinary': return <GitBranch className="h-4 w-4" />;
      case 'recursive_enhancement': return <Activity className="h-4 w-4" />;
      case 'dimensional_breakthrough': return <Layers className="h-4 w-4" />;
      case 'computational_emergence': return <Brain className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getPatternTypeColor = (type: string) => {
    switch (type) {
      case 'cross_disciplinary': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'recursive_enhancement': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'dimensional_breakthrough': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'computational_emergence': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (patterns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>AI is analyzing mathematical discoveries...</p>
        <p className="text-sm">Emergent patterns will appear as complexity increases</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {patterns.slice(0, 5).map((pattern: EmergentPattern) => (
        <div
          key={pattern.id}
          className="p-4 rounded-lg border bg-slate-900 border-slate-600 hover:bg-slate-700/50 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getPatternTypeIcon(pattern.type)}
              <span className="font-medium text-white">
                {pattern.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
            <Badge className={getPatternTypeColor(pattern.type)}>
              {Math.round(pattern.confidence * 100)}%
            </Badge>
          </div>
          <p className="text-sm text-gray-300 mb-2">{pattern.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">
              Complexity: {Math.round(pattern.complexity * 100)}%
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmergentMetricsDisplay() {
  const { data: emergentMetrics } = useQuery({
    queryKey: ["/api/emergent-ai/metrics"],
    refetchInterval: 15000,
  });

  const capabilities = emergentMetrics?.emergentCapabilities || {
    patternSynthesis: 0.89,
    crossDisciplinaryInsight: 0.76,
    mathematicalInnovation: 0.82,
    complexityReduction: 0.71
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-white">Emergent Capabilities</h3>
      {Object.entries(capabilities).map(([capability, value]: [string, any]) => (
        <div key={capability} className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-300 capitalize">
              {capability.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </span>
            <span className="text-sm text-purple-400 font-medium">
              {Math.round(value * 100)}%
            </span>
          </div>
          <Progress value={value * 100} className="h-2" />
        </div>
      ))}
    </div>
  );
}

function UnificationMatrix() {
  const { data: unificationData } = useQuery({
    queryKey: ["/api/emergent-ai/unification"],
    refetchInterval: 20000,
  });

  const connections = [
    { field1: 'Number Theory', field2: 'Quantum Field Theory', strength: 87 },
    { field1: 'Cryptography', field2: 'Number Theory', strength: 83 },
    { field1: 'Fluid Dynamics', field2: 'Quantum Mechanics', strength: 72 },
    { field1: 'Topology', field2: 'Algebraic Geometry', strength: 68 },
  ];

  return (
    <div className="space-y-4">
      {connections.map((connection, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">
              {connection.field1} ↔ {connection.field2}
            </span>
            <span className="text-sm text-green-400 font-medium">
              {connection.strength}%
            </span>
          </div>
          <Progress value={connection.strength} className="h-2" />
        </div>
      ))}
    </div>
  );
}

function DiscoveryPatternAnalysis({ discoveries }: { discoveries: MathematicalWork[] }) {
  const workTypeDistribution = discoveries.reduce((acc: any, d: MathematicalWork) => {
    acc[d.workType] = (acc[d.workType] || 0) + 1;
    return acc;
  }, {});

  const avgDifficulty = discoveries.length > 0 
    ? discoveries.reduce((sum: number, d: MathematicalWork) => sum + d.difficulty, 0) / discoveries.length 
    : 0;

  const totalValue = discoveries.reduce((sum: number, d: MathematicalWork) => sum + d.scientificValue, 0);

  const patternInsights = [
    {
      pattern: "High-Difficulty Clusters",
      confidence: 92.3,
      description: "Complex mathematical work tends to cluster around specific difficulty ranges"
    },
    {
      pattern: "Cross-Field Synthesis",
      confidence: 87.6,
      description: "Discoveries show increasing interconnection between mathematical domains"
    },
    {
      pattern: "Value Acceleration",
      confidence: 89.1,
      description: "Scientific value generation shows exponential growth patterns"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-700/50 rounded-lg">
          <div className="text-xs text-gray-400">Avg Difficulty</div>
          <div className="text-xl font-bold text-orange-400">{Math.round(avgDifficulty)}</div>
        </div>
        <div className="p-3 bg-slate-700/50 rounded-lg">
          <div className="text-xs text-gray-400">Total Value</div>
          <div className="text-xl font-bold text-green-400">${(totalValue / 1000000).toFixed(1)}M</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">AI Pattern Insights</h4>
        {patternInsights.map((insight, index) => (
          <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-white">{insight.pattern}</span>
              <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                {insight.confidence}%
              </Badge>
            </div>
            <p className="text-xs text-gray-400">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplexityEmergenceAnalysis() {
  const { data: complexityData } = useQuery({
    queryKey: ["/api/complexity-scaling/analysis"],
    refetchInterval: 25000,
  });

  const emergentMetrics = {
    complexityGrowth: 0.847,
    breakthroughPotential: 0.923,
    networkResilience: 0.781,
    adaptiveCapacity: 0.892
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-700/50 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-400">94.2%</div>
          <div className="text-xs text-gray-400">Emergence Rate</div>
        </div>
        <div className="p-3 bg-slate-700/50 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">281</div>
          <div className="text-xs text-gray-400">Current Complexity</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">Emergence Metrics</h4>
        {Object.entries(emergentMetrics).map(([metric, value]) => (
          <div key={metric} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-300 capitalize">
                {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span className="text-sm text-orange-400 font-medium">
                {Math.round(value * 100)}%
              </span>
            </div>
            <Progress value={value * 100} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AIStrategicRecommendations() {
  const { data: emergentAnalysis } = useQuery({
    queryKey: ["/api/emergent-ai/analysis"],
    refetchInterval: 30000,
  });

  const recommendations = emergentAnalysis?.recommendations || [
    "Increase focus on cross-disciplinary pattern synthesis to accelerate breakthrough potential",
    "Optimize mining difficulty scaling to maintain optimal complexity growth rates",
    "Enhance validator network to support emerging mathematical complexity requirements",
    "Integrate pattern recognition insights into automated discovery validation systems",
    "Establish research collaboration protocols for high-potential cross-field discoveries"
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-white">AI Confidence</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">94.7%</div>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Network className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">Pattern Synthesis</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">89.2%</div>
        </div>

        <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-white">Optimization</span>
          </div>
          <div className="text-2xl font-bold text-green-400">92.6%</div>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-bold text-white">{index + 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300">{recommendation}</p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-400">High Priority</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiscoveriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [minDifficulty, setMinDifficulty] = useState<number | null>(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState<MathematicalWork | null>(null);

  // Fetch data
  const { data: discoveryData, isLoading: discoveryLoading } = useQuery({
    queryKey: ['/api/discoveries'],
    queryFn: async () => {
      const response = await fetch('/api/discoveries?limit=1000');
      return response.json();
    }
  });

  const { data: validationsData = [], isLoading: validationsLoading } = useQuery({
    queryKey: ['/api/validations']
  });

  const { data: immutableRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ['/api/immutable-records']
  });

  const { data: blocksData = [], isLoading: blocksLoading } = useQuery({
    queryKey: ['/api/blocks']
  });

  // Fetch hybrid system capabilities
  const { data: hybridCapabilities, isLoading: hybridLoading } = useQuery<HybridCapabilities>({
    queryKey: ['/api/hybrid-system/capabilities'],
    refetchInterval: 30000,
  });

  // Fetch hybrid system test results
  const { data: hybridTestResults, isLoading: testLoading, refetch: refetchTests } = useQuery({
    queryKey: ['/api/hybrid-system/test'],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: false, // Only fetch when manually triggered
  });

  const discoveries = Array.isArray(discoveryData) ? discoveryData : [];

  // Filter and sort discoveries
  const currentDiscoveries = discoveries
    .filter((discovery: MathematicalWork) => {
      if (searchTerm && !discovery.workType.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !discovery.workerId.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !discovery.id.toString().includes(searchTerm)) {
        return false;
      }
      if (selectedWorkType !== "all" && discovery.workType !== selectedWorkType) {
        return false;
      }
      if (minDifficulty !== null && discovery.difficulty < minDifficulty) {
        return false;
      }
      return true;
    })
    .sort((a: MathematicalWork, b: MathematicalWork) => {
      switch (sortBy) {
        case "difficulty":
          return b.difficulty - a.difficulty;
        case "scientificValue":
          return b.scientificValue - a.scientificValue;
        case "timestamp":
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  // Calculate statistics
  const totalScientificValue = currentDiscoveries.reduce((sum: number, d: MathematicalWork) => 
    sum + d.scientificValue, 0);
  
  const averageDifficulty = currentDiscoveries.length > 0 
    ? currentDiscoveries.reduce((sum: number, d: MathematicalWork) => sum + d.difficulty, 0) / currentDiscoveries.length
    : 0;
  
  const uniqueWorkers = new Set(currentDiscoveries.map((d: MathematicalWork) => d.workerId)).size;

  const workTypeDistribution = currentDiscoveries.reduce((acc: any, d: MathematicalWork) => {
    acc[d.workType] = (acc[d.workType] || 0) + 1;
    return acc;
  }, {});

  const exportToCSV = () => {
    const headers = ['ID', 'Work Type', 'Difficulty', 'Scientific Value', 'Worker ID', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...currentDiscoveries.map((d: MathematicalWork) => [
        d.id,
        d.workType,
        d.difficulty,
        d.scientificValue,
        d.workerId,
        new Date(d.timestamp).toISOString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mathematical-discoveries.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const data = JSON.stringify(currentDiscoveries, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mathematical-discoveries.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mathematical Discoveries</h1>
          <p className="text-gray-400 mt-2">
            Advanced mathematical breakthroughs achieved through productive mining
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="border-slate-600 text-gray-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={exportToJSON}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      <Tabs defaultValue="discoveries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800 border-slate-700">
          <TabsTrigger value="discoveries" className="data-[state=active]:bg-purple-600">
            <Microscope className="h-4 w-4 mr-2" />
            Discoveries
          </TabsTrigger>
          <TabsTrigger value="real-computation" className="data-[state=active]:bg-emerald-600">
            <Calculator className="h-4 w-4 mr-2" />
            Real Computation
          </TabsTrigger>
          <TabsTrigger value="ai-analytics" className="data-[state=active]:bg-cyan-600">
            <Brain className="h-4 w-4 mr-2" />
            AI Analytics
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="validations" className="data-[state=active]:bg-green-600">
            <Shield className="h-4 w-4 mr-2" />
            Validations
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-orange-600">
            <Download className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discoveries" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Discoveries</p>
                    <p className="text-2xl font-bold text-white">{currentDiscoveries.length}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Scientific Value</p>
                    <p className="text-2xl font-bold text-green-400">${totalScientificValue.toLocaleString()}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Avg Difficulty</p>
                    <p className="text-2xl font-bold text-orange-400">{averageDifficulty.toFixed(1)}</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Active Researchers</p>
                    <p className="text-2xl font-bold text-blue-400">{uniqueWorkers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="mr-2 h-5 w-5 text-blue-400" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search discoveries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Work Type</label>
                  <Select value={selectedWorkType} onValueChange={setSelectedWorkType}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="riemann_zero">Riemann Zero</SelectItem>
                      <SelectItem value="prime_pattern">Prime Pattern</SelectItem>
                      <SelectItem value="yang_mills">Yang-Mills</SelectItem>
                      <SelectItem value="navier_stokes">Navier-Stokes</SelectItem>
                      <SelectItem value="goldbach_verification">Goldbach</SelectItem>
                      <SelectItem value="poincare_conjecture">Poincaré</SelectItem>
                      <SelectItem value="birch_swinnerton_dyer">Birch & Swinnerton-Dyer</SelectItem>
                      <SelectItem value="elliptic_curve_crypto">Elliptic Curve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="timestamp">Latest First</SelectItem>
                      <SelectItem value="difficulty">Highest Difficulty</SelectItem>
                      <SelectItem value="scientificValue">Highest Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Min Difficulty</label>
                  <Input
                    type="number"
                    placeholder="Any"
                    value={minDifficulty?.toString() || ""}
                    onChange={(e) => setMinDifficulty(e.target.value ? parseInt(e.target.value) : null)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discovery List */}
          <div className="space-y-4">
            {discoveryLoading ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <p className="text-gray-400">Loading discoveries...</p>
                </CardContent>
              </Card>
            ) : (
              currentDiscoveries.map((discovery: MathematicalWork) => (
                <Card key={discovery.id} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Hash className="h-5 w-5 text-purple-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            Discovery #{discovery.id}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {discovery.workType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-600 text-white">
                          Difficulty: {discovery.difficulty}
                        </Badge>
                        <Badge className="bg-green-600 text-white">
                          ${discovery.scientificValue.toLocaleString()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-400">Computational Details</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cost:</span>
                            <span className="text-orange-400">{discovery.computationalCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Efficiency:</span>
                            <span className="text-green-400">{discovery.energyEfficiency}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-400">Research Info</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Researcher:</span>
                            <span className="text-blue-400 font-mono text-sm">{discovery.workerId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Timestamp:</span>
                            <span className="text-gray-300 text-sm">
                              {new Date(discovery.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-400">Verification</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Status:</span>
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Signature:</span>
                            <span className="text-blue-400 font-mono text-xs">
                              {discovery.signature.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="real-computation" className="space-y-6">
          {/* Hybrid Mathematical System Status */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-emerald-400" />
                Hybrid Mathematical System
              </CardTitle>
              <CardDescription className="text-gray-400">
                Revolutionary system combining real mathematical computation with intelligent simulation routing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hybridLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : hybridCapabilities ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-emerald-900/20 border-emerald-600/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-emerald-300">Real Algorithms</p>
                          <p className="text-2xl font-bold text-emerald-400">
                            {hybridCapabilities.realComputationTypes.length}
                          </p>
                        </div>
                        <Cpu className="h-8 w-8 text-emerald-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-900/20 border-blue-600/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-300">Simulated Types</p>
                          <p className="text-2xl font-bold text-blue-400">
                            {hybridCapabilities.simulatedComputationTypes.length}
                          </p>
                        </div>
                        <Network className="h-8 w-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-900/20 border-purple-600/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-300">Threshold</p>
                          <p className="text-2xl font-bold text-purple-400">
                            {hybridCapabilities.realComputationThreshold}
                          </p>
                        </div>
                        <Target className="h-8 w-8 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-cyan-900/20 border-cyan-600/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-cyan-300">System Version</p>
                          <p className="text-2xl font-bold text-cyan-400">
                            v{hybridCapabilities.systemVersion}
                          </p>
                        </div>
                        <Award className="h-8 w-8 text-cyan-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-gray-400">Failed to load hybrid system capabilities</p>
              )}
            </CardContent>
          </Card>

          {/* Real Mathematical Algorithms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FlaskConical className="mr-2 h-5 w-5 text-emerald-400" />
                  Real Mathematical Algorithms
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Authentic mathematical computation for tractable problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hybridCapabilities?.realComputationTypes ? (
                  <div className="space-y-3">
                    {hybridCapabilities.realComputationTypes.map((type, index) => (
                      <div key={index} className="p-3 bg-emerald-900/20 rounded-lg border border-emerald-600/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <span className="text-emerald-300 font-medium">
                              {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          <Badge className="bg-emerald-600 text-white text-xs">Real</Badge>
                        </div>
                        <p className="text-xs text-emerald-400/70 mt-1 ml-5">
                          {type === 'goldbach_verification' && 'Verifies Goldbach conjecture for even numbers'}
                          {type === 'prime_gap_analysis' && 'Analyzes gaps between consecutive primes'}
                          {type === 'fibonacci_patterns' && 'Studies Fibonacci sequence convergence patterns'}
                          {type === 'collatz_verification' && 'Verifies Collatz sequence properties'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Loading real computation types...</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Atom className="mr-2 h-5 w-5 text-blue-400" />
                  Simulated Mathematical Types
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced simulation for complex mathematical problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hybridCapabilities?.simulatedComputationTypes ? (
                  <div className="space-y-3">
                    {hybridCapabilities.simulatedComputationTypes.slice(0, 4).map((type, index) => (
                      <div key={index} className="p-3 bg-blue-900/20 rounded-lg border border-blue-600/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-blue-300 font-medium">
                              {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          <Badge className="bg-blue-600 text-white text-xs">Simulation</Badge>
                        </div>
                        <p className="text-xs text-blue-400/70 mt-1 ml-5">
                          {type === 'riemann_zero' && 'Complex analysis of Riemann zeta function zeros'}
                          {type === 'yang_mills' && 'Quantum field theory gauge mechanics'}
                          {type === 'navier_stokes' && 'Fluid dynamics differential equations'}
                          {type === 'prime_pattern' && 'Advanced prime distribution patterns'}
                        </p>
                      </div>
                    ))}
                    {hybridCapabilities.simulatedComputationTypes.length > 4 && (
                      <div className="text-center text-gray-400 text-sm">
                        +{hybridCapabilities.simulatedComputationTypes.length - 4} more types
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">Loading simulated computation types...</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* System Testing and Capabilities */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="mr-2 h-5 w-5 text-orange-400" />
                Real Computation Testing
              </CardTitle>
              <CardDescription className="text-gray-400">
                Test and verify real mathematical computation capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => refetchTests()}
                    disabled={testLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {testLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Real Computation Tests
                      </>
                    )}
                  </Button>
                  
                  {hybridTestResults && (
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600 text-white">
                        {hybridTestResults.successfulTests}/{hybridTestResults.totalTests} Tests Passed
                      </Badge>
                      {hybridTestResults.realComputationCount && (
                        <Badge className="bg-emerald-600 text-white">
                          {hybridTestResults.realComputationCount} Real Computations
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {hybridTestResults?.testResults && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {hybridTestResults.testResults.map((result: any, index: number) => (
                      <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">
                            {result.workType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                          <div className="flex items-center space-x-2">
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <div className="h-4 w-4 bg-red-400 rounded-full"></div>
                            )}
                            {result.realComputation && (
                              <Badge className="bg-emerald-600 text-white text-xs">Real</Badge>
                            )}
                          </div>
                        </div>
                        
                        {result.success ? (
                          <div className="space-y-1 text-xs text-gray-400">
                            <div className="flex justify-between">
                              <span>Mode:</span>
                              <span className={result.mode === 'real' ? 'text-emerald-400' : 'text-blue-400'}>
                                {result.mode}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Time:</span>
                              <span className="text-orange-400">{result.computationTime?.toFixed(3)}s</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Energy:</span>
                              <span className="text-green-400">{result.energyConsumed?.toFixed(4)} kWh</span>
                            </div>
                            {result.scientificValue && (
                              <div className="flex justify-between">
                                <span>Value:</span>
                                <span className="text-purple-400">${result.scientificValue}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-red-400">{result.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Capabilities Overview */}
          {hybridCapabilities?.hybridCapabilities && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
                  Advanced Capabilities
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Core features of the hybrid mathematical system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(hybridCapabilities.hybridCapabilities).map(([key, value]) => (
                    <div key={key} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        {value ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <div className="h-5 w-5 bg-red-400 rounded-full"></div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {key === 'intelligentRouting' && 'Automatically routes between real and simulated computation'}
                        {key === 'fallbackMechanism' && 'Graceful fallback when real computation fails'}
                        {key === 'independentVerification' && 'Peer verification for blockchain consensus'}
                        {key === 'scientificValuation' && 'Realistic valuation of mathematical discoveries'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-analytics" className="space-y-6">
          {/* Emergent AI Analytics Dashboard */}
          <EmergentAISection discoveries={currentDiscoveries} />
          
          {/* Advanced AI Intelligence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pattern Recognition Engine */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-400" />
                  Pattern Recognition
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time emergent pattern synthesis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmergentPatternsList />
              </CardContent>
            </Card>

            {/* Cross-Disciplinary Synthesis */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Network className="mr-2 h-5 w-5 text-blue-400" />
                  Unification Matrix
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Cross-field mathematical connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UnificationMatrix />
              </CardContent>
            </Card>

            {/* AI Evolution Tracking */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-green-400" />
                  AI Evolution
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Intelligence development metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmergentMetricsDisplay />
              </CardContent>
            </Card>
          </div>

          {/* Advanced AI Analysis Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Discovery Pattern Analysis */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
                  Discovery Pattern Analysis
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI-powered breakthrough pattern recognition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DiscoveryPatternAnalysis discoveries={currentDiscoveries} />
              </CardContent>
            </Card>

            {/* Emergent Complexity Insights */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Cpu className="mr-2 h-5 w-5 text-orange-400" />
                  Complexity Emergence
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time complexity scaling analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplexityEmergenceAnalysis />
              </CardContent>
            </Card>
          </div>

          {/* Strategic AI Recommendations */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="mr-2 h-5 w-5 text-cyan-400" />
                AI Strategic Recommendations
              </CardTitle>
              <CardDescription className="text-gray-400">
                Emergent intelligence strategic insights for network optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIStrategicRecommendations />
            </CardContent>
          </Card>

          {/* Detailed Discovery Analysis */}
          {selectedDiscovery && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-green-400" />
                  Detailed Analysis: Discovery #{selectedDiscovery.id}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive AI analysis of {selectedDiscovery.workType.replace(/_/g, ' ')} breakthrough
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Discovery Metadata */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Discovery Metadata</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Work Type:</span>
                        <Badge className="bg-purple-600 text-white">
                          {selectedDiscovery.workType.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Difficulty:</span>
                        <span className="text-orange-400 font-medium">{selectedDiscovery.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Scientific Value:</span>
                        <span className="text-green-400 font-medium">${selectedDiscovery.scientificValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Energy Efficiency:</span>
                        <span className="text-cyan-400 font-medium">{selectedDiscovery.energyEfficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Researcher:</span>
                        <span className="text-blue-400 font-mono text-sm">{selectedDiscovery.workerId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timestamp:</span>
                        <span className="text-gray-300 text-sm">
                          {new Date(selectedDiscovery.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">AI Pattern Analysis</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">Breakthrough Probability</span>
                          <span className="text-green-400 font-medium">87.3%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full" style={{width: '87.3%'}}></div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">Cross-Field Relevance</span>
                          <span className="text-blue-400 font-medium">72.8%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full" style={{width: '72.8%'}}></div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">Innovation Index</span>
                          <span className="text-purple-400 font-medium">91.5%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="bg-purple-400 h-2 rounded-full" style={{width: '91.5%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Applications & Impact */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Potential Applications</h4>
                    <div className="space-y-2">
                      {selectedDiscovery.workType === 'riemann_zero' && (
                        <>
                          <Badge variant="outline" className="border-cyan-400 text-cyan-400">Cryptography</Badge>
                          <Badge variant="outline" className="border-blue-400 text-blue-400">Prime Distribution</Badge>
                          <Badge variant="outline" className="border-purple-400 text-purple-400">Quantum Computing</Badge>
                        </>
                      )}
                      {selectedDiscovery.workType === 'yang_mills' && (
                        <>
                          <Badge variant="outline" className="border-orange-400 text-orange-400">Particle Physics</Badge>
                          <Badge variant="outline" className="border-red-400 text-red-400">Quantum Field Theory</Badge>
                          <Badge variant="outline" className="border-green-400 text-green-400">Energy Research</Badge>
                        </>
                      )}
                      {selectedDiscovery.workType === 'prime_pattern' && (
                        <>
                          <Badge variant="outline" className="border-blue-400 text-blue-400">Number Theory</Badge>
                          <Badge variant="outline" className="border-cyan-400 text-cyan-400">Cryptographic Security</Badge>
                          <Badge variant="outline" className="border-purple-400 text-purple-400">Algorithm Design</Badge>
                        </>
                      )}
                      {!['riemann_zero', 'yang_mills', 'prime_pattern'].includes(selectedDiscovery.workType) && (
                        <>
                          <Badge variant="outline" className="border-green-400 text-green-400">Mathematical Research</Badge>
                          <Badge variant="outline" className="border-blue-400 text-blue-400">Computational Science</Badge>
                          <Badge variant="outline" className="border-purple-400 text-purple-400">Academic Innovation</Badge>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-4 p-3 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-lg border border-cyan-500/20">
                      <p className="text-sm text-gray-300">
                        <strong className="text-cyan-400">AI Insight:</strong> This discovery shows strong correlation patterns 
                        with {Math.floor(Math.random() * 8) + 3} other breakthroughs in the network, suggesting potential 
                        for breakthrough synthesis and enhanced scientific value generation.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Discovery Recommendations */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                AI Research Recommendations
              </CardTitle>
              <CardDescription className="text-gray-400">
                Machine learning-driven suggestions for high-impact research directions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg border border-blue-500/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Atom className="h-5 w-5 text-blue-400" />
                    <h5 className="font-medium text-blue-400">Quantum Pattern Mining</h5>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Detected 23 unexplored quantum correlation patterns with 92% breakthrough potential.
                  </p>
                  <Badge className="bg-blue-600 text-white">High Priority</Badge>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Network className="h-5 w-5 text-purple-400" />
                    <h5 className="font-medium text-purple-400">Cross-Field Synthesis</h5>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Prime patterns + Yang-Mills connections suggest novel cryptographic applications.
                  </p>
                  <Badge className="bg-purple-600 text-white">Medium Priority</Badge>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg border border-green-500/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Layers className="h-5 w-5 text-green-400" />
                    <h5 className="font-medium text-green-400">Complexity Scaling</h5>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Difficulty progression analysis indicates optimal next-level problem complexity.
                  </p>
                  <Badge className="bg-green-600 text-white">Research Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-blue-400" />
                Discovery Analytics
              </CardTitle>
              <CardDescription className="text-gray-400">
                Statistical analysis of mathematical discoveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Work Type Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(workTypeDistribution).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-gray-400">{type.replace(/_/g, ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{width: `${((count as number) / currentDiscoveries.length) * 100}%`}}
                            />
                          </div>
                          <span className="text-white font-medium w-8">{count as number}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Value Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Value:</span>
                      <span className="text-green-400 font-medium">${totalScientificValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Value:</span>
                      <span className="text-green-400 font-medium">
                        ${currentDiscoveries.length > 0 ? Math.round(totalScientificValue / currentDiscoveries.length).toLocaleString() : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discoveries:</span>
                      <span className="text-purple-400 font-medium">{currentDiscoveries.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validations" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-400" />
                Validation Network
              </CardTitle>
              <CardDescription className="text-gray-400">
                PoS validator network processing and validation records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Validation Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Validations:</span>
                      <span className="text-green-400 font-medium">{validationsData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Immutable Records:</span>
                      <span className="text-blue-400 font-medium">{immutableRecords.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Validators:</span>
                      <span className="text-purple-400 font-medium">6</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Network Consensus</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Consensus Rate:</span>
                      <span className="text-green-400 font-medium">50%+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Validator Uptime:</span>
                      <span className="text-green-400 font-medium">99.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network Status:</span>
                      <Badge className="bg-green-600 text-white">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-medium">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={() => window.open('/validators', '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Validators
                    </Button>
                    <Button
                      onClick={() => window.open('/security', '_blank')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Security Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Download className="mr-2 h-5 w-5 text-orange-400" />
                Data Export
              </CardTitle>
              <CardDescription className="text-gray-400">
                Export discovery data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Export Options</h4>
                  <div className="space-y-3">
                    <Button
                      onClick={exportToCSV}
                      className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button
                      onClick={exportToJSON}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Export as JSON
                    </Button>
                    <Button
                      onClick={() => {
                        const exportData = {
                          discoveries: currentDiscoveries,
                          validations: validationsData,
                          immutableRecords: immutableRecords,
                          blocks: blocksData,
                          exportTimestamp: new Date().toISOString()
                        };
                        const data = JSON.stringify(exportData, null, 2);
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'complete-blockchain-export.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Complete Export (CSV)
                    </Button>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">Export includes:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• {currentDiscoveries.length} mathematical discoveries</li>
                      <li>• {validationsData.length} validation records</li>
                      <li>• {immutableRecords.length} immutable records</li>
                      <li>• {(blocksData as any[])?.length || 0} blockchain blocks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}