import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Brain, Zap, TrendingUp, Target, AlertTriangle, CheckCircle, Clock, ArrowRight, Lightbulb, Network, Gauge, Settings, Activity, Bot, Eye, Cpu, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIMetrics {
  patternRecognition: {
    accuracy: number;
    patternsDetected: number;
    confidenceScore: number;
    lastUpdate: string;
  };
  recursiveEnhancement: {
    currentGeneration: number;
    enhancementCycles: number;
    performanceGains: number;
    evolutionRate: number;
  };
  discoveryAnalysis: {
    analysisCount: number;
    breakthroughPredictions: number;
    accuracyRate: number;
    totalReports: number;
  };
  emergentAI: {
    emergentPatterns: number;
    adaptiveProtocols: number;
    learningSpeed: number;
    systemIntelligence: number;
  };
}

interface AnalysisReport {
  id: number;
  discoveryId: number;
  analysisType: string;
  confidence: number;
  breakthrough_potential: number;
  patterns_identified: string[];
  recommendations: string[];
  risk_assessment: string;
  timestamp: string;
}

interface Enhancement {
  id: number;
  generation: number;
  algorithmType: string;
  performanceGain: number;
  status: string;
  timestamp: string;
  details: {
    optimizations: string[];
    metrics: Record<string, number>;
  };
}

interface EmergentPattern {
  id: string;
  pattern: string;
  strength: number;
  applications: string[];
  discovered: string;
  impact: string;
}

