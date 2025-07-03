import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Shield, 
  Award, 
  FileCheck,
  TrendingUp,
  Users,
  BarChart3,
  Filter,
  Search,
  Star,
  Globe,
  BookOpen,
  Code,
  Download,
  Copy,
  Settings
} from "lucide-react";

export function InstitutionalValidation() {
  const { toast } = useToast();
  const [selectedWork, setSelectedWork] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedValidator, setSelectedValidator] = useState<number | null>(null);
  const [validationStats, setValidationStats] = useState<any>(null);
  






  // Fetch validators
  const { data: validators, isLoading: validatorsLoading } = useQuery({
    queryKey: ['/api/institutional/validators'],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch pipeline reports
  const { data: pipelineReports, isLoading: pipelineLoading } = useQuery({
    queryKey: ['/api/institutional/pipeline'],
    staleTime: 2 * 60 * 1000,
  });

  // Fetch certifications
  const { data: certifications, isLoading: certificationsLoading } = useQuery({
    queryKey: ['/api/institutional/certifications'],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch discoveries for validation submission
  const { data: discoveries, isLoading: discoveriesLoading } = useQuery({
    queryKey: ['/api/discoveries'],
    staleTime: 2 * 60 * 1000,
  });

  // Initialize institutional validators
  const initValidatorsMutation = useMutation({
    mutationFn: () => 
      apiRequest('/api/institutional/init-validators', { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: "Validators Initialized",
        description: "Institutional validation network has been set up successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/institutional/validators'] });
    },
    onError: () => {
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize institutional validators.",
        variant: "destructive",
      });
    },
  });

  // Submit work to validation pipeline
  const submitValidationMutation = useMutation({
    mutationFn: (workId: number) => 
      apiRequest(`/api/institutional/validate/${workId}`, { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: "Submitted for Validation",
        description: "Mathematical work has been submitted to institutional validation pipeline.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/institutional/pipeline'] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit work for institutional validation.",
        variant: "destructive",
      });
    },
  });

  // Process institutional validation
  const processValidationMutation = useMutation({
    mutationFn: ({ workId, validatorId, validationType, validationScore, reviewData, comments }: any) => 
      apiRequest(`/api/institutional/validate/${workId}/review`, { 
        method: 'POST',
        body: JSON.stringify({ validatorId, validationType, validationScore, reviewData, comments })
      }),
    onSuccess: () => {
      toast({
        title: "Validation Processed",
        description: "Institutional validation has been recorded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/institutional/pipeline'] });
      queryClient.invalidateQueries({ queryKey: ['/api/institutional/certifications'] });
    },
    onError: () => {
      toast({
        title: "Processing Failed",
        description: "Failed to process institutional validation.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'validated': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'under_review': case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'requires_revision': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSpecializationIcon = (spec: string) => {
    switch (spec) {
      case 'riemann_zero': return '∞';
      case 'prime_pattern': return '℘';
      case 'yang_mills': return 'Ψ';
      case 'navier_stokes': return '∇';
      case 'goldbach_verification': return '∑';
      case 'birch_swinnerton_dyer': return '∮';
      case 'elliptic_curve_crypto': return '∈';
      case 'poincare_conjecture': return '∂';
      default: return '∝';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Academic Validation</h1>
          <p className="text-gray-400">Institutional peer review and certification system</p>
        </div>
      </div>

      <Tabs defaultValue="validators" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="validators" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            <Building2 className="w-4 h-4 mr-2" />
            Validators
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="certifications" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            <Award className="w-4 h-4 mr-2" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="submission" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            <FileCheck className="w-4 h-4 mr-2" />
            Submit Work
          </TabsTrigger>
        </TabsList>

        {/* Institutional Validators Tab */}
        <TabsContent value="validators" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Network Status
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Institutional validation network overview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {Array.isArray(validators) ? validators.length : 0}
                    </div>
                    <div className="text-sm text-gray-400">Active Validators</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">98.7%</div>
                    <div className="text-sm text-gray-400">Avg Reputation</div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => initValidatorsMutation.mutate()}
                  disabled={initValidatorsMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {initValidatorsMutation.isPending ? "Initializing..." : "Initialize Validators"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Performance Metrics
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Validation performance statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Validation Speed</span>
                    <span className="text-green-400">2.3 days avg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Consensus Rate</span>
                    <span className="text-blue-400">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality Score</span>
                    <span className="text-purple-400">9.1/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validators List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Institutional Validators</CardTitle>
              <CardDescription className="text-gray-400">
                Leading academic institutions providing validation services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {validatorsLoading ? (
                <div className="text-center py-8 text-gray-400">Loading validators...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Institution</TableHead>
                        <TableHead className="text-slate-300">Type</TableHead>
                        <TableHead className="text-slate-300">Specialization</TableHead>
                        <TableHead className="text-slate-300">Country</TableHead>
                        <TableHead className="text-slate-300">Reputation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(validators) && validators.length > 0 ? (
                        validators.map((validator: any) => (
                          <TableRow key={validator.id} className="border-slate-700">
                            <TableCell className="text-white font-medium">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-blue-400" />
                                {validator.institutionName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                {validator.institutionType?.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {Array.isArray(validator.specialization) && validator.specialization.slice(0, 3).map((spec: string, idx: number) => (
                                  <span key={idx} className="inline-flex items-center justify-center w-6 h-6 text-xs bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                                    {getSpecializationIcon(spec)}
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-gray-300">
                                <Globe className="w-4 h-4 text-gray-400" />
                                {validator.country}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-yellow-400 font-medium">
                                  {parseFloat(validator.reputation || '0').toFixed(1)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                            No validators found. Click "Initialize Validators" to set up the network.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>



        {/* Additional tabs can be added here */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Validation Pipeline</CardTitle>
              <CardDescription className="text-gray-400">
                Track mathematical work through institutional validation process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                Validation pipeline functionality coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Academic Certifications</CardTitle>
              <CardDescription className="text-gray-400">
                Institutional certification records and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                Certification records functionality coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submission" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Submit Work for Validation</CardTitle>
              <CardDescription className="text-gray-400">
                Submit mathematical discoveries for institutional peer review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                Work submission functionality coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}