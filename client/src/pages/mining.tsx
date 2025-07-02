import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Pickaxe, 
  Settings, 
  Zap, 
  Brain, 
  Calculator, 
  Trophy,
  Clock,
  Target,
  Activity,
  DollarSign
} from 'lucide-react';
import type { MiningOperation, MathematicalWork } from '@shared/schema';

export default function MiningPage() {
  const [workType, setWorkType] = useState('riemann_zero');
  const [difficulty, setDifficulty] = useState(10);
  const queryClient = useQueryClient();

  // Fetch active mining operations
  const { data: operations = [] } = useQuery<MiningOperation[]>({
    queryKey: ['/api/mining/operations'],
    refetchInterval: 2000
  });

  // Fetch recent discoveries
  const { data: discoveries = [] } = useQuery<MathematicalWork[]>({
    queryKey: ['/api/discoveries'],
    refetchInterval: 5000
  });

  // Start mining mutation
  const startMining = useMutation({
    mutationFn: async (params: { workType: string; difficulty: number }) => {
      const response = await fetch('/api/mining/start-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) throw new Error('Failed to start mining');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining/operations'] });
    }
  });

  const handleStartMining = () => {
    startMining.mutate({ workType, difficulty });
  };

  const getWorkTypeInfo = (type: string) => {
    switch (type) {
      case 'riemann_zero':
        return {
          icon: <Calculator className="h-5 w-5" />,
          title: 'Riemann Zero Computation',
          description: 'Calculate zeros of the Riemann zeta function using Euler-Maclaurin series',
          value: '$2-5M per discovery',
          timeEstimate: '2-5 minutes'
        };
      case 'prime_pattern':
        return {
          icon: <Brain className="h-5 w-5" />,
          title: 'Prime Pattern Discovery',
          description: 'Find twin primes and prime constellations using Sieve of Eratosthenes',
          value: '$1-3M per pattern',
          timeEstimate: '1-3 minutes'
        };
      case 'goldbach_verification':
        return {
          icon: <Target className="h-5 w-5" />,
          title: 'Goldbach Verification',
          description: 'Verify Goldbach conjecture for even numbers via exhaustive search',
          value: '$0.5-2M per verification',
          timeEstimate: '30s-2 minutes'
        };
      default:
        return {
          icon: <Calculator className="h-5 w-5" />,
          title: 'Mathematical Work',
          description: 'Unknown work type',
          value: 'Variable',
          timeEstimate: 'Unknown'
        };
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const getOperationStatus = (operation: MiningOperation) => {
    if (operation.status === 'completed') return 'secondary';
    if (operation.status === 'failed') return 'destructive';
    return 'default';
  };

  return (
    <div className="text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
            <Pickaxe className="text-pm-accent h-8 w-8" />
            <span>Mathematical Mining Operations</span>
          </h1>
          <p className="text-slate-300 text-lg">
            Contribute to scientific discovery while earning rewards through real mathematical computation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mining Control Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-pm-secondary/50 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="text-pm-accent h-5 w-5" />
                  <span>Start New Mining Operation</span>
                </CardTitle>
                <CardDescription>
                  Configure and launch real mathematical computation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workType">Mathematical Work Type</Label>
                  <Select value={workType} onValueChange={setWorkType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="riemann_zero">Riemann Zero Computation</SelectItem>
                      <SelectItem value="prime_pattern">Prime Pattern Discovery</SelectItem>
                      <SelectItem value="goldbach_verification">Goldbach Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Input
                    id="difficulty"
                    type="number"
                    min={1}
                    max={50}
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value) || 10)}
                    className="bg-pm-primary/30 border-slate-600"
                  />
                  <p className="text-xs text-slate-400">
                    Higher difficulty = longer computation time = higher rewards
                  </p>
                </div>

                {/* Work Type Preview */}
                <div className="bg-pm-primary/30 rounded-lg p-4 border border-slate-700/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-pm-accent/20 p-2 rounded">
                      {getWorkTypeInfo(workType).icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{getWorkTypeInfo(workType).title}</h4>
                      <p className="text-sm text-slate-400">{getWorkTypeInfo(workType).description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center space-x-1 text-slate-400">
                        <DollarSign className="h-3 w-3" />
                        <span>Expected Value</span>
                      </div>
                      <p className="font-medium text-pm-accent">{getWorkTypeInfo(workType).value}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>Time Estimate</span>
                      </div>
                      <p className="font-medium">{getWorkTypeInfo(workType).timeEstimate}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleStartMining}
                  disabled={startMining.isPending}
                  className="w-full bg-pm-accent hover:bg-pm-accent/80 text-pm-primary font-semibold"
                >
                  {startMining.isPending ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-spin" />
                      Starting Mining...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Start Real Mining
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Operations and Discoveries */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Operations */}
            <Card className="bg-pm-secondary/50 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="text-pm-accent h-5 w-5" />
                    <span>Active Mining Operations</span>
                  </div>
                  <Badge variant="outline" className="border-pm-accent text-pm-accent">
                    {operations.filter(op => op.status === 'active').length} Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {operations.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active mining operations</p>
                    <p className="text-sm">Start a new operation to begin mathematical computation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {operations.slice(0, 5).map((operation) => (
                      <div key={`operation-${operation.id}`} className="bg-pm-primary/30 border border-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-pm-scientific/20 p-2 rounded">
                              {getWorkTypeInfo(operation.operationType).icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-200">
                                {getWorkTypeInfo(operation.operationType).title}
                              </h4>
                              <p className="text-sm text-slate-400">
                                Started: {formatTimestamp(operation.startTime)}
                              </p>
                            </div>
                          </div>
                          <Badge variant={getOperationStatus(operation)}>
                            {operation.status}
                          </Badge>
                        </div>
                        
                        {operation.status === 'active' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{Math.round(operation.progress * 100)}%</span>
                            </div>
                            <Progress 
                              value={operation.progress * 100} 
                              className="h-2 bg-slate-700"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Discoveries */}
            <Card className="bg-pm-secondary/50 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="text-pm-warning h-5 w-5" />
                  <span>Recent Mathematical Discoveries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                          {getWorkTypeInfo(discovery.workType).icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-200">
                            {getWorkTypeInfo(discovery.workType).title}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {formatTimestamp(discovery.timestamp)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-pm-accent">
                            ${discovery.scientificValue.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400">
                            Scientific Value
                          </div>
                        </div>
                      </div>
                    ))}
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