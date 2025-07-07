import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Brain, Search, TrendingUp, Zap, Star, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

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
  recommendations: {
    priority: 'urgent' | 'high' | 'medium' | 'low';
    actions: string[];
    follow_up_research: string[];
  };
  ai_insights: {
    breakthrough_probability: number;
    paradigm_shift_potential: number;
    interdisciplinary_connections: string[];
    future_implications: string[];
  };
  generated_at: string;
}

interface AIInsights {
  total_analyses: number;
  breakthrough_rate: number;
  avg_confidence: number;
  top_patterns: Array<{ pattern: string; frequency: number }>;
  research_momentum: string;
}

export default function AIAnalysisPage() {
  const [selectedWorkType, setSelectedWorkType] = useState<string>('all');
  const [searchWorkId, setSearchWorkId] = useState<string>('');
  const { toast } = useToast();

  // Get AI insights
  const { data: insights } = useQuery<AIInsights>({
    queryKey: ['/api/ai/insights'],
  });

  // Get recent discoveries for analysis
  const { data: discoveries } = useQuery({
    queryKey: ['/api/discoveries'],
    queryFn: () => fetch('/api/discoveries?limit=100000').then(res => res.json()),
  });

  // Auto-analyze mutation
  const autoAnalyzeMutation = useMutation({
    mutationFn: () => apiRequest('/api/ai/auto-analyze', { method: 'POST' }),
    onSuccess: (data: any) => {
      toast({
        title: "AI Analysis Complete",
        description: `Analyzed ${data.analyzed} of ${data.total} recent discoveries`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/insights'] });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze discoveries",
        variant: "destructive",
      });
    },
  });

  // Individual analysis mutation
  const analyzeMutation = useMutation({
    mutationFn: (workId: number) => apiRequest(`/api/ai/analyze/${workId}`, { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "Discovery has been analyzed by AI system",
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze discovery",
        variant: "destructive",
      });
    },
  });

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'breakthrough': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'major': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'moderate': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'incremental': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-400" />;
      case 'medium': return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case 'low': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-blue-400" />
            AI Discovery Analysis
          </h1>
          <p className="text-xl text-blue-200">
            Advanced artificial intelligence analyzing mathematical discoveries for significance, patterns, and potential applications
          </p>
        </div>

        {/* AI System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-panel border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Analyses</p>
                  <p className="text-2xl font-bold text-blue-400">{insights?.total_analyses || 0}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Breakthrough Rate</p>
                  <p className="text-2xl font-bold text-orange-400">{insights?.breakthrough_rate?.toFixed(1) || 0}%</p>
                </div>
                <Star className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold text-green-400">{insights?.avg_confidence?.toFixed(1) || 0}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Research Momentum</p>
                  <p className="text-lg font-bold text-purple-400 capitalize">{insights?.research_momentum || 'steady'}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass-panel">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
            <TabsTrigger value="analysis">Individual Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                    AI Analysis Engine
                  </CardTitle>
                  <CardDescription>
                    Intelligent analysis of mathematical discoveries using advanced algorithms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-green-400">System Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Online</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engine Version</span>
                      <span className="font-mono">v1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Analysis Models</span>
                      <span className="font-mono">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pattern Recognition</span>
                      <span className="font-mono">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cross-Validation</span>
                      <span className="font-mono">Enabled</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => autoAnalyzeMutation.mutate()}
                    disabled={autoAnalyzeMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {autoAnalyzeMutation.isPending ? 'Analyzing...' : 'Auto-Analyze Recent Discoveries'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle>Analysis Capabilities</CardTitle>
                  <CardDescription>
                    Comprehensive evaluation framework for mathematical discoveries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <CheckCircle className="h-5 w-5 mr-3 text-blue-400" />
                      <div>
                        <div className="font-medium">Significance Assessment</div>
                        <div className="text-sm text-muted-foreground">Breakthrough detection and impact evaluation</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <CheckCircle className="h-5 w-5 mr-3 text-purple-400" />
                      <div>
                        <div className="font-medium">Pattern Recognition</div>
                        <div className="text-sm text-muted-foreground">Cross-discovery pattern analysis and clustering</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-400" />
                      <div>
                        <div className="font-medium">Application Identification</div>
                        <div className="text-sm text-muted-foreground">Potential use cases and field applications</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <CheckCircle className="h-5 w-5 mr-3 text-orange-400" />
                      <div>
                        <div className="font-medium">Verification Analysis</div>
                        <div className="text-sm text-muted-foreground">Mathematical validity and soundness verification</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Detected Patterns</CardTitle>
                <CardDescription>
                  AI-identified patterns across mathematical discoveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights?.top_patterns?.length ? (
                    insights.top_patterns.map((pattern, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <div className="font-medium capitalize">{pattern.pattern.replace(/_/g, ' ')}</div>
                          <div className="text-sm text-muted-foreground">
                            Pattern detected across multiple discoveries
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-400">{pattern.frequency}</div>
                          <div className="text-sm text-muted-foreground">occurrences</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No patterns detected yet. Run auto-analysis to identify patterns.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Individual Discovery Analysis</CardTitle>
                <CardDescription>
                  Analyze specific mathematical discoveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter Work ID to analyze..."
                      value={searchWorkId}
                      onChange={(e) => setSearchWorkId(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={() => {
                      const workId = parseInt(searchWorkId);
                      if (workId) {
                        analyzeMutation.mutate(workId);
                      }
                    }}
                    disabled={!searchWorkId || analyzeMutation.isPending}
                  >
                    {analyzeMutation.isPending ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Discoveries Available for Analysis</h3>
                  <div className="overflow-x-auto">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>Work ID</th>
                          <th>Type</th>
                          <th>Difficulty</th>
                          <th>Scientific Value</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(discoveries) && discoveries.slice(0, 10).map((discovery: any) => (
                          <tr key={discovery.id}>
                            <td className="font-mono">{discovery.id}</td>
                            <td className="capitalize">{discovery.workType?.replace(/_/g, ' ')}</td>
                            <td>{discovery.difficulty}</td>
                            <td>${formatNumber(discovery.scientificValue)}</td>
                            <td>
                              <Button
                                size="sm"
                                onClick={() => analyzeMutation.mutate(discovery.id)}
                                disabled={analyzeMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Analyze
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle>Research Momentum Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <span className="font-medium">Current Momentum</span>
                      <Badge className={`capitalize ${
                        insights?.research_momentum === 'accelerating' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        insights?.research_momentum === 'high_confidence' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {insights?.research_momentum || 'steady'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Breakthrough Rate</span>
                        <span className="font-mono">{insights?.breakthrough_rate?.toFixed(1) || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average Confidence</span>
                        <span className="font-mono">{insights?.avg_confidence?.toFixed(1) || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pattern Frequency</span>
                        <span className="font-mono">{insights?.top_patterns?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center mb-2">
                        {getPriorityIcon('high')}
                        <span className="ml-2 font-medium">Focus Areas</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Continue research in Riemann zeros and Yang-Mills theory for breakthrough potential
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center mb-2">
                        {getPriorityIcon('medium')}
                        <span className="ml-2 font-medium">Collaboration</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cross-reference findings with institutional validators for verification
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-center mb-2">
                        {getPriorityIcon('medium')}
                        <span className="ml-2 font-medium">Pattern Analysis</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Investigate millennium problem convergence patterns for potential connections
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}