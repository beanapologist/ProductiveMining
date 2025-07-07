import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, AlertTriangle, Eye, Activity, Zap, Clock, 
  CheckCircle, XCircle, RefreshCw, TrendingUp, Brain,
  Lock, Search, Database, Cpu, Wifi, AlertOctagon,
  BarChart3, LineChart, Target, Radar, ShieldAlert,
  Bug, Crosshair, Settings, Play, Pause, RotateCcw
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ThreatPattern {
  id: string;
  name: string;
  type: 'network' | 'computational' | 'cryptographic' | 'behavioral' | 'quantum';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  signature: string;
  description: string;
  indicators: string[];
  detectionMethod: string;
  timestamp: string;
  mitigationStrategy: string;
  mathematicalEvidence?: any;
}

interface ThreatScanResult {
  scanId: string;
  timestamp: string;
  duration: number;
  threatsDetected: number;
  criticalThreats: number;
  highThreats: number;
  mediumThreats: number;
  lowThreats: number;
  threats: ThreatPattern[];
  networkHealthScore: number;
  quantumSecurityLevel: number;
  cryptographicStrength: number;
  recommendations: string[];
  nextScanRecommended: string;
}

interface MonitoringData {
  timestamp: string;
  networkStatus: {
    activeMiners: number;
    blocksPerHour: number;
    healthScore: number;
  };
  quantumMetrics: {
    coherenceLevel: number;
    quantumThreats: number;
    securityStrength: number;
  };
  mathematicalPatterns: {
    discoveryRate: number;
    anomalyCount: number;
    validationAccuracy: number;
  };
  cryptographicSecurity: {
    encryptionStrength: number;
    keyRotationStatus: string;
    vulnerabilityCount: number;
  };
  alertLevel: 'normal' | 'elevated' | 'high' | 'critical';
}

