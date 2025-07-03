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
  const { data: valuationData, isLoading } = useQuery<ValuationSummary>({
    queryKey: ['/api/data-management/valuation-summary'],
    refetchInterval: 30000,
  });

  const workTypeNames: Record<string, string> = {
    riemann_zero: "Riemann Hypothesis Zeros",
    prime_pattern: "Prime Number Patterns",
    yang_mills: "Yang-Mills Theory",
    navier_stokes: "Navier-Stokes Equations"
  };

  const workTypeDescriptions: Record<string, string> = {
    riemann_zero: "Computing non-trivial zeros of the Riemann zeta function, fundamental to number theory and cryptography",
    prime_pattern: "Discovering patterns in prime number distribution, essential for computational security",
    yang_mills: "Solving gauge field equations in quantum field theory, advancing particle physics understanding",
    navier_stokes: "Analyzing fluid dynamics equations, crucial for engineering and atmospheric modeling"
  };

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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Scientific Valuation System</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Understanding how Productive Mining calculates realistic scientific value from mathematical discoveries
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
          <TabsTrigger value="examples">Work Types</TabsTrigger>
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
                  {valuationData.totalDiscoveries.toLocaleString()}
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
                  ${(valuationData.adjustedTotal / 1000000).toFixed(1)}M
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
                  ${valuationData.averageValue.toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm">Per discovery</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Valuation Principles</CardTitle>
              <CardDescription className="text-gray-400">
                Core methodology for determining scientific value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-white">Base Values</span>
                  </div>
                  <p className="text-gray-400 text-sm">{valuationData.valuationExplanation.baseValues}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="font-semibold text-white">Computational Costs</span>
                  </div>
                  <p className="text-gray-400 text-sm">{valuationData.valuationExplanation.computationalCosts}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="font-semibold text-white">Research Impact</span>
                  </div>
                  <p className="text-gray-400 text-sm">{valuationData.valuationExplanation.researchImpact}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span className="font-semibold text-white">Value Range</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {valuationData.valuationExplanation.minSingleDiscovery} to {valuationData.valuationExplanation.maxSingleDiscovery}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methodology" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Scientific Value Calculation Formula</CardTitle>
              <CardDescription className="text-gray-400">
                Step-by-step breakdown of how values are determined
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                <h3 className="text-white font-semibold mb-2">1. Base Value Calculation</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Base Value = Work Type Factor × Difficulty Multiplier × Research Grant Equivalent
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Work Type Factor: 1.0-2.5 (based on theoretical significance)</div>
                  <div>• Difficulty Multiplier: 0.8-1.5 (computational complexity)</div>
                  <div>• Research Grant Equivalent: $1,200-$3,500</div>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                <h3 className="text-white font-semibold mb-2">2. Computational Cost Factor</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Cost Factor = (Computational Resources × Energy Cost) / Efficiency Ratio
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Includes cloud computing costs and energy consumption</div>
                  <div>• Accounts for algorithm efficiency improvements</div>
                  <div>• Reflects real-world computational expenses</div>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                <h3 className="text-white font-semibold mb-2">3. Research Impact Multiplier</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Impact Factor = Theoretical Significance × Practical Applications × Citation Potential
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Theoretical Significance: Contribution to mathematical knowledge</div>
                  <div>• Practical Applications: Real-world use cases and implementations</div>
                  <div>• Citation Potential: Expected academic and industry references</div>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                <h3 className="text-white font-semibold mb-2">4. Diminishing Returns Adjustment</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Adjusted Value = Total Value × (1 - Diminishing Factor)
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Prevents infinite value accumulation</div>
                  <div>• Current Factor: {(valuationData.diminishingFactor * 100).toFixed(1)}%</div>
                  <div>• Reflects market saturation of similar discoveries</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valuationData.sampleValuations.map((sample, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    {workTypeNames[sample.workType]}
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      ${sample.totalValue.toLocaleString()}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {workTypeDescriptions[sample.workType]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Base Value</span>
                      <span className="text-white font-semibold">${sample.baseValue.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(sample.baseValue / sample.totalValue) * 100} 
                      className="h-2"
                    />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Computational Cost</span>
                      <span className="text-white font-semibold">${sample.computationalCost.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(sample.computationalCost / sample.totalValue) * 100} 
                      className="h-2"
                    />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Research Impact</span>
                      <span className="text-white font-semibold">${sample.researchImpact.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(sample.researchImpact / sample.totalValue) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="pt-2 border-t border-slate-600">
                    <p className="text-xs text-gray-400">{sample.methodology}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Value Distribution Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                How scientific value is distributed across the network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Raw vs Adjusted Totals</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Raw Total Value</span>
                      <span className="text-white">${(valuationData.rawTotal / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Adjusted Total Value</span>
                      <span className="text-green-400 font-semibold">${(valuationData.adjustedTotal / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Diminishing Factor</span>
                      <span className="text-yellow-400">{(valuationData.diminishingFactor * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Value Efficiency Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Average per Discovery</span>
                      <span className="text-white">${valuationData.averageValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Discoveries</span>
                      <span className="text-white">{valuationData.totalDiscoveries.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Value Density</span>
                      <span className="text-blue-400">${(valuationData.adjustedTotal / valuationData.totalDiscoveries).toFixed(0)}/discovery</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                <h3 className="text-white font-semibold mb-3">Realistic Valuation Rationale</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• <strong>Research Grant Equivalent:</strong> Values reflect actual academic research funding levels</p>
                  <p>• <strong>Computational Cost Basis:</strong> Based on real cloud computing and energy expenses</p>
                  <p>• <strong>Market-Driven Adjustments:</strong> Diminishing returns prevent unrealistic value inflation</p>
                  <p>• <strong>Academic Validation:</strong> Methodology reviewed by institutional partners</p>
                  <p>• <strong>Practical Applications:</strong> Values tied to real-world utility and implementation potential</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}