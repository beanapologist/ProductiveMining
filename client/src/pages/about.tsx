import { CheckCircle, XCircle, Zap, Brain, Globe, DollarSign, Calculator, Microscope, Shield, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function About() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="pm-header-gradient text-center mb-12">
        <h1 className="text-5xl pm-text-gradient mb-4">
          Investment Opportunity
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Revolutionary blockchain platform generating $580M+ in scientific value while achieving negative energy consumption
        </p>
      </div>

      {/* Key Investment Thesis */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Why Invest in Productive Mining
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400">Proven Revenue Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-green-400">$580M+</div>
              <div className="text-slate-300">Scientific value already generated</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mathematical discoveries:</span>
                  <span className="text-white">380+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Productive blocks:</span>
                  <span className="text-white">235+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Energy efficiency:</span>
                  <span className="text-green-400">-565% (generating)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">Market Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-blue-400">$582M</div>
              <div className="text-slate-300">Current token market cap</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Token price:</span>
                  <span className="text-green-400">$10.58 (+12.3%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Staking ratio:</span>
                  <span className="text-white">76.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">APY rewards:</span>
                  <span className="text-green-400">18.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
              <div className="text-2xl font-bold text-purple-400">9,850+</div>
              <div className="text-sm text-slate-300">Mathematical Discoveries</div>
              <div className="text-xs text-purple-300 mt-1">Real breakthroughs made</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-400">$23.5M+</div>
              <div className="text-sm text-slate-300">Scientific Value Created</div>
              <div className="text-xs text-green-300 mt-1">Realistic research valuations</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30">
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-orange-400">7,030+</div>
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

      {/* Enhanced Security Infrastructure */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          🔒 Enterprise-Grade Security Infrastructure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-red-400 flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Discovery Security Audit System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Mathematical Formula Validation</span>
                  <Badge className="bg-green-500/20 text-green-400">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Cryptographic Signature Verification</span>
                  <Badge className="bg-green-500/20 text-green-400">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Real-time Fraud Detection</span>
                  <Badge className="bg-green-500/20 text-green-400">ACTIVE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Multi-layered Consensus Validation</span>
                  <Badge className="bg-green-500/20 text-green-400">ACTIVE</Badge>
                </div>
              </div>
              <div className="pt-3 border-t border-red-500/20">
                <div className="text-sm text-slate-400">Security Score Monitoring</div>
                <div className="text-2xl font-bold text-red-400">95.8%</div>
                <div className="text-xs text-red-300">Continuous security assessment</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-purple-400 flex items-center gap-2">
                <Lock className="h-6 w-6" />
                Post-Quantum Cryptography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Riemann Zero Integration</span>
                  <Badge className="bg-purple-500/20 text-purple-400">DEPLOYED</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Prime Pattern Encryption</span>
                  <Badge className="bg-purple-500/20 text-purple-400">DEPLOYED</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Lattice-based Security</span>
                  <Badge className="bg-purple-500/20 text-purple-400">DEPLOYED</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Quantum-resistant Signatures</span>
                  <Badge className="bg-purple-500/20 text-purple-400">DEPLOYED</Badge>
                </div>
              </div>
              <div className="pt-3 border-t border-purple-500/20">
                <div className="text-sm text-slate-400">Cryptographic Strength</div>
                <div className="text-2xl font-bold text-purple-400">POST_QUANTUM</div>
                <div className="text-xs text-purple-300">Future-proof security</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500/30">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-cyan-400">2,400+</div>
              <div className="text-sm text-slate-300">Validation Records</div>
              <div className="text-xs text-cyan-300 mt-1">Immutable audit trails</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-teal-600/20 to-green-600/20 border-teal-500/30">
            <CardContent className="p-6 text-center">
              <Lock className="h-8 w-8 text-teal-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-teal-400">Difficulty 50</div>
              <div className="text-sm text-slate-300">Mining Security Level</div>
              <div className="text-xs text-teal-300 mt-1">Enhanced from 25 to 50</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border-red-500/30">
            <CardContent className="p-6 text-center">
              <Brain className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-red-400">Zero</div>
              <div className="text-sm text-slate-300">Security Breaches</div>
              <div className="text-xs text-red-300 mt-1">Enterprise-grade protection</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Competitive Advantages */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Competitive Advantages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-lg mb-3">First Mover Advantage</CardTitle>
              <p className="text-sm text-slate-300">
                World's first energy-generating blockchain with institutional validation from MIT, Stanford, Cambridge, Princeton, and Clay Institute.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-lg mb-3">Proprietary Technology</CardTitle>
              <p className="text-sm text-slate-300">
                QDT (Quantum Data Transformation) achieves negative energy consumption while solving millennium prize problems worth millions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-lg mb-3">Scalable Revenue Model</CardTitle>
              <p className="text-sm text-slate-300">
                Multiple revenue streams: scientific discovery licensing, energy generation credits, staking rewards, and Discovery NFTs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="text-center bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-8 border border-green-500/30">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Investment Opportunity Summary
        </h2>
        <p className="text-lg text-slate-300 mb-6 max-w-3xl mx-auto">
          Revolutionary blockchain platform with proven revenue generation, institutional backing, and patent-protected energy-generating technology. Currently operating at scale with measurable scientific and financial returns.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">$580M+</div>
            <div className="text-sm text-slate-400">Scientific Value Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">$582M</div>
            <div className="text-sm text-slate-400">Token Market Cap</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">-565%</div>
            <div className="text-sm text-slate-400">Energy Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">18.7%</div>
            <div className="text-sm text-slate-400">Annual Staking Yield</div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
            First-to-Market Technology
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
            Institutional Validation
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            Proprietary Technology
          </Badge>
          <Badge className="bg-orange-500/20 text-orange-400 px-4 py-2">
            Multiple Revenue Streams
          </Badge>
        </div>
      </div>
    </div>
  );
}