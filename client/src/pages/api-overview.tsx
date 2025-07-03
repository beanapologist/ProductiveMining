import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Cpu, 
  Brain, 
  Shield, 
  Coins, 
  Database, 
  Zap,
  Activity,
  Code,
  Play,
  Copy,
  CheckCircle
} from "lucide-react";

interface APIOverview {
  endpoints: {
    core: Record<string, string>;
    advanced: {
      emergentAI: Record<string, string>;
      recursiveEnhancement: Record<string, string>;
      complexityScaling: Record<string, string>;
      security: Record<string, string>;
      institutional: Record<string, string>;
    };
    blockchain: Record<string, string>;
    token: Record<string, string>;
  };
  systemStats: {
    totalEndpoints: number;
    categories: number;
    lastUpdated: string;
    version: string;
    features: string[];
  };
  documentation: string;
}

interface RecursiveStatus {
  currentGeneration: number;
  activeAlgorithms: number;
  totalGenerations: number;
  avgPerformance: number;
  lastEnhancement: string;
  quantumCoherence: number;
  evolutionStatus: string;
  protocolsActive: number;
  algorithms: Array<{
    type: string;
    generation: number;
    accuracy: number;
    efficiency: number;
    breakthroughRate: number;
    adaptability: number;
    improvements: number;
  }>;
  protocolsActive: number;
}

