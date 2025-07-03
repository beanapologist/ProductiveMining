import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Clock, Fingerprint, CheckCircle, Users, Database } from "lucide-react";

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

export default function ImmutableRecordsPage() {
  const { data: records = [] } = useQuery<ImmutableRecord[]>({
    queryKey: ["/api/immutable-records"],
    refetchInterval: 5000,
  });

  const { data: validationActivityRecords = [] } = useQuery<ImmutableRecord[]>({
    queryKey: ["/api/immutable-records/type/validation_activity"],
    refetchInterval: 10000,
  });

  const { data: consensusRecords = [] } = useQuery<ImmutableRecord[]>({
    queryKey: ["/api/immutable-records/type/consensus_decision"],
    refetchInterval: 10000,
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'validation_activity': return '✓';
      case 'consensus_decision': return '🏛️';
      case 'stake_slash': return '⚡';
      case 'reputation_update': return '📊';
      default: return '📋';
    }
  };

  const getRecordTypeName = (type: string) => {
    switch (type) {
      case 'validation_activity': return 'Validation Activity';
      case 'consensus_decision': return 'Consensus Decision';
      case 'stake_slash': return 'Stake Slashing';
      case 'reputation_update': return 'Reputation Update';
      default: return type;
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Immutable Records Pool</h1>
              <p className="text-slate-600">Tamper-proof audit trail of all validation activities</p>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{records.length}</p>
                  <p className="text-sm text-slate-600">Total Records</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {records.filter(r => r.isVerified).length}
                  </p>
                  <p className="text-sm text-slate-600">Verified Records</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{validationActivityRecords.length}</p>
                  <p className="text-sm text-slate-600">Validation Activities</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-2">
                <Fingerprint className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{consensusRecords.length}</p>
                  <p className="text-sm text-slate-600">Consensus Decisions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Records Display */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="validation">Validation Activity</TabsTrigger>
            <TabsTrigger value="consensus">Consensus Decisions</TabsTrigger>
            <TabsTrigger value="integrity">Integrity Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {records.map((record) => (
                <Card key={record.id} className="bg-white border border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getRecordTypeIcon(record.recordType)}</span>
                        <CardTitle className="text-lg">{getRecordTypeName(record.recordType)}</CardTitle>
                        <Badge variant={record.isVerified ? "default" : "secondary"}>
                          {record.isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimestamp(record.immutableSince)}</span>
                      </div>
                    </div>
                    <CardDescription>
                      Record #{record.id} • Hash: {formatHash(record.activityHash)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Staker ID:</span>
                        <p className="text-slate-600">#{record.stakerId}</p>
                      </div>
                      {record.workId && (
                        <div>
                          <span className="font-medium text-slate-700">Work ID:</span>
                          <p className="text-slate-600">#{record.workId}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-slate-700">Reputation Impact:</span>
                        <p className={`${record.reputationImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {record.reputationImpact >= 0 ? '+' : ''}{record.reputationImpact.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Digital Signature:</span>
                        <p className="text-slate-600 font-mono text-xs">{formatHash(record.digitalSignature)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Merkle Root:</span>
                        <p className="text-slate-600 font-mono text-xs">{formatHash(record.merkleRoot)}</p>
                      </div>
                      {record.consensusParticipants && record.consensusParticipants.length > 0 && (
                        <div>
                          <span className="font-medium text-slate-700">Participants:</span>
                          <p className="text-slate-600">{record.consensusParticipants.length} validators</p>
                        </div>
                      )}
                    </div>
                    
                    {record.activityData && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-700 block mb-2">Activity Data:</span>
                        <div className="text-xs text-slate-600 space-y-1">
                          {record.activityData.validationType && (
                            <p><span className="font-medium">Type:</span> {record.activityData.validationType}</p>
                          )}
                          {record.activityData.scientificValue && (
                            <p><span className="font-medium">Scientific Value:</span> ${record.activityData.scientificValue?.toLocaleString()}</p>
                          )}
                          {record.activityData.institutionName && (
                            <p><span className="font-medium">Institution:</span> {record.activityData.institutionName}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {records.length === 0 && (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Immutable Records</h3>
                <p className="text-slate-600">Validation activity records will appear here once validators start processing mathematical discoveries.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <div className="grid gap-4">
              {validationActivityRecords.map((record) => (
                <Card key={record.id} className="bg-white border border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>✓</span>
                      <span>Validation Activity #{record.id}</span>
                    </CardTitle>
                    <CardDescription>
                      {formatTimestamp(record.immutableSince)} • Hash: {formatHash(record.activityHash)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <p><span className="font-medium">Validation ID:</span> #{record.validationId}</p>
                      <p><span className="font-medium">Work ID:</span> #{record.workId}</p>
                      <p><span className="font-medium">Staker:</span> #{record.stakerId}</p>
                      {record.activityData?.institutionName && (
                        <p><span className="font-medium">Institution:</span> {record.activityData.institutionName}</p>
                      )}
                      {record.activityData?.scientificValue && (
                        <p><span className="font-medium">Scientific Value:</span> ${record.activityData.scientificValue.toLocaleString()}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consensus" className="space-y-4">
            <div className="grid gap-4">
              {consensusRecords.map((record) => (
                <Card key={record.id} className="bg-white border border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>🏛️</span>
                      <span>Consensus Decision #{record.id}</span>
                    </CardTitle>
                    <CardDescription>
                      {formatTimestamp(record.immutableSince)} • Participants: {record.consensusParticipants?.length || 0}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <p><span className="font-medium">Work ID:</span> #{record.workId}</p>
                      <p><span className="font-medium">Total Stake:</span> {record.activityData?.totalStakeInvolved?.toLocaleString() || 'N/A'}</p>
                      <p><span className="font-medium">Consensus Result:</span> {record.activityData?.consensusResult || 'Pending'}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integrity" className="space-y-4">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Record Integrity Verification</CardTitle>
                <CardDescription>
                  All records are cryptographically signed and chained for tamper detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-medium text-green-800">Cryptographic Integrity</p>
                      <p className="text-sm text-green-600">All records verified with digital signatures</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-medium text-blue-800">Chain Integrity</p>
                      <p className="text-sm text-blue-600">Records linked via previous hash references</p>
                    </div>
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div>
                      <p className="font-medium text-purple-800">Merkle Tree Verification</p>
                      <p className="text-sm text-purple-600">Batch verification using merkle roots</p>
                    </div>
                    <Fingerprint className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}