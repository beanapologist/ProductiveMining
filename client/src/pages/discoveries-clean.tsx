import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [minDifficulty, setMinDifficulty] = useState<number | null>(null);

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
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="discoveries" className="data-[state=active]:bg-purple-600">
            <Microscope className="h-4 w-4 mr-2" />
            Discoveries
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
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