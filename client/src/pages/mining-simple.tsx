import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Pickaxe, Play, CheckCircle, Award } from 'lucide-react';

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedWorkType, setSelectedWorkType] = useState('riemann_zero');
  const [difficulty, setDifficulty] = useState([150]);

  const { data: currentOperations = [], isLoading } = useQuery<MiningOperation[]>({
    queryKey: ['/api/mining/operations'],
    refetchInterval: 2000,
  });

  const { data: currentDiscoveries = [] } = useQuery({
    queryKey: ['/api/discoveries'],
    queryFn: () => fetch('/api/discoveries?limit=1000').then(res => res.json()),
  });

  const startMining = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/mining/start-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to start mining');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/operations'] });
      toast({
        title: "Mining Started",
        description: "Mathematical computation has begun",
      });
    },
    onError: () => {
      toast({
        title: "Mining Failed",
        description: "Could not start mining operation",
        variant: "destructive",
      });
    },
  });

  const workTypes = [
    { value: 'riemann_zero', label: 'Riemann Hypothesis', description: 'Find zeros of the zeta function' },
    { value: 'prime_pattern', label: 'Prime Patterns', description: 'Discover new prime constellations' },
    { value: 'yang_mills', label: 'Yang-Mills Theory', description: 'Quantum field theory calculations' },
    { value: 'navier_stokes', label: 'Navier-Stokes', description: 'Fluid dynamics solutions' },
    { value: 'goldbach_verification', label: 'Goldbach Conjecture', description: 'Verify even number sums' },
    { value: 'birch_swinnerton_dyer', label: 'Birch-Swinnerton-Dyer', description: 'Elliptic curve analysis' },
    { value: 'poincare_conjecture', label: 'Poincaré Conjecture', description: 'Topology problems' },
    { value: 'elliptic_curve_crypto', label: 'Elliptic Curve Crypto', description: 'Cryptographic security' },
    { value: 'lattice_crypto', label: 'Lattice Cryptography', description: 'Post-quantum encryption' },
  ];

  const activeOperations = currentOperations.filter((op: MiningOperation) => op.status === 'active');
  const completedOperations = currentOperations.filter((op: MiningOperation) => op.status === 'completed');

  const handleStartMining = () => {
    startMining.mutate({
      workType: selectedWorkType,
      difficulty: difficulty[0],
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading mining operations...</p>
        </div>
      </div>
    );
  }

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
              <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
              Completed
            </CardTitle>
            <CardDescription className="text-gray-400">
              Successful discoveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {completedOperations.length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Completed operations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Award className="mr-2 h-5 w-5 text-purple-400" />
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
              Scientific discoveries made
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Award className="mr-2 h-5 w-5 text-blue-400" />
              Scientific Value
            </CardTitle>
            <CardDescription className="text-gray-400">
              Total research value
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                max={150}
                min={50}
                step={5}
                className="w-full"
              />
            </div>

            <Button 
              onClick={handleStartMining}
              disabled={startMining.isPending}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {startMining.isPending ? 'Starting...' : 'Start Mining'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="h-5 w-5 mr-2 text-blue-400" />
              Active Operations
            </CardTitle>
            <CardDescription className="text-gray-400">
              Currently running mathematical computations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeOperations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No active mining operations</p>
                <p className="text-sm text-gray-500 mt-2">Start a new operation to begin mining</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOperations.map((operation: MiningOperation) => (
                  <div key={operation.id} className="p-4 bg-slate-900/50 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        ACTIVE
                      </Badge>
                      <span className="text-xs text-slate-400">
                        Progress: {operation.progress}%
                      </span>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">
                      {operation.operationType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${operation.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {completedOperations.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-400" />
              Recent Completions
            </CardTitle>
            <CardDescription className="text-gray-400">
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
                    {new Date(operation.startTime).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}