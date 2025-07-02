import { CheckCircle, XCircle, Zap, Brain, Globe, DollarSign, Calculator, Microscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function About() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
                <span className="text-slate-300">99% more energy efficient</span>
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
              <h4 className="font-semibold text-green-400 mb-2">The Solution</h4>
              <p className="text-sm text-slate-300">
                Our mining solves real mathematical problems like the Riemann Hypothesis and creates post-quantum cryptography, generating millions in scientific value while using minimal energy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-400">99%</div>
            <div className="text-sm text-slate-300">Less Energy</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-400">100%</div>
            <div className="text-sm text-slate-300">Real Science</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400">$105M+</div>
            <div className="text-sm text-slate-300">Scientific Value</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30">
          <CardContent className="p-6 text-center">
            <Globe className="h-8 w-8 text-orange-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-orange-400">∞</div>
            <div className="text-sm text-slate-300">Future Impact</div>
          </CardContent>
        </Card>
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

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Ready to Join the Revolution?
        </h2>
        <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
          Be part of the future where computational power creates real value for humanity instead of just wasting energy on meaningless calculations.
        </p>
        <div className="flex justify-center space-x-4">
          <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
            🌱 Sustainable Mining
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
            🧠 Real Science
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            💎 True Value
          </Badge>
        </div>
      </div>
    </div>
  );
}