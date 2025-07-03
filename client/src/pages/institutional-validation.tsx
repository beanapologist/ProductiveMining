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
  Zap,
  Target,
  Activity
} from "lucide-react";

export function InstitutionalValidation() {
  const { toast } = useToast();
  const [selectedWork, setSelectedWork] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedValidator, setSelectedValidator] = useState<number | null>(null);
  const [validationStats, setValidationStats] = useState<any>(null);

  // Get institutional validators
  const { data: validators = [], isLoading: loadingValidators } = useQuery({
    queryKey: ['/api/institutional/validators'],
  });

  // Get pipeline reports
  const { data: pipelineReports = [], isLoading: loadingPipeline } = useQuery({
    queryKey: ['/api/institutional/pipeline'],
  });

  // Get certification records  
  const { data: certifications = [], isLoading: loadingCerts } = useQuery({
    queryKey: ['/api/institutional/certifications'],
  });

  // Get mathematical work for validation
  const { data: discoveries = [] } = useQuery({
    queryKey: ['/api/discoveries'],
  });

  // Get validation statistics
  const { data: validationStatistics } = useQuery({
    queryKey: ['/api/validations'],
    select: (data: any[]) => {
      const totalValidations = data.length;
      const approvedValidations = data.filter((v: any) => v.validationStatus === 'approved').length;
      const pendingValidations = data.filter((v: any) => v.validationStatus === 'pending_consensus').length;
      const rejectedValidations = data.filter((v: any) => v.validationStatus === 'rejected').length;
      
      return {
        total: totalValidations,
        approved: approvedValidations,
        pending: pendingValidations,
        rejected: rejectedValidations,
        approvalRate: totalValidations > 0 ? (approvedValidations / totalValidations) * 100 : 0
      };
    }
  });

  // Submit to validation pipeline mutation
  const submitToValidation = useMutation({
    mutationFn: async (workId: number) => {
      return apiRequest(`/api/institutional/validate/${workId}`, {
        method: 'POST'
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Validation Submitted",
        description: data.message || "Successfully submitted to validation pipeline",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/institutional/pipeline'] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.error || "Failed to submit to validation pipeline",
        variant: "destructive",
      });
    },
  });

  // Initialize validators mutation
  const initializeValidators = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/institutional/validators/init', {
        method: 'POST'
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Validators Initialized",
        description: data.message || "Successfully initialized institutional validators",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/institutional/validators'] });
    },
    onError: (error: any) => {
      toast({
        title: "Initialization Failed",
        description: error.response?.data?.error || "Failed to initialize validators",
        variant: "destructive",
      });
    },
  });

  if (loadingValidators || loadingPipeline || loadingCerts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getValidatorIcon = (type: string) => {
    return type === 'university' ? GraduationCap : Building2;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'pending': return Clock;
      case 'in_progress': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Institutional Validation Pipeline
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Formal academic verification of mathematical discoveries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Validators</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{(validators as any[]).length}</div>
            <p className="text-xs text-blue-600">Academic institutions</p>
            <div className="mt-2 flex items-center gap-2">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Avg. Rep: {(validators as any[]).length > 0 ? 
                  ((validators as any[]).reduce((acc: number, v: any) => acc + parseFloat(v.reputation || 0), 0) / (validators as any[]).length).toFixed(1) :
                  '0'}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Validations</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {validationStatistics?.total || 0}
            </div>
            <p className="text-xs text-orange-600">All time validations</p>
            <div className="mt-2 flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {validationStatistics?.approvalRate?.toFixed(1) || '0'}% approval rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {validationStatistics?.pending || 0}
            </div>
            <p className="text-xs text-purple-600">Awaiting consensus</p>
            <div className="mt-2">
              <Progress 
                value={validationStatistics?.total ? (validationStatistics.pending / validationStatistics.total) * 100 : 0} 
                className="h-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{(certifications as any[]).length}</div>
            <p className="text-xs text-green-600">Completed validations</p>
            <div className="mt-2 flex items-center gap-2">
              <Target className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {validationStatistics?.approved || 0} approved
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="validators" className="space-y-6">
        <TabsList>
          <TabsTrigger value="validators">Institutional Validators</TabsTrigger>
          <TabsTrigger value="pipeline">Validation Pipeline</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
          <TabsTrigger value="submit">Submit Work</TabsTrigger>
        </TabsList>

        <TabsContent value="validators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Academic Validation Network
              </CardTitle>
              <CardDescription>
                Prestigious institutions providing formal verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search institutions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Institution Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="university">Universities</SelectItem>
                      <SelectItem value="research_institute">Research Institutes</SelectItem>
                    </SelectContent>
                  </Select>
                  {(validators as any[]).length === 0 && (
                    <Button 
                      onClick={() => initializeValidators.mutate()}
                      disabled={initializeValidators.isPending}
                      className="whitespace-nowrap"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {initializeValidators.isPending ? 'Initializing...' : 'Initialize Validators'}
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(validators as any[])
                  .filter((validator: any) => {
                    const matchesSearch = searchQuery === "" || 
                      validator.institutionName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      validator.country?.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesType = filterType === "all" || validator.institutionType === filterType;
                    return matchesSearch && matchesType;
                  })
                  .map((validator: any) => {
                    const IconComponent = getValidatorIcon(validator.institutionType);
                    return (
                      <Card 
                        key={validator.id} 
                        className={`border-2 hover:border-blue-300 transition-all duration-200 cursor-pointer ${
                          selectedValidator === validator.id ? 'border-blue-500 ring-2 ring-blue-200' : ''
                        }`}
                        onClick={() => setSelectedValidator(selectedValidator === validator.id ? null : validator.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <IconComponent className="w-8 h-8 text-blue-600 mt-1" />
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {validator.institutionName}
                                </h3>
                                {validator.isActive && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="h-3 w-3 text-gray-400" />
                                <Badge variant="outline" className="text-xs">
                                  {validator.country}
                                </Badge>
                                <Star className="h-3 w-3 text-yellow-500" />
                                <Badge variant="secondary" className="text-xs">
                                  {parseFloat(validator.reputation || 0).toFixed(1)}%
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  Specializations:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {validator.specialization?.map((spec: string) => (
                                    <Badge key={spec} variant="outline" className="text-xs">
                                      {spec.replace('_', ' ')}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              {validator.totalValidations && (
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                    <span>Total Validations: {validator.totalValidations}</span>
                                    <span>Success Rate: {validator.successfulValidations ? 
                                      ((validator.successfulValidations / validator.totalValidations) * 100).toFixed(1) : '0'}%
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
              {(validators as any[]).filter((validator: any) => {
                const matchesSearch = searchQuery === "" || 
                  validator.institutionName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  validator.country?.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesType = filterType === "all" || validator.institutionType === filterType;
                return matchesSearch && matchesType;
              }).length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No validators match your search criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Active Validation Pipeline
              </CardTitle>
              <CardDescription>
                Real-time status of institutional reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pipelineReports.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No active validations</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Completion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pipelineReports.map((report: any) => {
                      const StatusIcon = getStatusIcon(report.status);
                      return (
                        <TableRow key={report.pipelineId}>
                          <TableCell className="font-medium">#{report.workId}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{report.workType}</Badge>
                          </TableCell>
                          <TableCell>{report.currentStage}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <StatusIcon className="w-4 h-4" />
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                {report.progress.completed}/{report.progress.required} reviews
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${(report.progress.completed / report.progress.required) * 100}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                            {report.estimatedCompletion ? 
                              new Date(report.estimatedCompletion).toLocaleDateString() : 
                              'Pending'
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Validation Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Validation Analytics
                </CardTitle>
                <CardDescription>
                  Real-time validation performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</span>
                      <span className="text-sm font-medium">
                        {validationStatistics?.approvalRate?.toFixed(1) || '0'}%
                      </span>
                    </div>
                    <Progress value={validationStatistics?.approvalRate || 0} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pipeline Efficiency</span>
                      <span className="text-sm font-medium">
                        {(pipelineReports as any[]).length > 0 ? 
                          ((pipelineReports as any[]).filter((p: any) => p.status === 'completed').length / (pipelineReports as any[]).length * 100).toFixed(1) :
                          '0'}%
                      </span>
                    </div>
                    <Progress 
                      value={(pipelineReports as any[]).length > 0 ? 
                        (pipelineReports as any[]).filter((p: any) => p.status === 'completed').length / (pipelineReports as any[]).length * 100 :
                        0} 
                      className="h-2" 
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Validation Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Approved</span>
                      </div>
                      <span className="text-sm font-medium">{validationStatistics?.approved || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="text-sm font-medium">{validationStatistics?.pending || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Rejected</span>
                      </div>
                      <span className="text-sm font-medium">{validationStatistics?.rejected || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Network Insights
                </CardTitle>
                <CardDescription>
                  Institutional validation network performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Active Validators</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {(validators as any[]).filter((v: any) => v.isActive).length || (validators as any[]).length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Global Coverage</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">
                      {new Set((validators as any[]).map((v: any) => v.country)).size} Countries
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Avg. Reputation</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {(validators as any[]).length > 0 ? 
                        ((validators as any[]).reduce((acc: number, v: any) => acc + parseFloat(v.reputation || 0), 0) / (validators as any[]).length).toFixed(1) :
                        '0'}%
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Top Validators by Reputation</h4>
                  <div className="space-y-2">
                    {(validators as any[])
                      .sort((a: any, b: any) => parseFloat(b.reputation || 0) - parseFloat(a.reputation || 0))
                      .slice(0, 3)
                      .map((validator: any, index: number) => (
                        <div key={validator.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium truncate max-w-32">
                              {validator.institutionName}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            {parseFloat(validator.reputation || 0).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Academic Certifications
              </CardTitle>
              <CardDescription>
                Formally validated mathematical discoveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {certifications.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No certifications issued yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.map((cert: any) => (
                    <Card key={cert.id} className="border-2 border-green-200 dark:border-green-800">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Award className="w-8 h-8 text-green-600 mt-1" />
                          <div className="space-y-2 flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Work #{cert.workId}
                            </h3>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              {cert.certificationLevel}
                            </Badge>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {cert.scientificSignificance}
                            </p>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Score: {cert.consensusScore}%</span>
                              <span>Certified: {new Date(cert.certifiedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Submit Work for Validation
              </CardTitle>
              <CardDescription>
                Submit mathematical discoveries to institutional validation pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Mathematical Work
                </label>
                <select 
                  className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  value={selectedWork || ''}
                  onChange={(e) => setSelectedWork(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">Choose discovery to validate...</option>
                  {discoveries.map((work: any) => (
                    <option key={work.id} value={work.id}>
                      #{work.id} - {work.workType.replace('_', ' ')} (${work.scientificValue.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedWork && (
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Selected Work Details
                  </h4>
                  {discoveries.find((w: any) => w.id === selectedWork) && (
                    <div className="space-y-2 text-sm">
                      <div>Work Type: {discoveries.find((w: any) => w.id === selectedWork)?.workType}</div>
                      <div>Difficulty: {discoveries.find((w: any) => w.id === selectedWork)?.difficulty}</div>
                      <div>Scientific Value: ${discoveries.find((w: any) => w.id === selectedWork)?.scientificValue.toLocaleString()}</div>
                    </div>
                  )}
                </div>
              )}

              <Button 
                onClick={() => selectedWork && submitToValidation.mutate(selectedWork)}
                disabled={!selectedWork || submitToValidation.isPending}
                className="w-full"
              >
                {submitToValidation.isPending ? 'Submitting...' : 'Submit to Validation Pipeline'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}