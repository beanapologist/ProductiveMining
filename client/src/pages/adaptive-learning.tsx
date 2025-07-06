import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, Layers, Cpu, Gauge, Play, Pause, Eye, Grid3X3, Zap, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LearningPattern {
  id: string;
  patternType: 'dimensional' | 'geometric' | 'algebraic' | 'topological';
  dimension: number;
  complexity: number;
  discoveryFrequency: number;
  successRate: number;
  geometricProperties: {
    curvature: number;
    manifoldType: string;
    symmetryGroup: string;
    topologicalInvariant: number;
  };
  learningMetrics: {
    adaptationRate: number;
    convergenceSpeed: number;
    explorationEfficiency: number;
    dimensionalInsight: number;
  };
  timestamp: string;
}

interface HigherDimensionalSpace {
  dimension: number;
  coordinates: number[];
  manifoldType: 'riemannian' | 'lorentzian' | 'kahler' | 'hyperbolic';
  curvature: number;
  topology: string;
  geometricStructure: {
    metric: number[][];
    connectionForm: number[][][];
    riemannTensor: number[][][][];
    holonomyGroup: string;
  };
}

interface GeometricComputationMethod {
  methodId: string;
  algorithmType: 'differential' | 'algebraic' | 'topological' | 'computational';
  dimensionRange: [number, number];
  complexity: number;
  convergenceRate: number;
  stabilityMetric: number;
  computationalEfficiency: number;
  geometricAccuracy: number;
}

interface AdaptiveLearningMetrics {
  currentCycle: number;
  totalPatterns: number;
  averageComplexity: number;
  averageSuccessRate: number;
  averageAdaptationRate: number;
  dimensionalCoverage: number;
  methodEfficiency: number;
  learningStatus: 'active' | 'inactive';
}

