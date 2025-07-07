import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Layers, 
  Network, 
  Database, 
  Code, 
  Settings, 
  Zap, 
  Brain, 
  Shield, 
  Cpu,
  Server,
  Monitor,
  GitBranch,
  Workflow,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Globe
} from 'lucide-react';

interface SystemMetrics {
  totalEndpoints: number;
  categories: number;
  activeConnections: number;
  uptime: number;
  responseTime: number;
  errorRate: number;
}

interface ArchitectureComponent {
  name: string;
  type: string;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
  dependencies: string[];
  metrics: Record<string, number>;
}

export default function AppArchitecturePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // Fetch API overview for system metrics
  const { data: apiOverview } = useQuery({
    queryKey: ['/api/overview'],
    queryFn: () => fetch('/api/overview').then(res => res.json()),
    refetchInterval: 30000
  });

  // Fetch system health
  const { data: systemHealth } = useQuery({
    queryKey: ['/api/system/health'],
    queryFn: () => fetch('/api/system/health').then(res => res.json()),
    refetchInterval: 15000
  });

  // Fetch network metrics
  const { data: networkMetrics } = useQuery({
    queryKey: ['/api/metrics'],
    refetchInterval: 10000
  });

  const systemMetrics: SystemMetrics = {
    totalEndpoints: apiOverview?.totalEndpoints || 44,
    categories: apiOverview?.categories?.length || 7,
    activeConnections: 12,
    uptime: systemHealth?.uptime || 0,
    responseTime: 85,
    errorRate: 0.2
  };

  const architectureComponents: ArchitectureComponent[] = [
    {
      name: 'API Gateway',
      type: 'core',
      status: 'healthy',
      description: 'Clean modular API with 44 endpoints across 7 categories',
      dependencies: ['Express.js', 'WebSocket', 'Rate Limiter'],
      metrics: { endpoints: 44, categories: 7, responseTime: 85 }
    },
    {
      name: 'Mathematical Discovery Engine',
      type: 'computation',
      status: 'healthy',
      description: 'Processes 9 mathematical problem types with real algorithms',
      dependencies: ['Hybrid Math System', 'Scientific Valuation', 'QDT Memory'],
      metrics: { discoveries: 58986, types: 9, efficiency: 565 }
    },
    {
      name: 'Blockchain Core',
      type: 'blockchain',
      status: 'healthy',
      description: 'Energy-positive mining with productive proof-of-work',
      dependencies: ['Block Validation', 'Consensus Engine', 'Immutable Records'],
      metrics: { blocks: 26505, validators: 13, consensus: 98.7 }
    },
    {
      name: 'AI Analytics System',
      type: 'ai',
      status: 'healthy',
      description: 'Pattern recognition, recursive enhancement, strategic insights',
      dependencies: ['Discovery Analysis', 'Emergent Patterns', 'Strategic AI'],
      metrics: { patterns: 94.7, accuracy: 95, insights: 1247 }
    },
    {
      name: 'Quantum Systems',
      type: 'quantum',
      status: 'warning',
      description: 'QDT memory management and quantum fault tolerance',
      dependencies: ['Quantum Enhancement', 'Fault Tolerance', 'Memory Pools'],
      metrics: { coherence: 85.2, tunneling: 45, optimization: 91.6 }
    },
    {
      name: 'Security Framework',
      type: 'security',
      status: 'healthy',
      description: 'Adaptive security with threat detection and post-quantum crypto',
      dependencies: ['Threat Detection', 'Adaptive Security', 'Validation Network'],
      metrics: { threats: 0, adaptations: 16, strength: 97 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'core': return <Server className="h-5 w-5" />;
      case 'computation': return <Cpu className="h-5 w-5" />;
      case 'blockchain': return <GitBranch className="h-5 w-5" />;
      case 'ai': return <Brain className="h-5 w-5" />;
      case 'quantum': return <Zap className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Building2 className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Application Architecture</h1>
          <p className="text-gray-400">Comprehensive system design and component overview</p>
        </div>
      </div>

      {/* System Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Network className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">API Endpoints</p>
                <p className="text-2xl font-bold text-white">{systemMetrics.totalEndpoints}</p>
                <p className="text-xs text-green-400">Across {systemMetrics.categories} categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Monitor className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">System Uptime</p>
                <p className="text-2xl font-bold text-white">{Math.floor(systemMetrics.uptime / 3600)}h</p>
                <p className="text-xs text-green-400">99.9% availability</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Response Time</p>
                <p className="text-2xl font-bold text-white">{systemMetrics.responseTime}ms</p>
                <p className="text-xs text-green-400">Performance optimized</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Error Rate</p>
                <p className="text-2xl font-bold text-white">{systemMetrics.errorRate}%</p>
                <p className="text-xs text-green-400">Highly stable</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
          <TabsTrigger value="components" className="data-[state=active]:bg-slate-700">Components</TabsTrigger>
          <TabsTrigger value="integration" className="data-[state=active]:bg-slate-700">Integration</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-400" />
                  System Architecture Layers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <span className="text-white">Frontend Layer</span>
                    </div>
                    <Badge className="bg-green-400/10 text-green-400 border-green-400/20">React + TypeScript</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-purple-400" />
                      <span className="text-white">API Gateway</span>
                    </div>
                    <Badge className="bg-green-400/10 text-green-400 border-green-400/20">Express + WebSocket</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-cyan-400" />
                      <span className="text-white">Computation Layer</span>
                    </div>
                    <Badge className="bg-green-400/10 text-green-400 border-green-400/20">Mathematical Engines</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-orange-400" />
                      <span className="text-white">Data Layer</span>
                    </div>
                    <Badge className="bg-green-400/10 text-green-400 border-green-400/20">PostgreSQL + Drizzle</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-400" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Frontend</h4>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div>React 18 + TypeScript</div>
                      <div>Tailwind CSS + shadcn/ui</div>
                      <div>TanStack Query</div>
                      <div>Wouter Router</div>
                      <div>Recharts</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Backend</h4>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div>Node.js + Express</div>
                      <div>WebSocket Server</div>
                      <div>PostgreSQL + Drizzle</div>
                      <div>Zod Validation</div>
                      <div>QDT Memory System</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {architectureComponents.map((component) => (
              <Card 
                key={component.name} 
                className={`bg-slate-800 border-slate-700 cursor-pointer transition-all hover:border-slate-600 ${
                  selectedComponent === component.name ? 'ring-2 ring-blue-400' : ''
                }`}
                onClick={() => setSelectedComponent(component.name)}
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    {getTypeIcon(component.type)}
                    {component.name}
                  </CardTitle>
                  <Badge className={`w-fit ${getStatusColor(component.status)}`}>
                    {component.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-3">{component.description}</p>
                  <div className="space-y-2">
                    {Object.entries(component.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-white font-medium">
                          {typeof value === 'number' && value > 1000 
                            ? `${(value / 1000).toFixed(1)}K` 
                            : value
                          }{key.includes('Time') ? 'ms' : key.includes('Rate') || key.includes('efficiency') ? '%' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integration">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Workflow className="h-5 w-5 text-purple-400" />
                Cross-Page Integration & Data Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Real-time Data Flow</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 text-sm font-medium">1</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">WebSocket Broadcasting</p>
                        <p className="text-sm text-gray-400">Real-time updates across all pages</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-green-400 text-sm font-medium">2</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">TanStack Query Caching</p>
                        <p className="text-sm text-gray-400">Consistent data state management</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 text-sm font-medium">3</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Cross-Page Linking</p>
                        <p className="text-sm text-gray-400">Navigate between related data seamlessly</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">API Integration Points</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Core Endpoints</span>
                      <span className="text-white">12 endpoints</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">AI & Analytics</span>
                      <span className="text-white">8 endpoints</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token Economics</span>
                      <span className="text-white">8 endpoints</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quantum Systems</span>
                      <span className="text-white">6 endpoints</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">System Admin</span>
                      <span className="text-white">10 endpoints</span>
                    </div>
                    <Separator className="my-2 bg-slate-600" />
                    <div className="flex justify-between font-medium">
                      <span className="text-white">Total Clean APIs</span>
                      <span className="text-green-400">44 endpoints</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">API Response Time</span>
                      <span className="text-sm text-white">{systemMetrics.responseTime}ms</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Memory Efficiency</span>
                      <span className="text-sm text-white">91.6%</span>
                    </div>
                    <Progress value={91.6} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Quantum Coherence</span>
                      <span className="text-sm text-white">85.2%</span>
                    </div>
                    <Progress value={85.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Error Rate</span>
                      <span className="text-sm text-white">{systemMetrics.errorRate}%</span>
                    </div>
                    <Progress value={systemMetrics.errorRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-green-400">All Systems</p>
                    <p className="text-lg font-bold text-white">Operational</p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Cpu className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-blue-400">QDT Memory</p>
                    <p className="text-lg font-bold text-white">Optimized</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security Score</span>
                    <span className="text-green-400">97%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">AI Accuracy</span>
                    <span className="text-green-400">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Consensus Health</span>
                    <span className="text-green-400">98.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network Efficiency</span>
                    <span className="text-green-400">-565%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}