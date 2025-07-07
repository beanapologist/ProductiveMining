import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StakingValidations from "@/components/staking-validations";
import { useState } from "react";
import { Brain, Search, Trophy, Clock, Zap, Target, Award, TrendingUp, Hash, Users, CheckCircle, Shield, Database, FileText, ExternalLink, BarChart3, Calendar, Filter, Eye, ChevronDown, ChevronUp, Activity, Download, Calculator, PieChart, LineChart, Microscope, FlaskConical, Atom, Binary, Sigma, Infinity, Pi } from "lucide-react";

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
  const { discoveries } = useWebSocket();
  const [searchQuery, setSearchQuery] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("all");
  const [selectedDiscovery, setSelectedDiscovery] = useState<MathematicalWork | null>(null);
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [valueFilter, setValueFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("discoveries");

  const { data: allDiscoveries = [], isLoading: discoveriesLoading, error: discoveriesError } = useQuery({
    queryKey: ["/api/discoveries", "all-discoveries"],
    queryFn: async () => {
      const response = await fetch("/api/discoveries?limit=100000");
      const data = await response.json();
      console.log(`🔍 Frontend received ${data.length} discoveries`);
      return data;
    },
    refetchInterval: 10000,
    staleTime: 0, // Force fresh data
  });

  const { data: immutableRecords = [] } = useQuery<ImmutableRecord[]>({
    queryKey: ['/api/immutable-records'],
  });

  const { data: validationsData = [] } = useQuery<any[]>({
    queryKey: ['/api/validations'],
  });

  const { data: blocksData = [] } = useQuery({
    queryKey: ['/api/blocks', 'limit-50000'],
    queryFn: () => fetch('/api/blocks?limit=50000').then(res => res.json()),
    staleTime: 0, // Force fresh data
  });

  const currentDiscoveries = (allDiscoveries as MathematicalWork[]) || [];
  
  console.log(`🔍 currentDiscoveries length: ${currentDiscoveries.length}`);

  // Function to get immutable records related to a specific discovery
  const getDiscoveryRecords = (workId: number): ImmutableRecord[] => {
    return immutableRecords.filter(record => record.workId === workId);
  };

  // Function to get total validation records for a discovery  
  const getValidationCount = (workId: number): number => {
    return getDiscoveryRecords(workId).length;
  };

  // Check if discovery has validation records (some records may be for older discoveries)
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
    { value: "yang_mills", label: "⚛️ Yang-Mills Theory" },
    { value: "poincare_conjecture", label: "🌐 Poincaré Conjecture" },
    { value: "elliptic_curve_crypto", label: "🔐 Elliptic Curve Crypto" },
    { value: "lattice_crypto", label: "🔒 Lattice Cryptography" },
    { value: "qdt_validation", label: "⚡ QDT Validation" }
  ];

  // Enhanced filtering with sorting and advanced filters
  const filteredDiscoveries = currentDiscoveries
    .filter((discovery: MathematicalWork) => {
      const matchesSearch = !searchQuery || 
        discovery.workType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discovery.workerId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = workTypeFilter === "all" || discovery.workType === workTypeFilter;
      
      const matchesDifficulty = difficultyFilter === "all" || 
        (difficultyFilter === "low" && discovery.difficulty < 30) ||
        (difficultyFilter === "medium" && discovery.difficulty >= 30 && discovery.difficulty < 50) ||
        (difficultyFilter === "high" && discovery.difficulty >= 50);
      
      const matchesValue = valueFilter === "all" ||
        (valueFilter === "low" && discovery.scientificValue < 1500) ||
        (valueFilter === "medium" && discovery.scientificValue >= 1500 && discovery.scientificValue < 2500) ||
        (valueFilter === "high" && discovery.scientificValue >= 2500);
    
      return matchesSearch && matchesType && matchesDifficulty && matchesValue;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "timestamp":
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
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
      
      return sortOrder === "asc" ? 
        (aValue > bValue ? 1 : -1) : 
        (aValue < bValue ? 1 : -1);
    });

  console.log(`🔍 filteredDiscoveries length: ${filteredDiscoveries.length}`);

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (!date || isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleString();
  };

  const getWorkTypeIcon = (workType: string) => {
    const icons: Record<string, string> = {
      riemann_zero: "🧮",
      prime_pattern: "🔢",
      goldbach_verification: "➕",
      birch_swinnerton_dyer: "📐",
      navier_stokes: "🌊",
      yang_mills: "⚛️",
      poincare_conjecture: "🌐",
      elliptic_curve_crypto: "🔐",
      lattice_crypto: "🔒",
      qdt_validation: "⚡"
    };
    return icons[workType] || "🧮";
  };

  const formatWorkType = (workType: string) => {
    if (!workType) return 'Unknown';
    return workType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const totalScientificValue = currentDiscoveries.reduce((sum: number, d: MathematicalWork) => 
    sum + (d.scientificValue || 0), 0
  );

  const averageDifficulty = currentDiscoveries.length > 0 
    ? currentDiscoveries.reduce((sum: number, d: MathematicalWork) => sum + d.difficulty, 0) / currentDiscoveries.length
    : 0;

  const uniqueWorkers = new Set(currentDiscoveries.map((d: MathematicalWork) => d.workerId)).size;

  // Download functions for database records
  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data available to download');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle null or undefined values
          if (value === null || value === undefined) {
            return '';
          }
          // Handle nested objects and arrays
          if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          // Handle strings with commas
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value);
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const downloadJSON = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data available to download');
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const downloadAllRecords = (format: 'csv' | 'json') => {
    const allData = {
      discoveries: currentDiscoveries,
      validations: validationsData,
      immutableRecords: immutableRecords,
      blocks: blocksData,
      exportInfo: {
        exportDate: new Date().toISOString(),
        totalDiscoveries: currentDiscoveries.length,
        totalValidations: validationStats.totalValidations,
        totalRecords: immutableRecordsStats.totalRecords,
        totalBlocks: (blocksData as any[])?.length || 0
      }
    };

    if (format === 'csv') {
      // Download separate CSV files for each data type
      downloadCSV(currentDiscoveries, 'mathematical_discoveries');
      downloadCSV(validationsData as any[], 'validations');
      downloadCSV(immutableRecords, 'immutable_records');
      downloadCSV(blocksData as any[], 'blocks');
    } else {
      downloadJSON([allData], 'complete_database_export');
    }
  };

  // Advanced database analytics
  const discoveryTypeStats = currentDiscoveries.reduce((acc: any, discovery) => {
    acc[discovery.workType] = (acc[discovery.workType] || 0) + 1;
    return acc;
  }, {});

  const validationStats = {
    totalValidations: validationsData.length,
    pendingValidations: validationsData.filter((v: any) => v.status === 'pending').length,
    approvedValidations: validationsData.filter((v: any) => v.status === 'approved').length,
    rejectedValidations: validationsData.filter((v: any) => v.status === 'rejected').length,
  };

  const immutableRecordsStats = {
    totalRecords: immutableRecords.length,
    validationRecords: immutableRecords.filter(r => r.recordType === 'validation_activity').length,
    consensusRecords: immutableRecords.filter(r => r.recordType === 'consensus_decision').length,
    verifiedRecords: immutableRecords.filter(r => r.isVerified).length,
  };

  const difficultyRanges = {
    low: currentDiscoveries.filter(d => d.difficulty < 30).length,
    medium: currentDiscoveries.filter(d => d.difficulty >= 30 && d.difficulty < 50).length,
    high: currentDiscoveries.filter(d => d.difficulty >= 50).length,
  };

  const valueRanges = {
    low: currentDiscoveries.filter(d => d.scientificValue < 1500).length,
    medium: currentDiscoveries.filter(d => d.scientificValue >= 1500 && d.scientificValue < 2500).length,
    high: currentDiscoveries.filter(d => d.scientificValue >= 2500).length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white">
            <Brain className="mr-3 h-8 w-8 text-purple-400" />
            Mathematical Discoveries
          </h1>
          <p className="text-gray-400 mt-2">
            Found {currentDiscoveries.length} total discoveries from productive mining
          </p>
          {discoveriesLoading && <p className="text-yellow-400 text-sm">Loading...</p>}
          {discoveriesError && <p className="text-red-400 text-sm">Error: {discoveriesError.message}</p>}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => downloadAllRecords('json')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
          <Button 
            onClick={() => downloadAllRecords('csv')}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Advanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-400" />
              Total Discoveries
            </CardTitle>
            <CardDescription className="text-gray-400">
              Mathematical breakthroughs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {currentDiscoveries.length}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {discoveriesLoading ? 'Loading...' : 
               currentDiscoveries.length > 0 ? 
                `+${Math.floor(currentDiscoveries.length / 10)} this week` : 
                'No discoveries loaded yet'
              }
            </div>
            <div className="text-xs text-red-400 mt-1">
              DEBUG: API={allDiscoveries.length} | Current={currentDiscoveries.length} | Filtered={filteredDiscoveries.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
              Scientific Value
            </CardTitle>
            <CardDescription className="text-gray-400">
              Total value generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              ${Math.floor(currentDiscoveries.reduce((sum, d) => sum + d.scientificValue, 0) / 1000)}K
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Avg: ${currentDiscoveries.length > 0 ? 
                Math.floor(currentDiscoveries.reduce((sum, d) => sum + d.scientificValue, 0) / currentDiscoveries.length) : 0
              } per discovery
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Zap className="mr-2 h-5 w-5 text-blue-400" />
              Avg Difficulty
            </CardTitle>
            <CardDescription className="text-gray-400">
              Computation complexity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {currentDiscoveries.length > 0 ? 
                Math.round(currentDiscoveries.reduce((sum, d) => sum + d.difficulty, 0) / currentDiscoveries.length) : 0
              }
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Range: {Math.min(...currentDiscoveries.map(d => d.difficulty))}-{Math.max(...currentDiscoveries.map(d => d.difficulty))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Users className="mr-2 h-5 w-5 text-green-400" />
              Active Researchers
            </CardTitle>
            <CardDescription className="text-gray-400">
              Unique contributors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {new Set(currentDiscoveries.map(d => d.workerId)).size}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {currentDiscoveries.length > 0 ? 
                `${Math.round(currentDiscoveries.length / new Set(currentDiscoveries.map(d => d.workerId)).size)} discoveries/researcher` : 
                'No researchers yet'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formula Analysis Tools */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calculator className="mr-2 h-5 w-5 text-orange-400" />
            Formula Analysis Tools
          </CardTitle>
          <CardDescription className="text-gray-400">
            Advanced mathematical analysis and pattern recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Work Type Distribution */}
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center">
                <PieChart className="mr-2 h-4 w-4 text-purple-400" />
                Discovery Types
              </h4>
              <div className="space-y-2">
                {Object.entries(discoveryTypeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                    <span className="text-sm text-gray-300">
                      {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-400 h-2 rounded-full" 
                          style={{width: `${(count as number / currentDiscoveries.length) * 100}%`}}
                        />
                      </div>
                      <span className="text-sm text-purple-400 font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center">
                <BarChart3 className="mr-2 h-4 w-4 text-blue-400" />
                Difficulty Analysis
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Low (&lt; 30)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full" 
                        style={{width: `${(difficultyRanges.low / currentDiscoveries.length) * 100}%`}}
                      />
                    </div>
                    <span className="text-sm text-green-400 font-medium">{difficultyRanges.low}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Medium (30-50)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{width: `${(difficultyRanges.medium / currentDiscoveries.length) * 100}%`}}
                      />
                    </div>
                    <span className="text-sm text-yellow-400 font-medium">{difficultyRanges.medium}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">High (50+)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-400 h-2 rounded-full" 
                        style={{width: `${(difficultyRanges.high / currentDiscoveries.length) * 100}%`}}
                      />
                    </div>
                    <span className="text-sm text-red-400 font-medium">{difficultyRanges.high}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Value Distribution */}
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-green-400" />
                Value Distribution
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Low (&lt; $1M)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full" 
                        style={{width: `${(valueRanges.low / currentDiscoveries.length) * 100}%`}}
                      />
                    </div>
                    <span className="text-sm text-blue-400 font-medium">{valueRanges.low}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Medium ($1M-$5M)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{width: `${(valueRanges.medium / currentDiscoveries.length) * 100}%`}}
                      />
                    </div>
                    <span className="text-sm text-yellow-400 font-medium">{valueRanges.medium}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">High ($5M+)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full" 
                        style={{width: `${(valueRanges.high / currentDiscoveries.length) * 100}%`}}
                      />
                    </div>
                    <span className="text-sm text-green-400 font-medium">{valueRanges.high}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Formula Analysis */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Microscope className="mr-2 h-5 w-5 text-cyan-400" />
            Advanced Formula Analysis
          </CardTitle>
          <CardDescription className="text-gray-400">
            Detailed mathematical pattern analysis and breakthrough identification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mathematical Complexity Analysis */}
            <div className="space-y-4">
              <h4 className="text-white font-medium flex items-center">
                <Sigma className="mr-2 h-4 w-4 text-purple-400" />
                Complexity Metrics
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Computational Intensity</span>
                    <span className="text-sm text-purple-400 font-medium">
                      {currentDiscoveries.length > 0 ? 
                        Math.round(currentDiscoveries.reduce((sum, d) => sum + d.computationalCost, 0) / currentDiscoveries.length) : 0
                      }
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Average computational cost per discovery
                  </div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Energy Efficiency</span>
                    <span className="text-sm text-green-400 font-medium">
                      {currentDiscoveries.length > 0 ? 
                        Math.round(currentDiscoveries.reduce((sum, d) => sum + d.energyEfficiency, 0) / currentDiscoveries.length) : 0
                      }%
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Average energy efficiency rating
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Recognition */}
            <div className="space-y-4">
              <h4 className="text-white font-medium flex items-center">
                <Atom className="mr-2 h-4 w-4 text-orange-400" />
                Pattern Recognition
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Prime Patterns</span>
                    <span className="text-sm text-orange-400 font-medium">
                      {discoveryTypeStats.prime_pattern || 0}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Prime number pattern discoveries
                  </div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Riemann Zeros</span>
                    <span className="text-sm text-blue-400 font-medium">
                      {discoveryTypeStats.riemann_zero || 0}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Riemann hypothesis zero discoveries
                  </div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Cryptographic Advances</span>
                    <span className="text-sm text-red-400 font-medium">
                      {(discoveryTypeStats.elliptic_curve_crypto || 0) + (discoveryTypeStats.lattice_crypto || 0)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Cryptographic breakthrough discoveries
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Analytics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Database className="mr-2 h-5 w-5 text-blue-400" />
            Database Analytics
          </CardTitle>
          <CardDescription className="text-gray-400">
            Comprehensive validation and record tracking statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Validation Statistics */}
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                Validation Status
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Total Validations</span>
                  <span className="text-sm text-blue-400 font-medium">{validationStats.totalValidations}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Approved</span>
                  <span className="text-sm text-green-400 font-medium">{validationStats.approvedValidations}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Pending</span>
                  <span className="text-sm text-yellow-400 font-medium">{validationStats.pendingValidations}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Rejected</span>
                  <span className="text-sm text-red-400 font-medium">{validationStats.rejectedValidations}</span>
                </div>
              </div>
            </div>

            {/* Immutable Records */}
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center">
                <Shield className="mr-2 h-4 w-4 text-purple-400" />
                Immutable Records
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Total Records</span>
                  <span className="text-sm text-purple-400 font-medium">{immutableRecordsStats.totalRecords}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Validation Records</span>
                  <span className="text-sm text-blue-400 font-medium">{immutableRecordsStats.validationRecords}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Consensus Records</span>
                  <span className="text-sm text-green-400 font-medium">{immutableRecordsStats.consensusRecords}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Verified</span>
                  <span className="text-sm text-emerald-400 font-medium">{immutableRecordsStats.verifiedRecords}</span>
                </div>
              </div>
            </div>

            {/* Research Metrics */}
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-yellow-400" />
                Research Metrics
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Avg Discovery Time</span>
                  <span className="text-sm text-yellow-400 font-medium">
                    {currentDiscoveries.length > 1 ? 
                      Math.round((new Date(currentDiscoveries[0].timestamp).getTime() - new Date(currentDiscoveries[currentDiscoveries.length - 1].timestamp).getTime()) / (1000 * 60 * 60 * currentDiscoveries.length)) : 0
                    }h
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Discovery Rate</span>
                  <span className="text-sm text-green-400 font-medium">
                    {currentDiscoveries.length > 0 ? 
                      Math.round(currentDiscoveries.length / Math.max(1, Math.ceil((Date.now() - new Date(currentDiscoveries[currentDiscoveries.length - 1].timestamp).getTime()) / (1000 * 60 * 60 * 24)))) : 0
                    }/day
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Success Rate</span>
                  <span className="text-sm text-emerald-400 font-medium">
                    {validationStats.totalValidations > 0 ? 
                      Math.round((validationStats.approvedValidations / validationStats.totalValidations) * 100) : 0
                    }%
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-sm text-gray-300">Blockchain Records</span>
                  <span className="text-sm text-blue-400 font-medium">{(blocksData as any[])?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                          ${discovery.scientificValue?.toLocaleString() || 0}
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
          <StakingValidations />
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
                      <li>• {validationStats.totalValidations} validation records</li>
                      <li>• {immutableRecordsStats.totalRecords} immutable records</li>
                      <li>• {(blocksData as any[])?.length || 0} blockchain blocks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Discovery Detail Modal */}
      {selectedDiscovery && (
        <Dialog open={!!selectedDiscovery} onOpenChange={() => setSelectedDiscovery(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <Hash className="mr-2 h-5 w-5 text-purple-400" />
                Discovery #{selectedDiscovery.id} - {selectedDiscovery.workType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </DialogTitle>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}