export default function APIOverview() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const { data: apiOverview, isLoading: overviewLoading } = useQuery<APIOverview>({
    queryKey: ['/api/overview'],
    staleTime: 30000
  });

  const { data: recursiveStatus } = useQuery<RecursiveStatus>({
    queryKey: ['/api/recursive-enhancement/status'],
    staleTime: 10000
  });

  const { data: emergentMetrics } = useQuery({
    queryKey: ['/api/emergent-ai/metrics'],
    staleTime: 10000
  });

  const copyEndpoint = (endpoint: string) => {
    const fullUrl = `${window.location.origin}${endpoint}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const testEndpoint = async (endpoint: string, method: 'GET' | 'POST' = 'GET') => {
    try {
      const response = method === 'GET' 
        ? await fetch(endpoint)
        : await fetch(endpoint, { method: 'POST' });
      
      const data = await response.json();
      setTestResults(prev => ({
        ...prev,
        [endpoint]: { success: true, data, status: response.status }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpoint]: { success: false, error: error.message, status: 'error' }
      }));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Server className="h-5 w-5" />;
      case 'advanced': return <Brain className="h-5 w-5" />;
      case 'blockchain': return <Database className="h-5 w-5" />;
      case 'token': return <Coins className="h-5 w-5" />;
      default: return <Code className="h-5 w-5" />;
    }
  };

  const getSubcategoryIcon = (subcategory: string) => {
    switch (subcategory) {
      case 'emergentAI': return <Brain className="h-4 w-4" />;
      case 'recursiveEnhancement': return <Zap className="h-4 w-4" />;
      case 'complexityScaling': return <Activity className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'institutional': return <CheckCircle className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  if (overviewLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (!apiOverview) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400">Failed to load API documentation</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Productive Mining API Documentation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {apiOverview.documentation}
        </p>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge variant="outline" className="px-4 py-2">
            <Server className="h-4 w-4 mr-2" />
            Version {apiOverview.systemStats.version}
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Database className="h-4 w-4 mr-2" />
            {apiOverview.systemStats.totalEndpoints} Endpoints
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Activity className="h-4 w-4 mr-2" />
            {apiOverview.systemStats.categories} Categories
          </Badge>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Emergent AI Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emergentMetrics ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Patterns:</span>
                  <span className="font-medium">{emergentMetrics.currentMetrics?.emergentPatterns || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Complexity:</span>
                  <span className="font-medium">{(emergentMetrics.currentMetrics?.complexityScore * 100 || 0).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Evolution:</span>
                  <span className="font-medium">{(emergentMetrics.currentMetrics?.aiEvolution * 100 || 0).toFixed(1)}%</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading metrics...</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              Recursive Enhancement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recursiveStatus ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Generation:</span>
                  <span className="font-medium">{recursiveStatus.currentGeneration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Algorithms:</span>
                  <span className="font-medium">{recursiveStatus.activeAlgorithms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Performance:</span>
                  <span className="font-medium">{recursiveStatus.avgPerformance}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Quantum Coherence:</span>
                  <span className="font-medium">{recursiveStatus.quantumCoherence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge variant="outline" className="text-xs">{recursiveStatus.evolutionStatus}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading status...</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              System Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {apiOverview.systemStats.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints Documentation */}
      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-6xl mx-auto">
          <TabsTrigger value="core" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Core APIs
          </TabsTrigger>
          <TabsTrigger value="recursive" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Self-Improving AI
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Advanced AI
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="token" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Tokenomics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recursive" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Recursive Enhancement System
              </CardTitle>
              <p className="text-gray-400">Self-improving algorithms that evolve based on network performance</p>
            </CardHeader>
            <CardContent>
              {recursiveStatus ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* System Status */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">System Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">{recursiveStatus.currentGeneration}</div>
                        <div className="text-sm text-gray-400">Current Generation</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{recursiveStatus.quantumCoherence}%</div>
                        <div className="text-sm text-gray-400">Quantum Coherence</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{recursiveStatus.avgPerformance}%</div>
                        <div className="text-sm text-gray-400">Avg Performance</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-400">{recursiveStatus.protocolsActive}</div>
                        <div className="text-sm text-gray-400">Active Protocols</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <span className="text-gray-300">Evolution Status:</span>
                      <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
                        {recursiveStatus.evolutionStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Algorithm Performance */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Algorithm Performance</h3>
                    <div className="space-y-3">
                      {recursiveStatus.algorithms && recursiveStatus.algorithms.length > 0 ? (
                        recursiveStatus.algorithms.map((algo, index) => (
                          <div key={index} className="bg-slate-700 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white capitalize">
                                {algo.type.replace(/_/g, ' ')}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                Gen {algo.generation}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Accuracy:</span>
                                <span className="text-green-400">{algo.accuracy}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Efficiency:</span>
                                <span className="text-blue-400">{algo.efficiency}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Breakthrough:</span>
                                <span className="text-purple-400">{algo.breakthroughRate}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Adaptability:</span>
                                <span className="text-cyan-400">{algo.adaptability}%</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-slate-700 p-4 rounded-lg text-center">
                          <p className="text-gray-400">No algorithm data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Loading recursive enhancement status...</p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-4">Enhancement Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button 
                    onClick={() => fetch('/api/recursive-enhancement/enhance', { method: 'POST' })}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Trigger Enhancement
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('/api/recursive-enhancement/status')}
                    className="border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    View Status API
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('/api/recursive-enhancement/genealogy')}
                    className="border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Algorithm Tree
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="core" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getCategoryIcon('core')}
                Core Mining & Discovery APIs
              </CardTitle>
              <p className="text-gray-400">Essential endpoints for mining operations and mathematical discoveries</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(apiOverview.endpoints.core).map(([name, endpoint]) => (
                <div key={name} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-white capitalize">{name.replace(/_/g, ' ')}</div>
                    <code className="text-sm text-blue-400">{endpoint}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyEndpoint(endpoint)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-600"
                    >
                      {copiedEndpoint === endpoint ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => testEndpoint(endpoint)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {Object.entries(apiOverview.endpoints.advanced).map(([subcategory, endpoints]) => (
            <Card key={subcategory} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {getSubcategoryIcon(subcategory)}
                  {subcategory.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} APIs
                </CardTitle>
                <p className="text-gray-400">
                  {subcategory === 'emergentAI' && 'Advanced AI pattern recognition and cross-disciplinary synthesis'}
                  {subcategory === 'recursiveEnhancement' && 'Self-improving algorithms that evolve with discoveries'}
                  {subcategory === 'complexityScaling' && 'Intelligent difficulty progression and network optimization'}
                  {subcategory === 'security' && 'Advanced threat detection and cryptographic enhancement'}
                  {subcategory === 'institutional' && 'Academic validation and institutional certification'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(endpoints).map(([name, endpoint]) => (
                  <div key={name} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-white capitalize">{name.replace(/([A-Z])/g, ' $1')}</div>
                      <code className="text-sm text-purple-400">{endpoint}</code>
                      {testResults[endpoint] && (
                        <div className="mt-2">
                          <Badge 
                            variant={testResults[endpoint].success ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {testResults[endpoint].success ? 'Success' : 'Error'} - {testResults[endpoint].status}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyEndpoint(endpoint)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-600"
                      >
                        {copiedEndpoint === endpoint ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => testEndpoint(endpoint, name.includes('trigger') ? 'POST' : 'GET')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getCategoryIcon('blockchain')}
                Blockchain Infrastructure APIs
              </CardTitle>
              <p className="text-gray-400">Core blockchain operations, validation, and data integrity</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(apiOverview.endpoints.blockchain).map(([name, endpoint]) => (
                <div key={name} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-white capitalize">{name.replace(/([A-Z])/g, ' $1')}</div>
                    <code className="text-sm text-green-400">{endpoint}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyEndpoint(endpoint)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-600"
                    >
                      {copiedEndpoint === endpoint ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => testEndpoint(endpoint)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="token" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getCategoryIcon('token')}
                Token Economy APIs
              </CardTitle>
              <p className="text-gray-400">PROD token metrics, staking, NFTs, and wallet management</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(apiOverview.endpoints.token).map(([name, endpoint]) => (
                <div key={name} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-white capitalize">{name.replace(/([A-Z])/g, ' $1')}</div>
                    <code className="text-sm text-yellow-400">{endpoint}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyEndpoint(endpoint)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-600"
                    >
                      {copiedEndpoint === endpoint ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => testEndpoint(endpoint)}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Results Panel */}
      {Object.keys(testResults).length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">API Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {Object.entries(testResults).map(([endpoint, result]) => (
                <div key={endpoint} className="p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm text-blue-400">{endpoint}</code>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? 'Success' : 'Error'}
                    </Badge>
                  </div>
                  <pre className="text-xs text-gray-400 overflow-x-auto">
                    {JSON.stringify(result.success ? result.data : result.error, null, 2).slice(0, 500)}
                    {JSON.stringify(result.success ? result.data : result.error, null, 2).length > 500 && '...'}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}