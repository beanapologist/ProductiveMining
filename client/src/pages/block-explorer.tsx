import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Hash, Layers, Zap, Brain, Calculator, CheckCircle, AlertCircle, Timer } from "lucide-react";
import { useState } from "react";

type Block = {
  id: number;
  index: number;
  timestamp: string;
  previousHash: string;
  blockHash: string;
  merkleRoot: string;
  nonce: number;
  difficulty: number;
  totalScientificValue: number;
  energyConsumed: number;
  knowledgeCreated: number;
  minerId: string;
};

type MathematicalWork = {
  id: number;
  workType: string;
  difficulty: number;
  result: any;
  verificationData: any;
  computationalCost: number;
  energyEfficiency: number;
  scientificValue: number;
  workerId: string;
  signature: string;
  timestamp: string;
};

export default function BlockExplorer() {
  const [selectedWork, setSelectedWork] = useState<MathematicalWork | null>(null);
  const [selectedBlockWork, setSelectedBlockWork] = useState<MathematicalWork[]>([]);

  const { data: blocks, isLoading: blocksLoading } = useQuery<Block[]>({
    queryKey: ["/api/blocks"],
    staleTime: 5000,
  });

  // Fetch work for specific block when clicked
  const fetchBlockWork = async (blockIndex: number) => {
    try {
      const response = await fetch(`/api/blocks/index/${blockIndex}`);
      const data = await response.json();
      setSelectedBlockWork(data.work || []);
    } catch (error) {
      console.error('Failed to fetch block work:', error);
      setSelectedBlockWork([]);
    }
  };

  if (blocksLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">Loading blockchain data...</div>
      </div>
    );
  }

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getWorkTypeLabel = (workType: string) => {
    const labels: { [key: string]: string } = {
      riemann_zero: "Riemann Hypothesis",
      prime_pattern: "Prime Patterns",
      yang_mills: "Yang-Mills",
      navier_stokes: "Navier-Stokes",
      goldbach_verification: "Goldbach Conjecture",
      birch_swinnerton_dyer: "Birch-Swinnerton-Dyer",
      elliptic_curve_crypto: "Elliptic Curve Crypto",
      lattice_crypto: "Lattice Crypto",
      poincare_conjecture: "Poincaré Conjecture"
    };
    return labels[workType] || workType;
  };

  const getVerificationStatus = (work: MathematicalWork) => {
    const verified = work.verificationData?.verified || false;
    const consensusScore = Math.random() * 100; // This would come from actual validation data
    const validators = Math.floor(Math.random() * 5) + 1;
    
    return { verified, consensusScore, validators };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Block Explorer</h1>
        <p className="text-gray-400">Explore productive blocks containing mathematical discoveries</p>
      </div>

      <div className="space-y-4">
        {blocks?.map((block) => {
          
          return (
            <Card key={block.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-400" />
                    Block #{block.index}
                  </CardTitle>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {formatValue(block.totalScientificValue)} Scientific Value
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  Mined {formatTimestamp(block.timestamp)} by {block.minerId}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Block Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-400 flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Block Hash
                    </div>
                    <div className="text-white font-mono text-xs break-all">
                      {block.blockHash.substring(0, 16)}...
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-gray-400 flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Difficulty
                    </div>
                    <div className="text-white">{block.difficulty}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-gray-400 flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      Knowledge Created
                    </div>
                    <div className="text-white">{block.knowledgeCreated} breakthroughs</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Energy Efficiency
                    </div>
                    <div className="text-green-400">{(block.energyConsumed * 100).toFixed(2)}%</div>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* Block Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => fetchBlockWork(block.index)}
                    className="w-full text-left bg-slate-900 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-purple-400" />
                        <span className="text-white font-medium">View Mathematical Discoveries</span>
                      </div>
                      <div className="text-blue-400">→</div>
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      Click to explore the productive mathematical work contained in this block
                    </div>
                  </button>
                  
                  {selectedBlockWork.length > 0 && (
                    <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-600">
                      <h5 className="text-white font-medium mb-3">Mathematical Discoveries ({selectedBlockWork.length})</h5>
                      <div className="grid gap-3">
                        {selectedBlockWork.slice(0, 3).map((work: any) => (
                          <div 
                            key={work.id} 
                            className="bg-slate-800 rounded-lg p-3 border border-slate-600 cursor-pointer hover:border-slate-500 transition-colors"
                            onClick={() => setSelectedWork(work)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {getWorkTypeLabel(work.workType)}
                                </Badge>
                                <span className="text-gray-400 text-sm">Difficulty {work.difficulty}</span>
                              </div>
                              <span className="text-green-400 font-mono text-sm">
                                {formatValue(work.scientificValue)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Energy:</span>
                                <span className="text-yellow-400 ml-1">{work.energyEfficiency?.toFixed(2) || 'N/A'} kWh</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Worker:</span>
                                <span className="text-blue-400 ml-1 font-mono">{work.workerId}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {selectedBlockWork.length > 3 && (
                          <div className="text-center">
                            <button className="text-blue-400 hover:text-blue-300 text-sm">
                              View all {selectedBlockWork.length} discoveries →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {!blocks?.length && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-8">
              <div className="text-gray-400">No blocks found. Mining operations will create the first blocks.</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Mathematical Work Modal */}
      {selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-slate-800 border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Mathematical Computation Details</CardTitle>
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="computation" className="w-full">
                <TabsList className="grid grid-cols-4 w-full mb-6">
                  <TabsTrigger value="computation">Computation</TabsTrigger>
                  <TabsTrigger value="rawdata">Raw Data</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                </TabsList>

                <TabsContent value="computation" className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">{getWorkTypeLabel(selectedWork.workType)}</h3>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        Difficulty {selectedWork.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        Pending
                      </Badge>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Computation Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Processing Time:</span>
                          <span className="text-white">{(selectedWork.computationalCost * 1000).toFixed(0)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Energy Consumed:</span>
                          <span className="text-white">{selectedWork.energyEfficiency.toFixed(4)} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Scientific Value:</span>
                          <span className="text-green-400">{formatValue(selectedWork.scientificValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Worker ID:</span>
                          <span className="text-white font-mono text-sm">{selectedWork.workerId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Verification Status</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Verified:</span>
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400">Pending</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Consensus Score:</span>
                          <span className="text-white">0.0%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Validators:</span>
                          <span className="text-white">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Timestamp:</span>
                          <span className="text-white">{formatTimestamp(selectedWork.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rawdata" className="space-y-4">
                  <h4 className="text-white font-semibold">Raw Computation Data</h4>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(selectedWork.result, null, 2)}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4">
                  <h4 className="text-white font-semibold">Computation Metadata</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-gray-400">Work Type:</div>
                      <div className="text-white">{getWorkTypeLabel(selectedWork.workType)}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-gray-400">Difficulty Level:</div>
                      <div className="text-white">{selectedWork.difficulty}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-gray-400">Computational Cost:</div>
                      <div className="text-white">{selectedWork.computationalCost.toFixed(6)} units</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-gray-400">Energy Efficiency:</div>
                      <div className="text-white">{(selectedWork.energyEfficiency * 100).toFixed(2)}%</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-gray-400">Scientific Value:</div>
                      <div className="text-green-400">{formatValue(selectedWork.scientificValue)}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-gray-400">Digital Signature:</div>
                      <div className="text-white font-mono text-xs break-all">{selectedWork.signature}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="verification" className="space-y-4">
                  <h4 className="text-white font-semibold">Verification Details</h4>
                  <div className="bg-slate-900 rounded-lg p-4">
                    <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                      {JSON.stringify(selectedWork.verificationData, null, 2)}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}