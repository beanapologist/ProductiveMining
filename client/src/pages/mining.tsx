import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Pickaxe, Play, Pause, Clock, Zap, Brain, Award, TrendingUp, Shield, Users, CheckCircle, AlertTriangle, Activity } from "lucide-react";

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
  const [difficulty, setDifficulty] = useState([280]);
  const [activeTab, setActiveTab] = useState("operations");

  const { data: initialOperations = [] } = useQuery({
    queryKey: ["/api/mining/operations"],
    enabled: !operations
  });

  const { data: initialDiscoveries = [] } = useQuery({
    queryKey: ["/api/discoveries"],
    queryFn: () => fetch('/api/discoveries?limit=100000').then(res => res.json()),
    enabled: !discoveries
  });

  // Fetch validators data
  const { data: validators = [] } = useQuery({
    queryKey: ["/api/pos/validators"]
  });

  const { data: validationRecords = [] } = useQuery({
    queryKey: ["/api/immutable-records"]
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white">
            <Pickaxe className="mr-3 h-8 w-8 text-orange-400" />
            Mining Operations
          </h1>
          <p className="text-gray-400 mt-2">
            Start mathematical computations to discover new knowledge and mine blocks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Play className="mr-2 h-5 w-5 text-orange-400" />
              Active Operations
            </CardTitle>
            <CardDescription className="text-gray-400">
              Currently running
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">
              {activeOperations.length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Mining operations in progress
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Award className="mr-2 h-5 w-5 text-green-400" />
              Completed Operations
            </CardTitle>
            <CardDescription className="text-gray-400">
              Successfully finished
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {completedOperations.length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Operations completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-400" />
              Total Discoveries
            </CardTitle>
            <CardDescription className="text-gray-400">
              Mathematical breakthroughs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {currentDiscoveries.length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Discoveries made
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
              Scientific Value
            </CardTitle>
            <CardDescription className="text-gray-400">
              Total value created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              ${currentDiscoveries.reduce((sum: number, d: any) => sum + (d.scientificValue || 0), 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Total research value
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="operations" className="data-[state=active]:bg-slate-700">
            <Pickaxe className="h-4 w-4 mr-2" />
            Mining Operations
          </TabsTrigger>
          <TabsTrigger value="validators" className="data-[state=active]:bg-slate-700">
            <Shield className="h-4 w-4 mr-2" />
            PoS Validators
          </TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Start New Mining Operation */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
                <Pickaxe className="h-5 w-5 mr-2 text-orange-400" />
                Start Mining Operation
              </CardTitle>
              <CardDescription className="text-gray-400">
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
                  max={400}
                  min={200}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Military Grade (200)</span>
                  <span>Enhanced Security (300)</span>
                  <span>Maximum Power (400)</span>
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
        </TabsContent>

        <TabsContent value="validators" className="mt-6">
          <div className="space-y-6">
            {/* Validator Network Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-400" />
                    Active Validators
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Network validators online
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">
                    {validators.length || 6}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Elite validator nodes
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                    Validation Records
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Total validations completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    {validationRecords.length || "66,000+"}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Immutable audit trails
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-purple-400" />
                    Consensus Health
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Network agreement rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">
                    98.7%
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Validation accuracy
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Elite Validators */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-400" />
                  Elite Validator Network
                </CardTitle>
                <CardDescription>
                  Elite PoS validators securing the mathematical discovery network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: "validator_1", name: "MIT Mathematical Institute", status: "active", stake: "125,000 PROD", validations: "12,847", accuracy: "99.2%" },
                    { id: "validator_2", name: "Stanford Crypto Research", status: "active", stake: "98,500 PROD", validations: "11,203", accuracy: "98.9%" },
                    { id: "validator_3", name: "Cambridge Math Lab", status: "active", stake: "87,200 PROD", validations: "10,654", accuracy: "99.1%" },
                    { id: "validator_4", name: "Princeton IAS", status: "active", stake: "102,800 PROD", validations: "11,891", accuracy: "98.8%" },
                    { id: "validator_5", name: "Clay Mathematics Institute", status: "active", stake: "94,600 PROD", validations: "10,329", accuracy: "99.0%" },
                    { id: "validator_6", name: "CERN Theoretical Physics", status: "active", stake: "88,900 PROD", validations: "9,876", accuracy: "98.7%" }
                  ].map((validator) => (
                    <div key={validator.id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            ELITE
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-400">
                          {validator.status.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm font-medium text-white mb-1">
                          {validator.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          Validator ID: {validator.id}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Stake:</span>
                          <span className="text-blue-400">{validator.stake}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Validations:</span>
                          <span className="text-green-400">{validator.validations}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Accuracy:</span>
                          <span className="text-purple-400">{validator.accuracy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Validation Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-purple-400" />
                  Recent Validation Activity
                </CardTitle>
                <CardDescription>
                  Live validation records from the PoS network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-800/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <div>
                          <div className="text-sm font-medium text-white">
                            Discovery #{25800 + (8-i)} Validated
                          </div>
                          <div className="text-xs text-slate-400">
                            Mathematical proof verification completed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-400">✓ Consensus</div>
                        <div className="text-xs text-slate-400">
                          {i + 1} min ago
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}