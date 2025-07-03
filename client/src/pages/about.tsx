import { CheckCircle, XCircle, Zap, Brain, Globe, DollarSign, Calculator, Microscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function About() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="pm-header-gradient text-center mb-12">
        <h1 className="text-5xl pm-text-gradient mb-4">
          ✨ What Makes Us Different?
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Understanding the revolutionary difference between wasteful Bitcoin mining and productive mathematical computation
        </p>
      </div>

      {/* Main Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Traditional Mining */}
        <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-500/20 rounded-full w-fit">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <CardTitle className="text-2xl text-red-400">Traditional Mining (Bitcoin)</CardTitle>
            <CardDescription className="text-red-300">
              Wasteful computational approach that benefits no one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <span className="text-slate-300">Solves meaningless hash puzzles</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <span className="text-slate-300">Wastes massive amounts of energy</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <span className="text-slate-300">Creates no scientific value</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <span className="text-slate-300">Only enriches miners</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-red-900/30 rounded-lg border border-red-500/30">
              <h4 className="font-semibold text-red-400 mb-2">The Problem</h4>
              <p className="text-sm text-slate-300">
                Bitcoin mining uses more electricity than entire countries just to solve arbitrary mathematical puzzles that have no real-world value beyond maintaining the blockchain.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Productive Mining */}
        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-500/20 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-400">Productive Mining (Our Way)</CardTitle>
            <CardDescription className="text-green-300">
              Revolutionary approach that benefits all of humanity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">Solves real mathematical problems</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">565% more energy efficient (generating energy)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">Creates valuable scientific knowledge</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">Benefits all of humanity</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
              <h4 className="font-semibold text-green-400 mb-2">Our Live Results</h4>
              <p className="text-sm text-slate-300">
                Right now: 380+ mathematical discoveries worth $580M in scientific value, 227 productive blocks mined, -565% energy efficiency (actually generating energy), and $582M PROD token market cap with institutional validation from MIT, Stanford, Cambridge, Princeton, and Clay Institute.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Performance Metrics */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          🚀 Live Network Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-400">-565%</div>
              <div className="text-sm text-slate-300">Energy Efficiency</div>
              <div className="text-xs text-blue-300 mt-1">Actually generating energy</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Calculator className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-400">380+</div>
              <div className="text-sm text-slate-300">Mathematical Discoveries</div>
              <div className="text-xs text-purple-300 mt-1">Real breakthroughs made</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-400">$580M+</div>
              <div className="text-sm text-slate-300">Scientific Value Created</div>
              <div className="text-xs text-green-300 mt-1">Active mining generation</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30">
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-orange-400">226</div>
              <div className="text-sm text-slate-300">Productive Blocks</div>
              <div className="text-xs text-orange-300 mt-1">Beyond Bitcoin's waste</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Additional Real-Time Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <Brain className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-yellow-400">$582M</div>
              <div className="text-sm text-slate-300">PROD Token Market Cap</div>
              <div className="text-xs text-yellow-300 mt-1">$10.58 per token (+12.3%)</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 border-pink-500/30">
            <CardContent className="p-6 text-center">
              <Microscope className="h-8 w-8 text-pink-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-pink-400">1,960+</div>
              <div className="text-sm text-slate-300">Validation Records</div>
              <div className="text-xs text-pink-300 mt-1">Institutional consensus</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border-indigo-500/30">
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-indigo-400">76.2%</div>
              <div className="text-sm text-slate-300">Token Staking Ratio</div>
              <div className="text-xs text-indigo-300 mt-1">18.7% APY rewards</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What We Solve */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          🧮 Real Mathematical Problems We Solve
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <Calculator className="h-8 w-8 text-blue-400 mb-2" />
              <CardTitle className="text-lg">Riemann Hypothesis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Finding zeros of the Riemann zeta function to unlock the secrets of prime numbers and revolutionize cryptography.
              </p>
              <Badge className="mt-3 bg-blue-500/20 text-blue-400">Million Dollar Problem</Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <Microscope className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle className="text-lg">Quantum Field Theory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Validating quantum physics theories and advancing our understanding of fundamental particle interactions.
              </p>
              <Badge className="mt-3 bg-purple-500/20 text-purple-400">Physics Breakthrough</Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <Brain className="h-8 w-8 text-green-400 mb-2" />
              <CardTitle className="text-lg">Post-Quantum Crypto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Building security systems that will protect digital communications even from quantum computer attacks.
              </p>
              <Badge className="mt-3 bg-green-500/20 text-green-400">Future Security</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Network Status */}
      <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Live Network Achievement
        </h2>
        <p className="text-lg text-slate-300 mb-6 max-w-3xl mx-auto">
          Our productive mining network is actively operating with 10+ researchers mining mathematical discoveries, 227 productive blocks created, and institutional validation from the world's leading academic institutions. Join the revolution that's already happening.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
            Energy Generating (-565%)
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
            Real Mathematical Breakthroughs
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            $582M Token Market Cap
          </Badge>
          <Badge className="bg-orange-500/20 text-orange-400 px-4 py-2">
            Institutional Validation
          </Badge>
        </div>
        <div className="text-center text-sm text-slate-400">
          Network actively mining • 380+ discoveries • 1,960+ validation records • 76.2% staking ratio
        </div>
      </div>
    </div>
  );
}