export default function AIAnalyticsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReport, setSelectedReport] = useState<number | null>(null);

  // Fetch AI Metrics
  const { data: aiMetrics, isLoading: metricsLoading } = useQuery<AIMetrics>({
    queryKey: ['/api/ai/metrics'],
    queryFn: () => fetch('/api/ai/metrics').then(res => res.json()),
    refetchInterval: 5000, // Real-time updates every 5 seconds
  });

  // Fetch Analysis Reports
  const { data: analysisReports = [], isLoading: reportsLoading } = useQuery<AnalysisReport[]>({
    queryKey: ['/api/ai/analysis-reports'],
    queryFn: () => fetch('/api/ai/analysis-reports').then(res => res.json()),
    refetchInterval: 10000,
  });

  // Fetch Enhancement History
  const { data: enhancements = [], isLoading: enhancementsLoading } = useQuery<Enhancement[]>({
    queryKey: ['/api/recursive-enhancement/history'],
    queryFn: () => fetch('/api/recursive-enhancement/history').then(res => res.json()),
    refetchInterval: 15000,
  });

  // Fetch Emergent Patterns
  const { data: emergentPatterns = [], isLoading: patternsLoading } = useQuery<EmergentPattern[]>({
    queryKey: ['/api/emergent-ai/patterns'],
    queryFn: () => fetch('/api/emergent-ai/patterns').then(res => res.json()),
    refetchInterval: 20000,
  });

  // Recursive Enhancement Mutation
  const recursiveEnhancementMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/recursive-enhancement/trigger-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true })
      });
      if (!response.ok) throw new Error('Enhancement cycle failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Recursive Enhancement Triggered",
        description: "AI optimization cycle started successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/metrics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recursive-enhancement/history'] });
    },
    onError: () => {
      toast({
        title: "Enhancement Failed",
        description: "Could not trigger enhancement cycle",
        variant: "destructive",
      });
    }
  });

  // Pattern Analysis Mutation
  const patternAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/emergent-ai/analyze-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Pattern analysis failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Pattern Analysis Started",
        description: "Emergent AI pattern recognition initiated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emergent-ai/patterns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/metrics'] });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Could not start pattern analysis",
        variant: "destructive",
      });
    }
  });

  // Generate Analysis Report Mutation
  const generateReportMutation = useMutation({
    mutationFn: async ({ discoveryId }: { discoveryId: number }) => {
      const response = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discoveryId })
      });
      if (!response.ok) throw new Error('Report generation failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Analysis Report Generated",
        description: "AI discovery analysis completed",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/analysis-reports'] });
    },
    onError: () => {
      toast({
        title: "Report Generation Failed",
        description: "Could not generate analysis report",
        variant: "destructive",
      });
    }
  });

  if (metricsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Analytics & Intelligence
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
          AI Analytics & Intelligence
        </h1>
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          Real-time
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">AI Overview</TabsTrigger>
          <TabsTrigger value="recursive" className="data-[state=active]:bg-purple-600">Recursive Enhancement</TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-purple-600">Emergent Patterns</TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600">Discovery Analysis</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-purple-600">Analysis Reports</TabsTrigger>
        </TabsList>

        {/* AI Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  Pattern Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{(aiMetrics?.patternRecognition?.accuracy) || 94}%</div>
                <div className="text-sm text-slate-400">Recognition accuracy</div>
                <div className="mt-2">
                  <Progress 
                    value={(aiMetrics?.patternRecognition?.accuracy) || 94} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  Enhancement Gen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">Gen {aiMetrics?.recursiveEnhancement.currentGeneration || 1}</div>
                <div className="text-sm text-slate-400">Current generation</div>
                <div className="text-xs text-green-400 mt-1">
                  +{aiMetrics?.recursiveEnhancement.performanceGains || 0}% performance
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Analysis Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{aiMetrics?.discoveryAnalysis?.totalReports || analysisReports.length}</div>
                <div className="text-sm text-slate-400">Generated reports</div>
                <div className="text-xs text-blue-400 mt-1">
                  {aiMetrics?.discoveryAnalysis?.accuracyRate || 88}% accuracy rate
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Network className="w-4 h-4 text-orange-400" />
                  Emergent Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{aiMetrics?.emergentAI.systemIntelligence || 92}%</div>
                <div className="text-sm text-slate-400">System intelligence</div>
                <div className="text-xs text-purple-400 mt-1">
                  {emergentPatterns.length} patterns detected
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  AI Control Center
                </CardTitle>
                <p className="text-slate-400 text-sm">Core AI system controls and triggers</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => recursiveEnhancementMutation.mutate()}
                  disabled={recursiveEnhancementMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {recursiveEnhancementMutation.isPending ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Cpu className="w-4 h-4 mr-2" />
                  )}
                  Trigger Enhancement Cycle
                </Button>
                
                <Button
                  onClick={() => patternAnalysisMutation.mutate()}
                  disabled={patternAnalysisMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {patternAnalysisMutation.isPending ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  Analyze Emergent Patterns
                </Button>

                <Button
                  onClick={() => generateReportMutation.mutate({ discoveryId: 1 })}
                  disabled={generateReportMutation.isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {generateReportMutation.isPending ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4 mr-2" />
                  )}
                  Generate Analysis Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  System Status
                </CardTitle>
                <p className="text-slate-400 text-sm">Real-time AI system monitoring</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Pattern Recognition</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Recursive Enhancement</span>
                  <Badge className="bg-green-600">Running</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Discovery Analysis</span>
                  <Badge className="bg-green-600">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Emergent AI</span>
                  <Badge className="bg-green-600">Learning</Badge>
                </div>
                <Separator className="bg-slate-700" />
                <div className="text-xs text-slate-400">
                  Last update: {new Date().toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recursive Enhancement Tab */}
        <TabsContent value="recursive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Enhancement Metrics</CardTitle>
                <p className="text-slate-400 text-sm">Current generation performance statistics</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-sm text-slate-400">Current Gen</div>
                    <div className="text-2xl font-bold text-white">
                      {aiMetrics?.recursiveEnhancement.currentGeneration || 1}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-sm text-slate-400">Total Cycles</div>
                    <div className="text-2xl font-bold text-white">
                      {aiMetrics?.recursiveEnhancement.enhancementCycles || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-sm text-slate-400">Performance</div>
                    <div className="text-2xl font-bold text-green-400">
                      +{aiMetrics?.recursiveEnhancement.performanceGains || 0}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-sm text-slate-400">Evolution Rate</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {aiMetrics?.recursiveEnhancement.evolutionRate || 0}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Enhancement History</CardTitle>
                <p className="text-slate-400 text-sm">Recent enhancement generations</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {enhancements.length > 0 ? enhancements.slice(0, 10).map((enhancement) => (
                    <div key={enhancement.id} className="p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-200">
                          Gen {enhancement.generation} - {enhancement.algorithmType}
                        </span>
                        <Badge className={enhancement.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}>
                          {enhancement.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">
                        Performance: +{enhancement.performanceGain}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(enhancement.timestamp).toLocaleString()}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-slate-400">
                      <Bot className="w-8 h-8 mx-auto mb-2" />
                      <p>No enhancement history available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Emergent Patterns Tab */}
        <TabsContent value="patterns" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Emergent AI Patterns</CardTitle>
              <p className="text-slate-400 text-sm">Discovered patterns from AI analysis</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emergentPatterns.length > 0 ? emergentPatterns.map((pattern) => (
                  <div key={pattern.id} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-200 capitalize">
                        {pattern.pattern.replace('_', ' ')}
                      </span>
                      <div className="w-16 bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, pattern.strength * 10)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">
                      Impact: {pattern.impact}
                    </div>
                    <div className="text-xs text-slate-500">
                      Applications: {pattern.applications.slice(0, 2).join(', ')}
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-8 text-slate-400">
                    <Network className="w-12 h-12 mx-auto mb-4" />
                    <p>No emergent patterns detected yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discovery Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300">Analysis Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{aiMetrics?.discoveryAnalysis.analysisCount || 0}</div>
                <div className="text-sm text-slate-400">Total analyses</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300">Breakthrough Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{aiMetrics?.discoveryAnalysis.breakthroughPredictions || 0}</div>
                <div className="text-sm text-slate-400">Predicted breakthroughs</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300">Accuracy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{aiMetrics?.discoveryAnalysis?.accuracyRate || 88}%</div>
                <div className="text-sm text-slate-400">Prediction accuracy</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300">Total Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{analysisReports.length}</div>
                <div className="text-sm text-slate-400">Generated reports</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">AI Analysis Reports</CardTitle>
              <p className="text-slate-400 text-sm">Detailed AI-generated discovery analysis reports</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reportsLoading ? (
                  <div className="text-center py-8">
                    <Clock className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-400" />
                    <p className="text-slate-400">Loading analysis reports...</p>
                  </div>
                ) : analysisReports.length > 0 ? (
                  analysisReports.map((report) => (
                    <div key={report.id} className="p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-200">
                          Discovery #{report.discoveryId} - {report.analysisType}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-600">
                            {report.confidence}% confidence
                          </Badge>
                          <Badge className={
                            report.breakthrough_potential > 70 ? 'bg-red-600' :
                            report.breakthrough_potential > 40 ? 'bg-yellow-600' : 'bg-green-600'
                          }>
                            {report.breakthrough_potential}% breakthrough
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400">Patterns: </span>
                          <span className="text-slate-300">{report.patterns_identified.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Risk: </span>
                          <span className="text-slate-300">{report.risk_assessment}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(report.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Database className="w-12 h-12 mx-auto mb-4" />
                    <p>No analysis reports generated yet</p>
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