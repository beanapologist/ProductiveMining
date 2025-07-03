import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Database, Search, Hash, Clock, Zap, Award, Link as LinkIcon, ExternalLink, Brain } from "lucide-react";

interface ProductiveBlock {
  id: number;
  index: number;
  timestamp: Date | string;
  previousHash: string;
  merkleRoot: string;
  difficulty: number;
  nonce: number;
  blockHash: string;
  minerId: string;
  totalScientificValue: number;
  energyConsumed: number;
  knowledgeCreated: number;
}

interface MathematicalWork {
  id: number;
  workType: string;
  difficulty: number;
  result: any;
  verificationData: any;
  computationalCost: number;
  energyEfficiency: number;
  scientificValue: number;
  timestamp: string;
  workerId: string;
  signature: string;
}

interface BlockWorkData {
  block: ProductiveBlock;
  work: MathematicalWork[];
}

export default function BlockExplorerPage() {
  const { blocks } = useWebSocket();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<ProductiveBlock | null>(null);

  const { data: initialBlocks = [] } = useQuery({
    queryKey: ["/api/blocks"],
    enabled: !blocks
  });

  const currentBlocks = blocks && blocks.length > 0 ? blocks : (initialBlocks as ProductiveBlock[] || []);

  const { data: blockWork } = useQuery<BlockWorkData>({
    queryKey: ["/api/blocks", selectedBlock?.id, "work"],
    enabled: !!selectedBlock,
    staleTime: 0, // Always refetch
  });

  // Automatically select the first block if none selected and blocks exist
  if (!selectedBlock && currentBlocks.length > 0) {
    // Use useEffect to avoid infinite re-renders
    setTimeout(() => setSelectedBlock(currentBlocks[0]), 0);
  }

  const filteredBlocks = currentBlocks.filter((block: ProductiveBlock) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      block.index.toString().includes(query) ||
      block.blockHash.toLowerCase().includes(query) ||
      block.minerId.toLowerCase().includes(query)
    );
  });

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (!date || isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleString();
  };

  const getWorkTypeIcon = (workType: string) => {
    const icons: Record<string, string> = {
      'riemann_zero': '🧮',
      'prime_pattern': '🔢',
      'goldbach_verification': '➕',
      'birch_swinnerton_dyer': '📐',
      'navier_stokes': '🌊',
      'yang_mills': '⚛️',
      'poincare_conjecture': '🌐',
      'elliptic_curve_crypto': '🔐',
      'lattice_crypto': '🔒',
      'qdt_validation': '⚡'
    };
    return icons[workType] || '📊';
  };

  const formatWorkType = (workType: string) => {
    const formatted = workType
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    const typeMap: Record<string, string> = {
      'Riemann Zero': 'Riemann Hypothesis',
      'Prime Pattern': 'Prime Patterns',
      'Goldbach Verification': 'Goldbach Conjecture',
      'Birch Swinnerton Dyer': 'Birch-Swinnerton-Dyer',
      'Navier Stokes': 'Navier-Stokes',
      'Yang Mills': 'Yang-Mills Theory',
      'Poincare Conjecture': 'Poincaré Conjecture',
      'Elliptic Curve Crypto': 'Elliptic Curve Crypto',
      'Lattice Crypto': 'Lattice Cryptography',
      'Qdt Validation': 'QDT Validation'
    };
    
    return typeMap[formatted] || formatted;
  };

  const totalScientificValue = currentBlocks.reduce((sum: number, block: ProductiveBlock) => 
    sum + (block.totalScientificValue || 0), 0
  );

  const totalEnergyEfficiency = currentBlocks.reduce((sum: number, block: ProductiveBlock) => 
    sum + (block.energyConsumed || 0), 0
  );

  // Get the latest difficulty from the most recent block (highest index)
  const latestDifficulty = currentBlocks.length > 0 
    ? Math.max(...currentBlocks.map(block => block.difficulty || 0))
    : 0;

  return (
    <div className="text-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Database className="h-10 w-10 mr-3 text-blue-400" />
            Block Explorer
          </h1>
          <p className="text-xl text-slate-300">
            Explore the blockchain of mathematical discoveries and scientific breakthroughs
          </p>
        </div>

        {/* Blockchain Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="pm-card border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Database className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{currentBlocks.length}</div>
                  <div className="text-sm text-slate-400">Total Blocks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pm-card border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Award className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">${totalScientificValue.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">Scientific Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pm-card border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-500/20">
                  <Zap className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{totalEnergyEfficiency.toFixed(2)} kWh</div>
                  <div className="text-sm text-slate-400">Total Energy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pm-card border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-orange-500/20">
                  <Hash className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {latestDifficulty}
                  </div>
                  <div className="text-sm text-slate-400">Latest Difficulty</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Block List */}
          <div className="lg:col-span-2">
            <Card className="pm-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="h-5 w-5 mr-2 text-blue-400" />
                  Blockchain Blocks
                </CardTitle>
                <CardDescription>
                  Mathematical discoveries stored in the blockchain
                </CardDescription>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by block number, hash, or miner..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredBlocks.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No blocks found</p>
                      <p className="text-sm">Try adjusting your search</p>
                    </div>
                  ) : (
                    filteredBlocks.map((block: ProductiveBlock) => (
                      <div 
                        key={block.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-blue-500/50 ${
                          selectedBlock?.id === block.id 
                            ? 'bg-blue-500/10 border-blue-500' 
                            : 'bg-slate-800/30 border-slate-700'
                        }`}
                        onClick={() => setSelectedBlock(block)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              Block #{block.index}
                            </Badge>
                            <span className="text-sm text-slate-400">
                              Difficulty {block.difficulty}
                            </span>
                          </div>
                          <div className="text-sm text-slate-400">
                            {formatTimestamp(block.timestamp)}
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <Hash className="h-3 w-3 text-slate-500" />
                            <span className="text-slate-300 font-mono">
                              {formatHash(block.blockHash)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Scientific Value:</span>
                            <span className="text-purple-400 font-semibold">
                              ${block.totalScientificValue?.toLocaleString() || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Energy:</span>
                            <span className="text-green-400">
                              {block.energyConsumed?.toFixed(3) || 0} kWh
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Block Details */}
          <div>
            <Card className="pm-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Hash className="h-5 w-5 mr-2 text-orange-400" />
                  Block Details
                </CardTitle>
                <CardDescription>
                  Detailed information about the selected block
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedBlock ? (
                  <div className="text-center py-8 text-slate-400">
                    <Hash className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select a block to view details</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Block Header */}
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Block #{selectedBlock.index}
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Timestamp:</span>
                          <span className="text-white">{formatTimestamp(selectedBlock.timestamp)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Difficulty:</span>
                          <span className="text-white">{selectedBlock.difficulty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Nonce:</span>
                          <span className="text-white font-mono">{selectedBlock.nonce}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hashes */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1">
                          Block Hash
                        </label>
                        <div className="p-2 bg-slate-800 rounded font-mono text-sm text-blue-400 break-all">
                          {selectedBlock.blockHash}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1">
                          Previous Hash
                        </label>
                        <div className="p-2 bg-slate-800 rounded font-mono text-sm text-slate-400 break-all">
                          {selectedBlock.previousHash}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1">
                          Merkle Root
                        </label>
                        <div className="p-2 bg-slate-800 rounded font-mono text-sm text-purple-400 break-all">
                          {selectedBlock.merkleRoot}
                        </div>
                      </div>
                    </div>

                    {/* Scientific Metrics */}
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                      <h4 className="text-white font-semibold mb-3">Scientific Impact</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Scientific Value:</span>
                          <span className="text-purple-400 font-semibold">
                            ${selectedBlock.totalScientificValue?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Knowledge Created:</span>
                          <span className="text-blue-400 font-semibold">
                            {selectedBlock.knowledgeCreated?.toLocaleString()} units
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Energy Consumed:</span>
                          <span className="text-green-400 font-semibold">
                            {selectedBlock.energyConsumed?.toFixed(3)} kWh
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Miner Info */}
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Miner Information</h4>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Miner ID:</span>
                          <span className="text-orange-400 font-mono">
                            {formatHash(selectedBlock.minerId)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mathematical Discoveries */}
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Mathematical Discoveries ({blockWork?.work?.length || 0})
                        {!blockWork && selectedBlock && (
                          <span className="ml-2 text-xs text-yellow-400">(Loading...)</span>
                        )}
                      </h4>
                      {blockWork?.work && blockWork.work.length > 0 ? (
                          <div className="space-y-3">
                            {blockWork.work.map((work: any, index: number) => (
                              <div key={index} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-purple-500/50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">{getWorkTypeIcon(work.workType)}</span>
                                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                                      {formatWorkType(work.workType)}
                                    </Badge>
                                  </div>
                                  <span className="text-green-400 font-semibold">
                                    ${work.scientificValue?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-400 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Discovery ID:</span>
                                    <span className="font-mono">#{work.id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Difficulty:</span>
                                    <span>{work.difficulty}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Energy Efficiency:</span>
                                    <span className="text-green-400">{work.energyEfficiency}x</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Worker:</span>
                                    <span className="font-mono text-orange-400">
                                      {work.workerId?.slice(0, 12)}...
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                      ) : (
                        <div className="text-center py-4 text-slate-400">
                          <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No mathematical discoveries linked to this block</p>
                          {selectedBlock && (
                            <p className="text-xs text-yellow-400 mt-1">
                              Debug: Block ID {selectedBlock.id}, Query enabled: {String(!!selectedBlock)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}