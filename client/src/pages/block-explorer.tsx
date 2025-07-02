import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, ExternalLink, Shield, Calculator, Zap, Database, Home, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import type { ProductiveBlock, MathematicalWork } from "@shared/schema";

interface BlockWithWork {
  block: ProductiveBlock;
  work: MathematicalWork[];
}

export default function BlockExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);

  // Fetch recent blocks
  const { data: blocks = [], isLoading: blocksLoading } = useQuery<ProductiveBlock[]>({
    queryKey: ['/api/blocks'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch specific block with mathematical work
  const { data: blockDetails, isLoading: detailsLoading } = useQuery<BlockWithWork>({
    queryKey: ['/api/blocks', selectedBlockId, 'work'],
    enabled: !!selectedBlockId,
  });

  const filteredBlocks = blocks.filter((block: ProductiveBlock) =>
    block.blockHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    block.minerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    block.index.toString().includes(searchTerm)
  );

  const formatScientificValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getWorkTypeIcon = (workType: string) => {
    switch (workType) {
      case 'riemann_zero':
        return <Calculator className="h-4 w-4 text-pm-scientific" />;
      case 'qdt_validation':
        return <Zap className="h-4 w-4 text-pm-accent" />;
      case 'prime_pattern':
        return <Database className="h-4 w-4 text-blue-400" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getWorkTypeLabel = (workType: string) => {
    switch (workType) {
      case 'riemann_zero':
        return 'Riemann Zero';
      case 'qdt_validation':
        return 'QDT Validation';
      case 'prime_pattern':
        return 'Prime Pattern';
      default:
        return workType;
    }
  };

  const renderMathematicalResult = (work: MathematicalWork) => {
    const result = work.result as any;
    
    switch (work.workType) {
      case 'riemann_zero':
        return (
          <div className="space-y-2">
            <div className="font-mono text-sm">
              ζ(1/2 + {result.zeroValue?.imag?.toFixed(4) || '0.0000'}i) ≈ 0
            </div>
            <div className="text-xs text-slate-400">
              Zero #{result.zeroIndex} | Precision: {result.precision?.toExponential(2)}
            </div>
          </div>
        );
      
      case 'qdt_validation':
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">
              {result.validationType?.replace(/_/g, ' ')} 
            </div>
            <div className="text-xs text-slate-400">
              Score: {result.overallScore?.toFixed(6)} | Error: {result.energyError?.toExponential(2)}
            </div>
          </div>
        );
      
      case 'prime_pattern':
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">
              {result.patternType} primes: {result.patternsFound} found
            </div>
            <div className="text-xs text-slate-400">
              Range: [{result.searchRange?.[0]?.toLocaleString()}, {result.searchRange?.[1]?.toLocaleString()}]
            </div>
          </div>
        );
      
      default:
        return <div className="text-sm">Mathematical work completed</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2 text-slate-300 hover:text-white">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2 border-pm-accent text-pm-accent">
              <Database className="h-4 w-4" />
              Block Explorer
            </Button>
          </div>
          <div className="text-slate-400 text-sm">
            Productive Mining Network
          </div>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pm-scientific via-pm-accent to-pm-primary bg-clip-text text-transparent">
            Productive Block Explorer
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Explore blocks containing real mathematical discoveries instead of meaningless hash computations.
            Every block represents genuine scientific breakthroughs with verifiable proofs.
          </p>
        </div>

        {/* Search */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by block hash, miner ID, or block number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Block List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Database className="h-6 w-6 text-pm-accent" />
              Recent Blocks
            </h2>
            
            {blocksLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="bg-slate-800/30 border-slate-700 animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-20 bg-slate-700/50 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredBlocks.map((block: ProductiveBlock) => (
                  <Card 
                    key={block.id} 
                    className={`bg-slate-800/50 border-slate-700 hover:border-pm-accent/50 transition-colors cursor-pointer ${
                      selectedBlockId === block.id ? 'border-pm-accent' : ''
                    }`}
                    onClick={() => setSelectedBlockId(block.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-pm-scientific border-pm-scientific">
                              Block #{block.index}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {format(new Date(block.timestamp), 'MMM dd, HH:mm')}
                            </Badge>
                          </div>
                          <div className="font-mono text-xs text-slate-400 truncate max-w-[300px]">
                            {block.blockHash}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-pm-accent">
                            {formatScientificValue(block.totalScientificValue)}
                          </div>
                          <div className="text-xs text-slate-400">Scientific Value</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <div className="text-slate-400">Miner</div>
                          <div className="font-medium truncate">{block.minerId}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Energy</div>
                          <div className="font-medium text-green-400">{block.energyConsumed.toFixed(3)} kWh</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Knowledge</div>
                          <div className="font-medium text-pm-scientific">
                            {formatScientificValue(block.knowledgeCreated)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Block Details */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Shield className="h-6 w-6 text-pm-accent" />
              Block Details
            </h2>
            
            {!selectedBlockId ? (
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-8 text-center">
                  <div className="text-slate-400">
                    Select a block to view detailed mathematical discoveries
                  </div>
                </CardContent>
              </Card>
            ) : detailsLoading ? (
              <Card className="bg-slate-800/30 border-slate-700 animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-slate-700/50 rounded"></div>
                    <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                    <div className="h-20 bg-slate-700/50 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ) : blockDetails ? (
              <div className="space-y-4">
                {/* Block Info */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-pm-accent" />
                      Block #{blockDetails.block.index}
                    </CardTitle>
                    <CardDescription>
                      Mined by {blockDetails.block.minerId} on{' '}
                      {format(new Date(blockDetails.block.timestamp), 'PPP at p')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400">Block Hash</div>
                        <div className="font-mono break-all">{blockDetails.block.blockHash}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Previous Hash</div>
                        <div className="font-mono break-all">{blockDetails.block.previousHash}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Merkle Root</div>
                        <div className="font-mono break-all">{blockDetails.block.merkleRoot}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Nonce</div>
                        <div className="font-mono">{blockDetails.block.nonce}</div>
                      </div>
                    </div>
                    
                    <Separator className="bg-slate-700" />
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-pm-accent">
                          {formatScientificValue(blockDetails.block.totalScientificValue)}
                        </div>
                        <div className="text-xs text-slate-400">Scientific Value</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {blockDetails.block.energyConsumed.toFixed(3)}
                        </div>
                        <div className="text-xs text-slate-400">kWh Used</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-pm-scientific">
                          {blockDetails.work.length}
                        </div>
                        <div className="text-xs text-slate-400">Discoveries</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mathematical Discoveries */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-pm-scientific" />
                      Mathematical Discoveries ({blockDetails.work.length})
                    </CardTitle>
                    <CardDescription>
                      Real scientific breakthroughs contained within this block
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {blockDetails.work.map((work: MathematicalWork) => (
                      <Card key={work.id} className="bg-slate-700/30 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              {getWorkTypeIcon(work.workType)}
                              <span className="font-medium">{getWorkTypeLabel(work.workType)}</span>
                              <Badge variant="outline" className="text-xs">
                                Difficulty {work.difficulty}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-pm-accent">
                                {formatScientificValue(work.scientificValue)}
                              </div>
                              <div className="text-xs text-slate-400">Value</div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            {renderMathematicalResult(work)}
                          </div>
                          
                          <Separator className="bg-slate-600 my-3" />
                          
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <div className="text-slate-400">Worker</div>
                              <div className="font-medium truncate">{work.workerId}</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Cost</div>
                              <div className="font-medium">{work.computationalCost.toLocaleString()} ops</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Efficiency</div>
                              <div className="font-medium text-green-400">{work.energyEfficiency.toFixed(1)}</div>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-2 bg-slate-800/50 rounded text-xs">
                            <div className="text-slate-400 mb-1">Cryptographic Signature</div>
                            <div className="font-mono break-all">{work.signature}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-8 text-center">
                  <div className="text-slate-400">
                    Block details not found
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}