import { useEffect } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import { Atom, Users, Zap, Leaf, Database, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import MetricsDashboard from "@/components/metrics-dashboard";
import MiningOperations from "@/components/mining-operations";
import BlockExplorer from "@/components/block-explorer";
import MiningSimulator from "@/components/mining-simulator";
import EducationalSection from "@/components/educational-section";
import RealComputationalDashboard from "@/components/real-computational-dashboard";

export default function Dashboard() {
  const { 
    isConnected, 
    metrics, 
    operations, 
    blocks,
    discoveries 
  } = useWebSocket();

  const { data: initialMetrics } = useQuery({
    queryKey: ["/api/metrics"],
    enabled: !metrics // Only fetch if WebSocket hasn't provided data
  });

  const currentMetrics = metrics || initialMetrics;

  return (
    <div className="text-slate-100">
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-slate-400">Real-time mathematical blockchain network overview</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-pm-accent animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-sm text-slate-300">
                {isConnected ? 'Live Mining' : 'Connecting...'}
              </span>
            </div>
            
            <Badge variant="outline" className="border-pm-accent text-pm-accent">
              Network Health: {currentMetrics ? (currentMetrics.networkHealth * 100).toFixed(1) : '99.8'}%
            </Badge>
            
            <Button 
              className="bg-pm-accent hover:bg-pm-accent/80 text-pm-primary"
              onClick={async () => {
                try {
                  const response = await fetch('/api/mining/start-real', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      workType: 'riemann_zero', 
                      difficulty: 10 
                    })
                  });
                  
                  if (response.ok) {
                    const operation = await response.json();
                    console.log('Real mining started:', operation);
                  }
                } catch (error) {
                  console.error('Failed to start mining:', error);
                }
              }}
            >
              Start Real Mining
            </Button>
          </div>
        </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pm-scientific/10 via-pm-primary to-pm-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-pm-accent/10 text-pm-accent border-pm-accent/20">
                  <Leaf className="w-4 h-4 mr-1" />
                  1000x More Energy Efficient
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Mining That{" "}
                  <span className="text-pm-accent">Advances</span>
                  <br />
                  <span className="mathematical-formula text-5xl lg:text-7xl">Science</span>
                </h1>
                
                <p className="text-xl text-slate-300 leading-relaxed">
                  Replace Bitcoin's wasteful SHA-256 with productive mathematical computations. 
                  Mine Riemann zeros, discover prime patterns, and validate quantum theories 
                  while securing the blockchain.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-pm-accent hover:bg-pm-accent/80 text-pm-primary">
                  Start Mining Demo
                </Button>
                <Button size="lg" variant="outline" className="border-slate-600 hover:border-slate-500">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 scientific-glow">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Zap className="text-pm-scientific h-5 w-5" />
                  <span>Live Mathematical Mining</span>
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Riemann Zero #16 (Clay Institute)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pm-accent rounded-full mining-pulse" />
                      <span className="text-xs text-pm-accent">Computing</span>
                    </div>
                  </div>
                  
                  <div className="bg-pm-primary/50 p-4 rounded-lg border border-slate-700/30">
                    <div className="mathematical-formula text-lg mb-2">
                      ζ(1/2 + 67.0798i) ≈ 0
                    </div>
                    <div className="text-sm text-slate-400">
                      t = <span className="text-pm-scientific font-mono">67.0798105950026142...</span>
                    </div>
                    <div className="text-xs text-pm-accent mt-1">Scientific Value: $2.8M</div>
                    <div className="mt-2 bg-slate-800 rounded-full h-2">
                      <div className="bg-pm-accent h-2 rounded-full transition-all duration-1000" style={{ width: '91%' }} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Cousin Prime Search (Range: 2M-3M)</span>
                    <span className="text-xs text-pm-accent">127 Patterns Found</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-pm-primary/50 p-2 rounded text-center border border-slate-700/30">
                      <div className="text-pm-scientific font-mono text-sm">2000003</div>
                      <div className="text-xs text-slate-400">p</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-slate-500">+4</span>
                    </div>
                    <div className="bg-pm-primary/50 p-2 rounded text-center border border-slate-700/30">
                      <div className="text-pm-scientific font-mono text-sm">2000007</div>
                      <div className="text-xs text-slate-400">p+4</div>
                    </div>
                  </div>
                  <div className="text-xs text-pm-accent text-center">QDT Resonance: 0.834 | Value: $2.1M</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Computational Findings Dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Real Mathematical <span className="text-pm-accent">Computational</span> Results
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Authentic mathematical computations and verified research results stored immutably on the blockchain.
          </p>
        </div>
        
        <RealComputationalDashboard />
      </section>

      {/* Traditional Metrics Dashboard */}
      <MetricsDashboard metrics={currentMetrics} />

      {/* Mining Operations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MiningOperations operations={operations} discoveries={discoveries} />
          </div>
          
          <div className="space-y-6">
            <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Zap className="text-pm-warning h-5 w-5" />
                <span>Energy Efficiency</span>
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-300">Productive Mining</span>
                    <span className="text-sm font-medium text-pm-accent">98.7% efficient</span>
                  </div>
                  <div className="bg-slate-800 rounded-full h-3">
                    <div className="bg-pm-accent h-3 rounded-full" style={{ width: '98.7%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-300">Traditional Bitcoin</span>
                    <span className="text-sm font-medium text-red-400">0.08% efficient</span>
                  </div>
                  <div className="bg-slate-800 rounded-full h-3">
                    <div className="bg-red-400 h-3 rounded-full" style={{ width: '0.08%' }} />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="bg-pm-primary/30 p-4 rounded-lg border border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Power Consumption</span>
                    <span className="text-lg font-semibold text-pm-accent">2.4 MW</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">vs Bitcoin: 150,000 MW</div>
                </div>
                
                <div className="bg-pm-primary/30 p-4 rounded-lg border border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">CO₂ Saved Today</span>
                    <span className="text-lg font-semibold text-pm-accent">
                      {currentMetrics ? Math.round(currentMetrics.co2Saved) : '847'} tons
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Equivalent to 1,823 cars off road</div>
                </div>
                
                <div className="bg-pm-primary/30 p-4 rounded-lg border border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Scientific Value/kWh</span>
                    <span className="text-lg font-semibold text-pm-scientific">$1,247</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Research contribution per energy unit</div>
                </div>
              </div>
            </div>
            
            <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Users className="text-red-400 h-5 w-5" />
                <span>Network Health</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Academic Validators</span>
                  <span className="text-sm font-medium text-pm-accent">247 online</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Peer Review Speed</span>
                  <span className="text-sm font-medium text-pm-scientific">4.2 min avg</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Fraud Detection</span>
                  <span className="text-sm font-medium text-pm-accent">99.97%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Mathematical Accuracy</span>
                  <span className="text-sm font-medium text-pm-accent">100%</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-pm-accent/10 border border-pm-accent/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-pm-accent">Security Status</span>
                </div>
                <p className="text-xs text-slate-300">
                  All mathematical proofs verified by institutional validators. 
                  Network protected by cryptographic signatures and academic consensus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BlockExplorer blocks={blocks} />
      <MiningSimulator />
      <EducationalSection />

      <footer className="bg-pm-primary border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-pm-accent/20 p-2 rounded-lg">
                  <Atom className="text-pm-accent h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Productive Mining</h3>
                  <p className="text-xs text-slate-400">Scientific Blockchain</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Revolutionizing blockchain technology by replacing computational waste 
                with meaningful scientific discoveries.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-200 mb-4">Technology</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-pm-accent transition-colors">Riemann Mining</a></li>
                <li><a href="#" className="hover:text-pm-accent transition-colors">Prime Discovery</a></li>
                <li><a href="#" className="hover:text-pm-accent transition-colors">QDT Validation</a></li>
                <li><a href="#" className="hover:text-pm-accent transition-colors">Memory Optimization</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-200 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-pm-accent transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-pm-accent transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-pm-accent transition-colors">Mining Guide</a></li>
                <li><a href="#" className="hover:text-pm-accent transition-colors">Validation Tools</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-200 mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-pm-accent transition-colors">Academic Partners</a></li>
                <li><a href="#" className="hover:text-pm-accent transition-colors">Research Network</a></li>
                <li><a href="#" className="hover:text-pm-accent transition-colors">Developer Forum</a></li>
                <li><a href="#" className="hover:text-pm-accent transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-400 mb-4 md:mb-0">
              © 2024 Productive Mining Protocol. Advancing science through blockchain.
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-pm-accent animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-slate-400">Network Status:</span>
                <span className="text-pm-accent">{isConnected ? 'Operational' : 'Connecting'}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}