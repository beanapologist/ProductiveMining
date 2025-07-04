import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Database, Award, Zap, Brain, TrendingUp, Hash } from "lucide-react";
import { format } from "date-fns";
import type { MathematicalWork, ProductiveBlock } from "@shared/schema";

export default function RealComputationalDashboard() {
  const { data: discoveries = [], isLoading: discoveriesLoading } = useQuery<MathematicalWork[]>({
    queryKey: ['/api/discoveries'],
    refetchInterval: 30000
  });

  const { data: blocks = [], isLoading: blocksLoading } = useQuery<ProductiveBlock[]>({
    queryKey: ['/api/blocks'],
    refetchInterval: 30000
  });

  const formatComputationalResult = (work: MathematicalWork) => {
    const result = work.result as any;
    switch (work.workType) {
      case 'riemann_zero':
        return {
          title: 'Riemann Zeta Function Zero',
          description: result?.formula || 'Euler-Maclaurin computation',
          value: result?.zeroValue ? 
            `ζ(${result.zeroValue.real} + ${result.zeroValue.imaginary}i)` : 
            'Computed zero',
          precision: result?.precision ? `Precision: ${result.precision.toExponential(3)}` : '',
          iterations: result?.iterations ? `${result.iterations.toLocaleString()} iterations` : '',
          icon: <Calculator className="w-5 h-5 text-blue-500" />
        };
      
      case 'prime_pattern':
        return {
          title: 'Prime Pattern Discovery',
          description: result?.patternType ? `${result.patternType} pattern analysis` : 'Prime analysis',
          value: result?.twinPairs ? 
            `${result.twinPairs.length} twin prime pairs found` : 
            `${result?.primes?.length || 0} primes discovered`,
          precision: result?.searchRange ? 
            `Range: [${result.searchRange[0]?.toLocaleString()}, ${result.searchRange[1]?.toLocaleString()}]` : '',
          iterations: result?.computationTime ? `${result.computationTime}ms computation` : '',
          icon: <Database className="w-5 h-5 text-green-500" />
        };
      
      case 'qdt_validation':
        return {
          title: 'Mathematical Verification',
          description: result?.validationType || 'Conjecture verification',
          value: result?.verifications ? 
            `${result.verifications.length} verifications completed` : 
            result?.successRate ? `Success rate: ${(result.successRate * 100).toFixed(1)}%` : 'Verified',
          precision: result?.numbers ? 
            `Numbers tested: ${result.numbers.join(', ')}` : '',
          iterations: result?.computationTime ? `${result.computationTime}ms computation` : '',
          icon: <Award className="w-5 h-5 text-purple-500" />
        };
      
      default:
        return {
          title: 'Mathematical Work',
          description: 'Computational research',
          value: `Scientific value: $${work.scientificValue.toLocaleString()}`,
          precision: '',
          iterations: '',
          icon: <Brain className="w-5 h-5 text-gray-500" />
        };
    }
  };

  const getVerificationStatus = (work: MathematicalWork) => {
    const verificationData = work.verificationData as any;
    if (verificationData?.verified) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          ✓ Verified
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        Pending
      </Badge>
    );
  };

  const totalScientificValue = discoveries.reduce((sum, work) => sum + work.scientificValue, 0);
  const totalComputationalCost = discoveries.reduce((sum, work) => sum + work.computationalCost, 0);
  const averageEfficiency = totalComputationalCost > 0 ? totalScientificValue / totalComputationalCost : 0;

  return (
    <div className="space-y-6">
      {/* Real-time Computational Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Discoveries</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {discoveries.length}
                </p>
              </div>
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Scientific Value</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  ${Math.floor(totalScientificValue / 1000)}K
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Computation Ops</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {(totalComputationalCost / 1000).toFixed(0)}K
                </p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Efficiency</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {averageEfficiency.toFixed(1)}
                </p>
              </div>
              <Hash className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Mathematical Discoveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            Real Mathematical Discoveries
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Authentic computational results from mathematical research
          </p>
        </CardHeader>
        <CardContent>
          {discoveriesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : discoveries.length > 0 ? (
            <div className="space-y-4">
              {discoveries.slice(0, 5).map((work) => {
                const formatted = formatComputationalResult(work);
                return (
                  <div key={work.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {formatted.icon}
                        <div>
                          <div className="font-medium">{formatted.title}</div>
                          <div className="text-sm text-muted-foreground">{formatted.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getVerificationStatus(work)}
                        <Badge variant="outline" className="text-xs">
                          ${work.scientificValue.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="font-medium text-blue-700 dark:text-blue-300">
                        {formatted.value}
                      </div>
                      {formatted.precision && (
                        <div className="text-muted-foreground">
                          {formatted.precision}
                        </div>
                      )}
                      {formatted.iterations && (
                        <div className="text-muted-foreground">
                          {formatted.iterations}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        Worker: {work.workerId} • 
                        Computed: {format(new Date(work.timestamp), 'MMM dd, HH:mm')} • 
                        Cost: {work.computationalCost.toLocaleString()} ops
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No mathematical discoveries available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blockchain Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6 text-green-600" />
            Computational Blocks
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Immutable blocks containing verified mathematical work
          </p>
        </CardHeader>
        <CardContent>
          {blocksLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : blocks.length > 0 ? (
            <div className="space-y-3">
              {blocks.slice(0, 3).map((block) => (
                <div key={block.id} className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Block #{block.index}</div>
                      <div className="text-sm text-muted-foreground">
                        Miner: {block.minerId}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Scientific Value: ${block.totalScientificValue.toLocaleString()} • 
                        Energy: {block.energyConsumed} units • 
                        Knowledge: {block.knowledgeCreated} discoveries
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {format(new Date(block.timestamp), 'MMM dd, HH:mm')}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        Difficulty {block.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs font-mono text-muted-foreground break-all">
                    Hash: {block.blockHash?.substring(0, 64)}...
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No computational blocks found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}