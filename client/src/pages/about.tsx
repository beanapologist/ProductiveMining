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
    refetchInterval: 120000,
    staleTime: 60000,
  });

  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['/api/health'],
    refetchInterval: 60000,
    staleTime: 30000,
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

      {/* Technical Specifications */}
      <Card className="bg-slate-800 border-slate-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="mr-2 h-5 w-5 text-gray-400" />
            Technical Specifications
          </CardTitle>
          <CardDescription className="text-gray-400">
            Platform architecture and performance details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Core Technology</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Backend Framework:</span>
                  <span className="text-white">Node.js + Express</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Database:</span>
                  <span className="text-white">PostgreSQL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Real-time:</span>
                  <span className="text-white">WebSocket</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Authentication:</span>
                  <span className="text-white">JWT + Session</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Response Time:</span>
                  <span className="text-green-400">&lt; 200ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uptime:</span>
                  <span className="text-green-400">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rate Limit:</span>
                  <span className="text-white">1000/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Concurrent Users:</span>
                  <span className="text-white">10,000+</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Features */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="mr-2 h-5 w-5 text-blue-400" />
            Platform Features
          </CardTitle>
          <CardDescription className="text-gray-400">
            Core features available through API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(apiOverview?.systemStats?.features || [
              'Real-time Mining Operations',
              'Mathematical Discovery Analysis',
              'Blockchain Data Access',
              'Security Threat Detection',
              'AI Pattern Recognition',
              'Validation Records',
              'Token Economics',
              'WebSocket Streaming'
            ]).map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-white">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}