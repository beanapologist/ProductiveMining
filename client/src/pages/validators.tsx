import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Shield, Users, CheckCircle, Clock, AlertCircle, Play } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Staker {
  id: number;
  stakerId: string;
  institutionName: string;
  stakeAmount: number;
  validationReputation: number;
  totalValidations: number;
  correctValidations: number;
  timestamp: string;
}

interface ValidationRecord {
  id: number;
  workId: number;
  stakerId: number;
  validationType: string;
  stakeAmount: number;
  status: string;
  timestamp: string;
  stakerName: string;
  workType: string;
}

export default function ValidatorsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: stakers = [], isLoading: stakersLoading } = useQuery<Staker[]>({
    queryKey: ['/api/stakers'],
  });

  const { data: validations = [], isLoading: validationsLoading } = useQuery<ValidationRecord[]>({
    queryKey: ['/api/validations'],
  });

  const initializeValidators = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/validators/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to initialize validators');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/stakers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/validations'] });
      toast({
        title: "Validators Initialized",
        description: `Created ${data.count} validator nodes for PoS consensus`,
      });
    },
    onError: () => {
      toast({
        title: "Initialization Failed",
        description: "Could not initialize validator network",
        variant: "destructive",
      });
    },
  });

  const totalStake = stakers.reduce((sum, staker) => sum + staker.stakeAmount, 0);
  const activeValidators = stakers.length;
  const pendingValidations = validations.filter(v => v.status === 'pending').length;
  const successfulValidations = validations.filter(v => v.status === 'approved').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getValidationTypeIcon = (type: string) => {
    switch (type) {
      case 'pos_consensus': return <Shield className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (stakersLoading || validationsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading validator network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PoS Validator Network</h1>
            <p className="text-gray-600">Mathematical Discovery Validation System</p>
          </div>
        </div>

        {/* Initialize Button */}
        {stakers.length === 0 && (
          <div className="mb-4">
            <Button 
              onClick={() => initializeValidators.mutate()}
              disabled={initializeValidators.isPending}
              className="flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{initializeValidators.isPending ? 'Initializing...' : 'Initialize PoS Network'}</span>
            </Button>
          </div>
        )}

        {/* Network Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Validators</p>
                  <p className="text-xl font-bold">{activeValidators}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Stake</p>
                  <p className="text-xl font-bold">{totalStake.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold">{pendingValidations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Successful</p>
                  <p className="text-xl font-bold">{successfulValidations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="validators" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="validators">Validator Nodes</TabsTrigger>
          <TabsTrigger value="validations">Validation History</TabsTrigger>
        </TabsList>

        <TabsContent value="validators" className="space-y-4">
          <div className="grid gap-4">
            {stakers.map((staker) => {
              const successRate = staker.totalValidations > 0 
                ? (staker.correctValidations / staker.totalValidations) * 100 
                : 100;
              
              return (
                <Card key={staker.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{staker.institutionName}</CardTitle>
                        <CardDescription>Validator ID: {staker.stakerId}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Stake Amount</p>
                        <p className="text-lg font-semibold">{staker.stakeAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reputation</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={staker.validationReputation * 100} className="flex-1" />
                          <span className="text-sm font-medium">{(staker.validationReputation * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Success Rate</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={successRate} className="flex-1" />
                          <span className="text-sm font-medium">{successRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Total Validations</p>
                        <p className="text-lg font-semibold">{staker.totalValidations}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Correct Validations</p>
                        <p className="text-lg font-semibold text-green-600">{staker.correctValidations}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="validations" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Validation Activity</CardTitle>
              <CardDescription>Mathematical discovery validations by PoS network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {validations.slice(0, 20).map((validation) => (
                  <div key={validation.id} className="flex items-center justify-between p-3 rounded-lg border bg-white/50">
                    <div className="flex items-center space-x-3">
                      {getValidationTypeIcon(validation.validationType)}
                      <div>
                        <p className="font-medium">{validation.workType}</p>
                        <p className="text-sm text-gray-600">
                          Work ID #{validation.workId} • {validation.stakerName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{validation.stakeAmount.toLocaleString()} stake</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(validation.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(validation.status)} text-white border-none`}
                      >
                        {validation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {validations.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No validation records yet</p>
                    <p className="text-sm text-gray-500">Validators will appear here as mathematical discoveries are validated</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}