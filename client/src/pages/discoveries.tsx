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
import { Brain, Search, Trophy, Clock, Zap, Target, Award, TrendingUp, Hash, Users, CheckCircle, Shield, Database, FileText, ExternalLink } from "lucide-react";

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

  const { data: initialDiscoveries = [] } = useQuery({
    queryKey: ["/api/discoveries"],
    enabled: !discoveries
  });

  const { data: immutableRecords = [] } = useQuery<ImmutableRecord[]>({
    queryKey: ['/api/immutable-records'],
  });

  const currentDiscoveries = discoveries && discoveries.length > 0 ? discoveries : (initialDiscoveries as MathematicalWork[] || []);

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

  const filteredDiscoveries = currentDiscoveries.filter((discovery: MathematicalWork) => {
    const matchesSearch = !searchQuery || 
      discovery.workType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discovery.workerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = workTypeFilter === "all" || discovery.workType === workTypeFilter;
    
    return matchesSearch && matchesType;
  });

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
    return workType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const totalScientificValue = currentDiscoveries.reduce((sum: number, d: MathematicalWork) => 
    sum + (d.scientificValue || 0), 0
  );

  const averageDifficulty = currentDiscoveries.length > 0 
    ? currentDiscoveries.reduce((sum: number, d: MathematicalWork) => sum + d.difficulty, 0) / currentDiscoveries.length
    : 0;

  const uniqueWorkers = new Set(currentDiscoveries.map((d: MathematicalWork) => d.workerId)).size;

  return (
    <div className="text-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Brain className="h-10 w-10 mr-3 text-purple-400" />
            Mathematical Discoveries
          </h1>
          <p className="text-xl text-slate-300">
            Explore groundbreaking mathematical breakthroughs and scientific achievements
          </p>
        </div>

        {/* Discovery Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="pm-card border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{currentDiscoveries.length}</div>
                  <div className="text-sm text-slate-400">Total Discoveries</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pm-card border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-500/20">
                  <Award className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">${totalScientificValue.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">Scientific Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pm-card border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Target className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{averageDifficulty.toFixed(1)}</div>
                  <div className="text-sm text-slate-400">Avg Difficulty</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pm-card border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-orange-500/20">
                  <Users className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{uniqueWorkers}</div>
                  <div className="text-sm text-slate-400">Contributors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discovery List */}
          <div className="lg:col-span-2">
            <Card className="pm-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-400" />
                  Mathematical Breakthroughs
                </CardTitle>
                <CardDescription>
                  Scientific discoveries made through productive mining
                </CardDescription>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search discoveries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 sm:w-[200px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {workTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredDiscoveries.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No discoveries found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    filteredDiscoveries.map((discovery: MathematicalWork) => (
                      <div 
                        key={discovery.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-purple-500/50 ${
                          selectedDiscovery?.id === discovery.id 
                            ? 'bg-purple-500/10 border-purple-500' 
                            : 'bg-slate-800/30 border-slate-700'
                        }`}
                        onClick={() => setSelectedDiscovery(discovery)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getWorkTypeIcon(discovery.workType)}</span>
                            <div>
                              <Badge variant="outline" className="text-purple-400 border-purple-400 mb-1">
                                {formatWorkType(discovery.workType)}
                              </Badge>
                              <div className="text-xs text-slate-400">
                                Difficulty {discovery.difficulty}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-green-400">
                              ${discovery.scientificValue?.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400">
                              {formatTimestamp(discovery.timestamp)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Database className="h-3 w-3 text-blue-400" />
                              <span className="text-blue-400">{getValidationCount(discovery.id)} Records</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Zap className="h-3 w-3 text-yellow-400" />
                              <span className="text-slate-400">
                                {discovery.energyEfficiency}x efficient
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3 text-green-400" />
                              <span className="text-slate-400">Verified</span>
                            </div>
                          </div>
                          <div className="text-slate-400 font-mono text-xs">
                            {discovery.workerId.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Discovery Details */}
          <div>
            <Card className="pm-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                  Discovery Details
                </CardTitle>
                <CardDescription>
                  Detailed information about the selected discovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedDiscovery ? (
                  <div className="text-center py-8 text-slate-400">
                    <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select a discovery to view details</p>
                  </div>
                ) : (
                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                      <TabsTrigger value="details" className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4" />
                        <span>Details</span>
                      </TabsTrigger>
                      <TabsTrigger value="validators" className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Validators</span>
                      </TabsTrigger>
                      <TabsTrigger value="records" className="flex items-center space-x-2">
                        <Database className="h-4 w-4" />
                        <span>Records</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      {/* Discovery Header */}
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-3xl">{getWorkTypeIcon(selectedDiscovery.workType)}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {formatWorkType(selectedDiscovery.workType)}
                            </h3>
                            <div className="text-sm text-slate-400">
                              Discovery #{selectedDiscovery.id}
                            </div>
                          </div>
                        </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Timestamp:</span>
                          <span className="text-white">{formatTimestamp(selectedDiscovery.timestamp)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Difficulty:</span>
                          <span className="text-white">{selectedDiscovery.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Energy Efficiency:</span>
                          <span className="text-green-400">{selectedDiscovery.energyEfficiency}x</span>
                        </div>
                      </div>
                    </div>

                    {/* Scientific Value */}
                    <div className="p-4 bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-lg border border-green-500/20">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Scientific Impact
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Scientific Value:</span>
                          <span className="text-green-400 font-semibold text-lg">
                            ${selectedDiscovery.scientificValue?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Computational Cost:</span>
                          <span className="text-yellow-400">
                            {selectedDiscovery.computationalCost?.toLocaleString()} ops
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Efficiency Ratio:</span>
                          <span className="text-blue-400">
                            {((selectedDiscovery.scientificValue || 0) / (selectedDiscovery.computationalCost || 1)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Verification */}
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                        Verification Status
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            ✓ VERIFIED
                          </Badge>
                          <span className="text-slate-400">Cryptographically signed</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-2">
                          <strong>Signature:</strong>
                          <div className="font-mono bg-slate-900 p-2 rounded mt-1 break-all">
                            {selectedDiscovery.signature}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Worker Info */}
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Contributor
                      </h4>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Worker ID:</span>
                          <span className="text-orange-400 font-mono">
                            {selectedDiscovery.workerId.slice(0, 12)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mathematical Result Preview */}
                    {selectedDiscovery.result && (
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <h4 className="text-white font-semibold mb-2 flex items-center">
                          <Hash className="h-4 w-4 mr-2" />
                          Result Preview
                        </h4>
                        <div className="text-xs text-slate-400 bg-slate-900 p-3 rounded font-mono max-h-32 overflow-y-auto">
                          {JSON.stringify(selectedDiscovery.result, null, 2).slice(0, 500)}
                          {JSON.stringify(selectedDiscovery.result).length > 500 && "..."}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                    <TabsContent value="validators" className="space-y-4">
                      <StakingValidations 
                        workId={selectedDiscovery.id} 
                        workTitle={formatWorkType(selectedDiscovery.workType)}
                      />
                    </TabsContent>

                    <TabsContent value="records" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-semibold flex items-center">
                            <Database className="h-4 w-4 mr-2" />
                            Immutable Validation Records
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                              onClick={() => window.open('/validators#records', '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View All Records
                            </Button>
                          </div>
                        </div>

                        {getDiscoveryRecords(selectedDiscovery.id).length > 0 ? (
                          <div className="space-y-3">
                            <div className="text-sm text-green-400 mb-3">
                              ✓ {getDiscoveryRecords(selectedDiscovery.id).length} validation records found for this discovery
                            </div>
                            {getDiscoveryRecords(selectedDiscovery.id).map((record) => (
                              <Card key={record.id} className="bg-slate-800/30 border-slate-700">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        <span className="font-medium text-white">Record #{record.id}</span>
                                        <Badge variant="outline" className="bg-blue-50/10 border-blue-400/30 text-blue-400">
                                          {record.recordType}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                                        <div>
                                          <span className="font-medium">Staker ID:</span> {record.stakerId}
                                        </div>
                                        <div>
                                          <span className="font-medium">Validation ID:</span> {record.validationId || 'N/A'}
                                        </div>
                                        <div>
                                          <span className="font-medium">Reputation Impact:</span> {record.reputationImpact.toFixed(4)}
                                        </div>
                                        <div>
                                          <span className="font-medium">Status:</span> 
                                          <span className={`ml-1 ${record.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {record.isVerified ? 'Verified' : 'Pending'}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-sm text-slate-500">
                                        <span className="font-medium">Activity Hash:</span> 
                                        <code className="ml-2 bg-slate-900 px-2 py-1 rounded text-xs">
                                          {record.activityHash.substring(0, 20)}...
                                        </code>
                                      </div>
                                      <div className="text-sm text-slate-500">
                                        <span className="font-medium">Digital Signature:</span>
                                        <code className="ml-2 bg-slate-900 px-2 py-1 rounded text-xs">
                                          {record.digitalSignature.substring(0, 24)}...
                                        </code>
                                      </div>
                                    </div>
                                    <div className="text-right text-sm text-slate-500">
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        {record.isVerified ? 'Verified' : 'Pending'}
                                      </div>
                                      <div>{new Date(record.immutableSince).toLocaleDateString()}</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400">
                            <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No validation records for this discovery</p>
                            <p className="text-sm">Newer discoveries await validation through the PoS consensus system</p>
                            <div className="mt-4 text-xs bg-slate-800/30 rounded p-3">
                              <div className="text-green-400 mb-1">✓ Network Status: {immutableRecords.length} total validation records exist</div>
                              <div className="text-blue-400">✓ PoS validation system active with institutional validators</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}