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
    queryFn: () => fetch('/api/blocks?limit=50000').then(res => res.json()),
    staleTime: 30000,
  });

  const { data: blockWork, isLoading: isBlockWorkLoading } = useQuery<BlockWorkData>({
    queryKey: ["/api/blocks", selectedBlock?.id, "work"],
    enabled: !!selectedBlock,
    staleTime: 30000,
  });

  const currentBlocks = blocks.length > 0 ? blocks : initialBlocks;

  const filteredBlocks = currentBlocks.filter((block: ProductiveBlock) => {
    if (!searchQuery) return true;
    
    return (
      block.id.toString().includes(searchQuery) ||
      block.blockHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.minerId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    if (!date || isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleString();
  };

  const getWorkTypeIcon = (workType: string) => {
    const icons: Record<string, string> = {
      'riemann_zero': '🧮',
      'prime_pattern': '🔢',
      'goldbach_verification': '✨',
      'birch_swinnerton_dyer': '🎯',
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

  // Calculate actual totals from current network data
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

  // Get actual block count from highest block index (total blocks mined)
  const actualBlockCount = currentBlocks.length > 0 
    ? Math.max(...currentBlocks.map(block => block.index || 0)) + 1
    : 0;
  
  // Format large numbers properly
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center text-white">
          <Database className="mr-3 h-8 w-8 text-blue-400" />
          Block Explorer
        </h1>
        <p className="text-gray-400 mt-2">
          Explore the blockchain of mathematical discoveries and scientific breakthroughs
        </p>
      </div>

      {/* Blockchain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <Database className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{actualBlockCount}</div>
                <div className="text-sm text-gray-400">Total Blocks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <Award className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{formatCurrency(totalScientificValue)}</div>
                <div className="text-sm text-gray-400">Scientific Value</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-500/20">
                <Zap className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{latestDifficulty}</div>
                <div className="text-sm text-gray-400">Latest Difficulty</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-orange-500/20">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {currentBlocks.length > 0 ? formatTimestamp(currentBlocks[currentBlocks.length - 1]?.timestamp) : 'N/A'}
                </div>
                <div className="text-sm text-gray-400">Latest Block</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by block ID, hash, or miner ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Blocks List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blocks List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Recent Blocks</h2>
          {filteredBlocks.length > 0 ? (
            filteredBlocks.map((block: ProductiveBlock) => (
              <Card key={block.id} className="bg-slate-800 border-slate-700 hover:border-blue-400 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-500/20">
                        <Database className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Block #{block.index}</div>
                        <div className="text-gray-400 text-sm">ID: {block.id}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBlock(block)}
                      className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Hash:</span>
                      <span className="text-white font-mono">{formatHash(block.blockHash)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Miner:</span>
                      <span className="text-white font-mono">{formatHash(block.minerId)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Scientific Value:</span>
                      <span className="text-green-400 font-semibold">{formatCurrency(block.totalScientificValue)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Difficulty:</span>
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        {block.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Timestamp:</span>
                      <span className="text-white">{formatTimestamp(block.timestamp)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No blocks found matching your search.</p>
            </div>
          )}
        </div>

        {/* Block Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Block Details</h2>
          
          {selectedBlock ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Hash className="mr-2 h-5 w-5 text-blue-400" />
                  Block #{selectedBlock.index}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed information and mathematical discoveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Block Hash</div>
                    <div className="text-white font-mono text-xs break-all">{selectedBlock.blockHash}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Previous Hash</div>
                    <div className="text-white font-mono text-xs break-all">{selectedBlock.previousHash}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Merkle Root</div>
                    <div className="text-white font-mono text-xs break-all">{selectedBlock.merkleRoot}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Nonce</div>
                      <div className="text-white font-semibold">{selectedBlock.nonce}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Difficulty</div>
                      <div className="text-purple-400 font-semibold">{selectedBlock.difficulty}</div>
                    </div>
                  </div>
                </div>

                {/* Mathematical Discoveries */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Mathematical Discoveries</h3>
                  {isBlockWorkLoading ? (
                    <div className="text-center py-4 text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                      <p className="mt-2">Loading mathematical discoveries...</p>
                    </div>
                  ) : blockWork?.work && blockWork.work.length > 0 ? (
                    <div className="space-y-3">
                      {blockWork.work.map((work: MathematicalWork) => (
                        <div key={work.id} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{getWorkTypeIcon(work.workType)}</span>
                              <span className="text-white font-semibold">{formatWorkType(work.workType)}</span>
                            </div>
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              {formatCurrency(work.scientificValue)}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Worker:</span>
                              <span className="text-white font-mono">{formatHash(work.workerId)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Difficulty:</span>
                              <span className="text-purple-400">{work.difficulty}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Energy Efficiency:</span>
                              <span className="text-green-400">{work.energyEfficiency.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-400">
                      <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No mathematical discoveries linked to this block</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-400">
                  <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select a block to view detailed information</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}