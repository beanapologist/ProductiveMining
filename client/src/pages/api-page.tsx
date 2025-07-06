import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Database, Brain, Shield, Zap, Settings, TrendingUp, FileCode, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

export default function ApiPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Endpoints</p>
                <p className="text-2xl font-bold text-white">
                  {apiOverview?.systemStats?.totalEndpoints || 0}
                </p>
              </div>
              <FileCode className="w-6 h-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-white">
                  {apiOverview?.systemStats?.categories || 0}
                </p>
              </div>
              <Database className="w-6 h-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Features</p>
                <p className="text-2xl font-bold text-white">
                  {apiOverview?.systemStats?.features?.length || 0}
                </p>
              </div>
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="text-sm font-medium text-white">
                  {apiOverview?.systemStats?.lastUpdated 
                    ? new Date(apiOverview.systemStats.lastUpdated).toLocaleTimeString()
                    : 'Live'
                  }
                </p>
              </div>
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="features">System Features</TabsTrigger>
          <TabsTrigger value="testing">API Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apiOverview?.endpoints && Object.entries(apiOverview.endpoints).map(([category, endpoints]) => (
              <Card key={category} className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-white">
                    {getCategoryIcon(category)}
                    <span className="capitalize">{category}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {Object.keys(endpoints).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(endpoints).map(([name, endpoint]) => (
                    <div key={name} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getMethodColor(endpoint)}`}></div>
                        <div>
                          <p className="text-sm font-medium text-white">{name}</p>
                          <p className="text-xs text-gray-400">{endpoint}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyEndpoint(endpoint)}
                        className="text-gray-400 hover:text-white"
                      >
                        {copiedEndpoint === endpoint ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Platform Features</CardTitle>
              <p className="text-gray-400">
                Comprehensive features available through the API
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apiOverview?.systemStats?.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700 rounded">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">API Testing Tools</CardTitle>
              <p className="text-gray-400">
                Test API endpoints directly from this interface
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => window.open('/api/overview', '_blank')}
                  className="justify-start"
                >
                  <FileCode className="w-4 h-4 mr-2" />
                  Test API Overview
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('/api/health', '_blank')}
                  className="justify-start"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Test System Health
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('/api/mining/operations', '_blank')}
                  className="justify-start"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Test Mining Operations
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('/api/discoveries', '_blank')}
                  className="justify-start"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Test Discoveries API
                </Button>
              </div>
              
              <div className="bg-slate-700 p-4 rounded">
                <h4 className="font-medium text-white mb-2">API Base URL</h4>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-slate-600 p-2 rounded text-sm text-gray-300">
                    {window.location.origin}/api
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyEndpoint('/api')}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}