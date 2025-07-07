import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calculator, TrendingUp, DollarSign, Zap, Brain, Shield } from "lucide-react";

interface ValuationSummary {
  totalDiscoveries: number;
  rawTotal: number;
  adjustedTotal: number;
  averageValue: number;
  diminishingFactor: number;
  sampleValuations: Array<{
    workType: string;
    baseValue: number;
    computationalCost: number;
    researchImpact: number;
    totalValue: number;
    methodology: string;
  }>;
  valuationExplanation: {
    baseValues: string;
    computationalCosts: string;
    researchImpact: string;
    maxSingleDiscovery: string;
    minSingleDiscovery: string;
  };
}

export default function ScientificValuation() {
  const { data: valuationData, isLoading, error } = useQuery<ValuationSummary>({
    queryKey: ['/api/data-management/valuation-summary'],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading scientific valuation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <p className="text-red-400">Error loading valuation data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <p className="text-gray-400">No valuation data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Scientific Valuation System</h1>
        <p className="text-lg text-gray-400">
          Realistic valuation of mathematical discoveries based on computational effort and research impact
        </p>
        
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">✅ Valuation Correction Complete</h2>
          <p className="text-gray-300">
            All scientific values have been corrected to realistic levels ($1.2K-$3.5K per discovery) 
            based on actual computational costs and research significance. Previous inflated values 
            have been replaced with fair market assessments.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
          <TabsTrigger value="analysis">Value Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-400" />
                  Total Discoveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {(valuationData.totalDiscoveries || 0).toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm">Mathematical breakthroughs</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Adjusted Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  ${(valuationData.adjustedTotal || 0).toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm">After diminishing returns</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Average Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  ${(valuationData.averageValue || 0).toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm">Per discovery</p>
              </CardContent>
            </Card>
          </div>

          {/* Sample Valuations */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Sample Discovery Valuations</CardTitle>
              <CardDescription className="text-gray-400">
                Recent mathematical discoveries with realistic scientific valuations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(valuationData.sampleValuations || []).map((sample, index) => (
                  <div key={index} className="border border-slate-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">
                        {sample.workType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <Badge variant="secondary" className="bg-green-900 text-green-300">
                        ${(sample.totalValue || 0).toLocaleString()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Base Value:</span>
                        <div className="text-white">${(sample.baseValue || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Computational Cost:</span>
                        <div className="text-white">${(sample.computationalCost || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Research Impact:</span>
                        <div className="text-white">${(sample.researchImpact || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methodology" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Valuation Methodology</CardTitle>
              <CardDescription className="text-gray-400">
                How we calculate realistic scientific values for mathematical discoveries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="font-semibold text-white">Base Research Values</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {valuationData.valuationExplanation?.baseValues || 'Base values calculated from research grants and academic funding levels'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-400" />
                    <span className="font-semibold text-white">Computational Costs</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {valuationData.valuationExplanation?.computationalCosts || 'Based on actual cloud computing costs and energy consumption'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-white">Research Impact</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {valuationData.valuationExplanation?.researchImpact || 'Evaluated based on theoretical importance and real-world applications'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span className="font-semibold text-white">Value Range</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {valuationData.valuationExplanation?.minSingleDiscovery || '$1,200'} to {valuationData.valuationExplanation?.maxSingleDiscovery || '$3,500'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Diminishing Returns Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                How aggregate value is calculated with economic scaling factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Raw Total Value:</span>
                  <span className="text-white font-mono">${(valuationData.rawTotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Diminishing Factor:</span>
                  <span className="text-orange-400 font-mono">{((valuationData.diminishingFactor || 0) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(valuationData.diminishingFactor || 0) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between items-center border-t border-slate-600 pt-4">
                  <span className="text-gray-300 font-semibold">Adjusted Total Value:</span>
                  <span className="text-green-400 font-mono text-lg">${(valuationData.adjustedTotal || 0).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}