export default function ThreatDetectionPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ThreatScanResult | null>(null);
  const queryClient = useQueryClient();

  // Real-time monitoring data
  const { data: monitoringData } = useQuery<MonitoringData>({
    queryKey: ['/api/threat-detection/monitoring'],
    refetchInterval: 20000, // Reduced from 5s to 20s
    staleTime: 2000,
  });

  // Threat statistics
  const { data: threatStats } = useQuery({
    queryKey: ['/api/threat-detection/statistics'],
    refetchInterval: 30000,
    staleTime: 10000,
  });

  // Scan history
  const { data: scanHistory = [] } = useQuery<ThreatScanResult[]>({
    queryKey: ['/api/threat-detection/history'],
    refetchInterval: 60000,
    staleTime: 30000,
  });

  // Active mitigations
  const { data: activeMitigations } = useQuery({
    queryKey: ['/api/threat-detection/mitigations'],
    refetchInterval: 10000,
    staleTime: 5000,
  });

  // Threat scan mutation
  const threatScanMutation = useMutation({
    mutationFn: () => apiRequest('/api/threat-detection/scan', { method: 'POST' }),
    onMutate: () => {
      setIsScanning(true);
    },
    onSuccess: (data) => {
      setLastScanResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/threat-detection/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/threat-detection/statistics'] });
    },
    onSettled: () => {
      setIsScanning(false);
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quantum': return <Zap className="w-4 h-4" />;
      case 'cryptographic': return <Lock className="w-4 h-4" />;
      case 'network': return <Wifi className="w-4 h-4" />;
      case 'computational': return <Cpu className="w-4 h-4" />;
      case 'behavioral': return <Eye className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'elevated': return 'border-yellow-500 bg-yellow-500/10';
      case 'normal': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-400" />
            AI Threat Detection & Mitigation
          </h1>
          <p className="text-slate-400 mt-2">
            Advanced AI-powered threat detection using mathematical discovery patterns
          </p>
        </div>
        <Button
          onClick={() => threatScanMutation.mutate()}
          disabled={isScanning}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Run Threat Scan
            </>
          )}
        </Button>
      </div>

      {/* Alert Status */}
      {monitoringData && (
        <Alert className={`border-2 ${getAlertLevelColor(monitoringData.alertLevel)}`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              System Alert Level: <strong className="capitalize">{monitoringData.alertLevel}</strong>
              {monitoringData.alertLevel !== 'normal' && (
                <span className="ml-2">- Enhanced monitoring active</span>
              )}
            </span>
            <Badge className={getSeverityColor(monitoringData.alertLevel)}>
              {monitoringData.alertLevel.toUpperCase()}
            </Badge>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700 grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="data-[state=active]:bg-red-600">
            <Radar className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="scan" className="data-[state=active]:bg-red-600">
            <Search className="w-4 h-4 mr-2" />
            Threat Scan
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-red-600">
            <Activity className="w-4 h-4 mr-2" />
            Live Monitoring
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-red-600">
            <Database className="w-4 h-4 mr-2" />
            Scan History
          </TabsTrigger>
          <TabsTrigger value="mitigations" className="data-[state=active]:bg-red-600">
            <Shield className="w-4 h-4 mr-2" />
            Mitigations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Network Health */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-400" />
                  Network Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {monitoringData?.networkStatus?.healthScore || threatStats?.averageNetworkHealth || 95}%
                </div>
                <Progress 
                  value={monitoringData?.networkStatus?.healthScore || threatStats?.averageNetworkHealth || 95} 
                  className="mt-2"
                />
                <div className="text-sm text-slate-400 mt-1">
                  {(monitoringData?.networkStatus?.activeMiners || 20)} active miners
                </div>
              </CardContent>
            </Card>

            {/* Quantum Security */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Quantum Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {monitoringData?.quantumMetrics?.securityStrength || threatStats?.averageQuantumSecurity || 88}%
                </div>
                <Progress 
                  value={monitoringData?.quantumMetrics?.securityStrength || threatStats?.averageQuantumSecurity || 88} 
                  className="mt-2"
                />
                <div className="text-sm text-slate-400 mt-1">
                  Coherence: {monitoringData?.quantumMetrics?.coherenceLevel || 75}%
                </div>
              </CardContent>
            </Card>

            {/* Cryptographic Strength */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Crypto Strength
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {monitoringData?.cryptographicSecurity?.encryptionStrength || threatStats?.averageCryptographicStrength || 92}%
                </div>
                <Progress 
                  value={monitoringData?.cryptographicSecurity?.encryptionStrength || threatStats?.averageCryptographicStrength || 92} 
                  className="mt-2"
                />
                <div className="text-sm text-slate-400 mt-1">
                  Post-quantum ready
                </div>
              </CardContent>
            </Card>

            {/* Active Threats */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  Active Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {(monitoringData?.quantumMetrics?.quantumThreats || 0) + 
                   (monitoringData?.mathematicalPatterns?.anomalyCount || 0) +
                   (monitoringData?.cryptographicSecurity?.vulnerabilityCount || 0)}
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  {activeMitigations?.count || 0} mitigations active
                </div>
                <div className="text-sm text-green-400 mt-1">
                  {threatStats?.totalScansPerformed || 0} scans performed
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Scan Results */}
          {lastScanResult && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-400" />
                  Latest Scan Results
                </CardTitle>
                <CardDescription>
                  Scan ID: {lastScanResult.scanId} • 
                  Duration: {lastScanResult.duration}ms • 
                  {new Date(lastScanResult.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{lastScanResult.criticalThreats}</div>
                    <div className="text-sm text-slate-400">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{lastScanResult.highThreats}</div>
                    <div className="text-sm text-slate-400">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{lastScanResult.mediumThreats}</div>
                    <div className="text-sm text-slate-400">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{lastScanResult.lowThreats}</div>
                    <div className="text-sm text-slate-400">Low</div>
                  </div>
                </div>
                
                {lastScanResult.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Security Recommendations:</h4>
                    {lastScanResult.recommendations.map((rec, index) => (
                      <div key={index} className="p-2 bg-slate-900 rounded text-sm text-slate-300">
                        {rec}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Scan Tab */}
        <TabsContent value="scan" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-red-400" />
                Advanced Threat Scanner
              </CardTitle>
              <CardDescription>
                Comprehensive AI-powered threat detection using mathematical discovery patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <Button
                  onClick={() => threatScanMutation.mutate()}
                  disabled={isScanning}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Scanning Network...
                    </>
                  ) : (
                    <>
                      <Crosshair className="w-5 h-5 mr-2" />
                      Start Comprehensive Scan
                    </>
                  )}
                </Button>
                
                {isScanning && (
                  <div className="space-y-2">
                    <div className="text-slate-400">Analyzing mathematical discovery patterns...</div>
                    <Progress value={Math.random() * 100} className="w-full" />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Network Analysis</h4>
                  <p className="text-sm text-slate-400">Scans consensus mechanisms, validator behavior, and mining patterns</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Quantum Security</h4>
                  <p className="text-sm text-slate-400">Evaluates quantum coherence and post-quantum cryptography</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Mathematical Patterns</h4>
                  <p className="text-sm text-slate-400">Detects anomalies in computational results and proof verification</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          {monitoringData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Network Status */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Health Score</span>
                      <span className="text-white font-semibold">{monitoringData.networkStatus.healthScore}%</span>
                    </div>
                    <Progress value={monitoringData.networkStatus.healthScore} />
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Miners</span>
                    <span className="text-white">{monitoringData.networkStatus.activeMiners}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Blocks/Hour</span>
                    <span className="text-white">{monitoringData.networkStatus.blocksPerHour}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Mathematical Patterns */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Mathematical Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Discovery Rate</span>
                    <span className="text-white">{monitoringData.mathematicalPatterns.discoveryRate}/hour</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Anomaly Count</span>
                    <Badge className={monitoringData.mathematicalPatterns.anomalyCount > 2 ? 'bg-orange-500' : 'bg-green-500'}>
                      {monitoringData.mathematicalPatterns.anomalyCount}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Validation Accuracy</span>
                      <span className="text-white font-semibold">{monitoringData.mathematicalPatterns.validationAccuracy}%</span>
                    </div>
                    <Progress value={monitoringData.mathematicalPatterns.validationAccuracy} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Threat Scan History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scanHistory.length > 0 ? (
                <div className="space-y-4">
                  {scanHistory.slice(-10).reverse().map((scan) => (
                    <div key={scan.scanId} className="p-4 bg-slate-900 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white">{scan.scanId}</div>
                        <div className="text-sm text-slate-400">
                          {new Date(scan.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-red-400 font-bold">{scan.criticalThreats}</div>
                          <div className="text-xs text-slate-400">Critical</div>
                        </div>
                        <div>
                          <div className="text-orange-400 font-bold">{scan.highThreats}</div>
                          <div className="text-xs text-slate-400">High</div>
                        </div>
                        <div>
                          <div className="text-yellow-400 font-bold">{scan.mediumThreats}</div>
                          <div className="text-xs text-slate-400">Medium</div>
                        </div>
                        <div>
                          <div className="text-blue-400 font-bold">{scan.lowThreats}</div>
                          <div className="text-xs text-slate-400">Low</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-slate-400">
                        Duration: {scan.duration}ms • Health: {scan.networkHealthScore}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  No scan history available. Run your first threat scan to begin monitoring.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mitigations Tab */}
        <TabsContent value="mitigations" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Active Threat Mitigations
              </CardTitle>
              <CardDescription>
                Real-time threat response and security countermeasures
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeMitigations?.activeMitigations?.length > 0 ? (
                <div className="space-y-3">
                  {activeMitigations.activeMitigations.map((mitigation: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white">{mitigation}</span>
                      </div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <h3 className="text-lg font-semibold text-white mb-2">All Systems Secure</h3>
                  <p>No active threat mitigations required. System is operating normally.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}