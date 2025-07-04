import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, Database, BarChart3, Shield, Activity, 
  FileDown, RefreshCw, CheckCircle, AlertTriangle,
  TrendingUp, Users, Blocks, Cpu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DatabaseAnalytics {
  analytics: {
    discoveries: {
      totalDiscoveries: number;
      totalScientificValue: number;
      averageDifficulty: number;
      discoveryTypes: Record<string, number>;
    };
    validations: {
      totalValidations: number;
      pendingValidations: number;
      approvedValidations: number;
      rejectedValidations: number;
      approvalRate: number;
    };
    records: {
      totalRecords: number;
      validationRecords: number;
      consensusRecords: number;
      verifiedRecords: number;
      verificationRate: number;
    };
    blocks: {
      totalBlocks: number;
    };
    stakers: {
      totalStakers: number;
    };
    overview: {
      totalRecords: number;
      networkValue: number;
      averageDifficulty: number;
      dataIntegrity: boolean;
      lastUpdated: string;
    };
  };
  exportMetadata: {
    exportDate: string;
    totalRecords: number;
    dataIntegrity: boolean;
  };
}

export default function DataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const { toast } = useToast();

  const { data: analytics, isLoading, refetch } = useQuery<DatabaseAnalytics>({
    queryKey: ["/api/database/analytics"],
  });

  const handleExport = async (format: 'json' | 'csv') => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/database/export?format=${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `productive-mining-export-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast({
          title: "Export Successful",
          description: `Database exported as ${format.toUpperCase()} file`,
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Data Refreshed",
      description: "Analytics have been updated with latest data",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="game-card">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-lg">Loading database analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Unable to load database analytics. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { analytics: data } = analytics;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="game-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              🏛️ Data Management Center
            </h1>
            <p className="text-gray-400 mt-2">
              Comprehensive database analytics, export tools, and data integrity monitoring
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => handleExport('json')}
              disabled={isExporting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              variant="outline"
              className="bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="game-card border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">Total Records</CardTitle>
            <Database className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.overview.totalRecords.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Network value: ${(data.overview.networkValue / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>

        <Card className="game-card border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Discoveries</CardTitle>
            <Cpu className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.discoveries.totalDiscoveries}</div>
            <p className="text-xs text-gray-400">
              Avg difficulty: {data.discoveries.averageDifficulty.toFixed(1)}
            </p>
          </CardContent>
        </Card>

        <Card className="game-card border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Validations</CardTitle>
            <Shield className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.validations.totalValidations}</div>
            <p className="text-xs text-gray-400">
              {data.validations.approvalRate.toFixed(1)}% approval rate
            </p>
          </CardContent>
        </Card>

        <Card className="game-card border-cyan-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-300">Data Integrity</CardTitle>
            <CheckCircle className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.overview.dataIntegrity ? "✓" : "⚠️"}
            </div>
            <p className="text-xs text-gray-400">
              {data.records.verificationRate.toFixed(1)}% verified
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="discoveries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
          <TabsTrigger 
            value="discoveries" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Cpu className="w-4 h-4 mr-2" />
            Discoveries
          </TabsTrigger>
          <TabsTrigger 
            value="validations"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Shield className="w-4 h-4 mr-2" />
            Validations
          </TabsTrigger>
          <TabsTrigger 
            value="records"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Activity className="w-4 h-4 mr-2" />
            Records
          </TabsTrigger>
          <TabsTrigger 
            value="system"
            className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discoveries" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="game-card">
              <CardHeader>
                <CardTitle className="text-blue-300">Discovery Overview</CardTitle>
                <CardDescription>Mathematical breakthrough statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Discoveries</span>
                    <span className="font-mono">{data.discoveries.totalDiscoveries}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Scientific Value</span>
                    <span className="font-mono text-green-400">
                      ${(data.discoveries.totalScientificValue / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Difficulty</span>
                    <span className="font-mono">{data.discoveries.averageDifficulty.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="game-card">
              <CardHeader>
                <CardTitle className="text-blue-300">Discovery Types</CardTitle>
                <CardDescription>Breakdown by mathematical field</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data.discoveries.discoveryTypes).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(count / data.discoveries.totalDiscoveries) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-mono w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="game-card">
              <CardHeader>
                <CardTitle className="text-purple-300">Validation Status</CardTitle>
                <CardDescription>Proof-of-Stake validation statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Validations</span>
                    <span className="font-mono">{data.validations.totalValidations}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Approved</span>
                      <span className="text-green-400">{data.validations.approvedValidations}</span>
                    </div>
                    <Progress 
                      value={(data.validations.approvedValidations / data.validations.totalValidations) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pending</span>
                      <span className="text-yellow-400">{data.validations.pendingValidations}</span>
                    </div>
                    <Progress 
                      value={(data.validations.pendingValidations / data.validations.totalValidations) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rejected</span>
                      <span className="text-red-400">{data.validations.rejectedValidations}</span>
                    </div>
                    <Progress 
                      value={(data.validations.rejectedValidations / data.validations.totalValidations) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="game-card">
              <CardHeader>
                <CardTitle className="text-purple-300">Consensus Metrics</CardTitle>
                <CardDescription>Network agreement statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {data.validations.approvalRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-400">Overall Approval Rate</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {data.validations.approvedValidations}
                    </div>
                    <p className="text-xs text-gray-400">Approved</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {data.validations.rejectedValidations}
                    </div>
                    <p className="text-xs text-gray-400">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="game-card">
              <CardHeader>
                <CardTitle className="text-green-300">Immutable Records</CardTitle>
                <CardDescription>Tamper-proof audit trail statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Records</span>
                    <span className="font-mono">{data.records.totalRecords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Validation Activities</span>
                    <span className="font-mono">{data.records.validationRecords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consensus Decisions</span>
                    <span className="font-mono">{data.records.consensusRecords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verified Records</span>
                    <span className="font-mono text-green-400">{data.records.verifiedRecords}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="game-card">
              <CardHeader>
                <CardTitle className="text-green-300">Record Integrity</CardTitle>
                <CardDescription>Verification and security metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {data.records.verificationRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-400">Verification Rate</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Verification Progress</span>
                    <span>{data.records.verifiedRecords} / {data.records.totalRecords}</span>
                  </div>
                  <Progress value={data.records.verificationRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="game-card">
              <CardHeader>
                <CardTitle className="text-cyan-300">Network Overview</CardTitle>
                <CardDescription>System-wide statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Blocks</span>
                  <span className="font-mono">{data.blocks.totalBlocks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Validators</span>
                  <span className="font-mono">{data.stakers.totalStakers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Value</span>
                  <span className="font-mono text-green-400">
                    ${(data.overview.networkValue / 1000000).toFixed(2)}M
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="game-card">
              <CardHeader>
                <CardTitle className="text-cyan-300">Data Integrity</CardTitle>
                <CardDescription>System health indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Overall Integrity</span>
                  <Badge 
                    variant={data.overview.dataIntegrity ? "default" : "destructive"}
                    className={data.overview.dataIntegrity ? "bg-green-600" : ""}
                  >
                    {data.overview.dataIntegrity ? "Verified" : "Warning"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated</span>
                  <span className="text-xs text-gray-400">
                    {new Date(data.overview.lastUpdated).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="game-card">
              <CardHeader>
                <CardTitle className="text-cyan-300">Export Status</CardTitle>
                <CardDescription>Data export information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Export Ready</span>
                  <Badge variant="default" className="bg-blue-600">Available</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Records</span>
                  <span className="font-mono">{analytics.exportMetadata.totalRecords}</span>
                </div>
                <div className="text-center pt-2">
                  <Button
                    onClick={() => handleExport('json')}
                    disabled={isExporting}
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isExporting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}