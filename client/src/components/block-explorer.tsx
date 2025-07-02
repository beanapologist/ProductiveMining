import { Box, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { ProductiveBlock } from "@shared/schema";

interface BlockExplorerProps {
  blocks: ProductiveBlock[];
}

export default function BlockExplorer({ blocks = [] }: BlockExplorerProps) {
  // Ensure blocks is always an array and filter out any invalid blocks
  const validBlocks = Array.isArray(blocks) ? blocks.filter(block => block && typeof block.index !== 'undefined') : [];
  

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    
    if (diff < 60000) return `${Math.floor(diff / 1000)} seconds ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    return `${Math.floor(diff / 3600000)} hours ago`;
  };

  return (
    <section className="bg-pm-secondary/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            🔗 Block Explorer
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
            Unlike Bitcoin blocks that waste energy on meaningless calculations, these blocks contain real mathematical breakthroughs
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧮</span>
              <span className="text-white">Real Math Inside</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💎</span>
              <span className="text-white">Scientific Value</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔒</span>
              <span className="text-white">Blockchain Secure</span>
            </div>
          </div>
        </div>
        
        {/* Recent Blocks */}
        <div className="space-y-6">
          {validBlocks.length === 0 ? (
            <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-12 text-center">
              <Box className="h-16 w-16 mx-auto mb-4 text-slate-400 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No blocks available</h3>
              <p className="text-slate-400">Blocks will appear here as they are mined</p>
            </div>
          ) : (
            validBlocks.map((block) => (
              <div key={block.id} className="pm-card">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="bg-pm-accent/20 p-3 rounded-lg">
                      <Box className="text-pm-accent h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Block #{block.index}</h3>
                      <p className="text-sm text-slate-400">
                        Mined {formatTimestamp(block.timestamp)} by {block.minerId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="outline" className="border-pm-accent text-pm-accent">
                      Scientific Value: ${Math.round(block.totalScientificValue).toLocaleString()}
                    </Badge>
                    <Badge variant="outline" className="border-pm-scientific text-pm-scientific">
                      Energy: {block.energyConsumed.toFixed(2)} kWh
                    </Badge>
                  </div>
                </div>
                
                {/* Mathematical Work Preview */}
                <div className="grid lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-pm-primary/30 p-3 rounded-lg border border-slate-700/30 text-center">
                    <div className="text-pm-scientific mb-2">∞</div>
                    <div className="text-sm font-medium">Riemann Zero</div>
                    <div className="text-xs text-pm-accent">
                      ${Math.round(block.totalScientificValue * 0.4).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-pm-primary/30 p-3 rounded-lg border border-slate-700/30 text-center">
                    <div className="text-pm-accent mb-2">#</div>
                    <div className="text-sm font-medium">Prime Patterns</div>
                    <div className="text-xs text-pm-accent">
                      ${Math.round(block.totalScientificValue * 0.35).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-pm-primary/30 p-3 rounded-lg border border-slate-700/30 text-center">
                    <div className="text-purple-400 mb-2">⚛</div>
                    <div className="text-sm font-medium">QDT Validation</div>
                    <div className="text-xs text-purple-400">
                      ${Math.round(block.totalScientificValue * 0.25).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {/* View Details Link */}
                <div className="flex justify-center">
                  <Link href={`/blocks`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-pm-accent text-pm-accent hover:bg-pm-accent hover:text-pm-primary"
                    >
                      View Full Block Details
                    </Button>
                  </Link>
                </div>
                
                {/* Block Hash and Technical Details */}
                <div className="pt-6 border-t border-slate-700/30">
                  <div className="grid lg:grid-cols-2 gap-6 text-sm">
                    <div>
                      <div className="text-slate-400 mb-1">Block Hash</div>
                      <div className="font-mono text-xs text-slate-300 break-all">
                        {block.blockHash}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Merkle Root (Mathematical Work)</div>
                      <div className="font-mono text-xs text-slate-300 break-all">
                        {block.merkleRoot}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Block Explorer Navigation */}
        {blocks.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-400 hover:text-slate-200"
                  disabled
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Block</span>
                  <Input 
                    type="number" 
                    value={blocks[0]?.index || 0}
                    className="bg-pm-primary border-slate-700 w-24 text-center text-sm"
                    readOnly
                  />
                  <span className="text-sm text-slate-400">of {blocks[0]?.index || 0}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="bg-pm-accent hover:bg-pm-accent/80 text-pm-primary"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
