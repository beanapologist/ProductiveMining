import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Pickaxe, Play, Pause, Clock, Zap, Brain, Award, TrendingUp } from "lucide-react";

interface MiningOperation {
  id: number;
  operationType: string;
  minerId: string;
  startTime: Date;
  estimatedCompletion: Date | null;
  progress: number;
  currentResult: any;
  difficulty: number;
  status: string;
}

export default function MiningPage() {
  const { operations, discoveries } = useWebSocket();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [selectedWorkType, setSelectedWorkType] = useState("riemann_zero");
  const [difficulty, setDifficulty] = useState([50]);

  const { data: initialOperations = [] } = useQuery({
    queryKey: ["/api/mining/operations"],
    enabled: !operations
  });

  const { data: initialDiscoveries = [] } = useQuery({
    queryKey: ["/api/discoveries"],
    enabled: !discoveries
  });

  const currentOperations = operations || initialOperations;
  const currentDiscoveries = discoveries || initialDiscoveries;

  const startMiningMutation = useMutation({
    mutationFn: async (params: { workType: string; difficulty: number }) => {
      const response = await fetch("/api/mining/start-real", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mining/operations"] });
      toast({
        title: "Mining Started!",
        description: "Your mathematical computation has begun.",
      });
    },
    onError: (error) => {
      console.error("Mining error:", error);
      toast({
        title: "Mining Failed",
        description: `Error starting mining: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const workTypes = [
    { value: "riemann_zero", label: "🧮 Riemann Hypothesis", description: "Find zeros of the zeta function" },
    { value: "prime_pattern", label: "🔢 Prime Patterns", description: "Discover prime number sequences" },
    { value: "goldbach_verification", label: "➕ Goldbach Conjecture", description: "Verify even number sums" },
    { value: "birch_swinnerton_dyer", label: "📐 Birch-Swinnerton-Dyer", description: "Elliptic curve analysis" },
    { value: "navier_stokes", label: "🌊 Navier-Stokes", description: "Fluid dynamics equations" },
    { value: "yang_mills", label: "⚛️ Yang-Mills Theory", description: "Quantum field theory" },
    { value: "poincare_conjecture", label: "🌐 Poincaré Conjecture", description: "Topology problems" },
    { value: "elliptic_curve_crypto", label: "🔐 Elliptic Curve Crypto", description: "Cryptographic security" },
    { value: "lattice_crypto", label: "🔒 Lattice Cryptography", description: "Post-quantum encryption" }
  ];

  const activeOperations = currentOperations.filter((op: MiningOperation) => op.status === 'active');
  const completedOperations = currentOperations.filter((op: MiningOperation) => op.status === 'completed');

  const handleStartMining = () => {
    console.log('Starting mining with:', { workType: selectedWorkType, difficulty: difficulty[0] });
    startMiningMutation.mutate({
      workType: selectedWorkType,
      difficulty: difficulty[0]
    });
  };

  const getOperationDescription = (operation: MiningOperation) => {
    const workType = workTypes.find(wt => wt.value === operation.operationType);
    return workType?.description || "Mathematical computation";
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (!date || isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleTimeString();
  };

  return (
    <div className="text-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Pickaxe className="h-10 w-10 mr-3 text-orange-400" />
            Mining Operations
          </h1>
          <p className="text-xl text-slate-300">
            Start mathematical computations to discover new knowledge and mine blocks
          </p>
        </div>

        {/* Mining Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="pm-card border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-orange-500/20">
                  <Play className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{activeOperations.length}</div>
                  <div className="text-sm text-slate-400">Active Operations</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pm-card border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-500/20">
                  <Award className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{completedOperations.length}</div>
                  <div className="text-sm text-slate-400">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pm-card border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{currentDiscoveries.length}</div>
                  <div className="text-sm text-slate-400">Total Discoveries</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pm-card border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-500/20">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    ${currentDiscoveries.reduce((sum: number, d: any) => sum + (d.scientificValue || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Start New Mining Operation */}
          <Card className="pm-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Pickaxe className="h-5 w-5 mr-2 text-orange-400" />
                Start Mining Operation
              </CardTitle>
              <CardDescription>
                Choose a mathematical problem to solve and earn scientific value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Mathematical Problem Type
                </label>
                <Select value={selectedWorkType} onValueChange={setSelectedWorkType}>
                  <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {workTypes.map((workType) => (
                      <SelectItem key={workType.value} value={workType.value}>
                        <div>
                          <div className="font-medium">{workType.label}</div>
                          <div className="text-xs text-slate-400">{workType.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Difficulty Level: {difficulty[0]}
                </label>
                <Slider
                  value={difficulty}
                  onValueChange={setDifficulty}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Easy (1)</span>
                  <span>Medium (10)</span>
                  <span>Hard (20)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="text-sm text-slate-300 mb-2">
                  <strong>Estimated Completion:</strong> ~2 minutes
                </div>
                <div className="text-sm text-slate-300 mb-2">
                  <strong>Energy Cost:</strong> {(difficulty[0] * 0.05).toFixed(2)} kWh
                </div>
                <div className="text-sm text-slate-300">
                  <strong>Expected Value:</strong> ${(difficulty[0] * 10000).toLocaleString()}
                </div>
              </div>

              <Button 
                onClick={handleStartMining}
                disabled={startMiningMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {startMiningMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Mining
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Active Operations */}
          <Card className="pm-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                Active Operations
              </CardTitle>
              <CardDescription>
                Currently running mathematical computations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeOperations.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Pause className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active mining operations</p>
                  <p className="text-sm">Start a new operation to begin</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOperations.map((operation: MiningOperation) => (
                    <div key={operation.id} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-orange-400 border-orange-400">
                            {operation.operationType.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-slate-400">
                            Difficulty {operation.difficulty}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">
                          {formatTimestamp(operation.startTime)}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Progress</span>
                          <span className="text-slate-300">{Math.round(operation.progress * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${operation.progress * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-sm text-slate-400">
                        {getOperationDescription(operation)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Completed Operations */}
        {completedOperations.length > 0 && (
          <Card className="pm-card mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="h-5 w-5 mr-2 text-green-400" />
                Recent Completions
              </CardTitle>
              <CardDescription>
                Successfully completed mathematical computations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedOperations.slice(0, 6).map((operation: MiningOperation) => (
                  <div key={operation.id} className="p-4 bg-slate-800/30 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        ✓ COMPLETED
                      </Badge>
                      <span className="text-xs text-slate-400">
                        Diff: {operation.difficulty}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">
                      {operation.operationType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatTimestamp(operation.startTime)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}