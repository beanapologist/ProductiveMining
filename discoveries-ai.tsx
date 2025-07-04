import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Brain, Zap, TrendingUp, Target, AlertTriangle, CheckCircle, Clock, ArrowRight, Lightbulb, Network, Gauge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MathematicalWork {
  id: number;
  workType: string;
  difficulty: number;
  result: any;
  verificationData: any;
  computationalCost: number;
  energyEfficiency: number;
  scientificValue: number;
  timestamp: Date;
  workerId: string;
  signature: string;
}

interface DiscoveryAnalysis {
  id: number;
  workId: number;
  analysisType: string;
  confidence: number;
  significance: 'breakthrough' | 'major' | 'moderate' | 'incremental';
  patterns: Array<{
    type: string;
    description: string;
    confidence: number;
  }>;
  applications: Array<{
    field: string;
    potential: 'high' | 'medium' | 'low';
    description: string;
  }>;
  novelty: {
    score: number;
    reasoning: string;
    similar_works: number[];
  };
  verification: {
    mathematical_validity: number;
    computational_accuracy: number;
    theoretical_soundness: number;
  };
  ai_insights: {
    breakthrough_probability: number;
    paradigm_shift_potential: number;
    interdisciplinary_connections: string[];
    future_implications: string[];
  };
  recommendations: {
    priority: 'urgent' | 'high' | 'medium' | 'low';
    actions: string[];
    follow_up_research: string[];
  };
}

interface InsightsSummary {
  totalAnalyzed: number;
  breakthroughCount: number;
  majorCount: number;
  averageConfidence: number;
  topPatterns: Array<{
    type: string;
    frequency: number;
    confidence: number;
  }>;
  emergingTrends: string[];
  crossDisciplinaryConnections: Array<{
    fields: string[];
    strength: number;
  }>;
  riskAssessment: {
    low: number;
    medium: number;
    high: number;
  };
}

interface CrossAnalysis {
  convergencePatterns: Array<{
    pattern: string;
    discoveries: number[];
    significance: string;
  }>;
  emergingClusters: Array<{
    cluster: string;
    workTypes: string[];
    strength: number;
  }>;
  timelineTrends: Array<{
    period: string;
    breakthroughs: number;
    averageDifficulty: number;
  }>;
  interdisciplinaryBridges: Array<{
    fields: string[];
    bridgeStrength: number;
    implications: string[];
  }>;
}

