import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Zap, 
  Target, 
  BarChart3, 
  Brain, 
  Sparkles,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface ComplexityAnalysis {
  recommendedDifficulty: number;
  scalingFactor: number;
  reasoning: string[];
  performanceScore: number;
  nextMilestone: number;
  adaptiveParameters: {
    workTypeOptimization: Record<string, number>;
    emergentComplexity: number;
    breakthroughPotential: number;
  };
}

interface ComplexityMetrics {
  currentDifficulty: number;
  performanceScore: number;
  nextMilestone: number;
  scalingFactor: number;
  emergentComplexity: number;
  breakthroughPotential: number;
  workTypeOptimization: Record<string, number>;
  reasoning: string[];
}

export default function ComplexityAnalysisPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch complexity analysis data
  const { data: analysisData, isLoading: isAnalysisLoading } = useQuery<ComplexityAnalysis>({
    queryKey: ["/api/complexity/analysis"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: metricsData, isLoading: isMetricsLoading } = useQuery<ComplexityMetrics>({
    queryKey: ["/api/complexity/metrics"],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  // Apply scaling mutation
  const applyScalingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/complexity/apply-scaling", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Failed to apply scaling");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/complexity/analysis"] });
      queryClient.invalidateQueries({ queryKey: ["/api/complexity/metrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blocks"] });
      
      toast({
        title: "Complexity Scaling Applied",
        description: data.applied 
          ? `Difficulty adjusted from ${data.previousDifficulty} to ${data.newDifficulty}`
          : "No scaling changes needed at this time",
      });
    },
    onError: (error) => {
      toast({
        title: "Scaling Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const getScalingDirection = (factor: number) => {
    if (factor > 1.05) return { icon: ArrowUp, color: "text-green-400", label: "Increasing" };
    if (factor < 0.95) return { icon: ArrowDown, color: "text-red-400", label: "Decreasing" };
    return { icon: Minus, color: "text-yellow-400", label: "Stable" };
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const formatWorkTypeName = (workType: string) => {
    return workType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isAnalysisLoading || isMetricsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="mt-2 text-gray-400">Analyzing complexity progression...</p>
        </div>
      </div>
    );
  }

  const analysis = analysisData;
  const metrics = metricsData;

  if (!analysis || !metrics) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center text-gray-400">
          <Brain className="h-12 w-12 mx-auto mb-4" />
          <p>No complexity analysis data available</p>
        </div>
      </div>
    );
  }

  const scalingDirection = getScalingDirection(analysis.scalingFactor);
  const ScalingIcon = scalingDirection.icon;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center text-white">
          <Brain className="mr-3 h-8 w-8 text-purple-400" />
          Complexity Scaling Analysis
        </h1>
        <p className="text-gray-400 mt-2">
          Intelligent difficulty progression and network optimization
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-500/20">
                <Target className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{analysis.recommendedDifficulty}</div>
                <div className="text-sm text-gray-400">Recommended Difficulty</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <BarChart3 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${getPerformanceColor(analysis.performanceScore)}`}>
                  {analysis.performanceScore.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Performance Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <ScalingIcon className={`h-5 w-5 ${scalingDirection.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {analysis.scalingFactor.toFixed(3)}x
                </div>
                <div className="text-sm text-gray-400">Scaling Factor</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-orange-500/20">
                <Sparkles className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{analysis.nextMilestone}</div>
                <div className="text-sm text-gray-400">Next Milestone</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="adaptive">Adaptive Parameters</TabsTrigger>
          <TabsTrigger value="optimization">Work Type Analysis</TabsTrigger>
          <TabsTrigger value="reasoning">Scaling Logic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Activity className="mr-2 h-5 w-5 text-blue-400" />
                  Network Performance
                </CardTitle>
                <CardDescription>Current system health and capacity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Performance Score</span>
                    <span className={getPerformanceColor(analysis.performanceScore)}>
                      {analysis.performanceScore.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={analysis.performanceScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Breakthrough Potential</span>
                    <span className="text-purple-400">
                      {(analysis.adaptiveParameters.breakthroughPotential * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={analysis.adaptiveParameters.breakthroughPotential * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Emergent Complexity</span>
                    <span className="text-green-400">
                      {analysis.adaptiveParameters.emergentComplexity.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={Math.min(analysis.adaptiveParameters.emergentComplexity * 50, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                  Scaling Controls
                </CardTitle>
                <CardDescription>Apply intelligent difficulty adjustments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Current Difficulty</p>
                    <p className="text-2xl font-bold text-blue-400">{metrics.currentDifficulty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">Recommended</p>
                    <p className="text-2xl font-bold text-purple-400">{analysis.recommendedDifficulty}</p>
                  </div>
                </div>

                <Badge variant="outline" className={`${scalingDirection.color} border-current`}>
                  <ScalingIcon className="mr-1 h-3 w-3" />
                  {scalingDirection.label}
                </Badge>

                <Button 
                  onClick={() => applyScalingMutation.mutate()}
                  disabled={applyScalingMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {applyScalingMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Applying...
                    </div>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Apply Scaling
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="adaptive" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Adaptive Parameters</CardTitle>
              <CardDescription>Advanced complexity scaling factors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-1">Emergent Complexity</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {analysis.adaptiveParameters.emergentComplexity.toFixed(2)}
                  </p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <Brain className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-1">Breakthrough Potential</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {(analysis.adaptiveParameters.breakthroughPotential * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-slate-700/50">
                  <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-1">Scaling Factor</p>
                  <p className="text-2xl font-bold text-green-400">
                    {analysis.scalingFactor.toFixed(3)}x
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Work Type Optimization</CardTitle>
              <CardDescription>Performance analysis by mathematical problem type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysis.adaptiveParameters.workTypeOptimization).map(([workType, value]) => (
                  <div key={workType} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                    <span className="text-sm font-medium text-gray-300">
                      {formatWorkTypeName(workType)}
                    </span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-400">
                        ${(value / 1000000).toFixed(1)}M
                      </span>
                      <p className="text-xs text-gray-500">avg scientific value</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reasoning" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Scaling Logic & Reasoning</CardTitle>
              <CardDescription>Detailed analysis of scaling decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.reasoning.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-400">{index + 1}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}