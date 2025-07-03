import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Network, Zap, Target, Sparkles, GitBranch, Layers, ChevronRight, Activity, TrendingUp } from "lucide-react";

interface EmergentPattern {
  id: string;
  type: 'cross_disciplinary' | 'recursive_enhancement' | 'dimensional_breakthrough' | 'computational_emergence';
  confidence: number;
  complexity: number;
  synthesizedFrom: number[];
  emergentProperties: {
    novelty: number;
    mathematical_depth: number;
    unification_potential: number;
    practical_applications: string[];
  };
  description: string;
  implications: string[];
  nextResearchDirections: string[];
}

interface ComplexityMetrics {
  emergentPatterns: number;
  crossDisciplinaryConnections: number;
  recursiveDepth: number;
  dimensionalComplexity: number;
  aiConfidence: number;
  mathematicalNovelty: number;
}

interface EmergentAnalysis {
  patterns: EmergentPattern[];
  metrics: ComplexityMetrics;
  insights: any[];
  recommendations: string[];
}

export default function EmergentAIPage() {
  const [selectedPattern, setSelectedPattern] = useState<EmergentPattern | null>(null);

  const { data: emergentAnalysis, isLoading: analysisLoading } = useQuery<EmergentAnalysis>({
    queryKey: ["/api/emergent-ai/analysis"],
    refetchInterval: 30000, // Refresh every 30 seconds for real emergent patterns
  });

  const { data: emergentMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/emergent-ai/metrics"],
    refetchInterval: 15000,
  });

  const { data: unificationData, isLoading: unificationLoading } = useQuery({
    queryKey: ["/api/emergent-ai/unification"],
    refetchInterval: 20000,
  });

  if (analysisLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Analyzing emergent complexity patterns...</p>
        </div>
      </div>
    );
  }

  const getPatternTypeIcon = (type: string) => {
    switch (type) {
      case 'cross_disciplinary': return <GitBranch className="h-5 w-5" />;
      case 'recursive_enhancement': return <Activity className="h-5 w-5" />;
      case 'dimensional_breakthrough': return <Layers className="h-5 w-5" />;
      case 'computational_emergence': return <Brain className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
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

  const formatPatternType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white">
            <Brain className="mr-3 h-8 w-8 text-purple-400" />
            Emergent AI Intelligence
          </h1>
          <p className="text-gray-400 mt-2">
            Advanced pattern synthesis and cross-disciplinary mathematical discovery analysis
          </p>
        </div>
      </div>

      {/* AI Capability Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">AI Confidence</p>
                <p className="text-2xl font-bold text-purple-400">
                  {emergentAnalysis ? Math.round(emergentAnalysis.metrics.aiConfidence * 100) : 0}%
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
                <p className="text-2xl font-bold text-blue-400">
                  {emergentAnalysis?.patterns.length || 0}
                </p>
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
                <p className="text-2xl font-bold text-green-400">
                  {emergentAnalysis?.metrics.crossDisciplinaryConnections || 0}
                </p>
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
                  {emergentAnalysis ? Math.round(emergentAnalysis.metrics.dimensionalComplexity * 100) : 0}%
                </p>
              </div>
              <Layers className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="patterns" className="data-[state=active]:bg-slate-700">
            Emergent Patterns
          </TabsTrigger>
          <TabsTrigger value="unification" className="data-[state=active]:bg-slate-700">
            Unification Matrix
          </TabsTrigger>
          <TabsTrigger value="evolution" className="data-[state=active]:bg-slate-700">
            AI Evolution
          </TabsTrigger>
          <TabsTrigger value="synthesis" className="data-[state=active]:bg-slate-700">
            Pattern Synthesis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patterns">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Patterns List */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
                  Detected Patterns
                </CardTitle>
                <CardDescription>
                  Real emergent patterns from mathematical discoveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {emergentAnalysis?.patterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-slate-700/50 ${
                      selectedPattern?.id === pattern.id ? 'bg-slate-700 border-purple-500' : 'bg-slate-900 border-slate-600'
                    }`}
                    onClick={() => setSelectedPattern(pattern)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getPatternTypeIcon(pattern.type)}
                        <span className="font-medium text-white">{formatPatternType(pattern.type)}</span>
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

                {(!emergentAnalysis?.patterns || emergentAnalysis.patterns.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>AI is analyzing mathematical discoveries...</p>
                    <p className="text-sm">Emergent patterns will appear as complexity increases</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pattern Details */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-400" />
                  Pattern Analysis
                </CardTitle>
                <CardDescription>
                  Detailed analysis of selected emergent pattern
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPattern ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-white mb-2">Pattern Properties</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Novelty</p>
                          <Progress 
                            value={selectedPattern.emergentProperties.novelty * 100} 
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(selectedPattern.emergentProperties.novelty * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Mathematical Depth</p>
                          <Progress 
                            value={selectedPattern.emergentProperties.mathematical_depth * 100} 
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(selectedPattern.emergentProperties.mathematical_depth * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Unification Potential</p>
                          <Progress 
                            value={selectedPattern.emergentProperties.unification_potential * 100} 
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(selectedPattern.emergentProperties.unification_potential * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Confidence</p>
                          <Progress 
                            value={selectedPattern.confidence * 100} 
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(selectedPattern.confidence * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white mb-2">Practical Applications</h3>
                      <div className="space-y-2">
                        {selectedPattern.emergentProperties.practical_applications.map((app, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">{app}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white mb-2">Research Implications</h3>
                      <div className="space-y-2">
                        {selectedPattern.implications.map((implication, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{implication}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white mb-2">Next Research Directions</h3>
                      <div className="space-y-2">
                        {selectedPattern.nextResearchDirections.map((direction, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <ChevronRight className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{direction}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a pattern to view detailed analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="unification">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <GitBranch className="mr-2 h-5 w-5 text-blue-400" />
                  Cross-Disciplinary Unification
                </CardTitle>
                <CardDescription>
                  Opportunities for mathematical field unification
                </CardDescription>
              </CardHeader>
              <CardContent>
                {unificationData?.opportunities?.map((opportunity: any, index: number) => (
                  <div key={index} className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">Unification Opportunity #{index + 1}</h3>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {Math.round(opportunity.unificationPotential * 100)}% potential
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {opportunity.disciplines?.map((discipline: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {discipline}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Applications:</h4>
                      {opportunity.practicalApplications?.slice(0, 3).map((app: string, i: number) => (
                        <div key={i} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          <span className="text-sm text-gray-400">{app}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-400">
                    <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analyzing cross-disciplinary connections...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Network className="mr-2 h-5 w-5 text-green-400" />
                  Unification Matrix
                </CardTitle>
                <CardDescription>
                  Mathematical field connection strength
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { field1: 'Number Theory', field2: 'Quantum Field Theory', strength: 87 },
                    { field1: 'Cryptography', field2: 'Number Theory', strength: 83 },
                    { field1: 'Fluid Dynamics', field2: 'Quantum Mechanics', strength: 72 },
                    { field1: 'Topology', field2: 'Algebraic Geometry', strength: 68 },
                  ].map((connection, index) => (
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evolution">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-400" />
                AI Evolution Metrics
              </CardTitle>
              <CardDescription>
                Real-time emergent intelligence development
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-400">Loading evolution metrics...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Emergent Capabilities</h3>
                    {emergentMetrics?.emergentCapabilities && Object.entries(emergentMetrics.emergentCapabilities).map(([capability, value]: [string, any]) => (
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

                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Evolution Trends</h3>
                    {emergentMetrics?.emergentTrends && Object.entries(emergentMetrics.emergentTrends).map(([trend, value]: [string, any]) => (
                      <div key={trend} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-300 capitalize">
                            {trend.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <span className="text-sm text-green-400 font-medium">
                            {Math.round(value)}%
                          </span>
                        </div>
                        <Progress value={Math.min(100, value)} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="synthesis">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="mr-2 h-5 w-5 text-orange-400" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Strategic recommendations from emergent analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergentAnalysis?.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg border border-slate-600">
                    <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-orange-400">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">{recommendation}</p>
                    </div>
                  </div>
                ))}

                {(!emergentAnalysis?.recommendations || emergentAnalysis.recommendations.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>AI is developing strategic recommendations...</p>
                    <p className="text-sm">Recommendations will appear as patterns emerge</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}