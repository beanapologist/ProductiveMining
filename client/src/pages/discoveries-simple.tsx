import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Award, Target, Users } from 'lucide-react';

interface MathematicalWork {
  id: number;
  workType: string;
  difficulty: number;
  result: any;
  verificationData: any;
  computationalCost: number;
  energyEfficiency: number;
  scientificValue: number;
  workerId: string;
  signature: string;
  timestamp: Date | string;
}

export default function DiscoveriesPage() {
  const { data: currentDiscoveries = [], isLoading } = useQuery<MathematicalWork[]>({
    queryKey: ['/api/discoveries'],
    queryFn: () => fetch('/api/discoveries?limit=1000').then(res => res.json()),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading discoveries...</p>
        </div>
      </div>
    );
  }

  const totalScientificValue = currentDiscoveries.reduce((sum: number, d: MathematicalWork) => 
    sum + (d.scientificValue || 0), 0
  );

  const averageDifficulty = currentDiscoveries.length > 0 
    ? currentDiscoveries.reduce((sum: number, d: MathematicalWork) => sum + d.difficulty, 0) / currentDiscoveries.length
    : 0;

  const uniqueWorkers = new Set(currentDiscoveries.map((d: MathematicalWork) => d.workerId)).size;

  const getWorkTypeLabel = (workType: string) => {
    const labels: { [key: string]: string } = {
      'riemann_zero': 'Riemann Hypothesis',
      'prime_pattern': 'Prime Patterns',
      'yang_mills': 'Yang-Mills Theory',
      'navier_stokes': 'Navier-Stokes',
      'goldbach_verification': 'Goldbach Conjecture',
      'poincare_conjecture': 'Poincaré Conjecture',
      'birch_swinnerton_dyer': 'Birch-Swinnerton-Dyer',
      'elliptic_curve_crypto': 'Elliptic Curve Cryptography'
    };
    return labels[workType] || workType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white">
            <Brain className="mr-3 h-8 w-8 text-purple-400" />
            Mathematical Discoveries
          </h1>
          <p className="text-gray-400 mt-2">
            Explore breakthrough mathematical discoveries made through productive mining
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-400" />
              Total Discoveries
            </CardTitle>
            <CardDescription className="text-gray-400">
              Mathematical breakthroughs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {currentDiscoveries.length}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Breakthrough discoveries made
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Award className="mr-2 h-5 w-5 text-green-400" />
              Scientific Value
            </CardTitle>
            <CardDescription className="text-gray-400">
              Total research value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              ${totalScientificValue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Value generated
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Target className="mr-2 h-5 w-5 text-blue-400" />
              Average Difficulty
            </CardTitle>
            <CardDescription className="text-gray-400">
              Computational complexity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {averageDifficulty.toFixed(1)}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Average difficulty level
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Users className="mr-2 h-5 w-5 text-orange-400" />
              Contributors
            </CardTitle>
            <CardDescription className="text-gray-400">
              Unique researchers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">
              {uniqueWorkers}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Active contributors
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-400" />
            Recent Discoveries
          </CardTitle>
          <CardDescription className="text-gray-400">
            Latest mathematical breakthroughs and their scientific value
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentDiscoveries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No discoveries found</p>
              <p className="text-sm text-gray-500 mt-2">Start mining to make new discoveries</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentDiscoveries.slice(0, 12).map((discovery: MathematicalWork) => (
                <div key={discovery.id} className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {getWorkTypeLabel(discovery.workType)}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      Diff: {discovery.difficulty}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">
                    Scientific Value: ${(discovery.scientificValue || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">
                    Energy Efficiency: {discovery.energyEfficiency?.toFixed(2) || 'N/A'}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(discovery.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}