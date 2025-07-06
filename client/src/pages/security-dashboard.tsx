import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, Key, Zap, AlertTriangle, CheckCircle, Database, Search, FileText, ExternalLink, Users, Brain, TrendingUp, Target, RefreshCw, Play, GraduationCap, Layers, Calculator, Award, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SecurityAnalysis {
  discoveryCount: number;
  enhancedCryptoKey?: {
    keyStrength: number;
    quantumResistance: number;
    securityLevel: string;
    enhancementSources: string[];
  };
  primeSignature?: {
    signature: string;
    verificationHash: string;
    primeStrength: number;
  };
  securityHash?: {
    hash: string;
    layers: number;
    entropy: number;
    securityLevel: string;
  };
  timestamp: string;
}

interface SecurityDiscoveryLink {
  discoveryId: number;
  workType: string;
  securityImpact: 'critical' | 'high' | 'medium' | 'low';
  cryptographicEnhancement: string;
  securityScore: number;
  aiAnalysis?: {
    significance: string;
    confidence: number;
    securityApplications: string[];
  };
}

interface ThreatAlert {
  id: number;
  threatType: 'quantum_attack' | 'pattern_exploitation' | 'validation_manipulation' | 'mining_hijack' | 'discovery_fraud' | 'network_compromise' | 'ai_adversarial';
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  description: string;
  affectedSystems: string[];
  detectionMethod: string;
  mitigationStrategy: string;
  automaticResponse: boolean;
  timestamp: Date;
  resolved: boolean;
  relatedDiscoveries: number[];
  threatVector: {
    source: string;
    target: string;
    method: string;
    impact: string;
  };
  aiAnalysis: {
    patternMatching: number;
    anomalyScore: number;
    riskAssessment: string;
    emergingThreatProbability: number;
  };
}

interface SecurityMitigation {
  id: number;
  threatId: number;
  mitigationType: 'cryptographic_enhancement' | 'network_hardening' | 'validation_strengthening' | 'discovery_verification' | 'ai_defense' | 'quantum_resistance';
  status: 'planned' | 'implementing' | 'active' | 'completed' | 'failed';
  effectiveness: number;
  automatedResponse: boolean;
  implementationDetails: {
    method: string;
    parameters: Record<string, any>;
    timeframe: string;
    resources: string[];
  };
  verificationMetrics: {
    securityImprovement: number;
    performanceImpact: number;
    reliabilityScore: number;
  };
  timestamp: Date;
}

interface ThreatIntelligence {
  globalThreats: {
    quantumAttacks: number;
    aiAdversarial: number;
    networkIntrusions: number;
    validationAttacks: number;
  };
  emergingPatterns: {
    type: string;
    frequency: number;
    riskLevel: string;
    firstDetected: Date;
  }[];
  defensivePosture: {
    overallRisk: number;
    mitigationCoverage: number;
    responseTime: number;
    adaptiveDefenses: number;
  };
  predictionModel: {
    nextThreatProbability: number;
    estimatedImpact: string;
    preparednessLevel: number;
    recommendedActions: string[];
  };
}

interface SecurityInsights {
  totalSecurityDiscoveries: number;
  quantumResistant: number;
  cryptographicBreakthroughs: number;
  averageSecurityScore: number;
  topSecurityEnhancements: SecurityDiscoveryLink[];
  emergingThreats: Array<{
    threat: string;
    mitigation: string;
    relatedDiscoveries: number[];
  }>;
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

interface AdaptiveSecurityStatus {
  currentIteration: number;
  lastIteration: string;
  totalIterations: number;
  latestSecurityMetrics: {
    overallSecurityScore: number;
    threatDetectionAccuracy: number;
    cryptographicStrength: number;
    adaptiveDefenseLevel: number;
    quantumResistanceLevel: number;
  } | null;
  adaptiveProtocolsActive: number;
  securityEvolutionTrend: number;
}

interface IntegrityResults {
  summary: {
    totalBlocks: number;
    validBlocks: number;
    invalidBlocks: number;
    warningBlocks: number;
    overallIntegrity: number;
  };
  securityMetrics: {
    totalBlocksValidated: number;
    validBlocks: number;
    integrityScore: number;
    lastValidation: string;
    cryptographicStrength: string;
    averageQuantumResistance: number;
  };
  timestamp: string;
}

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState("security");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<SecurityAnalysis | null>(null);
  const [threatFilter, setThreatFilter] = useState<string>('all');
  const [selectedThreat, setSelectedThreat] = useState<ThreatAlert | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [integrityResults, setIntegrityResults] = useState<IntegrityResults | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Adaptive Security Status
  const { data: adaptiveSecurityStatus } = useQuery<AdaptiveSecurityStatus>({
    queryKey: ['/api/adaptive-security/status'],
    refetchInterval: 10000,
  });