export default function DiscoveriesAIPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDiscovery, setSelectedDiscovery] = useState<number | null>(null);
  const [analysisTab, setAnalysisTab] = useState('overview');

  // Fetch discoveries
  const { data: discoveries = [], isLoading: discoveriesLoading } = useQuery<MathematicalWork[]>({
    queryKey: ['/api/discoveries'],
    queryFn: () => fetch('/api/discoveries?limit=100').then(res => res.json()),
  });

  // Fetch AI insights summary
  const { data: insights, isLoading: insightsLoading } = useQuery<InsightsSummary>({
    queryKey: ['/api/discoveries/insights/summary'],
    refetchInterval: 30000,
  });

  // Fetch cross-analysis patterns
  const { data: crossAnalysis, isLoading: crossAnalysisLoading } = useQuery<CrossAnalysis>({
    queryKey: ['/api/discoveries/patterns/cross-analysis'],
    refetchInterval: 60000,
  });

  // Fetch individual discovery analysis
  const { data: discoveryAnalysis, isLoading: analysisLoading } = useQuery<DiscoveryAnalysis>({
    queryKey: ['/api/discoveries', selectedDiscovery, 'analysis'],
    enabled: selectedDiscovery !== null,
    queryFn: () => selectedDiscovery ? fetch(`/api/discoveries/${selectedDiscovery}/analysis`).then(res => res.json()) : null,
  });

  // AI Review mutation
  const aiReviewMutation = useMutation({
    mutationFn: async ({ workId, priority }: { workId: number; priority: string }) => {
      const response = await fetch(`/api/discoveries/${workId}/ai-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority })
      });
      if (!response.ok) throw new Error('Failed to generate AI review');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "AI Review Generated", description: "Comprehensive analysis completed successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/discoveries'] });
    },
    onError: () => {
      toast({ title: "AI Review Failed", description: "Unable to generate analysis", variant: "destructive" });
    }
  });

  const getWorkTypeDisplay = (workType: string) => {
    const types: Record<string, string> = {
      'riemann_zero': 'Riemann Hypothesis',
      'prime_pattern': 'Prime Patterns',
      'yang_mills': 'Yang-Mills Theory',
      'navier_stokes': 'Navier-Stokes',
      'goldbach_verification': 'Goldbach Conjecture',
      'birch_swinnerton_dyer': 'Birch-Swinnerton-Dyer',
      'elliptic_curve_crypto': 'Elliptic Curve Crypto',
      'poincare_conjecture': 'Poincaré Conjecture',
      'lattice_crypto': 'Lattice Cryptography'
    };
    return types[workType] || workType;
  };

  const getSignificanceBadge = (significance: string) => {
    const colors = {
      'breakthrough': 'bg-gradient-to-r from-purple-500 to-pink-500',
      'major': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'moderate': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'incremental': 'bg-gradient-to-r from-gray-500 to-slate-500'
    };
    return colors[significance as keyof typeof colors] || colors.incremental;
  };

  if (discoveriesLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI-Enhanced Discovery Analysis
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="space-y-3">
                  <div className="h-3 bg-slate-600 rounded"></div>
                  <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI-Enhanced Discovery Analysis
        </h1>
      </div>

      <Tabs value={analysisTab} onValueChange={setAnalysisTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-purple-600">AI Insights</TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-purple-600">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="discoveries" className="data-[state=active]:bg-purple-600">Discovery Browser</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  Total Discoveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{discoveries.length}</div>
                <div className="text-sm text-slate-400">Mathematical breakthroughs</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  AI Analyzed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{insights?.totalAnalyzed || 0}</div>
                <div className="text-sm text-slate-400">Comprehensive analysis</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Breakthroughs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{insights?.breakthroughCount || 0}</div>
                <div className="text-sm text-slate-400">Revolutionary discoveries</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-blue-400" />
                  Avg Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{insights?.averageConfidence ? insights.averageConfidence.toFixed(1) : '0.0'}%</div>
                <div className="text-sm text-slate-400">Analysis confidence</div>
              </CardContent>
            </Card>
          </div>

          {insights && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Network className="w-5 h-5 text-purple-400" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Low Risk</span>
                      <Badge className="bg-green-600">{insights.riskAssessment.low}</Badge>
                    </div>
                    <Progress value={(insights.riskAssessment.low / insights.totalAnalyzed) * 100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Medium Risk</span>
                      <Badge className="bg-yellow-600">{insights.riskAssessment.medium}</Badge>
                    </div>
                    <Progress value={(insights.riskAssessment.medium / insights.totalAnalyzed) * 100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">High Risk</span>
                      <Badge className="bg-red-600">{insights.riskAssessment.high}</Badge>
                    </div>
                    <Progress value={(insights.riskAssessment.high / insights.totalAnalyzed) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Emerging Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.emergingTrends.map((trend, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                        <ArrowRight className="w-4 h-4 text-yellow-400 mt-0.5" />
                        <span className="text-sm text-slate-300">{trend}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {insights && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Top Pattern Detection</CardTitle>
                  <p className="text-slate-400 text-sm">Most frequently identified patterns across discoveries</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.topPatterns?.length > 0 ? insights.topPatterns.map((pattern, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-300 capitalize">{pattern.type?.replace('_', ' ') || 'Unknown Pattern'}</span>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-600">{pattern.frequency || 0}</Badge>
                            <span className="text-xs text-slate-400">{pattern.confidence ? pattern.confidence.toFixed(1) : '0.0'}%</span>
                          </div>
                        </div>
                        <Progress value={pattern.confidence || 0} className="h-2" />
                      </div>
                    )) : (
                      <div className="text-center text-slate-400 py-4">
                        <span className="text-sm">No patterns detected yet</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Cross-Disciplinary Connections</CardTitle>
                  <p className="text-slate-400 text-sm">Interdisciplinary impact analysis</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.crossDisciplinaryConnections.slice(0, 5).map((connection, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <span className="text-sm text-slate-300 capitalize">{connection.fields[0]?.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-600 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(100, (connection.strength / 10) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-400">{connection.strength}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Pattern Analysis Tab */}
        <TabsContent value="patterns" className="space-y-6">
          {crossAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Convergence Patterns</CardTitle>
                  <p className="text-slate-400 text-sm">Mathematical discoveries showing convergent evolution</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {crossAnalysis.convergencePatterns.map((pattern, index) => (
                      <div key={index} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-200 capitalize">
                            {pattern.pattern.replace('_', ' ')}
                          </span>
                          <Badge className={`${getSignificanceBadge(pattern.significance)} text-white`}>
                            {pattern.significance}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-400">
                          {pattern.discoveries.length} related discoveries
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Emerging Clusters</CardTitle>
                  <p className="text-slate-400 text-sm">Research activity clustering analysis</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {crossAnalysis.emergingClusters.map((cluster, index) => (
                      <div key={index} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-200 capitalize">
                            {cluster.cluster}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{cluster.strength}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">
                          Work types: {cluster.workTypes.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Discovery Browser Tab */}
        <TabsContent value="discoveries" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Discovery List */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Discoveries</CardTitle>
                  <p className="text-slate-400 text-sm">Click on a discovery for AI analysis</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {discoveries.slice(0, 20).map((discovery) => (
                      <div 
                        key={discovery.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedDiscovery === discovery.id 
                            ? 'bg-purple-600/20 border border-purple-500' 
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        onClick={() => setSelectedDiscovery(discovery.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-200">
                            {getWorkTypeDisplay(discovery.workType)}
                          </span>
                          <Badge className="bg-blue-600">
                            D-{discovery.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>ID: {discovery.id}</span>
                          <span>${(discovery.scientificValue ? (discovery.scientificValue / 1000000).toFixed(1) : '0.0')}M</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Panel */}
            <div>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDiscovery === null ? (
                    <div className="text-center py-8 text-slate-400">
                      <Brain className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                      <p>Select a discovery to view AI analysis</p>
                    </div>
                  ) : analysisLoading ? (
                    <div className="space-y-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ) : discoveryAnalysis ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Significance</span>
                        <Badge className={`${getSignificanceBadge(discoveryAnalysis.significance)} text-white`}>
                          {discoveryAnalysis.significance}
                        </Badge>
                      </div>

                      <div>
                        <span className="text-sm text-slate-300 block mb-2">Confidence</span>
                        <Progress value={discoveryAnalysis.confidence} className="h-3" />
                        <span className="text-xs text-slate-400 mt-1 block">{discoveryAnalysis.confidence.toFixed(1)}%</span>
                      </div>

                      <div>
                        <span className="text-sm text-slate-300 block mb-2">Breakthrough Probability</span>
                        <Progress value={discoveryAnalysis.ai_insights?.breakthrough_probability || 0} className="h-3" />
                        <span className="text-xs text-slate-400 mt-1 block">
                          {discoveryAnalysis.ai_insights?.breakthrough_probability ? discoveryAnalysis.ai_insights.breakthrough_probability.toFixed(1) : '0.0'}%
                        </span>
                      </div>

                      <Separator className="bg-slate-600" />

                      <div>
                        <span className="text-sm text-slate-300 block mb-2">Detected Patterns</span>
                        <div className="space-y-2">
                          {discoveryAnalysis.patterns?.length > 0 ? discoveryAnalysis.patterns.slice(0, 3).map((pattern, index) => (
                            <div key={index} className="text-xs text-slate-400 p-2 bg-slate-700 rounded">
                              {pattern.description || 'Pattern analysis pending'}
                            </div>
                          )) : (
                            <div className="text-xs text-slate-500 p-2 bg-slate-700 rounded">
                              No patterns identified yet
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-slate-300 block mb-2">Applications</span>
                        <div className="space-y-2">
                          {discoveryAnalysis.applications?.length > 0 ? discoveryAnalysis.applications.slice(0, 2).map((app, index) => (
                            <div key={index} className="text-xs">
                              <div className="flex items-center gap-2">
                                <Badge className={`${
                                  app.potential === 'high' ? 'bg-green-600' :
                                  app.potential === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
                                }`}>
                                  {app.potential || 'unknown'}
                                </Badge>
                                <span className="text-slate-300 capitalize">{app.field?.replace('_', ' ') || 'General research'}</span>
                              </div>
                            </div>
                          )) : (
                            <div className="text-xs text-slate-500">
                              Applications analysis pending
                            </div>
                          )}
                        </div>
                      </div>

                      <Button 
                        onClick={() => aiReviewMutation.mutate({ workId: selectedDiscovery, priority: 'high' })}
                        disabled={aiReviewMutation.isPending}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        {aiReviewMutation.isPending ? (
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4 mr-2" />
                        )}
                        Generate AI Review
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                      <p>Failed to load analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}