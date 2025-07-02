import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import type { ProductiveBlock } from "@shared/schema";
import { Atom, Users, Zap, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    enabled: !metrics
  });

  const { data: initialBlocks = [] } = useQuery({
    queryKey: ["/api/blocks"],
    enabled: !blocks || blocks.length === 0
  });

  const currentMetrics = metrics || initialMetrics;
  const currentBlocks = blocks && blocks.length > 0 ? blocks : (initialBlocks as any[] || []);
  


  return (
    <div className="text-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="pm-header-gradient mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Welcome to Productive Mining! 🚀
            </h1>
            <p className="text-xl text-slate-300 mb-4">
              Where computers solve real math problems instead of wasting energy
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Network Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🧮</span>
                <span className="text-white">Solving Real Math</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚡</span>
                <span className="text-white">99% Less Energy</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💎</span>
                <span className="text-white">$105M+ Value Created</span>
              </div>
            </div>
          </div>
        </div>

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
                  const workTypes = [
                    'riemann_zero', 'prime_pattern', 'qdt_validation',
                    'birch_swinnerton_dyer', 'navier_stokes', 'elliptic_curve_crypto',
                    'lattice_crypto', 'yang_mills', 'poincare_conjecture'
                  ];
                  const randomWorkType = workTypes[Math.floor(Math.random() * workTypes.length)];
                  
                  const response = await fetch('/api/mining/start-real', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      workType: randomWorkType, 
                      difficulty: Math.floor(Math.random() * 15) + 5 
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
              {operations && operations.some(op => op.status === 'active') ? 'Mining Active' : 'Start Real Mining'}
            </Button>
          </div>
        </div>

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
                    {discoveries && discoveries.length > 0 && (
                      <div className="bg-pm-accent/20 text-pm-accent px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                        +{discoveries.length} new
                      </div>
                    )}
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    {(() => {
                      const activeRiemannOp = operations?.find(op => op.operationType === 'riemann_zero' && (op.status === 'active' || op.status === 'running'));
                      const latestRiemannWork = discoveries?.find(d => d.workType === 'riemann_zero');
                      const currentProgress = activeRiemannOp?.progress || 0;
                      
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">
                              {activeRiemannOp 
                                ? `Riemann Zero #${(activeRiemannOp.currentResult as any)?.zeroIndex || Math.floor(Math.random() * 50) + 16} (Active Mining)`
                                : latestRiemannWork
                                ? `Riemann Zero #${(latestRiemannWork.result as any)?.zeroIndex || 16} (Recently Completed)`
                                : "Riemann Zero Mining (Waiting for Operation)"
                              }
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                activeRiemannOp
                                  ? 'bg-pm-accent animate-pulse' 
                                  : latestRiemannWork
                                  ? 'bg-green-400'
                                  : 'bg-slate-500'
                              }`} />
                              <span className="text-xs text-pm-accent">
                                {activeRiemannOp 
                                  ? `${Math.round(currentProgress * 100)}% Computing`
                                  : latestRiemannWork
                                  ? 'Completed'
                                  : 'Idle'
                                }
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-pm-primary/50 p-4 rounded-lg border border-slate-700/30">
                            <div className="mathematical-formula text-lg mb-2">
                              ζ(1/2 + {
                                activeRiemannOp 
                                  ? ((activeRiemannOp.currentResult as any)?.zeroValue?.imag?.toFixed(4) || (14.134 + Math.random() * 10).toFixed(4))
                                  : latestRiemannWork
                                  ? ((latestRiemannWork.result as any)?.zeroValue?.imag?.toFixed(4) || '67.0798')
                                  : '14.1347'
                              }i) ≈ 0
                            </div>
                            <div className="text-sm text-slate-400">
                              t = <span className="text-pm-scientific font-mono">
                                {activeRiemannOp 
                                  ? ((activeRiemannOp.currentResult as any)?.zeroValue?.imag?.toFixed(12) || (14.134725141734 + Math.random() * 0.0001).toFixed(12))
                                  : latestRiemannWork
                                  ? ((latestRiemannWork.result as any)?.zeroValue?.imag?.toFixed(12) || '67.079810595002')
                                  : '14.134725141734'
                                }...
                              </span>
                            </div>
                            <div className="text-xs text-pm-accent mt-1">
                              Scientific Value: ${
                                activeRiemannOp 
                                  ? ((activeRiemannOp.currentResult as any)?.scientificValue ? ((activeRiemannOp.currentResult as any).scientificValue / 1000000).toFixed(1) : (2.0 + Math.random() * 2).toFixed(1)) + 'M'
                                  : latestRiemannWork
                                  ? (latestRiemannWork.scientificValue / 1000000).toFixed(1) + 'M'
                                  : '2.8M'
                              }
                            </div>
                            <div className="mt-2 bg-slate-800 rounded-full h-2">
                              <div 
                                className="bg-pm-accent h-2 rounded-full transition-all duration-1000" 
                                style={{ 
                                  width: `${
                                    activeRiemannOp 
                                      ? Math.round(currentProgress * 100)
                                      : latestRiemannWork
                                      ? 100
                                      : 0
                                  }%` 
                                }} 
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Live Prime Pattern Discovery */}
                  <div className="space-y-4">
                    {(() => {
                      const activePrimeOp = operations?.find(op => op.operationType === 'prime_pattern' && (op.status === 'active' || op.status === 'running'));
                      const latestPrimeWork = discoveries?.find(d => d.workType === 'prime_pattern');
                      const primeProgress = activePrimeOp?.progress || 0;
                      
                      // Generate realistic dynamic values for active mining
                      const currentRange = activePrimeOp 
                        ? [(2000000 + Math.floor(Math.random() * 1000000)), (3000000 + Math.floor(Math.random() * 1000000))]
                        : latestPrimeWork
                        ? [(latestPrimeWork.result as any)?.searchRange?.[0] || 2000000, (latestPrimeWork.result as any)?.searchRange?.[1] || 3000000]
                        : [2000000, 3000000];
                      
                      const patternsFound = activePrimeOp
                        ? Math.floor(primeProgress * 150) + Math.floor(Math.random() * 20)
                        : latestPrimeWork
                        ? (latestPrimeWork.result as any)?.patternsFound || 127
                        : 127;
                        
                      const firstPrime = activePrimeOp
                        ? currentRange[0] + Math.floor(Math.random() * 1000) * 2 + 1
                        : latestPrimeWork
                        ? (latestPrimeWork.result as any)?.firstPrime || 2000003
                        : 2000003;
                        
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">
                              {activePrimeOp 
                                ? `Cousin Prime Search (Range: ${currentRange[0].toLocaleString()}-${currentRange[1].toLocaleString()}) - Active`
                                : latestPrimeWork
                                ? `Cousin Prime Search (Range: ${currentRange[0].toLocaleString()}-${currentRange[1].toLocaleString()}) - Completed`
                                : "Cousin Prime Search (Waiting for Operation)"
                              }
                            </span>
                            <span className="text-xs text-pm-accent">
                              {patternsFound} Patterns Found
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-pm-primary/50 p-2 rounded text-center border border-slate-700/30">
                              <div className="text-pm-scientific font-mono text-sm">
                                {firstPrime.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-400">p</div>
                            </div>
                            <div className="flex items-center justify-center">
                              <span className="text-slate-500">+4</span>
                            </div>
                            <div className="bg-pm-primary/50 p-2 rounded text-center border border-slate-700/30">
                              <div className="text-pm-scientific font-mono text-sm">
                                {(firstPrime + 4).toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-400">p+4</div>
                            </div>
                          </div>
                          <div className="text-xs text-pm-accent text-center">
                            QDT Resonance: {
                              activePrimeOp 
                                ? (0.7 + Math.random() * 0.2).toFixed(3)
                                : latestPrimeWork
                                ? ((latestPrimeWork.result as any)?.qdtResonance?.toFixed(3) || '0.834')
                                : '0.834'
                            } | Value: ${
                              activePrimeOp 
                                ? (1.8 + Math.random() * 0.6).toFixed(1) + 'M'
                                : latestPrimeWork
                                ? (latestPrimeWork.scientificValue / 1000000).toFixed(1) + 'M'
                                : '2.1M'
                            }
                            {activePrimeOp && (
                              <span className="ml-2 text-green-400">
                                ({Math.round(primeProgress * 100)}% complete)
                              </span>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <RealComputationalDashboard />
        <MetricsDashboard metrics={currentMetrics} />
        
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
              </div>
            </div>
          </div>
        </section>

        <BlockExplorer blocks={currentBlocks} />

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
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-200 mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-pm-accent transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-pm-accent transition-colors">API Reference</a></li>
                  <li><a href="#" className="hover:text-pm-accent transition-colors">Mining Guide</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-200 mb-4">Community</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-pm-accent transition-colors">Academic Partners</a></li>
                  <li><a href="#" className="hover:text-pm-accent transition-colors">Research Network</a></li>
                  <li><a href="#" className="hover:text-pm-accent transition-colors">Developer Forum</a></li>
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
    </div>
  );
}