import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Calculator, 
  Zap, 
  Trophy, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Target,
  Brain,
  Atom,
  Waves,
  Clock,
  Star,
  Shield,
  Hash,
  Lock,
  Grid
} from "lucide-react";

export default function MinerSubmissionDemo() {
  const { toast } = useToast();
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [minerId, setMinerId] = useState("");
  const [difficulty, setDifficulty] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [proofFormats, setProofFormats] = useState<any>(null);

  const workTypes = [
    { value: "riemann_zero", label: "Riemann Hypothesis", icon: Brain, color: "bg-purple-500" },
    { value: "prime_pattern", label: "Prime Patterns", icon: Target, color: "bg-blue-500" },
    { value: "yang_mills", label: "Yang-Mills Theory", icon: Atom, color: "bg-red-500" },
    { value: "navier_stokes", label: "Navier-Stokes", icon: Waves, color: "bg-cyan-500" },
    { value: "goldbach_verification", label: "Goldbach Conjecture", icon: Star, color: "bg-yellow-500" },
    { value: "poincare_conjecture", label: "Poincaré Conjecture", icon: Shield, color: "bg-green-500" },
    { value: "birch_swinnerton_dyer", label: "Birch-Swinnerton-Dyer", icon: Hash, color: "bg-indigo-500" },
    { value: "elliptic_curve_crypto", label: "Elliptic Curve Crypto", icon: Lock, color: "bg-orange-500" },
    { value: "lattice_crypto", label: "Lattice Cryptography", icon: Grid, color: "bg-pink-500" }
  ];

  const loadProofFormats = async () => {
    try {
      const response = await fetch("/api/miners/proof-formats");
      const data = await response.json();
      setProofFormats(data);
    } catch (error) {
      console.error("Failed to load proof formats:", error);
    }
  };

  const generateSampleProof = (workType: string, difficulty: number) => {
    const proofs: Record<string, any> = {
      riemann_zero: {
        zeroValue: { real: 0.5, imaginary: 14.134725142 + (difficulty * 0.1) },
        precision: Math.pow(10, -12 - difficulty/10),
        iterations: 50000 + difficulty * 1000,
        computationTime: 45.2 + difficulty * 0.8
      },
      prime_pattern: {
        patternType: "twin",
        searchRange: [2000000 + difficulty * 10000, 3000000 + difficulty * 10000],
        patternsFound: 156 + difficulty * 2,
        computationTime: 89.3 + difficulty * 1.2,
        avgQdtResonance: 0.94 + (difficulty * 0.001)
      },
      yang_mills: {
        fieldConfiguration: `SU(${Math.floor(difficulty/10) + 2})`,
        actionValue: 1.234567 + difficulty * 0.001,
        instanton_number: Math.floor(difficulty/20),
        computationTime: 156.7 + difficulty * 2.1,
        convergenceRate: 0.999 - (difficulty * 0.0001)
      },
      navier_stokes: {
        reynoldsNumber: 1000 + difficulty * 50,
        flowRegime: difficulty > 70 ? "turbulent" : "laminar",
        pressureGradient: 0.001 + difficulty * 0.00005,
        velocityProfile: `computed_${difficulty}_steps`,
        computationTime: 234.1 + difficulty * 3.2
      },
      goldbach_verification: {
        numberTested: 1000000 + difficulty * 50000,
        verificationsCount: 500000 + difficulty * 25000,
        largestPrimePair: [982451, 1017549 + difficulty * 100],
        computationTime: 67.8 + difficulty * 1.1,
        confidenceLevel: 0.9999 + (difficulty * 0.000001)
      },
      poincare_conjecture: {
        manifoldDimension: 3,
        topologicalInvariant: difficulty > 60 ? "non_trivial" : "trivial",
        homologyGroups: `H_${Math.floor(difficulty/15)}`,
        computationTime: 445.2 + difficulty * 4.7,
        ricci_flow_steps: 10000 + difficulty * 200
      },
      birch_swinnerton_dyer: {
        ellipticCurve: `y^2 = x^3 + ${difficulty}x + ${difficulty * 2}`,
        rankComputation: Math.floor(difficulty/25),
        L_function_value: 1.000001 + difficulty * 0.000001,
        computationTime: 789.4 + difficulty * 6.3,
        torsion_subgroup: `Z/${Math.floor(difficulty/10) || 1}Z`
      },
      elliptic_curve_crypto: {
        curveParameters: `secp${256 + difficulty}k1`,
        keyGeneration: true,
        signatureVerification: true,
        computationTime: 12.3 + difficulty * 0.2,
        securityLevel: difficulty + 128
      },
      lattice_crypto: {
        latticeType: "LWE",
        dimension: 512 + difficulty * 8,
        modulusSize: 2048 + difficulty * 16,
        errorDistribution: "discrete_gaussian",
        computationTime: 89.7 + difficulty * 1.4,
        securityEstimate: difficulty + 80
      }
    };

    return proofs[workType] || {};
  };

  const submitWork = async () => {
    if (!minerId.trim() || !selectedWorkType) {
      toast({
        title: "Missing Information",
        description: "Please provide miner ID and select a work type",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const computationProof = generateSampleProof(selectedWorkType, difficulty);
      
      const submission = {
        minerId: minerId.trim(),
        workType: selectedWorkType,
        difficulty,
        computationProof,
        energyReport: {
          energyConsumed: 0.05 + (difficulty * 0.001)
        },
        signature: `sig_${minerId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const response = await fetch("/api/miners/submit-work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setSubmissionResult(result);

      toast({
        title: "Work Submitted Successfully! 🎉",
        description: `Mathematical work submitted for validation. Scientific value: $${result.feedback?.scientificValue || 'calculating...'}`,
      });

    } catch (error) {
      console.error("Submission failed:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedWorkTypeInfo = workTypes.find(wt => wt.value === selectedWorkType);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
          🧮 Miner Submission & Feedback System
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive demonstration of the productive mining blockchain's miner submission API, 
          proof validation formats, and real-time feedback mechanisms.
        </p>
      </div>

      <Tabs defaultValue="submit" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="submit">Submit Work</TabsTrigger>
          <TabsTrigger value="formats">Proof Formats</TabsTrigger>
          <TabsTrigger value="feedback">Feedback System</TabsTrigger>
          <TabsTrigger value="demo">API Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submission Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Submit Mathematical Work
                </CardTitle>
                <CardDescription>
                  Submit your mathematical computation for validation and earn scientific value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minerId">Miner ID</Label>
                  <Input
                    id="minerId"
                    placeholder="Enter your miner identifier"
                    value={minerId}
                    onChange={(e) => setMinerId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workType">Mathematical Work Type</Label>
                  <Select value={selectedWorkType} onValueChange={setSelectedWorkType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mathematical problem type" />
                    </SelectTrigger>
                    <SelectContent>
                      {workTypes.map((workType) => {
                        const Icon = workType.icon;
                        return (
                          <SelectItem key={workType.value} value={workType.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {workType.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Input
                    id="difficulty"
                    type="number"
                    min="1"
                    max="200"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value) || 50)}
                  />
                  <div className="text-sm text-muted-foreground">
                    Higher difficulty = more scientific value (1-200)
                  </div>
                </div>

                {selectedWorkTypeInfo && (
                  <Alert>
                    <selectedWorkTypeInfo.icon className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{selectedWorkTypeInfo.label}</strong>: This mathematical problem type 
                      focuses on {selectedWorkType.includes('crypto') ? 'cryptographic security' : 
                      selectedWorkType.includes('pattern') ? 'number theory patterns' : 
                      'advanced mathematical computation'}.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={submitWork} 
                  disabled={isSubmitting || !minerId.trim() || !selectedWorkType}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Submit Mathematical Work
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Submission Preview
                </CardTitle>
                <CardDescription>
                  Real-time preview of your mathematical work submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedWorkType && minerId ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-semibold text-sm">Computation Proof</h4>
                      <pre className="text-xs mt-2 whitespace-pre-wrap">
                        {JSON.stringify(generateSampleProof(selectedWorkType, difficulty), null, 2)}
                      </pre>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Estimated Value:</span>
                        <div className="text-green-600 font-bold">
                          ${(1200 + difficulty * 15).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Energy Cost:</span>
                        <div className="text-blue-600">
                          {(0.05 + difficulty * 0.001).toFixed(3)} kWh
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Fill in the form to see submission preview
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submission Result */}
          {submissionResult && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Submission Successful!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${submissionResult.feedback?.scientificValue || 'Calculating...'}
                    </div>
                    <div className="text-sm text-muted-foreground">Scientific Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {submissionResult.feedback?.difficulty || difficulty}
                    </div>
                    <div className="text-sm text-muted-foreground">Difficulty Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {submissionResult.feedback?.validationStatus || 'Pending'}
                    </div>
                    <div className="text-sm text-muted-foreground">Validation Status</div>
                  </div>
                </div>
                
                {submissionResult.feedback?.recommendations && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700">Performance Recommendations:</h4>
                    <ul className="mt-2 space-y-1 text-sm text-blue-600">
                      {submissionResult.feedback.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="formats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-indigo-500" />
                Proof Format Specifications
              </CardTitle>
              <CardDescription>
                Required formats for mathematical computation proofs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={loadProofFormats} className="mb-4">
                  Load Proof Format Examples
                </Button>
                
                {proofFormats ? (
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(proofFormats, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workTypes.map((workType) => {
                      const Icon = workType.icon;
                      return (
                        <div key={workType.value} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="h-4 w-4" />
                            <h4 className="font-semibold">{workType.label}</h4>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {workType.value === 'riemann_zero' && "Requires: zeroValue (complex), precision, iterations"}
                            {workType.value === 'prime_pattern' && "Requires: patternType, searchRange, patternsFound"}
                            {workType.value === 'yang_mills' && "Requires: fieldConfiguration, actionValue, instanton_number"}
                            {workType.value === 'navier_stokes' && "Requires: reynoldsNumber, flowRegime, pressureGradient"}
                            {workType.value === 'goldbach_verification' && "Requires: numberTested, verificationsCount, largestPrimePair"}
                            {workType.value === 'poincare_conjecture' && "Requires: manifoldDimension, topologicalInvariant"}
                            {workType.value === 'birch_swinnerton_dyer' && "Requires: ellipticCurve, rankComputation, L_function_value"}
                            {workType.value === 'elliptic_curve_crypto' && "Requires: curveParameters, keyGeneration, signatureVerification"}
                            {workType.value === 'lattice_crypto' && "Requires: latticeType, dimension, modulusSize"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Feedback System Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Real-time scientific value calculation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Performance optimization recommendations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Work type difficulty suggestions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Energy efficiency analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Mathematical proof validation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Miner performance trending</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Validation Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700">1</Badge>
                    <span>Proof format validation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700">2</Badge>
                    <span>Mathematical correctness check</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-100 text-purple-700">3</Badge>
                    <span>Scientific value assessment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-orange-100 text-orange-700">4</Badge>
                    <span>PoS consensus validation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-red-100 text-red-700">5</Badge>
                    <span>Block creation & reward</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints Testing</CardTitle>
                <CardDescription>
                  Test the miner submission API endpoints directly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-slate-100 rounded-lg font-mono text-sm">
                  <div className="text-green-600 font-semibold">POST</div>
                  <div>/api/miners/submit-work</div>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg font-mono text-sm">
                  <div className="text-blue-600 font-semibold">GET</div>
                  <div>/api/miners/:minerId/submissions</div>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg font-mono text-sm">
                  <div className="text-blue-600 font-semibold">GET</div>
                  <div>/api/miners/proof-formats</div>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg font-mono text-sm">
                  <div className="text-blue-600 font-semibold">GET</div>
                  <div>/api/miners/:minerId/feedback</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Current system operational status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Miner Submission API</span>
                    <Badge className="bg-green-100 text-green-700">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Proof Validation Engine</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Scientific Valuation</span>
                    <Badge className="bg-green-100 text-green-700">Calculating</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Feedback Generation</span>
                    <Badge className="bg-green-100 text-green-700">Real-time</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>PoS Validation Network</span>
                    <Badge className="bg-yellow-100 text-yellow-700">Processing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}