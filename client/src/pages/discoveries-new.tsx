import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import StakingValidations from "@/components/staking-validations";
import { useState } from "react";
import { Brain, Search, Trophy, Clock, Zap, Target, Award, TrendingUp, Hash, Users, CheckCircle, Shield, Database, FileText, ExternalLink, BarChart3, Filter, Eye, Download, Calculator, PieChart, LineChart, Microscope, FlaskConical } from "lucide-react";

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

export default function DiscoveriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("all");
  const [selectedDiscovery, setSelectedDiscovery] = useState<MathematicalWork | null>(null);
  const [sortBy, setSortBy] = useState("timestamp");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("discoveries");

  const { data: allDiscoveries = [] } = useQuery({
    queryKey: ["/api/discoveries"],
    queryFn: () => fetch("/api/discoveries?limit=1000").then(res => res.json()),
    refetchInterval: 30000, // Reduced from 10s to 30s
  });

  const { data: immutableRecords = [] } = useQuery<ImmutableRecord[]>({
    queryKey: ['/api/immutable-records'],
  });

  const { data: validationsData = [] } = useQuery<any[]>({
    queryKey: ['/api/validations'],
  });

  const { data: blocksData = [] } = useQuery({
    queryKey: ['/api/blocks'],
  });

  const currentDiscoveries = (allDiscoveries as MathematicalWork[]) || [];

  // Function to get immutable records related to a specific discovery
  const getDiscoveryRecords = (workId: number): ImmutableRecord[] => {
    return immutableRecords.filter(record => record.workId === workId);
  };

  // Function to get total validation records for a discovery  
  const getValidationCount = (workId: number): number => {
    return getDiscoveryRecords(workId).length;
  };

  // Check if discovery has validation records
  const hasValidationRecords = (workId: number): boolean => {
    return getDiscoveryRecords(workId).length > 0;
  };

  const workTypes = [
    { value: "all", label: "All Discoveries" },
    { value: "riemann_zero", label: "🧮 Riemann Hypothesis" },
    { value: "prime_pattern", label: "🔢 Prime Patterns" },
    { value: "goldbach_verification", label: "➕ Goldbach Conjecture" },
    { value: "birch_swinnerton_dyer", label: "📐 Birch-Swinnerton-Dyer" },
    { value: "navier_stokes", label: "🌊 Navier-Stokes" },
    { value: "yang_mills", label: "⚛️ Yang-Mills" },
    { value: "poincare_conjecture", label: "🌐 Poincaré Conjecture" },
    { value: "elliptic_curve_crypto", label: "🔐 Elliptic Curve Crypto" },
    { value: "lattice_crypto", label: "🔒 Lattice Crypto" }
  ];

  // Filter discoveries based on search and filters
  const filteredDiscoveries = currentDiscoveries
    .filter((discovery: MathematicalWork) => {
      const matchesSearch = !searchQuery || 
        discovery.workType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discovery.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discovery.id.toString().includes(searchQuery);
      
      const matchesWorkType = workTypeFilter === "all" || discovery.workType === workTypeFilter;
      
      const matchesDifficulty = difficultyFilter === "all" || 
        (difficultyFilter === "low" && discovery.difficulty < 30) ||
        (difficultyFilter === "medium" && discovery.difficulty >= 30 && discovery.difficulty < 50) ||
        (difficultyFilter === "high" && discovery.difficulty >= 50);
      
      return matchesSearch && matchesWorkType && matchesDifficulty;
    })
    .sort((a: MathematicalWork, b: MathematicalWork) => {
      let aValue, bValue;
      switch (sortBy) {
        case "difficulty":
          aValue = a.difficulty;
          bValue = b.difficulty;
          break;
        case "scientificValue":
          aValue = a.scientificValue;
          bValue = b.scientificValue;
          break;
        case "workType":
          aValue = a.workType;
          bValue = b.workType;
          break;
        default:
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
      }
      
      return aValue > bValue ? -1 : 1; // Descending order
    });

  const totalScientificValue = currentDiscoveries.reduce((sum: number, d: MathematicalWork) => 
    sum + (d.scientificValue || 0), 0
  );

  const averageDifficulty = currentDiscoveries.length > 0 
    ? currentDiscoveries.reduce((sum: number, d: MathematicalWork) => sum + d.difficulty, 0) / currentDiscoveries.length
    : 0;

  const uniqueWorkers = new Set(currentDiscoveries.map((d: MathematicalWork) => d.workerId)).size;

  // Download functions
  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadJSON = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadAllRecords = async (format: 'csv' | 'json') => {
    try {
      const response = await fetch('/api/database/export');
      const data = await response.json();
      
      if (format === 'csv') {
        downloadCSV(data.discoveries, 'complete_database_export');
      } else {
        downloadJSON(data, 'complete_database_export');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
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
          <Badge className="bg-purple-600 text-white">
            {currentDiscoveries.length} Total Discoveries
          </Badge>
          <Badge className="bg-green-600 text-white">
            ${(totalScientificValue / 1000000).toFixed(1)}M Scientific Value
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-400" />
              Total Discoveries
            </CardTitle>
            <CardDescription className="text-gray-400">
              Mathematical breakthroughs made
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {currentDiscoveries.length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Breakthrough discoveries made
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Award className="mr-2 h-5 w-5 text-green-400" />
              Scientific Value
            </CardTitle>
            <CardDescription className="text-gray-400">
              Total research value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              ${(totalScientificValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Value generated
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Target className="mr-2 h-5 w-5 text-blue-400" />
              Average Difficulty
            </CardTitle>
            <CardDescription className="text-gray-400">
              Computational complexity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {averageDifficulty.toFixed(1)}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Average complexity level
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Users className="mr-2 h-5 w-5 text-cyan-400" />
              Active Researchers
            </CardTitle>
            <CardDescription className="text-gray-400">
              Unique contributors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">
              {uniqueWorkers}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Research contributors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Discoveries Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="discoveries" className="data-[state=active]:bg-purple-600">
            <Brain className="mr-2 h-4 w-4" />
            Discoveries
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="validations" className="data-[state=active]:bg-green-600">
            <CheckCircle className="mr-2 h-4 w-4" />
            Validations
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-orange-600">
            <Download className="mr-2 h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discoveries" className="space-y-6">
          {/* Search and Filter Controls */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="mr-2 h-5 w-5 text-blue-400" />
                Search & Filter Discoveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Search</label>
                  <Input
                    placeholder="Search discoveries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Work Type</label>
                  <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {workTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Difficulty</label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="low">Low (&lt; 30)</SelectItem>
                      <SelectItem value="medium">Medium (30-50)</SelectItem>
                      <SelectItem value="high">High (50+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="timestamp">Recent</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                      <SelectItem value="scientificValue">Value</SelectItem>
                      <SelectItem value="workType">Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discoveries List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredDiscoveries.length > 0 ? (
              filteredDiscoveries.map((discovery) => (
                <Card key={discovery.id} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Hash className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">
                            Discovery #{discovery.id}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {discovery.workType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          className={`${
                            discovery.difficulty >= 50 ? 'bg-red-600' :
                            discovery.difficulty >= 30 ? 'bg-yellow-600' : 'bg-green-600'
                          } text-white`}
                        >
                          Difficulty: {discovery.difficulty}
                        </Badge>
                        <Badge className="bg-purple-600 text-white">
                          ${(discovery.scientificValue / 1000000).toFixed(1)}M
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-gray-400 text-sm">Researcher</p>
                        <p className="text-white font-mono text-sm">{discovery.workerId}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-400 text-sm">Computational Cost</p>
                        <p className="text-blue-400 font-medium">{discovery.computationalCost.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-400 text-sm">Energy Efficiency</p>
                        <p className="text-green-400 font-medium">{discovery.energyEfficiency}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(discovery.timestamp).toLocaleDateString()}</span>
                        </div>
                        {hasValidationRecords(discovery.id) && (
                          <div className="flex items-center space-x-1 text-green-400 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>{getValidationCount(discovery.id)} validations</span>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => setSelectedDiscovery(discovery)}
                        variant="outline"
                        size="sm"
                        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-white font-medium mb-2">No discoveries found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search filters or check back later for new mathematical breakthroughs.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Microscope className="mr-2 h-5 w-5 text-cyan-400" />
                Formula Analysis Dashboard
              </CardTitle>
              <CardDescription className="text-gray-400">
                Advanced mathematical pattern analysis and breakthrough identification tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FlaskConical className="h-12 w-12 mx-auto mb-4 text-cyan-400" />
                <h3 className="text-white font-medium mb-2">Interactive Analysis Tools</h3>
                <p className="text-gray-400 mb-4">
                  Formula validation, pattern recognition, and complexity analysis tools coming soon.
                </p>
                <Button
                  onClick={() => window.open('/security', '_blank')}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Security Analysis
                </Button>
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
                <Download className="mr-2 h-5 w-5 text-green-400" />
                Data Export & Analytics
              </CardTitle>
              <CardDescription className="text-gray-400">
                Export mathematical discoveries and research data for external analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Quick Export Options</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={() => downloadCSV(currentDiscoveries, 'mathematical_discoveries')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export Discoveries (CSV)
                    </Button>
                    <Button
                      onClick={() => downloadJSON(currentDiscoveries, 'mathematical_discoveries')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Export Discoveries (JSON)
                    </Button>
                    <Button
                      onClick={() => downloadCSV(validationsData as any[], 'validations')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Export Validations (CSV)
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Complete Database Export</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={() => downloadAllRecords('json')}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white justify-start"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Complete Export (JSON)
                    </Button>
                    <Button
                      onClick={() => downloadAllRecords('csv')}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white justify-start"
                    >
                      <FileText className="h-4 w-4 mr-2" />
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

      {/* Discovery Detail Overlay */}
      {selectedDiscovery && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDiscovery(null)}>
          <Card className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Hash className="mr-2 h-5 w-5 text-purple-400" />
                  Discovery #{selectedDiscovery.id} - {selectedDiscovery.workType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <Button
                  onClick={() => setSelectedDiscovery(null)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Discovery Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Work Type:</span>
                      <span className="text-white">{selectedDiscovery.workType.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Difficulty:</span>
                      <span className="text-purple-400 font-medium">{selectedDiscovery.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Scientific Value:</span>
                      <span className="text-green-400 font-medium">${selectedDiscovery.scientificValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Researcher:</span>
                      <span className="text-blue-400 font-mono">{selectedDiscovery.workerId}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Computational Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Computational Cost:</span>
                      <span className="text-orange-400">{selectedDiscovery.computationalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Energy Efficiency:</span>
                      <span className="text-green-400">{selectedDiscovery.energyEfficiency}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timestamp:</span>
                      <span className="text-gray-300">{new Date(selectedDiscovery.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Signature:</span>
                      <span className="text-blue-400 font-mono text-xs">{selectedDiscovery.signature.substring(0, 16)}...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mathematical Results */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Mathematical Results</h4>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(selectedDiscovery.result, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Verification Data */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Verification Data</h4>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(selectedDiscovery.verificationData, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Validation Records */}
              {hasValidationRecords(selectedDiscovery.id) && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-green-400" />
                    Validation Records ({getValidationCount(selectedDiscovery.id)})
                  </h4>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {getDiscoveryRecords(selectedDiscovery.id).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300 text-sm">
                            Staker #{record.stakerId} - {record.recordType}
                          </span>
                        </div>
                        <Badge className={`${record.isVerified ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
                          {record.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}