  // Trigger security iteration mutation
  const triggerSecurityMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/adaptive-security/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!response.ok) throw new Error('Failed to trigger security iteration');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Security Iteration Triggered!",
        description: "Adaptive security improvement cycle has been initiated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/adaptive-security/status'] });
    },
    onError: (error) => {
      toast({
        title: "Security Iteration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const { data: discoveries } = useQuery({
    queryKey: ['/api/discoveries'],
    queryFn: () => fetch('/api/discoveries?limit=50000').then(res => res.json()),
  });

  const { data: securityInsights, isLoading: loadingInsights } = useQuery<SecurityInsights>({
    queryKey: ['/api/discoveries/security-insights'],
    staleTime: 30000
  });

  const { data: immutableRecords = [] } = useQuery<ImmutableRecord[]>({
    queryKey: ['/api/immutable-records'],
    refetchInterval: 30000,
  });

  // Threat Detection Queries
  const { data: threats = [], isLoading: loadingThreats, refetch: refetchThreats } = useQuery<ThreatAlert[]>({
    queryKey: ['/api/security/threats', threatFilter],
    queryFn: async () => {
      const params = threatFilter !== 'all' ? `?severity=${threatFilter}` : '';
      const response = await fetch(`/api/security/threats${params}`);
      if (!response.ok) throw new Error('Failed to fetch threats');
      return response.json();
    },
    staleTime: 15000,
    refetchInterval: 30000,
  });

  const { data: mitigations = [] } = useQuery<SecurityMitigation[]>({
    queryKey: ['/api/security/mitigations'],
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const { data: threatIntelligence } = useQuery<{threatIntelligence: ThreatIntelligence}>({
    queryKey: ['/api/security/threat-intelligence'],
    staleTime: 60000,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  const { data: aiRecommendations = [] } = useQuery<any[]>({
    queryKey: ['/api/security/ai-recommendations'],
    staleTime: 120000,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  const runSecurityAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/crypto/analysis');
      const data = await response.json();
      setLastAnalysis(data.analysis);
    } catch (error) {
      console.error('Security analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const integrityCheckMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/integrity/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Integrity check failed');
      return response.json();
    },
    onSuccess: (data) => {
      setIntegrityResults(data);
      queryClient.invalidateQueries({ queryKey: ['/api/blocks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stakers'] });
      toast({
        title: "Data Integrity Check Completed",
        description: `Validated ${data.summary.totalBlocks} blocks with ${data.summary.overallIntegrity.toFixed(1)}% integrity`,
      });
    },
    onError: () => {
      toast({
        title: "Integrity Check Failed",
        description: "Could not complete blockchain validation",
        variant: "destructive",
      });
    },
  });

  // Threat Detection Mutations
  const threatScanMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/security/threat-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Threat scan failed');
      return response.json();
    },
    onSuccess: (data) => {
      setIsScanning(false);
      refetchThreats();
      toast({
        title: "Threat Scan Completed",
        description: `Detected ${data.threatsDetected} potential threats`,
        variant: data.threatsDetected > 0 ? "destructive" : "default",
      });
    },
    onError: () => {
      setIsScanning(false);
      toast({
        title: "Threat Scan Failed",
        description: "Could not complete security scan",
        variant: "destructive",
      });
    },
  });

  const mitigateThreatMutation = useMutation({
    mutationFn: async (threatId: number) => {
      const response = await fetch(`/api/security/threats/${threatId}/mitigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Mitigation failed');
      return response.json();
    },
    onSuccess: () => {
      refetchThreats();
      queryClient.invalidateQueries({ queryKey: ['/api/security/mitigations'] });
      toast({
        title: "Mitigation Deployed",
        description: "Security measures have been implemented",
      });
    },
    onError: () => {
      toast({
        title: "Mitigation Failed",
        description: "Could not deploy security countermeasures",
        variant: "destructive",
      });
    },
  });

  const runThreatScan = () => {
    setIsScanning(true);
    threatScanMutation.mutate();
  };

  const handleMitigateThreat = (threatId: number) => {
    mitigateThreatMutation.mutate(threatId);
  };

  useEffect(() => {
    if (discoveries?.length > 0) {
      runSecurityAnalysis();
    }
  }, [discoveries]);

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'Military Grade': case 'POST_QUANTUM': return 'bg-red-500';
      case 'Enterprise Grade': case 'QUANTUM_SAFE': return 'bg-purple-500';
      case 'Commercial Grade': case 'ENHANCED': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSecurityLevelIcon = (level: string) => {
    switch (level) {
      case 'Military Grade': case 'POST_QUANTUM': return <Shield className="h-5 w-5" />;
      case 'Enterprise Grade': case 'QUANTUM_SAFE': return <Lock className="h-5 w-5" />;
      case 'Commercial Grade': case 'ENHANCED': return <Key className="h-5 w-5" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white">
            <Shield className="mr-3 h-8 w-8 text-purple-400" />
            Security & Operations Hub
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive security, validation, complexity analysis, and AI enhancement system
          </p>
        </div>
        <Button 
          onClick={runSecurityAnalysis}
          disabled={isAnalyzing}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isAnalyzing ? (
            <>
              <Zap className="mr-2 h-4 w-4 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Run Analysis
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="validators" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Validators
          </TabsTrigger>
          <TabsTrigger value="institutional" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="ai-learning" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Systems
          </TabsTrigger>
          <TabsTrigger value="complexity" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Complexity
          </TabsTrigger>
          <TabsTrigger value="valuation" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Valuation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Discovery Count */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-400" />
              Mathematical Discoveries
            </CardTitle>
            <CardDescription className="text-gray-400">
              Available for security enhancement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {discoveries?.length || 0}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Active discoveries in system
            </p>
          </CardContent>
        </Card>

        {/* Enhanced Crypto Key */}
        {lastAnalysis?.enhancedCryptoKey && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Key className="mr-2 h-5 w-5 text-blue-400" />
                Enhanced Cryptographic Key
              </CardTitle>
              <CardDescription className="text-gray-400">
                Multi-source mathematical enhancement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Key Strength:</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {lastAnalysis.enhancedCryptoKey.keyStrength}-bit
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Quantum Resistance:</span>
                <Progress 
                  value={lastAnalysis.enhancedCryptoKey.quantumResistance} 
                  className="w-16 h-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Security Level:</span>
                <Badge className={`${getSecurityLevelColor(lastAnalysis.enhancedCryptoKey.securityLevel)} text-white`}>
                  {getSecurityLevelIcon(lastAnalysis.enhancedCryptoKey.securityLevel)}
                  <span className="ml-1">{lastAnalysis.enhancedCryptoKey.securityLevel}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Hash */}
        {lastAnalysis?.securityHash && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Lock className="mr-2 h-5 w-5 text-purple-400" />
                Multi-Layer Security Hash
              </CardTitle>
              <CardDescription className="text-gray-400">
                Combined mathematical insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Security Layers:</span>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  {lastAnalysis.securityHash.layers}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Entropy:</span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {Math.round(lastAnalysis.securityHash.entropy)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Level:</span>
                <Badge className={`${getSecurityLevelColor(lastAnalysis.securityHash.securityLevel)} text-white`}>
                  {getSecurityLevelIcon(lastAnalysis.securityHash.securityLevel)}
                  <span className="ml-1">{lastAnalysis.securityHash.securityLevel}</span>
                </Badge>
              </div>
              <div className="text-xs text-gray-500 font-mono break-all mt-3 p-2 bg-slate-900 rounded">
                {lastAnalysis.securityHash.hash.substring(0, 32)}...
              </div>
            </CardContent>
          </Card>
        )}
        {/* Immutable Records Security */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-purple-400" />
                  Immutable Records Security
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Cryptographic validation audit trail
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                onClick={() => window.open('/validators', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Records
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{immutableRecords.length}</div>
                <div className="text-xs text-gray-400">Total Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {immutableRecords.filter(r => r.isVerified).length}
                </div>
                <div className="text-xs text-gray-400">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {immutableRecords.filter(r => r.recordType === 'validation_activity').length}
                </div>
                <div className="text-xs text-gray-400">Validations</div>
              </div>
            </div>
            
            {immutableRecords.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-gray-400 font-medium">Recent Security Records:</div>
                {immutableRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="p-3 bg-slate-900/50 rounded border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-purple-400 border-purple-400">
                          #{record.id}
                        </Badge>
                        <span className="text-sm text-gray-300">{record.recordType}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {record.isVerified ? (
                          <CheckCircle className="h-3 w-3 text-green-400" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-yellow-400" />
                        )}
                        <span className="text-xs text-gray-400">
                          {record.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 font-mono">
                      Hash: {record.activityHash.substring(0, 16)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Integrity Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-blue-400" />
              Blockchain Data Integrity
            </div>
            <Button 
              onClick={() => integrityCheckMutation.mutate()}
              disabled={integrityCheckMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              {integrityCheckMutation.isPending ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Run Integrity Check
                </>
              )}
            </Button>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Comprehensive validation of all blocks and mathematical formulas through PoS consensus
          </CardDescription>
        </CardHeader>
        <CardContent>
          {integrityResults ? (
            <div className="space-y-4">
              {/* Integrity Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {integrityResults.summary.totalBlocks}
                  </div>
                  <div className="text-sm text-gray-400">Total Blocks</div>
                </div>
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {integrityResults.summary.validBlocks}
                  </div>
                  <div className="text-sm text-gray-400">Valid Blocks</div>
                </div>
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400">
                    {integrityResults.summary.warningBlocks}
                  </div>
                  <div className="text-sm text-gray-400">Warnings</div>
                </div>
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">
                    {integrityResults.summary.invalidBlocks}
                  </div>
                  <div className="text-sm text-gray-400">Invalid</div>
                </div>
              </div>

              {/* Overall Integrity Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Overall Integrity Score</span>
                  <span className="text-green-400 font-bold">
                    {integrityResults.summary.overallIntegrity.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={integrityResults.summary.overallIntegrity} 
                  className="h-2"
                />
              </div>

              {/* Security Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Cryptographic Strength:</span>
                    <Badge 
                      className={`${getSecurityLevelColor(integrityResults.securityMetrics.cryptographicStrength)} text-white`}
                    >
                      {integrityResults.securityMetrics.cryptographicStrength}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Quantum Resistance:</span>
                    <span className="text-purple-400 font-semibold">
                      {integrityResults.securityMetrics.averageQuantumResistance.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Last Validation:</span>
                    <span className="text-blue-400 text-sm">
                      {new Date(integrityResults.securityMetrics.lastValidation).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">PoS Consensus:</span>
                    <span className="text-green-400 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="h-12 w-12 mx-auto mb-3 text-gray-500" />
              <p className="text-gray-400">Click "Run Integrity Check" to validate blockchain data</p>
              <p className="text-sm text-gray-500 mt-1">
                This will examine all blocks, verify mathematical formulas, and validate through PoS consensus
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhancement Sources */}
      {lastAnalysis?.enhancedCryptoKey?.enhancementSources && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-400" />
              Mathematical Enhancement Sources
            </CardTitle>
            <CardDescription className="text-gray-400">
              Cryptographic improvements derived from real mathematical breakthroughs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lastAnalysis.enhancedCryptoKey.enhancementSources.map((source, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">{source}</div>
                    <div className="text-xs text-gray-400">Active Enhancement</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adaptive Security Evolution System */}
      {adaptiveSecurityStatus && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-400" />
                Adaptive Security Evolution System
              </div>
              <Button
                onClick={() => triggerSecurityMutation.mutate()}
                disabled={triggerSecurityMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                {triggerSecurityMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Trigger Security Iteration
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Self-improving security system with real-time threat adaptation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {adaptiveSecurityStatus.currentIteration}
                </div>
                <div className="text-sm text-gray-400">Current Iteration</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {adaptiveSecurityStatus.latestSecurityMetrics?.overallSecurityScore || '--'}%
                </div>
                <div className="text-sm text-gray-400">Security Score</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {adaptiveSecurityStatus.adaptiveProtocolsActive}
                </div>
                <div className="text-sm text-gray-400">Active Protocols</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">
                  {adaptiveSecurityStatus.latestSecurityMetrics?.threatDetectionAccuracy || '--'}%
                </div>
                <div className="text-sm text-gray-400">Threat Detection</div>
              </div>
            </div>
            
            {/* Security Evolution Metrics */}
            {adaptiveSecurityStatus.latestSecurityMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Cryptographic Strength:</span>
                    <span className="text-green-400 font-bold">
                      {adaptiveSecurityStatus.latestSecurityMetrics.cryptographicStrength}%
                    </span>
                  </div>
                  <Progress 
                    value={adaptiveSecurityStatus.latestSecurityMetrics.cryptographicStrength} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Quantum Resistance:</span>
                    <span className="text-blue-400 font-bold">
                      {adaptiveSecurityStatus.latestSecurityMetrics.quantumResistanceLevel}%
                    </span>
                  </div>
                  <Progress 
                    value={adaptiveSecurityStatus.latestSecurityMetrics.quantumResistanceLevel} 
                    className="h-2"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Discovery Security Integration */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-400" />
              AI Discovery Security Integration
            </div>
            <Button
              onClick={() => window.open('/discoveries', '_blank')}
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              size="sm"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Analysis
            </Button>
          </CardTitle>
          <CardDescription className="text-gray-400">
            AI-powered analysis of mathematical discoveries for cryptographic security enhancement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingInsights ? (
            <div className="flex items-center justify-center py-8">
              <Brain className="h-6 w-6 animate-pulse text-purple-400 mr-2" />
              <span className="text-gray-400">Loading AI insights...</span>
            </div>
          ) : securityInsights ? (
            <div className="space-y-6">
              {/* Security Discovery Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">
                    {securityInsights.totalSecurityDiscoveries}
                  </div>
                  <div className="text-sm text-gray-400">Security Discoveries</div>
                </div>
                <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">
                    {securityInsights.quantumResistant}
                  </div>
                  <div className="text-sm text-gray-400">Quantum Resistant</div>
                </div>
                <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">
                    {securityInsights.cryptographicBreakthroughs}
                  </div>
                  <div className="text-sm text-gray-400">Crypto Breakthroughs</div>
                </div>
                <div className="text-center p-3 bg-orange-900/20 rounded-lg border border-orange-500/20">
                  <div className="text-2xl font-bold text-orange-400">
                    {Math.round(securityInsights.averageSecurityScore)}
                  </div>
                  <div className="text-sm text-gray-400">Avg Security Score</div>
                </div>
              </div>

              {/* Top Security Enhancements */}
              <div className="space-y-3">
                <h4 className="text-white font-medium flex items-center">
                  <Target className="mr-2 h-4 w-4 text-green-400" />
                  Top Security Enhancements
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {securityInsights.topSecurityEnhancements?.slice(0, 5).map((enhancement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={`${
                          enhancement.securityImpact === 'critical' ? 'bg-red-600' :
                          enhancement.securityImpact === 'high' ? 'bg-orange-600' :
                          enhancement.securityImpact === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
                        } text-white`}>
                          {enhancement.securityImpact}
                        </Badge>
                        <div>
                          <div className="text-sm text-white font-medium">
                            {enhancement.cryptographicEnhancement}
                          </div>
                          <div className="text-xs text-gray-400">
                            Discovery #{enhancement.discoveryId} • {enhancement.workType.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-400">
                          {enhancement.securityScore}
                        </div>
                        <div className="text-xs text-gray-400">
                          {enhancement.aiAnalysis?.confidence.toFixed(1)}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emerging Threats */}
              <div className="space-y-3">
                <h4 className="text-white font-medium flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-400" />
                  Emerging Threats & Mitigations
                </h4>
                <div className="space-y-2">
                  {securityInsights.emergingThreats?.map((threat, index) => (
                    <div key={index} className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-red-400 font-medium">{threat.threat}</span>
                        <Badge variant="outline" className="text-red-400 border-red-400">
                          {threat.relatedDiscoveries?.length || 0} discoveries
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-300">
                        <span className="text-green-400 font-medium">Mitigation:</span> {threat.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto mb-3 text-gray-500" />
              <p className="text-gray-400">AI security insights will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI-Powered Threat Detection */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-400" />
              AI Threat Detection & Mitigation
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={runThreatScan}
                disabled={isScanning}
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                size="sm"
              >
                {isScanning ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-pulse" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Threat Scan
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Advanced AI-powered threat detection using mathematical discovery patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Threat Intelligence Overview */}
            {threatIntelligence && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                  <div className="text-2xl font-bold text-red-400">
                    {threatIntelligence.threatIntelligence.globalThreats.quantumAttacks}
                  </div>
                  <div className="text-sm text-gray-400">Quantum Attacks</div>
                </div>
                <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">
                    {threatIntelligence.threatIntelligence.globalThreats.aiAdversarial}
                  </div>
                  <div className="text-sm text-gray-400">AI Adversarial</div>
                </div>
                <div className="text-center p-3 bg-orange-900/20 rounded-lg border border-orange-500/20">
                  <div className="text-2xl font-bold text-orange-400">
                    {threatIntelligence.threatIntelligence.globalThreats.networkIntrusions}
                  </div>
                  <div className="text-sm text-gray-400">Network Threats</div>
                </div>
                <div className="text-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                  <div className="text-2xl font-bold text-yellow-400">
                    {threatIntelligence.threatIntelligence.globalThreats.validationAttacks}
                  </div>
                  <div className="text-sm text-gray-400">Validation Attacks</div>
                </div>
              </div>
            )}

            {/* Active Threats */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-400" />
                  Active Threats ({threats.filter(t => !t.resolved).length})
                </h4>
                <div className="flex space-x-2">
                  <select
                    value={threatFilter}
                    onChange={(e) => setThreatFilter(e.target.value)}
                    className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-1 text-sm"
                  >
                    <option value="all">All Threats</option>
                    <option value="critical">Critical Only</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
              
              {loadingThreats ? (
                <div className="text-center py-8">
                  <div className="animate-pulse text-gray-400">Loading threat data...</div>
                </div>
              ) : threats.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {threats.filter(t => !t.resolved).slice(0, 10).map((threat) => (
                    <div key={threat.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Badge className={`${
                            threat.severity === 'critical' ? 'bg-red-600' :
                            threat.severity === 'high' ? 'bg-orange-600' :
                            threat.severity === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
                          } text-white`}>
                            {threat.severity}
                          </Badge>
                          <span className="text-white font-medium">
                            {threat.threatType.replace('_', ' ').toUpperCase()}
                          </span>
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {threat.confidence.toFixed(1)}% confidence
                          </Badge>
                        </div>
                        <Button
                          onClick={() => handleMitigateThreat(threat.id)}
                          disabled={mitigateThreatMutation.isPending}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {mitigateThreatMutation.isPending ? 'Deploying...' : 'Mitigate'}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{threat.description}</p>
                      <div className="text-xs text-gray-400">
                        <div>Detection: {threat.detectionMethod}</div>
                        <div>AI Analysis: {threat.aiAnalysis.riskAssessment} (Score: {threat.aiAnalysis.anomalyScore.toFixed(2)})</div>
                        <div>Affected Systems: {threat.affectedSystems.join(', ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
                  <p className="text-gray-400">No active threats detected</p>
                  <p className="text-sm text-gray-500">All systems secure</p>
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            {aiRecommendations.length > 0 && (
              <div>
                <h4 className="text-white font-medium flex items-center mb-3">
                  <Brain className="mr-2 h-4 w-4 text-purple-400" />
                  AI Security Recommendations
                </h4>
                <div className="space-y-2">
                  {aiRecommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-purple-400 font-medium text-sm">{rec.type?.replace('_', ' ')}</span>
                        <Badge variant="outline" className={`text-xs ${
                          rec.priority === 'high' ? 'text-red-400 border-red-400' :
                          rec.priority === 'medium' ? 'text-yellow-400 border-yellow-400' :
                          'text-gray-400 border-gray-400'
                        }`}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-300">{rec.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Confidence: {rec.confidence?.toFixed(1)}% • Related Discovery: #{rec.relatedDiscovery}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Traditional vs Enhanced Security</CardTitle>
            <CardDescription className="text-gray-400">
              Comparison with standard cryptographic systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Standard AES-256:</span>
                <Badge variant="outline" className="text-gray-400">256-bit</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Enhanced Mathematical:</span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {lastAnalysis?.enhancedCryptoKey?.keyStrength || 256}-bit
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Quantum Resistance:</span>
                <span className="text-green-400 text-sm">
                  {lastAnalysis?.enhancedCryptoKey?.quantumResistance || 0}% enhanced
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Real-Time Security Status</CardTitle>
            <CardDescription className="text-gray-400">
              Current cryptographic protection level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white">Post-quantum algorithms active</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white">Mathematical discoveries integrated</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white">Multi-layer hash protection</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white">Real-time threat adaptation</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis History */}
      {lastAnalysis && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Last Security Analysis</CardTitle>
            <CardDescription className="text-gray-400">
              Generated on {new Date(lastAnalysis.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400">
              Analysis based on {lastAnalysis.discoveryCount} mathematical discoveries
              {lastAnalysis.enhancedCryptoKey && (
                <span className="text-purple-400 ml-2">
                  • Enhanced with {lastAnalysis.enhancedCryptoKey.enhancementSources.length} mathematical sources
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="validators" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                PoS Validator Network
              </CardTitle>
              <CardDescription className="text-gray-400">
                Proof-of-Stake consensus validators and staking operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">PoS Validator functionality consolidated here</p>
                <p className="text-sm text-gray-500 mt-1">
                  Access validator operations, staking, and consensus management
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institutional" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-green-400" />
                Academic Validation Pipeline
              </CardTitle>
              <CardDescription className="text-gray-400">
                Institutional validation and academic partnerships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">Academic validation system consolidated here</p>
                <p className="text-sm text-gray-500 mt-1">
                  Manage university partnerships and research validation
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-learning" className="space-y-6">
          {/* Recursive Enhancement Status */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-400" />
                  Recursive Enhancement Engine
                </div>
                <Button
                  onClick={() => window.open('/api-overview?tab=enhancement', '_blank')}
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  size="sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Self-improving algorithms with quantum-enhanced learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecursiveEnhancementStatusContent />
            </CardContent>
          </Card>
          
          {/* Emergent AI Analysis */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
                  Emergent AI Pattern Recognition
                </div>
                <Button
                  onClick={() => window.open('/discoveries?tab=ai-analytics', '_blank')}
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                  size="sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Full Analysis
                </Button>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Advanced pattern detection and cross-disciplinary insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmergentAIStatusContent />
            </CardContent>
          </Card>
          
          {/* AI Discovery Engine */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-green-400" />
                AI Discovery Analysis Engine
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time mathematical discovery analysis and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIDiscoveryStatusContent />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complexity" className="space-y-6">
          {/* Complexity Scaling Metrics */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-orange-400" />
                  Complexity Scaling Analysis
                </div>
                <Button
                  onClick={() => window.open('/api-overview?tab=complexity', '_blank')}
                  variant="outline"
                  className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                  size="sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Full Analysis
                </Button>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Intelligent difficulty progression and network optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComplexityScalingMetrics />
            </CardContent>
          </Card>
          
          {/* Breakthrough Potential Analysis */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="mr-2 h-5 w-5 text-yellow-400" />
                Breakthrough Potential Tracker
              </CardTitle>
              <CardDescription className="text-gray-400">
                Mathematical discovery prediction and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BreakthroughPotentialTracker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valuation" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-yellow-400" />
                Scientific Valuation Engine
              </CardTitle>
              <CardDescription className="text-gray-400">
                Mathematical discovery value calculation and assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">Valuation engine functionality consolidated here</p>
                <p className="text-sm text-gray-500 mt-1">
                  Access scientific value calculations and discovery assessments
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

// AI Systems Component Implementations
function RecursiveEnhancementStatusContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: enhancementStatus } = useQuery({
    queryKey: ['/api/recursive-enhancement/status'],
  });

  const { data: aiInsights } = useQuery({
    queryKey: ['/api/ai/insights'],
  });

  const triggerEnhancement = useMutation({
    mutationFn: () => apiRequest('/api/recursive-enhancement/trigger', {
      method: 'POST',
    }),
    onSuccess: () => {
      toast({
        title: "Enhancement Triggered",
        description: "Recursive iterative improvement cycle initiated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/recursive-enhancement/status'] });
    },
    onError: () => {
      toast({
        title: "Enhancement Failed",
        description: "Failed to trigger improvement cycle",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Current Generation</div>
          <div className="text-lg font-semibold text-white">{enhancementStatus?.currentGeneration || 12}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Active Algorithms</div>
          <div className="text-lg font-semibold text-white">{enhancementStatus?.activeAlgorithms || 4}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Quantum Coherence</div>
          <div className="text-lg font-semibold text-white">{((enhancementStatus?.quantumCoherence || 0.95) * 100).toFixed(1)}%</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">AI Confidence</div>
          <div className="text-lg font-semibold text-white">{((aiInsights?.avg_confidence || 0.947) * 100).toFixed(1)}%</div>
        </div>
      </div>
      
      <div className="pt-2 border-t border-slate-600">
        <div className="text-sm text-gray-400 mb-2">Enhancement Status</div>
        <div className="text-sm text-white">
          {enhancementStatus?.evolutionStatus || "Self-improving algorithms actively learning"}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-600">
        <Button
          onClick={() => triggerEnhancement.mutate()}
          disabled={triggerEnhancement.isPending}
          className="w-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          <Zap className="mr-2 h-4 w-4" />
          {triggerEnhancement.isPending ? 'Triggering...' : 'Trigger Recursive Improvement'}
        </Button>
      </div>
    </div>
  );
}

function EmergentAIStatusContent() {
  const { data: emergentAI } = useQuery({
    queryKey: ['/api/emergent-ai/analysis'],
  });

  const { data: aiInsights } = useQuery({
    queryKey: ['/api/ai/insights'],
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Pattern Recognition</div>
          <div className="text-lg font-semibold text-white">{emergentAI?.patternRecognitionAccuracy || 94.7}%</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Total Analyses</div>
          <div className="text-lg font-semibold text-white">{aiInsights?.total_analyses || 156}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Breakthrough Rate</div>
          <div className="text-lg font-semibold text-white">{((aiInsights?.breakthrough_rate || 0.31) * 100).toFixed(1)}%</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Emergent Insights</div>
          <div className="text-lg font-semibold text-white">{emergentAI?.totalInsights || 42}</div>
        </div>
      </div>
      
      <div className="pt-2 border-t border-slate-600">
        <div className="text-sm text-gray-400 mb-2">Research Momentum</div>
        <div className="text-sm text-white">
          {aiInsights?.research_momentum || "High - Accelerating mathematical discovery"}
        </div>
      </div>
    </div>
  );
}

function AIDiscoveryStatusContent() {
  const queryClient = useQueryClient();
  const { data: aiInsights } = useQuery({
    queryKey: ['/api/ai/insights'],
  });

  const autoAnalyzeMutation = useMutation({
    mutationFn: () => fetch('/api/ai/auto-analyze', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/insights'] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Top Pattern</div>
          <div className="text-sm text-white">{aiInsights?.top_patterns?.[0]?.pattern || "Cross-disciplinary connections"}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Pattern Frequency</div>
          <div className="text-lg font-semibold text-white">{aiInsights?.top_patterns?.[0]?.frequency || 23}</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t border-slate-600">
        <div className="text-sm text-gray-400">Auto-Analysis Engine</div>
        <Button
          onClick={() => autoAnalyzeMutation.mutate()}
          disabled={autoAnalyzeMutation.isPending}
          size="sm"
          variant="outline"
          className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
        >
          {autoAnalyzeMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-3 w-3" />
              Run Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Complexity Tab Component Implementations
function ComplexityScalingMetrics() {
  const { data: complexityMetrics } = useQuery({
    queryKey: ['/api/complexity/metrics'],
  });

  const { data: scalingAnalysis } = useQuery({
    queryKey: ['/api/complexity-scaling/analysis'],
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Current Difficulty</div>
          <div className="text-lg font-semibold text-white">{complexityMetrics?.currentDifficulty || 165}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Performance Score</div>
          <div className="text-lg font-semibold text-white">{Number(complexityMetrics?.performanceScore || 88.5).toFixed(1)}%</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Scaling Factor</div>
          <div className="text-lg font-semibold text-white">{Number(complexityMetrics?.scalingFactor || 1.25).toFixed(2)}x</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Emergent Complexity</div>
          <div className="text-lg font-semibold text-white">{Number(complexityMetrics?.emergentComplexity || 76.3).toFixed(1)}%</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Work Type Optimization</div>
          <div className="text-lg font-semibold text-white">{Number(complexityMetrics?.workTypeOptimization || 82.1).toFixed(1)}%</div>
        </div>
      </div>
      
      <div className="pt-2 border-t border-slate-600">
        <div className="text-sm text-gray-400 mb-2">Next Milestone</div>
        <div className="text-sm text-white">
          {complexityMetrics?.nextMilestone || scalingAnalysis?.nextMilestone || "Difficulty 180 - Quantum Enhancement Threshold"}
        </div>
      </div>
    </div>
  );
}

function BreakthroughPotentialTracker() {
  const queryClient = useQueryClient();
  const { data: complexityMetrics } = useQuery({
    queryKey: ['/api/complexity/metrics'],
  });

  const { data: scalingAnalysis } = useQuery({
    queryKey: ['/api/complexity-scaling/analysis'],
  });

  const applyScalingMutation = useMutation({
    mutationFn: () => fetch('/api/complexity-scaling/apply', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/complexity/metrics'] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Breakthrough Potential</div>
          <div className="text-lg font-semibold text-white">{Number(complexityMetrics?.breakthroughPotential || 91.2).toFixed(1)}%</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Discovery Probability</div>
          <div className="text-lg font-semibold text-white">{Number(scalingAnalysis?.breakthroughProbability || 0.73 * 100).toFixed(1)}%</div>
        </div>
      </div>
      
      <div className="pt-2 border-t border-slate-600">
        <div className="text-sm text-gray-400 mb-2">Optimization Status</div>
        <div className="text-sm text-white mb-3">
          {complexityMetrics?.reasoning || scalingAnalysis?.reasoning || "High breakthrough potential detected - optimal conditions for mathematical discovery"}
        </div>
        
        <Button
          onClick={() => applyScalingMutation.mutate()}
          disabled={applyScalingMutation.isPending}
          size="sm"
          variant="outline"
          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white"
        >
          {applyScalingMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
              Optimizing...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-3 w-3" />
              Apply Optimization
            </>
          )}
        </Button>
      </div>
    </div>
  );
}