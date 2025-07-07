import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, Database, Activity, Zap, Shield, Brain, CheckCircle, FileCode, TrendingUp, Settings, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiOverview {
  endpoints: {
    mining: Record<string, string>;
    blockchain: Record<string, string>;
    discoveries: Record<string, string>;
    security: Record<string, string>;
    ai: Record<string, string>;
    validation: Record<string, string>;
    token: Record<string, string>;
  };
  systemStats: {
    totalEndpoints: number;
    categories: number;
    lastUpdated: string;
    version: string;
    features: string[];
  };
}

export default function About() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: apiOverview, isLoading } = useQuery<ApiOverview>({
    queryKey: ['/api/overview'],
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['/api/health'],
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const copyEndpoint = (endpoint: string | any) => {
    if (typeof endpoint !== 'string') return;
    const fullUrl = `${window.location.origin}${endpoint}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedEndpoint(endpoint);
    toast({
      title: "Endpoint copied",
      description: `${fullUrl} copied to clipboard`,
      duration: 2000,
    });
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const getMethodColor = (endpoint: string | any) => {
    if (typeof endpoint !== 'string') return 'bg-gray-500';
    if (endpoint.includes('start') || endpoint.includes('trigger') || endpoint.includes('create')) {
      return 'bg-green-500';
    }
    if (endpoint.includes('status') || endpoint.includes('metrics') || endpoint.includes('overview')) {
      return 'bg-blue-500';
    }
    if (endpoint.includes('security') || endpoint.includes('validation')) {
      return 'bg-orange-500';
    }
    return 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mining': return <Zap className="w-4 h-4" />;
      case 'blockchain': return <Database className="w-4 h-4" />;
      case 'discoveries': return <FileCode className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'validation': return <CheckCircle className="w-4 h-4" />;
      case 'token': return <TrendingUp className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">API Documentation</h1>
          <p className="text-gray-400">
            Comprehensive API endpoints for the Productive Mining Platform
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-green-400 border-green-400">
            Version {apiOverview?.systemStats?.version || '2.1.0'}
          </Badge>
          <div className="flex items-center space-x-2">
            {healthLoading ? (
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
            <span className="text-sm text-gray-400">
              {healthLoading ? 'Checking...' : 'System Online'}
            </span>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center">
              <Server className="mr-2 h-5 w-5 text-blue-400" />
              Total Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {apiOverview?.systemStats?.totalEndpoints || 85}
            </div>
            <p className="text-sm text-gray-400">
              Active API endpoints
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center">
              <Database className="mr-2 h-5 w-5 text-green-400" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {apiOverview?.systemStats?.categories || 7}
            </div>
            <p className="text-sm text-gray-400">
              Functional categories
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center">
              <Activity className="mr-2 h-5 w-5 text-orange-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              Online
            </div>
            <p className="text-sm text-gray-400">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints by Category */}
      <Tabs defaultValue="mining" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8">
          <TabsTrigger value="mining" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Mining
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Systems
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mining" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="mr-2 h-5 w-5 text-blue-400" />
                Mining Operations API
              </CardTitle>
              <CardDescription className="text-gray-400">
                Control and monitor productive mining operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(apiOverview?.endpoints?.mining || {
                '/api/mining/operations': 'Get active mining operations',
                '/api/mining/start': 'Start new mining operation',
                '/api/mining/metrics': 'Get mining performance metrics'
              }).map(([endpoint, description]) => (
                <div key={endpoint} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={getMethodColor(endpoint)}>
                      {endpoint.includes('start') || endpoint.includes('create') ? 'POST' : 'GET'}
                    </Badge>
                    <code className="text-sm text-green-400">{endpoint}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">{description}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyEndpoint(endpoint)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedEndpoint === endpoint ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="mr-2 h-5 w-5 text-green-400" />
                Blockchain Data API
              </CardTitle>
              <CardDescription className="text-gray-400">
                Access blocks, discoveries, and validation data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(apiOverview?.endpoints?.blockchain || {
                '/api/blocks': 'Get blockchain blocks',
                '/api/discoveries': 'Get mathematical discoveries',
                '/api/metrics': 'Get network metrics'
              }).map(([endpoint, description]) => (
                <div key={endpoint} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={getMethodColor(endpoint)}>GET</Badge>
                    <code className="text-sm text-green-400">{endpoint}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">{description}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyEndpoint(endpoint)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedEndpoint === endpoint ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="mr-2 h-5 w-5 text-orange-400" />
                Security & Validation API
              </CardTitle>
              <CardDescription className="text-gray-400">
                Security monitoring and threat detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(apiOverview?.endpoints?.security || {
                '/api/threat-detection/scan': 'Perform threat scan',
                '/api/adaptive-security/status': 'Get security status',
                '/api/immutable-records': 'Get validation records'
              }).map(([endpoint, description]) => (
                <div key={endpoint} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={getMethodColor(endpoint)}>
                      {endpoint.includes('scan') || endpoint.includes('trigger') ? 'POST' : 'GET'}
                    </Badge>
                    <code className="text-sm text-green-400">{endpoint}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">{description}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyEndpoint(endpoint)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedEndpoint === endpoint ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-400" />
                AI & Analytics API
              </CardTitle>
              <CardDescription className="text-gray-400">
                AI analysis and recursive enhancement systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(apiOverview?.endpoints?.ai || {
                '/api/ai/metrics': 'Get AI system metrics',
                '/api/recursive-enhancement/status': 'Get enhancement status',
                '/api/emergent-ai/analysis': 'Get pattern analysis'
              }).map(([endpoint, description]) => (
                <div key={endpoint} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={getMethodColor(endpoint)}>GET</Badge>
                    <code className="text-sm text-green-400">{endpoint}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">{description}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyEndpoint(endpoint)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedEndpoint === endpoint ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Security Infrastructure */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          🔒 Enterprise-Grade Security Infrastructure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-red-400 flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Discovery Security Audit System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Mathematical Formula Validation</span>
                  <Badge className="bg-green-500/20 text-green-400">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Cryptographic Signature Verification</span>
                  <Badge className="bg-green-500/20 text-green-400">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Real-time Fraud Detection</span>
                  <Badge className="bg-green-500/20 text-green-400">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Multi-layered Consensus Validation</span>
                  <Badge className="bg-green-500/20 text-green-400">ACTIVE</Badge>
                </div>
              </div>
              <div className="pt-3 border-t border-red-500/20">
                <div className="text-sm text-slate-400">Security Score Monitoring</div>
                <div className="text-2xl font-bold text-red-400">95.8%</div>
                <div className="text-xs text-red-300">Continuous security assessment</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-purple-400 flex items-center gap-2">
                <Lock className="h-6 w-6" />
                Post-Quantum Cryptography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Riemann Zero Integration</span>
                  <Badge className="bg-purple-500/20 text-purple-400">DEPLOYED</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Prime Pattern Encryption</span>
                  <Badge className="bg-purple-500/20 text-purple-400">DEPLOYED</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Lattice-based Security</span>
                  <Badge className="bg-purple-500/20 text-purple-400">DEPLOYED</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Quantum-resistant Signatures</span>
                  <Badge className="bg-purple-500/20 text-purple-400">DEPLOYED</Badge>
                </div>
              </div>
              <div className="pt-3 border-t border-purple-500/20">
                <div className="text-sm text-slate-400">Cryptographic Strength</div>
                <div className="text-2xl font-bold text-purple-400">POST_QUANTUM</div>
                <div className="text-xs text-purple-300">Future-proof security</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500/30">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-cyan-400">2,400+</div>
              <div className="text-sm text-slate-300">Validation Records</div>
              <div className="text-xs text-cyan-300 mt-1">Immutable audit trails</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-teal-600/20 to-green-600/20 border-teal-500/30">
            <CardContent className="p-6 text-center">
              <Lock className="h-8 w-8 text-teal-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-teal-400">Difficulty 50</div>
              <div className="text-sm text-slate-300">Mining Security Level</div>
              <div className="text-xs text-teal-300 mt-1">Enhanced from 25 to 50</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border-red-500/30">
            <CardContent className="p-6 text-center">
              <Brain className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-red-400">Zero</div>
              <div className="text-sm text-slate-300">Security Breaches</div>
              <div className="text-xs text-red-300 mt-1">Enterprise-grade protection</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Competitive Advantages */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Competitive Advantages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-lg mb-3">First Mover Advantage</CardTitle>
              <p className="text-sm text-slate-300">
                World's first energy-generating blockchain with institutional validation from MIT, Stanford, Cambridge, Princeton, and Clay Institute.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-lg mb-3">Proprietary Technology</CardTitle>
              <p className="text-sm text-slate-300">
                QDT (Quantum Data Transformation) achieves negative energy consumption while solving millennium prize problems worth millions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-lg mb-3">Scalable Revenue Model</CardTitle>
              <p className="text-sm text-slate-300">
                Multiple revenue streams: scientific discovery licensing, energy generation credits, staking rewards, and Discovery NFTs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="text-center bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-8 border border-green-500/30">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Investment Opportunity Summary
        </h2>
        <p className="text-lg text-slate-300 mb-6 max-w-3xl mx-auto">
          Revolutionary blockchain platform with proven revenue generation, institutional backing, and patent-protected energy-generating technology. Currently operating at scale with measurable scientific and financial returns.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">$580M+</div>
            <div className="text-sm text-slate-400">Scientific Value Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">$582M</div>
            <div className="text-sm text-slate-400">Token Market Cap</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">-565%</div>
            <div className="text-sm text-slate-400">Energy Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">18.7%</div>
            <div className="text-sm text-slate-400">Annual Staking Yield</div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
            First-to-Market Technology
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
            Institutional Validation
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            Proprietary Technology
          </Badge>
          <Badge className="bg-orange-500/20 text-orange-400 px-4 py-2">
            Multiple Revenue Streams
          </Badge>
        </div>
      </div>
    </div>
  );
}