export default function AdaptiveLearningPage() {
  const [selectedDimension, setSelectedDimension] = useState<number>(4);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Recursive Enhancement Status
  const { data: recursiveEnhancementStatus } = useQuery<RecursiveEnhancementStatus>({
    queryKey: ['/api/recursive-enhancement/status'],
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

  const { data: learningStatus } = useQuery({
    queryKey: ['/api/adaptive-learning/status'],
    refetchInterval: 5000
  });

  const { data: patterns } = useQuery<LearningPattern[]>({
    queryKey: ['/api/adaptive-learning/patterns'],
    refetchInterval: 10000
  });

  const { data: dimensions } = useQuery<HigherDimensionalSpace[]>({
    queryKey: ['/api/adaptive-learning/dimensions'],
    refetchInterval: 15000
  });

  const { data: methods } = useQuery<GeometricComputationMethod[]>({
    queryKey: ['/api/adaptive-learning/geometric-methods'],
    refetchInterval: 10000
  });

  const { data: metrics } = useQuery<AdaptiveLearningMetrics>({
    queryKey: ['/api/adaptive-learning/metrics'],
    refetchInterval: 5000
  });

  const getPatternTypeColor = (type: string) => {
    const colors = {
      dimensional: 'bg-blue-500',
      geometric: 'bg-green-500',
      algebraic: 'bg-purple-500',
      topological: 'bg-orange-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const selectedSpace = dimensions?.find(d => d.dimension === selectedDimension);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Brain className="h-8 w-8 text-blue-400" />
          Adaptive Learning System
        </h1>
        <p className="text-gray-400">
          In-house AI exploring higher-dimensional mathematical spaces and developing advanced geometric computational methods
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Learning Status</p>
                <p className="text-2xl font-bold text-white">
                  {learningStatus?.isLearning ? 'Active' : 'Inactive'}
                </p>
              </div>
              <Brain className={`h-8 w-8 ${learningStatus?.isLearning ? 'text-green-400' : 'text-gray-400'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Learning Cycles</p>
                <p className="text-2xl font-bold text-blue-400">{learningStatus?.learningCycles || 0}</p>
              </div>
              <Gauge className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pattern Count</p>
                <p className="text-2xl font-bold text-purple-400">{learningStatus?.patternCount || 0}</p>
              </div>
              <Grid3X3 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Dimensions</p>
                <p className="text-2xl font-bold text-green-400">{learningStatus?.dimensionCount || 0}</p>
              </div>
              <Layers className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Learning Performance Metrics</CardTitle>
          <CardDescription className="text-gray-400">
            Real-time adaptive learning system performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Average Complexity</span>
                <span className="text-white">{(metrics?.averageComplexity * 100 || 0).toFixed(1)}%</span>
              </div>
              <Progress value={metrics?.averageComplexity * 100 || 0} className="bg-slate-700" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-white">{(metrics?.averageSuccessRate * 100 || 0).toFixed(1)}%</span>
              </div>
              <Progress value={metrics?.averageSuccessRate * 100 || 0} className="bg-slate-700" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Method Efficiency</span>
                <span className="text-white">{(metrics?.methodEfficiency * 100 || 0).toFixed(1)}%</span>
              </div>
              <Progress value={metrics?.methodEfficiency * 100 || 0} className="bg-slate-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recursive Enhancement System */}
      {recursiveEnhancementStatus && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                Recursive Enhancement System
              </div>
              <Button
                onClick={() => triggerEnhancementMutation.mutate()}
                disabled={triggerEnhancementMutation.isPending}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                size="sm"
              >
                {triggerEnhancementMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Trigger Enhancement
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Self-improving algorithms that evolve through recursive mathematical optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {recursiveEnhancementStatus.currentGeneration}
                </div>
                <div className="text-sm text-gray-400">Current Generation</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {recursiveEnhancementStatus.activeAlgorithms}
                </div>
                <div className="text-sm text-gray-400">Active Algorithms</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {recursiveEnhancementStatus.avgPerformance}%
                </div>
                <div className="text-sm text-gray-400">Avg Performance</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {recursiveEnhancementStatus.quantumCoherence}%
                </div>
                <div className="text-sm text-gray-400">Quantum Coherence</div>
              </div>
            </div>

            {/* Algorithm Status */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">Algorithm Evolution Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recursiveEnhancementStatus.algorithms?.map((algorithm, index) => (
                  <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {algorithm.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <Badge className="bg-yellow-600 text-white">
                        Gen {algorithm.generation}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Accuracy:</span>
                        <span className="text-green-400">{algorithm.accuracy}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Efficiency:</span>
                        <span className="text-blue-400">{algorithm.efficiency}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Improvements:</span>
                        <span className="text-purple-400">{algorithm.improvements}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-700">
          <TabsTrigger value="patterns" className="data-[state=active]:bg-slate-600">
            Learning Patterns
          </TabsTrigger>
          <TabsTrigger value="dimensions" className="data-[state=active]:bg-slate-600">
            Higher Dimensions
          </TabsTrigger>
          <TabsTrigger value="methods" className="data-[state=active]:bg-slate-600">
            Geometric Methods
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns?.map((pattern) => (
              <Card key={pattern.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">
                      {pattern.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </CardTitle>
                    <Badge className={`${getPatternTypeColor(pattern.patternType)} text-white`}>
                      {pattern.patternType}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    {pattern.dimension}D Pattern • Complexity: {(pattern.complexity * 100).toFixed(1)}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Discovery Rate:</span>
                        <span className="text-white ml-2">{(pattern.discoveryFrequency * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-white ml-2">{(pattern.successRate * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">Learning Metrics:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Adaptation:</span>
                          <span className="text-blue-400">{(pattern.learningMetrics.adaptationRate * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Convergence:</span>
                          <span className="text-green-400">{(pattern.learningMetrics.convergenceSpeed * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Efficiency:</span>
                          <span className="text-purple-400">{(pattern.learningMetrics.explorationEfficiency * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Insight:</span>
                          <span className="text-orange-400">{(pattern.learningMetrics.dimensionalInsight * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-600 pt-2 space-y-1 text-xs">
                      <div className="text-gray-400">Geometric Properties:</div>
                      <div className="text-white">
                        <span className="text-gray-400">Manifold:</span> {pattern.geometricProperties.manifoldType}
                      </div>
                      <div className="text-white">
                        <span className="text-gray-400">Symmetry:</span> {pattern.geometricProperties.symmetryGroup}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dimensions" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Higher-Dimensional Space Explorer</CardTitle>
              <CardDescription className="text-gray-400">
                Navigate through mathematical spaces from 4D to 11D
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                {dimensions?.map((dim) => (
                  <Button
                    key={dim.dimension}
                    variant={selectedDimension === dim.dimension ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDimension(dim.dimension)}
                    className={selectedDimension === dim.dimension ? 
                      "bg-blue-600 text-white" : 
                      "border-slate-600 text-gray-300 hover:bg-slate-700"
                    }
                  >
                    {dim.dimension}D
                  </Button>
                ))}
              </div>

              {selectedSpace && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold">Space Properties</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Manifold Type:</span>
                          <span className="text-white capitalize">{selectedSpace.manifoldType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Curvature:</span>
                          <span className="text-blue-400">{selectedSpace.curvature.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Topology:</span>
                          <span className="text-green-400">{selectedSpace.topology}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Holonomy Group:</span>
                          <span className="text-purple-400">{selectedSpace.geometricStructure.holonomyGroup}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-white font-semibold">Coordinate Evolution</h4>
                      <div className="space-y-1">
                        {selectedSpace.coordinates.slice(0, 8).map((coord, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-gray-400 w-8">x{i+1}:</span>
                            <div className="flex-1 bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.abs(coord) * 50}%` }}
                              />
                            </div>
                            <span className="text-white text-xs w-16">{coord.toFixed(3)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods?.map((method) => (
              <Card key={method.methodId} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {method.methodId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {method.algorithmType} algorithm • {method.dimensionRange[0]}D-{method.dimensionRange[1]}D
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Convergence</span>
                          <span className="text-white">{(method.convergenceRate * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={method.convergenceRate * 100} className="bg-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Stability</span>
                          <span className="text-white">{(method.stabilityMetric * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={method.stabilityMetric * 100} className="bg-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Efficiency</span>
                          <span className="text-white">{(method.computationalEfficiency * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={method.computationalEfficiency * 100} className="bg-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Accuracy</span>
                          <span className="text-white">{(method.geometricAccuracy * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={method.geometricAccuracy * 100} className="bg-slate-700" />
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Overall Complexity:</span>
                      <span className="text-blue-400 ml-2">{(method.complexity * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}