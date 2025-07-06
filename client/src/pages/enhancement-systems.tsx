import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Zap, Shield, Brain, RefreshCw, TrendingUp, Activity, Lock, Sparkles, Play, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RecursiveEnhancementStatus {
  currentGeneration: number;
  activeAlgorithmCount: number;
  totalGenerations: number;
  lastEnhancement: string;
  quantumCoherence: number;
  evolutionStatus: string;
  activeAlgorithms: Array<{
    algorithmType: string;
    generation: number;
    performanceMetrics: {
      accuracy: number;
      efficiency: number;
      breakthroughRate: number;
      adaptability: number;
    };
  }>;
}

interface AdaptiveSecurityStatus {
  iterationCount: number;
  securityScore: number;
  lastIteration: string;
  adaptiveProtocols: Array<{
    protocolType: string;
    active: boolean;
    triggerCondition: string;
  }>;
  threatDetectionAccuracy: number;
  cryptographicStrength: number;
  adaptiveDefenseLevel: number;
  quantumResistance: number;
}

export default function EnhancementSystemsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch recursive enhancement status
  const { data: enhancementStatus, isLoading: enhancementLoading } = useQuery({
    queryKey: ['/api/recursive-enhancement/status'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch adaptive security status
  const { data: securityStatus, isLoading: securityLoading } = useQuery({
    queryKey: ['/api/adaptive-security/status'],
    refetchInterval: 10000,
  });

  // Trigger enhancement mutation
  const triggerEnhancementMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/recursive-enhancement/trigger-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!response.ok) throw new Error('Failed to trigger enhancement cycle');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Enhancement Triggered!",
        description: "Recursive enhancement cycle has been initiated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/recursive-enhancement/status'] });
    },
    onError: (error) => {
      toast({
        title: "Enhancement Failed",
        description: error.message,
        variant: "destructive",
      });
    }
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Enhancement Systems</h1>
          <p className="text-gray-400 mt-2">
            Self-improving algorithms and adaptive security systems for productive mining optimization
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => triggerEnhancementMutation.mutate()}
            disabled={triggerEnhancementMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {triggerEnhancementMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Trigger Enhancement
          </Button>
          <Button
            onClick={() => triggerSecurityMutation.mutate()}
            disabled={triggerSecurityMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {triggerSecurityMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Shield className="h-4 w-4 mr-2" />
            )}
            Trigger Security Iteration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recursive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
          <TabsTrigger value="recursive" className="data-[state=active]:bg-slate-700">
            <Brain className="h-4 w-4 mr-2" />
            Recursive Enhancement
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
            <Shield className="h-4 w-4 mr-2" />
            Adaptive Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recursive" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  Generation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enhancementLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  </div>
                ) : enhancementStatus ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Generation</span>
                      <Badge className="bg-blue-600">Gen {enhancementStatus.currentGeneration}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Algorithms</span>
                      <span className="text-white">{enhancementStatus.activeAlgorithmCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quantum Coherence</span>
                      <span className="text-green-400">{enhancementStatus.quantumCoherence}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">No data available</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enhancementLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-3 bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-700 rounded"></div>
                  </div>
                ) : enhancementStatus?.activeAlgorithms?.length > 0 ? (
                  <div className="space-y-3">
                    {enhancementStatus.activeAlgorithms.slice(0, 3).map((algo, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400 capitalize">
                            {algo.algorithmType.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-white">
                            {Math.round(algo.performanceMetrics.accuracy)}%
                          </span>
                        </div>
                        <Progress 
                          value={algo.performanceMetrics.accuracy} 
                          className="h-2 bg-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">No algorithms active</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Evolution Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enhancementLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                  </div>
                ) : enhancementStatus ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <Badge className="bg-green-600">{enhancementStatus.evolutionStatus}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Generations</span>
                      <span className="text-white">{enhancementStatus.totalGenerations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-xs">Last Enhancement</span>
                      <span className="text-gray-300 text-xs">
                        {new Date(enhancementStatus.lastEnhancement).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">No data available</div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Algorithm Performance Overview</CardTitle>
              <p className="text-gray-400">
                Detailed performance metrics for active recursive enhancement algorithms
              </p>
            </CardHeader>
            <CardContent>
              {enhancementLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-slate-700 rounded"></div>
                  ))}
                </div>
              ) : enhancementStatus?.activeAlgorithms?.length > 0 ? (
                <div className="space-y-4">
                  {enhancementStatus.activeAlgorithms.map((algo, index) => (
                    <div key={index} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-medium capitalize">
                            {algo.algorithmType.replace('_', ' ')} Algorithm
                          </h4>
                          <p className="text-gray-400 text-sm">Generation {algo.generation}</p>
                        </div>
                        <Badge className="bg-blue-600">
                          Gen {algo.generation}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-gray-400 text-sm">Accuracy</span>
                          <div className="text-white font-medium">
                            {Math.round(algo.performanceMetrics.accuracy)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Efficiency</span>
                          <div className="text-white font-medium">
                            {Math.round(algo.performanceMetrics.efficiency)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Breakthrough Rate</span>
                          <div className="text-white font-medium">
                            {Math.round(algo.performanceMetrics.breakthroughRate)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Adaptability</span>
                          <div className="text-white font-medium">
                            {Math.round(algo.performanceMetrics.adaptability)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No active algorithms found. Enhancement cycle will generate new algorithms.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-400" />
                  Security Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                {securityLoading ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  </div>
                ) : securityStatus ? (
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-white">
                      {securityStatus.securityScore}%
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Iterations</span>
                      <span className="text-white">{securityStatus.iterationCount}</span>
                    </div>
                    <Progress 
                      value={securityStatus.securityScore} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                ) : (
                  <div className="text-gray-400">No data available</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-yellow-400" />
                  Defense Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {securityLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-3 bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-700 rounded"></div>
                  </div>
                ) : securityStatus ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Threat Detection</span>
                      <span className="text-white">{securityStatus.threatDetectionAccuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Crypto Strength</span>
                      <span className="text-white">{securityStatus.cryptographicStrength}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Defense Level</span>
                      <span className="text-white">{securityStatus.adaptiveDefenseLevel}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Quantum Resistance</span>
                      <span className="text-green-400">{securityStatus.quantumResistance}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">No metrics available</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  Protocol Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {securityLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-700 rounded"></div>
                    <div className="h-4 bg-slate-700 rounded"></div>
                  </div>
                ) : securityStatus?.adaptiveProtocols ? (
                  <div className="space-y-2">
                    {securityStatus.adaptiveProtocols.slice(0, 4).map((protocol, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm capitalize">
                          {protocol.protocolType.replace('_', ' ')}
                        </span>
                        <Badge className={protocol.active ? "bg-green-600" : "bg-gray-600"}>
                          {protocol.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                    <div className="flex justify-between mt-3">
                      <span className="text-gray-400 text-xs">Last Iteration</span>
                      <span className="text-gray-300 text-xs">
                        {new Date(securityStatus.lastIteration).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">No protocols active</div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Adaptive Security Protocols</CardTitle>
              <p className="text-gray-400">
                Real-time security improvement protocols and their trigger conditions
              </p>
            </CardHeader>
            <CardContent>
              {securityLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-12 bg-slate-700 rounded"></div>
                  ))}
                </div>
              ) : securityStatus?.adaptiveProtocols?.length > 0 ? (
                <div className="space-y-4">
                  {securityStatus.adaptiveProtocols.map((protocol, index) => (
                    <div key={index} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-medium capitalize">
                            {protocol.protocolType.replace('_', ' ')} Protocol
                          </h4>
                          <p className="text-gray-400 text-sm">{protocol.triggerCondition}</p>
                        </div>
                        <Badge className={protocol.active ? "bg-green-600" : "bg-gray-600"}>
                          {protocol.active ? "Active" : "Standby"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No adaptive protocols found. Security iteration will activate protocols.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}