import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Shield, Users, CheckCircle, Clock, AlertCircle, Play, FileText, Fingerprint, Database, Award } from 'lucide-react';
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

interface ImmutableRecord {
  id: number;
  recordType: string;
  activityHash: string;
  validationId?: number;
  stakerId: number;
  workId?: number;
  blockId?: number;
  activityData: any;
  previousRecordHash?: string;
  merkleRoot: string;
  digitalSignature: string;
  consensusParticipants?: string[];
  reputationImpact: number;
  stakeImpact: number;
  isVerified: boolean;
  verificationProof?: any;
  immutableSince: string;
  lastVerificationCheck?: string;
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

  const { data: immutableRecords = [], isLoading: recordsLoading } = useQuery<ImmutableRecord[]>({
    queryKey: ['/api/immutable-records'],
  });

  const { data: validationRecords = [] } = useQuery<ImmutableRecord[]>({
    queryKey: ['/api/immutable-records/type/validation_activity'],
  });

  const { data: consensusRecords = [] } = useQuery<ImmutableRecord[]>({
    queryKey: ['/api/immutable-records/type/consensus_decision'],
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

  const processPendingValidations = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/pos/process-pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to process pending validations');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/validations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/immutable-records'] });
      toast({
        title: "Validations Processed",
        description: `Processed pending validations through PoS consensus`,
      });
    },
    onError: () => {
      toast({
        title: "Processing Failed",
        description: "Could not process pending validations",
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white">
            <Shield className="mr-3 h-8 w-8 text-blue-400" />
            PoS Validator Network
          </h1>
          <p className="text-gray-400 mt-2">
            Elite institutional validators providing consensus for mathematical discoveries
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-4">
          {stakers.length === 0 && (
            <Button 
              onClick={() => initializeValidators.mutate()}
              disabled={initializeValidators.isPending}
              className="flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{initializeValidators.isPending ? 'Initializing...' : 'Initialize PoS Network'}</span>
            </Button>
          )}
          
          {pendingValidations > 0 && (
            <Button 
              onClick={() => processPendingValidations.mutate()}
              disabled={processPendingValidations.isPending}
              className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {processPendingValidations.isPending 
                  ? 'Processing...' 
                  : `Process ${pendingValidations} Pending Validations`
                }
              </span>
            </Button>
          )}
        </div>

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
                  <p className="text-sm text-gray-600">Pending Validations</p>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validators">Validator Nodes</TabsTrigger>
          <TabsTrigger value="validations">Validation History</TabsTrigger>
          <TabsTrigger value="records">Immutable Records</TabsTrigger>
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

        <TabsContent value="records" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Immutable Records Pool
              </CardTitle>
              <CardDescription>
                Tamper-proof audit trail of all validation activities with cryptographic integrity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="validation" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="validation">Validation Activities</TabsTrigger>
                  <TabsTrigger value="consensus">Consensus Decisions</TabsTrigger>
                  <TabsTrigger value="integrity">Integrity Chain</TabsTrigger>
                </TabsList>

                <TabsContent value="validation" className="space-y-4">
                  <div className="space-y-4">
                    {validationRecords.length > 0 ? (
                      validationRecords.map((record) => (
                        <Card key={record.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium">Validation Activity #{record.id}</span>
                                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
                                    {record.recordType}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Staker ID:</span> {record.stakerId}
                                  </div>
                                  <div>
                                    <span className="font-medium">Work ID:</span> {record.workId || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Reputation Impact:</span> {record.reputationImpact}
                                  </div>
                                  <div>
                                    <span className="font-medium">Stake Impact:</span> {record.stakeImpact}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium">Activity Hash:</span> 
                                  <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                                    {record.activityHash.substring(0, 16)}...
                                  </code>
                                </div>
                              </div>
                              <div className="text-right text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Fingerprint className="w-3 h-3" />
                                  {record.isVerified ? 'Verified' : 'Pending'}
                                </div>
                                <div>{formatDistanceToNow(new Date(record.immutableSince))} ago</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No validation records yet</p>
                        <p className="text-sm text-gray-500">Records will appear as validators process mathematical discoveries</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="consensus" className="space-y-4">
                  <div className="space-y-4">
                    {consensusRecords.length > 0 ? (
                      consensusRecords.map((record) => (
                        <Card key={record.id} className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-green-600" />
                                  <span className="font-medium">Consensus Decision #{record.id}</span>
                                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
                                    {record.recordType}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Block ID:</span> {record.blockId || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Participants:</span> {record.consensusParticipants?.length || 0}
                                  </div>
                                  <div>
                                    <span className="font-medium">Reputation Impact:</span> {record.reputationImpact}
                                  </div>
                                  <div>
                                    <span className="font-medium">Merkle Root:</span> 
                                    <code className="ml-2 bg-gray-100 px-1 py-0.5 rounded text-xs">
                                      {record.merkleRoot.substring(0, 12)}...
                                    </code>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  {record.isVerified ? 'Verified' : 'Pending'}
                                </div>
                                <div>{formatDistanceToNow(new Date(record.immutableSince))} ago</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No consensus records yet</p>
                        <p className="text-sm text-gray-500">Records will appear as consensus decisions are made</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="integrity" className="space-y-4">
                  <div className="space-y-4">
                    {immutableRecords.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="text-sm text-gray-600">Total Records</p>
                                  <p className="text-xl font-bold">{immutableRecords.length}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                  <p className="text-sm text-gray-600">Verified</p>
                                  <p className="text-xl font-bold">{immutableRecords.filter(r => r.isVerified).length}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <Fingerprint className="w-5 h-5 text-purple-600" />
                                <div>
                                  <p className="text-sm text-gray-600">Chain Integrity</p>
                                  <p className="text-xl font-bold">100%</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        {immutableRecords.slice(0, 10).map((record) => (
                          <Card key={record.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-gray-600" />
                                    <span className="font-medium">Record #{record.id}</span>
                                    <Badge variant="outline">{record.recordType}</Badge>
                                  </div>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div>
                                      <span className="font-medium">Digital Signature:</span>
                                      <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                                        {record.digitalSignature.substring(0, 24)}...
                                      </code>
                                    </div>
                                    <div>
                                      <span className="font-medium">Previous Hash:</span>
                                      <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                                        {record.previousRecordHash?.substring(0, 24) || 'Genesis'}...
                                      </code>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Fingerprint className="w-3 h-3" />
                                    {record.isVerified ? 'Verified' : 'Pending'}
                                  </div>
                                  <div>{formatDistanceToNow(new Date(record.immutableSince))} ago</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No immutable records yet</p>
                        <p className="text-sm text-gray-500">Cryptographic records will appear as blockchain activities occur</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}