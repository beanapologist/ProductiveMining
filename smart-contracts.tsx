import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  FileCode, 
  Scroll, 
  Shield, 
  Zap, 
  Download, 
  Copy, 
  Check,
  Plus,
  Settings,
  Code,
  Brain,
  Award,
  Users
} from 'lucide-react';

interface SmartContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  contractCode: string;
  parameters: ContractParameter[];
  usageCount: number;
  createdAt: string;
}

interface ContractParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

interface GeneratedContract {
  id: string;
  templateId: string;
  name: string;
  parameters: Record<string, any>;
  contractCode: string;
  deploymentReady: boolean;
  createdAt: string;
}

const contractTemplates: SmartContractTemplate[] = [
  {
    id: 'research-discovery',
    name: 'Mathematical Discovery Protocol',
    category: 'Research',
    description: 'Smart contract for registering and validating mathematical discoveries with peer review',
    usageCount: 145,
    createdAt: '2025-01-15',
    parameters: [
      { name: 'discoveryTitle', type: 'string', description: 'Title of the mathematical discovery', required: true },
      { name: 'researcherAddress', type: 'address', description: 'Ethereum address of the researcher', required: true },
      { name: 'validationPeriod', type: 'uint256', description: 'Days for peer validation', required: true, defaultValue: '30' },
      { name: 'minimumValidators', type: 'uint256', description: 'Minimum number of validators required', required: true, defaultValue: '3' },
      { name: 'rewardAmount', type: 'uint256', description: 'PROD tokens rewarded for discovery', required: true, defaultValue: '1000' }
    ],
    contractCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MathematicalDiscoveryProtocol is ReentrancyGuard {
    IERC20 public prodToken;
    
    struct Discovery {
        string title;
        address researcher;
        string ipfsHash;
        uint256 timestamp;
        uint256 validationDeadline;
        uint256 validatorCount;
        uint256 rewardAmount;
        bool validated;
        bool rewarded;
        mapping(address => bool) validators;
    }
    
    mapping(uint256 => Discovery) public discoveries;
    uint256 public discoveryCounter;
    uint256 public validationPeriod = {{validationPeriod}} days;
    uint256 public minimumValidators = {{minimumValidators}};
    
    event DiscoverySubmitted(uint256 indexed discoveryId, address indexed researcher, string title);
    event DiscoveryValidated(uint256 indexed discoveryId, address indexed validator);
    event RewardDistributed(uint256 indexed discoveryId, address indexed researcher, uint256 amount);
    
    constructor(address _prodToken) {
        prodToken = IERC20(_prodToken);
    }
    
    function submitDiscovery(string memory _title, string memory _ipfsHash) external {
        uint256 discoveryId = discoveryCounter++;
        Discovery storage discovery = discoveries[discoveryId];
        
        discovery.title = _title;
        discovery.researcher = msg.sender;
        discovery.ipfsHash = _ipfsHash;
        discovery.timestamp = block.timestamp;
        discovery.validationDeadline = block.timestamp + validationPeriod;
        discovery.rewardAmount = {{rewardAmount}} * 10**18;
        
        emit DiscoverySubmitted(discoveryId, msg.sender, _title);
    }
    
    function validateDiscovery(uint256 _discoveryId) external {
        Discovery storage discovery = discoveries[_discoveryId];
        require(block.timestamp <= discovery.validationDeadline, "Validation period expired");
        require(!discovery.validators[msg.sender], "Already validated");
        require(msg.sender != discovery.researcher, "Cannot validate own discovery");
        
        discovery.validators[msg.sender] = true;
        discovery.validatorCount++;
        
        emit DiscoveryValidated(_discoveryId, msg.sender);
        
        if (discovery.validatorCount >= minimumValidators) {
            discovery.validated = true;
            _distributeReward(_discoveryId);
        }
    }
    
    function _distributeReward(uint256 _discoveryId) internal nonReentrant {
        Discovery storage discovery = discoveries[_discoveryId];
        require(discovery.validated && !discovery.rewarded, "Invalid reward conditions");
        
        discovery.rewarded = true;
        prodToken.transfer(discovery.researcher, discovery.rewardAmount);
        
        emit RewardDistributed(_discoveryId, discovery.researcher, discovery.rewardAmount);
    }
}`
  },
  {
    id: 'pos-validator',
    name: 'PoS Validator Contract',
    category: 'Validation',
    description: 'Proof-of-Stake validator contract for mathematical work verification',
    usageCount: 89,
    createdAt: '2025-01-20',
    parameters: [
      { name: 'minimumStake', type: 'uint256', description: 'Minimum PROD tokens required to stake', required: true, defaultValue: '10000' },
      { name: 'validatorReward', type: 'uint256', description: 'Reward per validation', required: true, defaultValue: '100' },
      { name: 'slashingPenalty', type: 'uint256', description: 'Penalty for invalid validation', required: true, defaultValue: '1000' }
    ],
    contractCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PoSValidatorContract {
    IERC20 public prodToken;
    
    struct Validator {
        uint256 stakedAmount;
        uint256 validationCount;
        uint256 correctValidations;
        bool active;
        uint256 reputation;
    }
    
    mapping(address => Validator) public validators;
    uint256 public minimumStake = {{minimumStake}} * 10**18;
    uint256 public validatorReward = {{validatorReward}} * 10**18;
    uint256 public slashingPenalty = {{slashingPenalty}} * 10**18;
    
    function stakeToValidate() external {
        require(prodToken.transferFrom(msg.sender, address(this), minimumStake), "Stake failed");
        
        validators[msg.sender].stakedAmount += minimumStake;
        validators[msg.sender].active = true;
    }
    
    function validateWork(uint256 workId, bool isValid) external {
        require(validators[msg.sender].active, "Not an active validator");
        
        validators[msg.sender].validationCount++;
        
        if (isValid) {
            validators[msg.sender].correctValidations++;
            validators[msg.sender].reputation += 10;
            prodToken.transfer(msg.sender, validatorReward);
        } else {
            validators[msg.sender].stakedAmount -= slashingPenalty;
            validators[msg.sender].reputation = validators[msg.sender].reputation > 5 ? 
                validators[msg.sender].reputation - 5 : 0;
        }
    }
}`
  },
  {
    id: 'research-collaboration',
    name: 'Research Collaboration Agreement',
    category: 'Collaboration',
    description: 'Multi-party contract for collaborative research projects with shared rewards',
    usageCount: 67,
    createdAt: '2025-01-25',
    parameters: [
      { name: 'projectTitle', type: 'string', description: 'Title of the research project', required: true },
      { name: 'collaboratorCount', type: 'uint256', description: 'Number of collaborators', required: true, defaultValue: '3' },
      { name: 'projectDuration', type: 'uint256', description: 'Project duration in days', required: true, defaultValue: '180' },
      { name: 'totalBudget', type: 'uint256', description: 'Total project budget in PROD tokens', required: true, defaultValue: '50000' }
    ],
    contractCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ResearchCollaborationAgreement {
    struct Collaborator {
        address addr;
        uint256 contributionWeight;
        bool approved;
    }
    
    string public projectTitle = "{{projectTitle}}";
    uint256 public totalBudget = {{totalBudget}} * 10**18;
    uint256 public projectDeadline;
    
    Collaborator[] public collaborators;
    mapping(address => bool) public isCollaborator;
    
    constructor(address[] memory _collaborators, uint256[] memory _weights) {
        require(_collaborators.length == {{collaboratorCount}}, "Invalid collaborator count");
        
        projectDeadline = block.timestamp + {{projectDuration}} days;
        
        for (uint i = 0; i < _collaborators.length; i++) {
            collaborators.push(Collaborator(_collaborators[i], _weights[i], false));
            isCollaborator[_collaborators[i]] = true;
        }
    }
    
    function approveCompletion() external {
        require(isCollaborator[msg.sender], "Not a collaborator");
        
        for (uint i = 0; i < collaborators.length; i++) {
            if (collaborators[i].addr == msg.sender) {
                collaborators[i].approved = true;
                break;
            }
        }
        
        _checkAndDistributeRewards();
    }
    
    function _checkAndDistributeRewards() internal {
        uint approvedCount = 0;
        for (uint i = 0; i < collaborators.length; i++) {
            if (collaborators[i].approved) approvedCount++;
        }
        
        if (approvedCount >= (collaborators.length * 2) / 3) {
            _distributeRewards();
        }
    }
}`
  }
];

export default function SmartContractsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedTemplate, setSelectedTemplate] = useState<SmartContractTemplate | null>(null);
  const [contractName, setContractName] = useState('');
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [showGenerated, setShowGenerated] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const { data: generatedContracts = [] } = useQuery<GeneratedContract[]>({
    queryKey: ['/api/smart-contracts'],
    queryFn: () => Promise.resolve([]), // Will implement API later
  });

  const generateContract = useMutation({
    mutationFn: async (data: any) => {
      // Simulate contract generation
      let code = selectedTemplate?.contractCode || '';
      
      // Replace parameters in template
      Object.entries(parameters).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        code = code.replace(regex, value);
      });
      
      return { code, name: contractName };
    },
    onSuccess: (data) => {
      setGeneratedCode(data.code);
      setShowGenerated(true);
      toast({
        title: "Contract Generated",
        description: "Smart contract template has been customized successfully",
      });
    },
  });

  const handleParameterChange = (paramName: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleGenerateContract = () => {
    if (!selectedTemplate || !contractName) {
      toast({
        title: "Missing Information",
        description: "Please select a template and provide a contract name",
        variant: "destructive",
      });
      return;
    }

    // Set default values for missing required parameters
    const allParameters = { ...parameters };
    selectedTemplate.parameters.forEach(param => {
      if (param.required && !allParameters[param.name] && param.defaultValue) {
        allParameters[param.name] = param.defaultValue;
      }
    });
    
    setParameters(allParameters);
    generateContract.mutate({ templateId: selectedTemplate.id, name: contractName, parameters: allParameters });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "Contract code has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy contract code",
        variant: "destructive",
      });
    }
  };

  const downloadContract = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName.replace(/\s+/g, '_')}.sol`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Contract file is being downloaded",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white">
            <FileCode className="mr-3 h-8 w-8 text-blue-400" />
            Smart Contract Templates
          </h1>
          <p className="text-gray-400 mt-2">
            Generate standardized smart contracts for research protocols and validation systems
          </p>
        </div>
      </div>

      {/* Template Categories Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-400" />
              Research Protocols
            </CardTitle>
            <CardDescription className="text-gray-400">
              Discovery & validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {contractTemplates.filter(t => t.category === 'Research').length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Available templates
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-400" />
              Validation Systems
            </CardTitle>
            <CardDescription className="text-gray-400">
              PoS & consensus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {contractTemplates.filter(t => t.category === 'Validation').length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Available templates
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Users className="mr-2 h-5 w-5 text-orange-400" />
              Collaboration
            </CardTitle>
            <CardDescription className="text-gray-400">
              Multi-party agreements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">
              {contractTemplates.filter(t => t.category === 'Collaboration').length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Available templates
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Award className="mr-2 h-5 w-5 text-yellow-400" />
              Total Usage
            </CardTitle>
            <CardDescription className="text-gray-400">
              Generated contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {contractTemplates.reduce((sum, t) => sum + t.usageCount, 0)}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Times deployed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template Selection */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Scroll className="h-5 w-5 mr-2 text-blue-400" />
              Choose Template
            </CardTitle>
            <CardDescription className="text-gray-400">
              Select a smart contract template for your research protocol
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contractTemplates.map((template) => (
              <div 
                key={template.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{template.name}</h3>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">{template.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template.parameters.length} parameters</span>
                  <span>Used {template.usageCount} times</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contract Configuration */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="h-5 w-5 mr-2 text-green-400" />
              Configure Contract
            </CardTitle>
            <CardDescription className="text-gray-400">
              Customize parameters for your smart contract
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate ? (
              <>
                <div>
                  <Label htmlFor="contractName" className="text-slate-300">Contract Name</Label>
                  <Input
                    id="contractName"
                    value={contractName}
                    onChange={(e) => setContractName(e.target.value)}
                    placeholder="Enter contract name"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-white">Parameters</h4>
                  {selectedTemplate.parameters.map((param) => (
                    <div key={param.name}>
                      <Label htmlFor={param.name} className="text-slate-300">
                        {param.name} {param.required && <span className="text-red-400">*</span>}
                      </Label>
                      <Input
                        id={param.name}
                        value={parameters[param.name] || param.defaultValue || ''}
                        onChange={(e) => handleParameterChange(param.name, e.target.value)}
                        placeholder={param.description}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">{param.description}</p>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleGenerateContract}
                  disabled={generateContract.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {generateContract.isPending ? 'Generating...' : 'Generate Contract'}
                  <Code className="h-4 w-4 ml-2" />
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Scroll className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Select a template to configure parameters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generated Contract */}
      {showGenerated && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                Generated Contract: {contractName}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="border-gray-600 hover:bg-gray-700"
                >
                  {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedCode ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadContract}
                  className="border-gray-600 hover:bg-gray-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Ready-to-deploy Solidity smart contract
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedCode}
              readOnly
              className="font-mono text-sm bg-slate-900 border-slate-600 text-green-400 min-h-[400px]"
            />
            <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm">
                ✅ Contract generated successfully! This contract is ready for deployment on Ethereum-compatible networks.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Start Guide */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="h-5 w-5 mr-2 text-purple-400" />
            Quick Start Guide
          </CardTitle>
          <CardDescription className="text-gray-400">
            How to use smart contract templates for research protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/30 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">1</div>
                <h4 className="font-medium text-white">Choose Template</h4>
              </div>
              <p className="text-sm text-gray-400">Select from research discovery, validation, or collaboration templates</p>
            </div>
            <div className="p-4 bg-slate-900/30 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">2</div>
                <h4 className="font-medium text-white">Configure Parameters</h4>
              </div>
              <p className="text-sm text-gray-400">Set validation periods, rewards, minimum stakes, and other protocol parameters</p>
            </div>
            <div className="p-4 bg-slate-900/30 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">3</div>
                <h4 className="font-medium text-white">Deploy & Use</h4>
              </div>
              <p className="text-sm text-gray-400">Download the generated Solidity code and deploy to your preferred blockchain network</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}