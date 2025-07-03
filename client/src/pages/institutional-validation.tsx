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
  
  // Smart Contracts state
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [contractName, setContractName] = useState<string>("");
  const [contractParameters, setContractParameters] = useState<Record<string, string>>({});
  const [generatedContract, setGeneratedContract] = useState<string>("");

  // Contract templates data
  const contractTemplates = [
    {
      id: "discovery-validation",
      name: "Discovery Validation Contract",
      category: "Validation",
      description: "Validates mathematical discoveries through institutional consensus",
      parameters: [
        { name: "minValidators", description: "Minimum validators required", defaultValue: "3" },
        { name: "validationPeriod", description: "Validation period (seconds)", defaultValue: "604800" },
        { name: "stakingAmount", description: "Required staking amount", defaultValue: "1000000000000000000" }
      ]
    },
    {
      id: "mining-pool",
      name: "Mining Pool Contract",
      category: "Mining",
      description: "Collaborative mining pool for mathematical computation",
      parameters: [
        { name: "poolFee", description: "Pool fee percentage", defaultValue: "5" },
        { name: "minContribution", description: "Minimum contribution", defaultValue: "100000000000000000" }
      ]
    },
    {
      id: "peer-review",
      name: "Peer Review Protocol",
      category: "Research",
      description: "Manages peer review process for academic research",
      parameters: [
        { name: "reviewPeriod", description: "Review period (days)", defaultValue: "30" },
        { name: "reviewerReward", description: "Reviewer reward amount", defaultValue: "50000000000000000" },
        { name: "consensusThreshold", description: "Consensus threshold", defaultValue: "66" }
      ]
    },
    {
      id: "data-licensing",
      name: "Data Licensing Contract",
      category: "Licensing", 
      description: "Smart contract for licensing mathematical research data",
      parameters: [
        { name: "licensePrice", description: "License price", defaultValue: "500000000000000000" },
        { name: "licenseDuration", description: "License duration (months)", defaultValue: "12" },
        { name: "royaltyPercentage", description: "Royalty percentage", defaultValue: "10" }
      ]
    },
    {
      id: "research-collaboration",
      name: "Research Collaboration Framework",
      category: "Collaboration",
      description: "Facilitates multi-institutional research collaboration",
      parameters: [
        { name: "institutions", description: "Number of institutions", defaultValue: "3" },
        { name: "fundingAmount", description: "Total funding amount", defaultValue: "10000000000000000000" },
        { name: "milestones", description: "Number of project milestones", defaultValue: "5" }
      ]
    }
  ];

  // Generate contract function
  const generateContract = () => {
    const template = contractTemplates.find(t => t.id === selectedTemplate);
    if (!template || !contractName) return;

    const contractCode = generateContractCode(template, contractName, contractParameters);
    setGeneratedContract(contractCode);
    
    toast({
      title: "Contract Generated Successfully!",
      description: `${contractName} smart contract has been generated and is ready for deployment.`,
    });
  };

  // Generate contract code function
  const generateContractCode = (template: any, name: string, params: Record<string, string>) => {
    const contractTemplate = getContractTemplate(template.id);
    
    // Replace placeholders with actual values
    let contractCode = contractTemplate
      .replace(/{{CONTRACT_NAME}}/g, name.replace(/\s+/g, ''))
      .replace(/{{TIMESTAMP}}/g, new Date().toISOString());

    // Replace parameter placeholders
    template.parameters.forEach((param: any) => {
      const value = params[param.name] || param.defaultValue || '';
      contractCode = contractCode.replace(new RegExp(`{{${param.name.toUpperCase()}}}`, 'g'), value);
    });

    return contractCode;
  };

  // Contract templates based on type
  const getContractTemplate = (templateId: string) => {
    const templates: Record<string, string> = {
      "discovery-validation": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title {{CONTRACT_NAME}}
 * @dev Smart contract for validating mathematical discoveries with institutional consensus
 * @notice Generated on {{TIMESTAMP}}
 */
contract {{CONTRACT_NAME}} is Ownable, ReentrancyGuard {
    
    struct Discovery {
        uint256 id;
        address submitter;
        string workType;
        string result;
        uint256 scientificValue;
        bool validated;
        uint256 validationCount;
        mapping(address => bool) validators;
    }
    
    mapping(uint256 => Discovery) public discoveries;
    mapping(address => bool) public authorizedValidators;
    
    uint256 public minValidators = {{MINVALIDATORS}};
    uint256 public validationPeriod = {{VALIDATIONPERIOD}};
    uint256 public stakingAmount = {{STAKINGAMOUNT}};
    
    event DiscoverySubmitted(uint256 indexed discoveryId, address indexed submitter);
    event DiscoveryValidated(uint256 indexed discoveryId, address indexed validator);
    event ValidationCompleted(uint256 indexed discoveryId, bool approved);
    
    modifier onlyAuthorizedValidator() {
        require(authorizedValidators[msg.sender], "Not authorized validator");
        _;
    }
    
    function submitDiscovery(
        uint256 _discoveryId,
        string memory _workType,
        string memory _result,
        uint256 _scientificValue
    ) external payable {
        require(msg.value >= stakingAmount, "Insufficient staking amount");
        
        Discovery storage discovery = discoveries[_discoveryId];
        discovery.id = _discoveryId;
        discovery.submitter = msg.sender;
        discovery.workType = _workType;
        discovery.result = _result;
        discovery.scientificValue = _scientificValue;
        
        emit DiscoverySubmitted(_discoveryId, msg.sender);
    }
    
    function validateDiscovery(uint256 _discoveryId) external onlyAuthorizedValidator {
        Discovery storage discovery = discoveries[_discoveryId];
        require(discovery.id != 0, "Discovery does not exist");
        require(!discovery.validators[msg.sender], "Already validated by this validator");
        
        discovery.validators[msg.sender] = true;
        discovery.validationCount++;
        
        emit DiscoveryValidated(_discoveryId, msg.sender);
        
        if (discovery.validationCount >= minValidators) {
            discovery.validated = true;
            emit ValidationCompleted(_discoveryId, true);
        }
    }
    
    function addValidator(address _validator) external onlyOwner {
        authorizedValidators[_validator] = true;
    }
    
    function removeValidator(address _validator) external onlyOwner {
        authorizedValidators[_validator] = false;
    }
}`,
      
      "mining-pool": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title {{CONTRACT_NAME}}
 * @dev Collaborative mining pool for mathematical problem solving
 * @notice Generated on {{TIMESTAMP}}
 */
contract {{CONTRACT_NAME}} is Ownable, ReentrancyGuard {
    
    struct Contributor {
        uint256 contribution;
        uint256 computePower;
        uint256 rewardsEarned;
        bool active;
    }
    
    mapping(address => Contributor) public contributors;
    address[] public contributorList;
    
    uint256 public poolFee = {{POOLFEE}}; // Percentage
    uint256 public minContribution = {{MINCONTRIBUTION}};
    uint256 public totalContributions;
    uint256 public totalRewards;
    
    event ContributionAdded(address indexed contributor, uint256 amount);
    event RewardsDistributed(uint256 totalAmount);
    event ContributorJoined(address indexed contributor);
    
    function joinPool() external payable {
        require(msg.value >= minContribution, "Contribution below minimum");
        
        if (contributors[msg.sender].contribution == 0) {
            contributorList.push(msg.sender);
            emit ContributorJoined(msg.sender);
        }
        
        contributors[msg.sender].contribution += msg.value;
        contributors[msg.sender].active = true;
        totalContributions += msg.value;
        
        emit ContributionAdded(msg.sender, msg.value);
    }
    
    function distributeRewards() external payable onlyOwner {
        require(msg.value > 0, "No rewards to distribute");
        
        uint256 feeAmount = (msg.value * poolFee) / 100;
        uint256 rewardAmount = msg.value - feeAmount;
        
        for (uint256 i = 0; i < contributorList.length; i++) {
            address contributor = contributorList[i];
            if (contributors[contributor].active) {
                uint256 share = (contributors[contributor].contribution * rewardAmount) / totalContributions;
                contributors[contributor].rewardsEarned += share;
            }
        }
        
        totalRewards += rewardAmount;
        emit RewardsDistributed(rewardAmount);
    }
    
    function withdrawRewards() external nonReentrant {
        uint256 rewards = contributors[msg.sender].rewardsEarned;
        require(rewards > 0, "No rewards to withdraw");
        
        contributors[msg.sender].rewardsEarned = 0;
        payable(msg.sender).transfer(rewards);
    }
}`
    };
    
    return templates[templateId] || templates["discovery-validation"];
  };

  // Copy contract to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContract);
    toast({
      title: "Copied to Clipboard",
      description: "Smart contract code has been copied to your clipboard.",
    });
  };

  // Download contract as .sol file
  const downloadContract = () => {
    const blob = new Blob([generatedContract], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName.replace(/\s+/g, '')}.sol`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
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
          <TabsTrigger value="contracts" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            <Code className="w-4 h-4 mr-2" />
            Smart Contracts
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

        {/* Smart Contracts Tab */}
        <TabsContent value="contracts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contract Generator */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  Smart Contract Generator
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Generate custom smart contracts for research protocols
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Contract Name
                    </label>
                    <Input
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                      placeholder="Enter contract name..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Contract Type
                    </label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select contract type..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {contractTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id} className="text-white">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              {template.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTemplate && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-300">Parameters</h4>
                      {contractTemplates
                        .find(t => t.id === selectedTemplate)
                        ?.parameters.map((param) => (
                          <div key={param.name}>
                            <label className="text-xs text-gray-400 mb-1 block">
                              {param.description}
                            </label>
                            <Input
                              value={contractParameters[param.name] || param.defaultValue}
                              onChange={(e) => setContractParameters(prev => ({
                                ...prev,
                                [param.name]: e.target.value
                              }))}
                              placeholder={param.defaultValue}
                              className="bg-slate-700 border-slate-600 text-white text-sm"
                            />
                          </div>
                        ))}
                    </div>
                  )}

                  <Button 
                    onClick={generateContract}
                    disabled={!selectedTemplate || !contractName}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Generate Contract
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Contract Display */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-green-400" />
                  Generated Contract
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Ready-to-deploy Solidity smart contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedContract ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button 
                        onClick={copyToClipboard}
                        variant="outline" 
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button 
                        onClick={downloadContract}
                        variant="outline" 
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                        {generatedContract}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Code className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                    <p>Generate a contract to see the code here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contract Templates Overview */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Available Contract Templates</CardTitle>
              <CardDescription className="text-gray-400">
                Pre-built smart contract templates for research protocols
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTemplate === template.id 
                        ? 'bg-blue-500/10 border-blue-500/50' 
                        : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-blue-400" />
                      <h3 className="font-medium text-white text-sm">{template.name}</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{template.description}</p>
                    <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {template.category}
                    </Badge>
                  </div>
                ))}
              </div>
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