import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Shield, 
  Users, 
  CheckCircle, 
  Clock, 
  Award,
  Building,
  FileText,
  Beaker
} from 'lucide-react';

interface ResearchValidator {
  id: string;
  name: string;
  institution: string;
  researchFields: string[];
  publicationCount: number;
  hIndex: number;
  reputation: number;
  validationAccuracy: number;
  totalValidations: number;
  lastActive: string;
}

interface ResearchValidation {
  id: string;
  blockId: number;
  discoveryId: number;
  validatorId: string;
  researchQuality: number;
  noveltyScore: number;
  rigorScore: number;
  impactPotential: number;
  peerReviewStatus: string;
  validationTime: string;
  comments: string;
}

interface PoRConsensus {
  blockId: number;
  requiredValidations: number;
  completedValidations: number;
  averageQualityScore: number;
  consensusReached: boolean;
  finalDecision: string;
  timestamp: string;
}

interface PoRStatus {
  activeValidators: number;
  totalValidations: number;
  recentValidations: number;
  averageQualityScore: number;
  queueLength: number;
  consensusThreshold: number;
  qualityThreshold: number;
  lastActivity: string;
}

export default function ProofOfResearchPage() {
  const [blockId, setBlockId] = useState<string>('');
  const [discoveryId, setDiscoveryId] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch PoR status
  const { data: porStatus } = useQuery<PoRStatus>({
    queryKey: ['/api/proof-of-research/status'],
    refetchInterval: 20000, // Reduced from 5s to 20s
  });

  // Fetch research validators
  const { data: validators = [] } = useQuery<ResearchValidator[]>({
    queryKey: ['/api/proof-of-research/validators'],
  });

  // Fetch recent validations
  const { data: validations = [] } = useQuery<ResearchValidation[]>({
    queryKey: ['/api/proof-of-research/validations'],
    refetchInterval: 10000,
  });

  // Fetch consensus results
  const { data: consensusResults = [] } = useQuery<PoRConsensus[]>({
    queryKey: ['/api/proof-of-research/consensus'],
    refetchInterval: 10000,
  });

  // Submit block for validation mutation
  const submitValidation = useMutation({
    mutationFn: async (data: { blockId: number; discoveryId: number }) => {
      const response = await fetch('/api/proof-of-research/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit for validation');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Validation Submitted",
        description: "Block submitted for research validation successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/proof-of-research/status'] });
      setBlockId('');
      setDiscoveryId('');
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockId || !discoveryId) {
      toast({
        title: "Missing Information",
        description: "Please provide both Block ID and Discovery ID",
        variant: "destructive",
      });
      return;
    }
    submitValidation.mutate({
      blockId: parseInt(blockId),
      discoveryId: parseInt(discoveryId),
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
          <Beaker className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Proof-of-Research Consensus</h1>
          <p className="text-gray-400">Third consensus layer for academic validation</p>
        </div>
      </div>

      {/* PoR Status Overview */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-400" />
          Consensus Status
        </h2>
        {porStatus ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{porStatus.activeValidators}</div>
              <div className="text-sm text-gray-400">Active Validators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{porStatus.totalValidations}</div>
              <div className="text-sm text-gray-400">Total Validations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{porStatus.averageQualityScore}%</div>
              <div className="text-sm text-gray-400">Avg Quality Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{porStatus.queueLength}</div>
              <div className="text-sm text-gray-400">Queue Length</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">Loading status...</div>
        )}
      </Card>

      {/* Submit Validation Form */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-400" />
          Submit for Research Validation
        </h2>
        <form onSubmit={handleSubmitValidation} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="blockId" className="text-gray-200">Block ID</Label>
              <Input
                id="blockId"
                type="number"
                value={blockId}
                onChange={(e) => setBlockId(e.target.value)}
                placeholder="Enter block ID"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="discoveryId" className="text-gray-200">Discovery ID</Label>
              <Input
                id="discoveryId"
                type="number"
                value={discoveryId}
                onChange={(e) => setDiscoveryId(e.target.value)}
                placeholder="Enter discovery ID"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={submitValidation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {submitValidation.isPending ? 'Submitting...' : 'Submit for Validation'}
          </Button>
        </form>
      </Card>

      {/* Research Validators */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-400" />
          Research Validators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validators.map((validator) => (
            <div key={validator.id} className="border border-slate-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white text-sm">{validator.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Building className="h-3 w-3" />
                    {validator.institution}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  H-Index: {validator.hIndex}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {validator.researchFields.slice(0, 2).map((field) => (
                    <Badge key={field} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-gray-400">Publications</div>
                    <div className="text-white font-medium">{validator.publicationCount}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Reputation</div>
                    <div className="text-emerald-400 font-medium">{validator.reputation}%</div>
                  </div>
                </div>
                
                <div className="text-xs">
                  <div className="text-gray-400">Validation Accuracy</div>
                  <div className="text-blue-400 font-medium">{(validator.validationAccuracy * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Validations */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-400" />
          Recent Validations
        </h2>
        {validations.length > 0 ? (
          <div className="space-y-3">
            {validations.slice(0, 10).map((validation) => (
              <div key={validation.id} className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">
                      Block #{validation.blockId} - Discovery #{validation.discoveryId}
                    </span>
                  </div>
                  <Badge 
                    variant={validation.peerReviewStatus === 'approved' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {validation.peerReviewStatus}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-gray-400">Quality</div>
                    <div className="text-emerald-400 font-medium">{validation.researchQuality}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Novelty</div>
                    <div className="text-blue-400 font-medium">{validation.noveltyScore}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Rigor</div>
                    <div className="text-purple-400 font-medium">{validation.rigorScore}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Impact</div>
                    <div className="text-orange-400 font-medium">{validation.impactPotential}%</div>
                  </div>
                </div>
                
                {validation.comments && (
                  <div className="mt-2 text-xs text-gray-400 italic">
                    "{validation.comments}"
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No research validations yet</p>
            <p className="text-sm text-gray-500">Submit blocks for academic peer review</p>
          </div>
        )}
      </Card>

      {/* Consensus Results */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-400" />
          Consensus Results
        </h2>
        {consensusResults.length > 0 ? (
          <div className="space-y-3">
            {consensusResults.slice(0, 10).map((result) => (
              <div key={result.blockId} className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Block #{result.blockId}</span>
                  <Badge 
                    variant={result.finalDecision === 'accepted' ? 'default' : 
                            result.finalDecision === 'rejected' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {result.finalDecision}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-gray-400">Validations</div>
                    <div className="text-white font-medium">
                      {result.completedValidations}/{result.requiredValidations}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Quality Score</div>
                    <div className="text-emerald-400 font-medium">{result.averageQualityScore.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Consensus</div>
                    <div className={`font-medium ${result.consensusReached ? 'text-green-400' : 'text-orange-400'}`}>
                      {result.consensusReached ? 'Reached' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No consensus results yet</p>
            <p className="text-sm text-gray-500">Research validations will appear here</p>
          </div>
        )}
      </Card>
    </div>
  );
}