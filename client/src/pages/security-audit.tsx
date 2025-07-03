import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Search, Cpu, Lock } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface DiscoveryAuditResult {
  discoveryId: number;
  workType: string;
  securityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  auditFlags: string[];
  validationMetrics: {
    totalValidations: number;
    approvalRate: number;
    consensusStrength: number;
    validatorDiversity: number;
  };
  mathematicalIntegrity: {
    formulaValidation: boolean;
    computationVerification: boolean;
    cryptographicSignature: boolean;
    independentVerification: boolean;
  };
  recommendations: string[];
}

interface AuditResults {
  totalDiscoveries: number;
  auditedDiscoveries: number;
  securityDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  overallSecurityScore: number;
  flaggedDiscoveries: DiscoveryAuditResult[];
  recommendations: string[];
}

export function SecurityAuditPage() {
  const [selectedDiscovery, setSelectedDiscovery] = useState<number | null>(null);

  // Run comprehensive security audit
  const auditMutation = useMutation({
    mutationFn: () => apiRequest('/api/discoveries/audit', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/discoveries'] });
    }
  });

  // Get audit results
  const { data: auditResults, isLoading } = useQuery<AuditResults>({
    queryKey: ['/api/discoveries/audit-results'],
    enabled: false // Only fetch after audit is run
  });

  // Get single discovery audit
  const { data: singleAudit } = useQuery<{ discovery: DiscoveryAuditResult }>({
    queryKey: ['/api/discoveries', selectedDiscovery, 'audit'],
    enabled: !!selectedDiscovery
  });

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HIGH': return 'bg-orange-500';
      case 'CRITICAL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getIntegrityIcon = (value: boolean) => {
    return value ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Discovery Security Audit
            </h1>
            <p className="text-gray-600">Comprehensive security analysis of mathematical discoveries</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Button 
            onClick={() => auditMutation.mutate()} 
            disabled={auditMutation.isPending}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {auditMutation.isPending ? (
              <>
                <Cpu className="h-4 w-4 mr-2 animate-spin" />
                Running Security Audit...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Run Comprehensive Audit
              </>
            )}
          </Button>
        </div>
      </div>

      {auditMutation.isSuccess && auditMutation.data && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Security Overview</TabsTrigger>
            <TabsTrigger value="flagged">Flagged Discoveries</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Overall Security Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {auditMutation.data.overallSecurityScore?.toFixed(1)}%
                  </div>
                  <Progress 
                    value={auditMutation.data.overallSecurityScore} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Total Discoveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {auditMutation.data.totalDiscoveries}
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {auditMutation.data.auditedDiscoveries} audited
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Flagged Discoveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {auditMutation.data.flaggedDiscoveries?.length || 0}
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Require attention
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Critical</span>
                      <span className="font-bold text-red-600">
                        {auditMutation.data.securityDistribution?.critical || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>High</span>
                      <span className="font-bold text-orange-600">
                        {auditMutation.data.securityDistribution?.high || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {auditMutation.data.securityDistribution?.low || 0}
                    </div>
                    <Badge className="bg-green-500 text-white mt-2">LOW RISK</Badge>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {auditMutation.data.securityDistribution?.medium || 0}
                    </div>
                    <Badge className="bg-yellow-500 text-white mt-2">MEDIUM RISK</Badge>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {auditMutation.data.securityDistribution?.high || 0}
                    </div>
                    <Badge className="bg-orange-500 text-white mt-2">HIGH RISK</Badge>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {auditMutation.data.securityDistribution?.critical || 0}
                    </div>
                    <Badge className="bg-red-500 text-white mt-2">CRITICAL</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flagged" className="space-y-4">
            {auditMutation.data.flaggedDiscoveries?.map((discovery) => (
              <Card key={discovery.discoveryId} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Discovery #{discovery.discoveryId} - {discovery.workType}
                      </CardTitle>
                      <CardDescription>
                        Security Score: {discovery.securityScore.toFixed(1)}%
                      </CardDescription>
                    </div>
                    <Badge className={getRiskBadgeColor(discovery.riskLevel)}>
                      {discovery.riskLevel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Audit Flags:</h4>
                      <div className="space-y-1">
                        {discovery.auditFlags.map((flag, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{flag}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{discovery.validationMetrics.totalValidations}</div>
                        <div className="text-sm text-gray-600">Validations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{discovery.validationMetrics.approvalRate.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Approval Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{discovery.validationMetrics.consensusStrength.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">Consensus</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{discovery.validationMetrics.validatorDiversity.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Diversity</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mathematical Integrity Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of mathematical and cryptographic validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auditMutation.data.flaggedDiscoveries?.slice(0, 5).map((discovery) => (
                  <div key={discovery.discoveryId} className="border-b pb-4 mb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Discovery #{discovery.discoveryId}</h4>
                      <Badge className={getRiskBadgeColor(discovery.riskLevel)}>
                        {discovery.riskLevel}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        {getIntegrityIcon(discovery.mathematicalIntegrity.formulaValidation)}
                        <span className="text-sm">Formula Valid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getIntegrityIcon(discovery.mathematicalIntegrity.computationVerification)}
                        <span className="text-sm">Computation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getIntegrityIcon(discovery.mathematicalIntegrity.cryptographicSignature)}
                        <span className="text-sm">Signature</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getIntegrityIcon(discovery.mathematicalIntegrity.independentVerification)}
                        <span className="text-sm">Independent</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable steps to enhance discovery security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditMutation.data.recommendations?.map((recommendation, index) => (
                    <Alert key={index}>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Recommendation {index + 1}</AlertTitle>
                      <AlertDescription>{recommendation}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Individual Discovery Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditMutation.data.flaggedDiscoveries?.slice(0, 3).map((discovery) => (
                    <div key={discovery.discoveryId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Discovery #{discovery.discoveryId}</h4>
                        <Badge className={getRiskBadgeColor(discovery.riskLevel)}>
                          {discovery.riskLevel}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {discovery.recommendations.map((rec, index) => (
                          <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                            • {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {auditMutation.isError && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Audit Failed</AlertTitle>
          <AlertDescription>
            Failed to run security audit. Please try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}