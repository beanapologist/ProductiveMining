import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Trophy, Brain, Calculator, Microscope, Atom, Zap, Shield, Network, Star, Award } from 'lucide-react';
import { format } from 'date-fns';

interface MathematicalWork {
  id: number;
  workType: string;
  difficulty: number;
  result: any;
  verificationData: any;
  computationalCost: number;
  energyEfficiency: number;
  scientificValue: number;
  timestamp: Date;
  workerId: string;
  signature: string;
}

const workTypeIcons: Record<string, any> = {
  'riemann_zero': Brain,
  'prime_pattern': Calculator,
  'qdt_validation': Microscope,
  'birch_swinnerton_dyer': Atom,
  'navier_stokes': Zap,
  'yang_mills': Shield,
  'elliptic_curve_crypto': Network,
  'lattice_crypto': Star,
  'poincare_conjecture': Award
};

const workTypeNames: Record<string, string> = {
  'riemann_zero': '🔢 Prime Number Secrets',
  'prime_pattern': '🔐 Security Patterns',
  'qdt_validation': '⚛️ Quantum Physics',
  'birch_swinnerton_dyer': '💰 Million Dollar Problem',
  'navier_stokes': '🌊 Fluid Flow Science',
  'yang_mills': '🌌 Forces of Nature',
  'elliptic_curve_crypto': '🛡️ Unbreakable Security',
  'lattice_crypto': '🔮 Quantum-Safe Locks',
  'poincare_conjecture': '🔄 3D Shape Puzzles'
};

const getDifficultyColor = (difficulty: number) => {
  if (difficulty >= 20) return 'destructive';
  if (difficulty >= 15) return 'secondary';
  if (difficulty >= 10) return 'default';
  return 'outline';
};

const formatScientificValue = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

export default function DiscoveriesPage() {
  const { data: discoveries = [], isLoading } = useQuery<MathematicalWork[]>({
    queryKey: ['/api/discoveries'],
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading mathematical discoveries...</p>
        </div>
      </div>
    );
  }

  if (discoveries.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Discoveries Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Mathematical discoveries will appear here as miners solve real computational problems. 
            Start mining operations to begin creating scientific breakthroughs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* User-friendly explanation header */}
      <div className="pm-header-gradient">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Mathematical Discoveries 🧠
          </h1>
          <p className="text-xl text-slate-300 mb-4">
            Real mathematical breakthroughs created by our mining network
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-lg mb-1">🔬</div>
              <div className="font-semibold text-white">Real Science</div>
              <div className="text-slate-400">Authentic mathematical problems solved by miners</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-lg mb-1">💰</div>
              <div className="font-semibold text-white">Valuable Knowledge</div>
              <div className="text-slate-400">Each discovery has measurable scientific value</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-lg mb-1">🌍</div>
              <div className="font-semibold text-white">Impact</div>
              <div className="text-slate-400">Benefits cryptography, physics, and technology</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mathematical Discoveries</h1>
          <p className="text-muted-foreground">
            Real computational breakthroughs from productive mining operations
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {discoveries.length} Discovery{discoveries.length !== 1 ? 'ies' : 'y'}
        </Badge>
      </div>

      <div className="grid gap-6">
        {discoveries.map((discovery) => {
          const IconComponent = workTypeIcons[discovery.workType] || Brain;
          const workTypeName = workTypeNames[discovery.workType] || discovery.workType;
          
          return (
            <Card key={discovery.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{workTypeName}</CardTitle>
                      <CardDescription>
                        Discovered by {discovery.workerId} • {format(new Date(discovery.timestamp), 'PPp')}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getDifficultyColor(discovery.difficulty)}>
                      Difficulty {discovery.difficulty}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {formatScientificValue(discovery.scientificValue)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Computational Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {discovery.computationalCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Computational Cost</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {discovery.energyEfficiency.toFixed(1)}x
                    </div>
                    <div className="text-sm text-muted-foreground">Energy Efficiency</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatScientificValue(discovery.scientificValue)}
                    </div>
                    <div className="text-sm text-muted-foreground">Scientific Value</div>
                  </div>
                </div>

                <Separator />

                {/* Discovery Results */}
                <div>
                  <h4 className="font-semibold mb-2">Computational Results</h4>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(discovery.result, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Verification Data */}
                {discovery.verificationData && (
                  <div>
                    <h4 className="font-semibold mb-2">Verification & Authentication</h4>
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Verified: </span>
                          <Badge variant={discovery.verificationData.verified ? "default" : "destructive"}>
                            {discovery.verificationData.verified ? "✓ Verified" : "✗ Unverified"}
                          </Badge>
                        </div>
                        {discovery.verificationData.theorem && (
                          <div>
                            <span className="font-medium">Theorem: </span>
                            <span className="text-blue-700 dark:text-blue-300">
                              {discovery.verificationData.theorem}
                            </span>
                          </div>
                        )}
                        {discovery.verificationData.verificationMethod && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Method: </span>
                            <span className="text-muted-foreground">
                              {discovery.verificationData.verificationMethod}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cryptographic Signature */}
                <div>
                  <h4 className="font-semibold mb-2">Cryptographic Proof</h4>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <code className="text-xs break-all text-muted-foreground">
                      {discovery.signature}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}