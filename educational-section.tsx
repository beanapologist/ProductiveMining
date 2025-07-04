import { Search, Shield, DollarSign, Leaf, Brain, Users, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EducationalSection() {
  return (
    <section className="bg-pm-secondary/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            How <span className="text-pm-scientific">Productive Mining</span> Works
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Understanding the revolutionary approach that replaces computational waste with scientific advancement.
          </p>
        </div>
        
        {/* Step-by-step Process */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-pm-secondary/50 backdrop-blur border-slate-700/50">
            <CardHeader>
              <div className="bg-pm-accent/20 p-4 rounded-lg w-fit mb-4">
                <Search className="text-pm-accent h-8 w-8" />
              </div>
              <CardTitle className="text-xl">1. Mathematical Discovery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Instead of computing meaningless hashes, miners solve real mathematical problems: 
                finding Riemann zeros, discovering prime patterns, or validating quantum field theories.
              </p>
              
              <div className="bg-pm-primary/30 p-3 rounded-lg border border-slate-700/30">
                <div className="mathematical-formula text-sm">
                  ζ(s) = Σ(1/n^s) = 0
                </div>
                <div className="text-xs text-slate-400 mt-1">Riemann Hypothesis validation</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-pm-secondary/50 backdrop-blur border-slate-700/50">
            <CardHeader>
              <div className="bg-pm-scientific/20 p-4 rounded-lg w-fit mb-4">
                <Shield className="text-pm-scientific h-8 w-8" />
              </div>
              <CardTitle className="text-xl">2. Academic Validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Institutional validators (MIT, Stanford, Clay Institute) verify mathematical proofs 
                using cryptographic signatures and peer review processes to ensure authenticity.
              </p>
              
              <div className="bg-pm-primary/30 p-3 rounded-lg border border-slate-700/30">
                <div className="text-sm text-slate-300">
                  <div className="flex items-center">
                    <div className="text-pm-scientific mr-2">🏛️</div>
                    Verified by 247 academic institutions
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-1">Cryptographic proof validation</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-pm-secondary/50 backdrop-blur border-slate-700/50">
            <CardHeader>
              <div className="bg-pm-warning/20 p-4 rounded-lg w-fit mb-4">
                <DollarSign className="text-pm-warning h-8 w-8" />
              </div>
              <CardTitle className="text-xl">3. Reward Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Miners receive tokens based on scientific value created, measured by mathematical 
                significance, precision achieved, and contribution to human knowledge.
              </p>
              
              <div className="bg-pm-primary/30 p-3 rounded-lg border border-slate-700/30">
                <div className="text-sm text-slate-300">
                  Value = f(significance, precision, novelty)
                </div>
                <div className="text-xs text-slate-400 mt-1">Algorithmic value assessment</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Benefits Comparison */}
        <Card className="bg-pm-secondary/50 backdrop-blur border-slate-700/50 p-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center mb-8">Revolutionary Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-pm-accent/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Leaf className="text-pm-accent h-8 w-8" />
                </div>
                <h4 className="font-semibold text-slate-200 mb-2">Environmental</h4>
                <p className="text-sm text-slate-400">1000x less energy consumption than traditional mining</p>
              </div>
              
              <div className="text-center">
                <div className="bg-pm-scientific/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="text-pm-scientific h-8 w-8" />
                </div>
                <h4 className="font-semibold text-slate-200 mb-2">Scientific</h4>
                <p className="text-sm text-slate-400">Advances mathematics and contributes to human knowledge</p>
              </div>
              
              <div className="text-center">
                <div className="bg-pm-warning/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="text-pm-warning h-8 w-8" />
                </div>
                <h4 className="font-semibold text-slate-200 mb-2">Economic</h4>
                <p className="text-sm text-slate-400">Creates real economic value through scientific discoveries</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="text-purple-400 h-8 w-8" />
                </div>
                <h4 className="font-semibold text-slate-200 mb-2">Social</h4>
                <p className="text-sm text-slate-400">Incentivizes global collaboration on important problems</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
