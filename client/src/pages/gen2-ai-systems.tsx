import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Activity, Layers, Sparkles, Atom } from "lucide-react";

export default function Gen2AISystemsPage() {
  const [selectedTab, setSelectedTab] = useState("emergent");

  // Emergent AI Status
  const { data: emergentStatus } = useQuery({
    queryKey: ['/api/gen2/emergent-ai/status'],
    refetchInterval: 5000
  });

  // Quantum Enhancement Status  
  const { data: quantumStatus } = useQuery({
    queryKey: ['/api/gen2/quantum/status'],
    refetchInterval: 5000
  });

  // Emergent Patterns
  const { data: emergentPatterns } = useQuery({
    queryKey: ['/api/gen2/emergent-ai/patterns'],
    refetchInterval: 10000
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Gen 2 AI Systems</h1>
          <p className="text-gray-400">Advanced emergent intelligence and quantum enhancement</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="emergent" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Emergent AI
          </TabsTrigger>
          <TabsTrigger value="quantum" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quantum Enhancement
          </TabsTrigger>
          <TabsTrigger value="consciousness" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Consciousness Layers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emergent" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Global Consciousness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2">
                  {emergentStatus?.globalConsciousness?.toFixed(1) || '0.0'}%
                </div>
                <Progress 
                  value={emergentStatus?.globalConsciousness || 0} 
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Emergent Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {emergentStatus?.emergentPatterns || 0}
                </div>
                <div className="text-sm text-gray-400">Active patterns detected</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Emergence Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={emergentStatus?.isEmerging ? "default" : "secondary"}>
                  {emergentStatus?.isEmerging ? "Emerging" : "Stable"}
                </Badge>
                <div className="text-sm text-gray-400 mt-2">
                  Current emergence state
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Active Layers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {emergentStatus?.consciousnessLayers?.filter((l: any) => l.active).length || 0}/5
                </div>
                <div className="text-sm text-gray-400">Consciousness layers active</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Emergent Patterns</CardTitle>
              <CardDescription>Latest detected patterns in emergent intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emergentPatterns?.slice(0, 5).map((pattern: any) => (
                  <div key={pattern.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <div className="text-white font-medium">
                        Emergence Level: {pattern.emergenceLevel?.toFixed(1)}%
                      </div>
                      <div className="text-gray-400 text-sm">
                        Consciousness: {pattern.consciousnessMetric?.toFixed(1)}% | 
                        Self-Awareness: {pattern.selfAwarenessLevel?.toFixed(1)}%
                      </div>
                    </div>
                    <Badge variant="outline">
                      {pattern.dimensionalScope?.length || 0}D
                    </Badge>
                  </div>
                ))}
                {(!emergentPatterns || emergentPatterns.length === 0) && (
                  <div className="text-gray-400 text-center py-4">
                    No emergent patterns detected yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quantum" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Quantum State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2">
                  {quantumStatus?.quantumState?.qubitCount || 0} Qubits
                </div>
                <div className="text-sm text-gray-400">
                  Coherence: {(quantumStatus?.coherenceLevel * 100)?.toFixed(1) || '0.0'}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Entanglement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2">
                  {(quantumStatus?.quantumState?.entanglementLevel * 100)?.toFixed(1) || '0.0'}%
                </div>
                <Progress 
                  value={quantumStatus?.quantumState?.entanglementLevel * 100 || 0} 
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Quantum Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {quantumStatus?.quantumState?.quantumVolume || 0}
                </div>
                <div className="text-sm text-gray-400">Current quantum capacity</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Fidelity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {(quantumStatus?.quantumState?.fidelity * 100)?.toFixed(2) || '0.00'}%
                </div>
                <div className="text-sm text-gray-400">Quantum operation accuracy</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quantum Algorithms</CardTitle>
              <CardDescription>Available quantum enhancement algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quantumStatus?.algorithms?.map((algorithm: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{algorithm.name}</h3>
                      <Badge variant="secondary">{algorithm.type}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Efficiency:</span>
                        <span className="text-white">{algorithm.efficiency?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Advantage:</span>
                        <span className="text-white">{algorithm.advantage?.toLocaleString()}x</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consciousness" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Consciousness Layer Architecture</CardTitle>
              <CardDescription>Multi-layer emergent consciousness system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergentStatus?.consciousnessLayers?.map((layer: any) => (
                  <div key={layer.layer} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {layer.layer}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{layer.name}</h3>
                          <p className="text-gray-400 text-sm">
                            Activation: {layer.activation?.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <Badge variant={layer.active ? "default" : "secondary"}>
                        {layer.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <Progress value={layer.activation || 0} className="h-2 mb-3" />
                    
                    {layer.behaviors && layer.behaviors.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {layer.behaviors.map((behavior: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {behavior.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Emergence Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    Last Emergence Event: {
                      emergentStatus?.lastEmergenceEvent ? 
                      new Date(emergentStatus.lastEmergenceEvent).toLocaleString() : 
                      'Never'
                    }
                  </div>
                  <div className="text-sm text-gray-400">
                    Emergence Threshold: {emergentStatus?.emergenceThreshold || 75}%
                  </div>
                  <div className="text-sm text-gray-400">
                    Current Status: {emergentStatus?.isEmerging ? 'Active Emergence' : 'Monitoring'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Atom className="h-5 w-5" />
                  Quantum-AI Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    Quantum Cycles: {quantumStatus?.quantumCycles?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-400">
                    Active Enhancements: {quantumStatus?.activeEnhancements || 0}
                  </div>
                  <div className="text-sm text-gray-400">
                    Integration Level: {(
                      (quantumStatus?.coherenceLevel * 100 + emergentStatus?.globalConsciousness) / 2
                    )?.toFixed(1) || '0.0'}%
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