import { Settings, Infinity, Calculator, Atom, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { MiningOperation, MathematicalWork } from "@shared/schema";

interface MiningOperationsProps {
  operations: MiningOperation[];
  discoveries: MathematicalWork[];
}

export default function MiningOperations({ operations = [], discoveries = [] }: MiningOperationsProps) {
  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'riemann_zero':
        return <Infinity className="text-pm-scientific h-4 w-4" />;
      case 'prime_pattern':
        return <Calculator className="text-pm-accent h-4 w-4" />;
      case 'qdt_validation':
        return <Atom className="text-purple-400 h-4 w-4" />;
      default:
        return <Settings className="text-slate-400 h-4 w-4" />;
    }
  };

  const getOperationTitle = (type: string) => {
    switch (type) {
      case 'riemann_zero':
        return 'Riemann Hypothesis';
      case 'prime_pattern':
        return 'Prime Constellation';
      case 'qdt_validation':
        return 'QDT Validation';
      default:
        return 'Mathematical Work';
    }
  };

  const getOperationDescription = (operation: MiningOperation) => {
    switch (operation.operationType) {
      case 'riemann_zero':
        return `Zero #${operation.currentResult?.zeroIndex || 'Unknown'} validation`;
      case 'prime_pattern':
        return `${operation.currentResult?.patternType || 'Pattern'} primes discovery`;
      case 'qdt_validation':
        return 'Quantum field constraints';
      default:
        return 'Mathematical computation';
    }
  };

  const formatTimeRemaining = (estimatedCompletion: string | null) => {
    if (!estimatedCompletion) return 'Unknown';
    
    const remaining = new Date(estimatedCompletion).getTime() - Date.now();
    if (remaining <= 0) return 'Completed';
    
    const minutes = Math.floor(remaining / 60000);
    return `~${minutes} min remaining`;
  };

  const getDiscoveryIcon = (type: string) => {
    switch (type) {
      case 'riemann_zero':
        return <Trophy className="text-pm-accent h-4 w-4" />;
      case 'prime_pattern':
        return <Atom className="text-pm-scientific h-4 w-4" />;
      case 'qdt_validation':
        return <Calculator className="text-purple-400 h-4 w-4" />;
      default:
        return <Trophy className="text-pm-accent h-4 w-4" />;
    }
  };

  const getDiscoveryTitle = (work: MathematicalWork) => {
    switch (work.workType) {
      case 'riemann_zero':
        return 'New Riemann Zero';
      case 'prime_pattern':
        return 'Prime Pattern Discovery';
      case 'qdt_validation':
        return 'QDT Constraint Validation';
      default:
        return 'Mathematical Discovery';
    }
  };

  const getDiscoveryDescription = (work: MathematicalWork) => {
    switch (work.workType) {
      case 'riemann_zero':
        return `Zero #${work.result?.zeroIndex || 'Unknown'} verified with ${work.result?.precision || '10⁻¹⁵'} precision`;
      case 'prime_pattern':
        return `${work.result?.patternsFound || 'Multiple'} ${work.result?.patternType || 'prime'} patterns found`;
      case 'qdt_validation':
        return `${work.result?.validationType || 'Energy conservation'} validated to ${work.result?.error || '10⁻¹²'} precision`;
      default:
        return 'Mathematical result computed';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Active Mining Operations */}
      <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center space-x-2">
            <Settings className="text-pm-accent h-5 w-5" />
            <span>Active Mining Operations</span>
          </h3>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-pm-accent rounded-full animate-pulse" />
            <span className="text-slate-300">Live</span>
          </div>
        </div>
        
        {operations.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active mining operations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {operations.slice(0, 5).map((operation) => (
              <div key={operation.id} className="bg-pm-primary/30 border border-slate-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-pm-scientific/20 p-2 rounded">
                      {getOperationIcon(operation.operationType)}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">
                        {getOperationTitle(operation.operationType)}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {getOperationDescription(operation)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-pm-accent">
                      {Math.round(operation.progress * 100)}% complete
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatTimeRemaining(operation.estimatedCompletion)}
                    </div>
                  </div>
                </div>
                <Progress value={operation.progress * 100} className="mb-3" />
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Miner: {operation.minerId}</span>
                  <span>Difficulty: {operation.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Recent Scientific Discoveries */}
      <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <Trophy className="text-pm-warning h-5 w-5" />
          <span>Recent Discoveries</span>
        </h3>
        
        {discoveries.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent discoveries</p>
          </div>
        ) : (
          <div className="space-y-4">
            {discoveries.slice(0, 5).map((discovery, index) => (
              <div key={`discovery-${discovery.id}-${index}`} className="flex items-center space-x-4 p-3 bg-pm-primary/30 rounded-lg border border-slate-700/30">
                <div className="bg-pm-accent/20 p-2 rounded-lg">
                  {getDiscoveryIcon(discovery.workType)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200">
                    {getDiscoveryTitle(discovery)}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {getDiscoveryDescription(discovery)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-pm-accent">
                    +{Math.round(discovery.scientificValue)} SCI
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatTimestamp(discovery.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
