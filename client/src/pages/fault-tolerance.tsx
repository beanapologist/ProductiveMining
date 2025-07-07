import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  Activity,
  Clock,
  Target,
  Cpu
} from 'lucide-react';

interface FaultToleranceStatus {
  isMonitoring: boolean;
  correctionCycles: number;
  activeErrorCorrectionCodes: number;
  recentErrors: number;
  metrics: {
    totalErrors: number;
    correctedErrors: number;
    errorRate: number;
    correctionSuccessRate: number;
    averageCorrectionTime: number;
    quantumVolumeFidelity: number;
    logicalErrorRate: number;
    thresholdMaintained: boolean;
  };
  activeCodes: Array<{
    name: string;
    type: string;
    efficiency: number;
    threshold: number;
    distance: number;
  }>;
}

interface ErrorReport {
  totalErrors24h: number;
  correctedErrors24h: number;
  errorsByType: Record<string, number>;
  averageCorrectionTime: number;
  quantumVolumeFidelity: number;
  thresholdStatus: string;
}

export function FaultTolerancePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch fault tolerance status
  const { data: status, isLoading: statusLoading } = useQuery<FaultToleranceStatus>({
    queryKey: ['/api/fault-tolerance/status'],
    refetchInterval: 5000,
    staleTime: 2000
  });

  // Fetch error corrections report
  const { data: report, isLoading: reportLoading } = useQuery<ErrorReport>({
    queryKey: ['/api/fault-tolerance/report'],
    refetchInterval: 10000,
    staleTime: 5000
  });

  // Force error correction mutation
  const forceCorrection = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/fault-tolerance/force-correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to force correction');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Error Correction Completed",
        description: `Corrected ${data.corrected} errors in this cycle`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/fault-tolerance/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/fault-tolerance/report'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to force error correction",
        variant: "destructive"
      });
    }
  });

  // Optimize fault tolerance mutation
  const optimize = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/fault-tolerance/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to optimize');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Optimization Complete",
        description: "Fault tolerance parameters have been optimized"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/fault-tolerance/status'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to optimize fault tolerance",
        variant: "destructive"
      });
    }
  });

  if (statusLoading && !status) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Loading fault tolerance systems...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (rate: number) => {
    if (rate >= 98) return 'text-green-500';
    if (rate >= 95) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getThresholdBadge = (maintained: boolean) => {
    return maintained ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Maintained
      </Badge>
    ) : (
      <Badge variant="destructive">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Exceeded
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-400" />
            Quantum Fault Tolerance
          </h1>
          <p className="text-gray-400 mt-2">
            Enterprise-grade quantum error correction and fault tolerance monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => forceCorrection.mutate()}
            disabled={forceCorrection.isPending}
            variant="outline"
            size="sm"
          >
            <Zap className="h-4 w-4 mr-2" />
            Force Correction
          </Button>
          <Button 
            onClick={() => optimize.mutate()}
            disabled={optimize.isPending}
            variant="outline"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Optimize
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {status && !status.metrics.thresholdMaintained && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> Error threshold exceeded. Emergency protocols may be activated.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="codes">Error Correction Codes</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="analysis">Error Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Correction Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {status?.metrics.correctionSuccessRate.toFixed(1)}%
                </div>
                <Progress 
                  value={status?.metrics.correctionSuccessRate || 0} 
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {status?.metrics.correctedErrors} / {status?.metrics.totalErrors} corrected
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Quantum Volume Fidelity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {status?.metrics.quantumVolumeFidelity.toFixed(1)}%
                </div>
                <Progress 
                  value={status?.metrics.quantumVolumeFidelity || 0} 
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-2">Enterprise-grade fidelity</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Average Correction Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {status?.metrics.averageCorrectionTime.toFixed(1)}μs
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-gray-500">Ultra-fast correction</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Error Threshold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {status && getThresholdBadge(status.metrics.thresholdMaintained)}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Current rate: {(status?.metrics.errorRate || 0).toFixed(4)}/s
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Status */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                Real-time Monitoring Status
              </CardTitle>
              <CardDescription className="text-gray-400">
                Live quantum error correction system status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {status?.correctionCycles.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Correction Cycles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {status?.activeErrorCorrectionCodes}
                  </div>
                  <div className="text-sm text-gray-400">Active Codes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {status?.recentErrors}
                  </div>
                  <div className="text-sm text-gray-400">Recent Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {(status?.metrics.logicalErrorRate || 0).toExponential(1)}
                  </div>
                  <div className="text-sm text-gray-400">Logical Error Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Error Correction Codes Tab */}
        <TabsContent value="codes" className="space-y-6">
          <div className="grid gap-4">
            {status?.activeCodes.map((code, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{code.name}</CardTitle>
                    <Badge variant="outline" className="border-blue-400 text-blue-400">
                      {code.type.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Efficiency</div>
                      <div className="text-lg font-semibold text-white">{code.efficiency}%</div>
                      <Progress value={code.efficiency} className="mt-1" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Error Threshold</div>
                      <div className="text-lg font-semibold text-white">{code.threshold}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Code Distance</div>
                      <div className="text-lg font-semibold text-white">{code.distance}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Error Correction Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Success Rate</span>
                    <span className={`font-semibold ${getStatusColor(status?.metrics.correctionSuccessRate || 0)}`}>
                      {status?.metrics.correctionSuccessRate.toFixed(2)}%
                    </span>
                  </div>
                  <Progress value={status?.metrics.correctionSuccessRate || 0} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quantum Volume Fidelity</span>
                    <span className={`font-semibold ${getStatusColor(status?.metrics.quantumVolumeFidelity || 0)}`}>
                      {status?.metrics.quantumVolumeFidelity.toFixed(2)}%
                    </span>
                  </div>
                  <Progress value={status?.metrics.quantumVolumeFidelity || 0} />
                </div>

                <div className="pt-2 border-t border-slate-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Average Correction Time</span>
                    <span className="text-white font-medium">
                      {status?.metrics.averageCorrectionTime.toFixed(2)}μs
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Monitoring Status</span>
                  <Badge variant={status?.isMonitoring ? "default" : "secondary"}>
                    {status?.isMonitoring ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Error Rate</span>
                  <span className="text-white font-medium">
                    {(status?.metrics.errorRate || 0).toFixed(4)}/s
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Logical Error Rate</span>
                  <span className="text-white font-medium">
                    {(status?.metrics.logicalErrorRate || 0).toExponential(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Threshold Status</span>
                  {status && getThresholdBadge(status.metrics.thresholdMaintained)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Error Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">24-Hour Error Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                Detailed breakdown of quantum errors and corrections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportLoading ? (
                <div className="text-center py-8">
                  <Activity className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                  <p className="text-gray-400">Loading error analysis...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold text-red-400">
                        {report?.totalErrors24h || 0}
                      </div>
                      <div className="text-sm text-gray-400">Total Errors</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {report?.correctedErrors24h || 0}
                      </div>
                      <div className="text-sm text-gray-400">Corrected</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {report?.averageCorrectionTime.toFixed(1)}μs
                      </div>
                      <div className="text-sm text-gray-400">Avg. Correction</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">
                        {report?.quantumVolumeFidelity.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">Fidelity</div>
                    </div>
                  </div>

                  {report?.errorsByType && Object.keys(report.errorsByType).length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Error Types Distribution</h3>
                      <div className="space-y-2">
                        {Object.entries(report.errorsByType).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-gray-400 capitalize">
                              {type.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-slate-600 rounded-full h-2">
                                <div 
                                  className="bg-blue-400 h-2 rounded-full"
                                  style={{ 
                                    width: `${(count / Math.max(...Object.values(report.errorsByType))) * 100}%` 
                                  }}
                                />
                              </div>
                              <span className="text-white font-medium w-8">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}