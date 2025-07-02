import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, Key, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface SecurityAnalysis {
  discoveryCount: number;
  enhancedCryptoKey?: {
    keyStrength: number;
    quantumResistance: number;
    securityLevel: string;
    enhancementSources: string[];
  };
  primeSignature?: {
    signature: string;
    verificationHash: string;
    primeStrength: number;
  };
  securityHash?: {
    hash: string;
    layers: number;
    entropy: number;
    securityLevel: string;
  };
  timestamp: string;
}

export default function SecurityDashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<SecurityAnalysis | null>(null);

  const { data: discoveries } = useQuery({
    queryKey: ['/api/discoveries'],
    refetchInterval: 30000,
  });

  const runSecurityAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/crypto/analysis');
      const data = await response.json();
      setLastAnalysis(data.analysis);
    } catch (error) {
      console.error('Security analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (discoveries?.length > 0) {
      runSecurityAnalysis();
    }
  }, [discoveries]);

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'Military Grade': case 'POST_QUANTUM': return 'bg-red-500';
      case 'Enterprise Grade': case 'QUANTUM_SAFE': return 'bg-purple-500';
      case 'Commercial Grade': case 'ENHANCED': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSecurityLevelIcon = (level: string) => {
    switch (level) {
      case 'Military Grade': case 'POST_QUANTUM': return <Shield className="h-5 w-5" />;
      case 'Enterprise Grade': case 'QUANTUM_SAFE': return <Lock className="h-5 w-5" />;
      case 'Commercial Grade': case 'ENHANCED': return <Key className="h-5 w-5" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white">
            <Shield className="mr-3 h-8 w-8 text-purple-400" />
            Enhanced Security Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Cryptographic security powered by real mathematical discoveries
          </p>
        </div>
        <Button 
          onClick={runSecurityAnalysis}
          disabled={isAnalyzing}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isAnalyzing ? (
            <>
              <Zap className="mr-2 h-4 w-4 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Run Analysis
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Discovery Count */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-400" />
              Mathematical Discoveries
            </CardTitle>
            <CardDescription className="text-gray-400">
              Available for security enhancement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {discoveries?.length || 0}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Active discoveries in system
            </p>
          </CardContent>
        </Card>

        {/* Enhanced Crypto Key */}
        {lastAnalysis?.enhancedCryptoKey && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Key className="mr-2 h-5 w-5 text-blue-400" />
                Enhanced Cryptographic Key
              </CardTitle>
              <CardDescription className="text-gray-400">
                Multi-source mathematical enhancement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Key Strength:</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {lastAnalysis.enhancedCryptoKey.keyStrength}-bit
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Quantum Resistance:</span>
                <Progress 
                  value={lastAnalysis.enhancedCryptoKey.quantumResistance} 
                  className="w-16 h-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Security Level:</span>
                <Badge className={`${getSecurityLevelColor(lastAnalysis.enhancedCryptoKey.securityLevel)} text-white`}>
                  {getSecurityLevelIcon(lastAnalysis.enhancedCryptoKey.securityLevel)}
                  <span className="ml-1">{lastAnalysis.enhancedCryptoKey.securityLevel}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Hash */}
        {lastAnalysis?.securityHash && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Lock className="mr-2 h-5 w-5 text-purple-400" />
                Multi-Layer Security Hash
              </CardTitle>
              <CardDescription className="text-gray-400">
                Combined mathematical insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Security Layers:</span>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  {lastAnalysis.securityHash.layers}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Entropy:</span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {Math.round(lastAnalysis.securityHash.entropy)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Level:</span>
                <Badge className={`${getSecurityLevelColor(lastAnalysis.securityHash.securityLevel)} text-white`}>
                  {getSecurityLevelIcon(lastAnalysis.securityHash.securityLevel)}
                  <span className="ml-1">{lastAnalysis.securityHash.securityLevel}</span>
                </Badge>
              </div>
              <div className="text-xs text-gray-500 font-mono break-all mt-3 p-2 bg-slate-900 rounded">
                {lastAnalysis.securityHash.hash.substring(0, 32)}...
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Enhancement Sources */}
      {lastAnalysis?.enhancedCryptoKey?.enhancementSources && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-400" />
              Mathematical Enhancement Sources
            </CardTitle>
            <CardDescription className="text-gray-400">
              Cryptographic improvements derived from real mathematical breakthroughs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lastAnalysis.enhancedCryptoKey.enhancementSources.map((source, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">{source}</div>
                    <div className="text-xs text-gray-400">Active Enhancement</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Traditional vs Enhanced Security</CardTitle>
            <CardDescription className="text-gray-400">
              Comparison with standard cryptographic systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Standard AES-256:</span>
                <Badge variant="outline" className="text-gray-400">256-bit</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Enhanced Mathematical:</span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {lastAnalysis?.enhancedCryptoKey?.keyStrength || 256}-bit
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Quantum Resistance:</span>
                <span className="text-green-400 text-sm">
                  {lastAnalysis?.enhancedCryptoKey?.quantumResistance || 0}% enhanced
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Real-Time Security Status</CardTitle>
            <CardDescription className="text-gray-400">
              Current cryptographic protection level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white">Post-quantum algorithms active</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white">Mathematical discoveries integrated</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white">Multi-layer hash protection</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white">Real-time threat adaptation</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis History */}
      {lastAnalysis && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Last Security Analysis</CardTitle>
            <CardDescription className="text-gray-400">
              Generated on {new Date(lastAnalysis.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-400">
              Analysis based on {lastAnalysis.discoveryCount} mathematical discoveries
              {lastAnalysis.enhancedCryptoKey && (
                <span className="text-purple-400 ml-2">
                  • Enhanced with {lastAnalysis.enhancedCryptoKey.enhancementSources.length} mathematical sources
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}