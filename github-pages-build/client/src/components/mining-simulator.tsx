import { useState } from "react";
import { Flame, Brain, Play, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MiningSimulator() {
  const [traditionalMining, setTraditionalMining] = useState(false);
  const [productiveMining, setProductiveMining] = useState(false);
  const [traditionalProgress, setTraditionalProgress] = useState(0);
  const [productiveProgress, setProductiveProgress] = useState(0);

  const startTraditionalMining = () => {
    if (traditionalMining) return;
    
    setTraditionalMining(true);
    setTraditionalProgress(0);

    const interval = setInterval(() => {
      setTraditionalProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTraditionalMining(false);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 100);
  };

  const startProductiveMining = () => {
    if (productiveMining) return;
    
    setProductiveMining(true);
    setProductiveProgress(0);

    const interval = setInterval(() => {
      setProductiveProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProductiveMining(false);
          return 100;
        }
        return prev + Math.random() * 4;
      });
    }, 120);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Interactive <span className="text-pm-accent">Mining Simulator</span>
        </h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Experience productive mining firsthand. Compare traditional SHA-256 waste with mathematical discovery mining.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Traditional Mining (Left) */}
        <Card className="bg-pm-secondary/50 backdrop-blur border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-red-400">
              <div className="bg-red-500/20 p-3 rounded-lg">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl">Traditional Bitcoin Mining</div>
                <div className="text-sm text-slate-400 font-normal">SHA-256 hash computation</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wasteful Computation Display */}
            <div className="bg-pm-primary/50 p-4 rounded-lg border border-red-500/20">
              <div className="text-center mb-4">
                <div className="text-2xl font-mono text-red-400 mb-2">
                  {traditionalMining ? (
                    <>0000000000000000000{Math.random().toString(36).substr(2, 8)}...</>
                  ) : (
                    "0000000000000000000847a2..."
                  )}
                </div>
                <div className="text-sm text-slate-400">Meaningless hash result</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Hash Rate:</span>
                  <span className="text-red-400 font-mono">120.5 TH/s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Power Consumption:</span>
                  <span className="text-red-400 font-mono">3,250 W</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Scientific Value:</span>
                  <span className="text-red-400 font-mono">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">CO₂ per Hour:</span>
                  <span className="text-red-400 font-mono">2.4 kg</span>
                </div>
              </div>
            </div>

            {traditionalMining && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mining Progress</span>
                  <span>{Math.round(traditionalProgress)}%</span>
                </div>
                <Progress value={traditionalProgress} className="bg-slate-800" />
              </div>
            )}
            
            {/* Start Traditional Mining Button */}
            <Button 
              onClick={startTraditionalMining}
              disabled={traditionalMining}
              className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400"
              variant="outline"
            >
              {traditionalMining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 mr-2" />
                  Mining...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Wasteful Mining
                </>
              )}
            </Button>
            
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-red-300 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <span>This mining produces no scientific value and wastes enormous amounts of energy</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Productive Mining (Right) */}
        <Card className="bg-pm-secondary/50 backdrop-blur border-pm-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-pm-accent">
              <div className="bg-pm-accent/20 p-3 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl">Productive Scientific Mining</div>
                <div className="text-sm text-slate-400 font-normal">Mathematical discovery computation</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Productive Computation Display */}
            <div className="bg-pm-primary/50 p-4 rounded-lg border border-pm-accent/20">
              <div className="text-center mb-4">
                <div className="mathematical-formula text-xl mb-2">
                  ζ(1/2 + i·14.1347...) ≈ 0
                </div>
                <div className="text-sm text-slate-400">Riemann Hypothesis verification</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Computation Rate:</span>
                  <span className="text-pm-accent font-mono">847 ops/s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Power Consumption:</span>
                  <span className="text-pm-accent font-mono">2.6 W</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Scientific Value:</span>
                  <span className="text-pm-accent font-mono">$1,247/hour</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">CO₂ per Hour:</span>
                  <span className="text-pm-accent font-mono">0.002 kg</span>
                </div>
              </div>
            </div>

            {productiveMining && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Research Progress</span>
                  <span>{Math.round(productiveProgress)}%</span>
                </div>
                <Progress value={productiveProgress} className="bg-slate-800" />
              </div>
            )}
            
            {/* Start Productive Mining Button */}
            <Button 
              onClick={startProductiveMining}
              disabled={productiveMining}
              className="w-full bg-pm-accent hover:bg-pm-accent/80 text-pm-primary"
            >
              {productiveMining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pm-primary mr-2" />
                  Computing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Productive Mining
                </>
              )}
            </Button>
            
            <div className="p-3 bg-pm-accent/10 border border-pm-accent/20 rounded-lg">
              <div className="flex items-center space-x-2 text-pm-accent text-xs">
                <CheckCircle className="h-4 w-4" />
                <span>This mining advances mathematics while using 1000x less energy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Comparison Chart */}
      <div className="mt-12 bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6 text-center">Head-to-Head Comparison</h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">0%</div>
            <div className="text-sm text-slate-400 mb-4">Scientific Value<br />(Traditional)</div>
            <div className="h-32 bg-slate-800 rounded relative overflow-hidden">
              <div className="absolute bottom-0 w-full bg-red-400 rounded transition-all duration-1000" style={{ height: '0%' }} />
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-pm-accent mb-2">1,247x</div>
            <div className="text-sm text-slate-400 mb-4">Energy Efficiency<br />Improvement</div>
            <div className="h-32 bg-slate-800 rounded relative overflow-hidden">
              <div className="absolute bottom-0 w-full bg-pm-accent rounded transition-all duration-1000" style={{ height: '100%' }} />
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-pm-scientific mb-2">∞</div>
            <div className="text-sm text-slate-400 mb-4">Knowledge<br />Creation</div>
            <div className="h-32 bg-slate-800 rounded relative overflow-hidden">
              <div className="absolute bottom-0 w-full bg-pm-scientific rounded transition-all duration-1000" style={{ height: '95%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
