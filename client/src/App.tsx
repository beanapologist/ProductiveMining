import { Switch, Route } from "wouter";
import { Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { BarChart3, Pickaxe, Database, Brain, Info, Shield, Users, User, GraduationCap, HardDrive, Coins, Wallet, Copy, Check, FileCode, TrendingUp, Play, Beaker, Layers, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Dashboard from "@/pages/dashboard-new";
import BlockExplorer from "@/pages/block-explorer";
import MiningPage from "@/pages/mining-simple";
import DiscoveriesPage from "@/pages/discoveries-clean";
import SecurityDashboard from "@/pages/security-dashboard";
import ValidatorsPage from "@/pages/validators";
import { InstitutionalValidation } from "@/pages/institutional-validation";
import ProofOfResearchPage from "@/pages/proof-of-research";
import DataManagement from "@/pages/data-management";
import ComplexityAnalysisPage from "@/pages/complexity-analysis";
import APIOverview from "@/pages/api-overview";
import ScientificValuation from "@/pages/scientific-valuation";
import AdaptiveLearningPage from "@/pages/adaptive-learning";
import MathMinerPage from "@/pages/math-miner";
import MinerSubmissionDemo from "@/pages/miner-submission-demo";

import WalletPage from "@/pages/wallet";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/mining" component={MiningPage} />
        <Route path="/discoveries" component={DiscoveriesPage} />
        <Route path="/validators" component={ValidatorsPage} />
        <Route path="/institutional" component={InstitutionalValidation} />
        <Route path="/research" component={ProofOfResearchPage} />
        <Route path="/security" component={SecurityDashboard} />
        <Route path="/complexity" component={ComplexityAnalysisPage} />
        <Route path="/valuation" component={ScientificValuation} />
        <Route path="/adaptive-learning" component={AdaptiveLearningPage} />
        <Route path="/math-miner" component={MathMinerPage} />
        <Route path="/miner-demo" component={MinerSubmissionDemo} />

        <Route path="/blocks" component={BlockExplorer} />
        <Route path="/block-explorer" component={BlockExplorer} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/data-management" component={DataManagement} />
        <Route path="/api" component={APIOverview} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function StartMiningButton() {
  const { toast } = useToast();
  
  const startMiningMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/mining/start-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationType: 'riemann_zero',
          difficulty: Math.floor(Math.random() * 50) + 150 // 150-200 range
        })
      });
      
      if (!response.ok) throw new Error('Failed to start mining');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Mining Started!",
        description: `Started ${data.operationType} mining operation #${data.id}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Mining Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return (
    <button
      onClick={() => startMiningMutation.mutate()}
      disabled={startMiningMutation.isPending}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
      title="Start productive mining operation"
    >
      {startMiningMutation.isPending ? (
        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      <span>Start Mining</span>
    </button>
  );
}

function Navigation() {
  const [location] = useLocation();
  
  const navItems = [
    { path: '/', title: 'Adventure Hub', icon: BarChart3 },
    { path: '/mining', title: 'Mining Quest', icon: Pickaxe },
    { path: '/math-miner', title: 'Math Miner', icon: User },
    { path: '/discoveries', title: 'Discovery Lab', icon: Brain },
    { path: '/validators', title: 'Guild Council', icon: Users },
    { path: '/institutional', title: 'Academy', icon: GraduationCap },
    { path: '/research', title: 'Research Lab', icon: Beaker },
    { path: '/security', title: 'Crypto Fortress', icon: Shield },
    { path: '/complexity', title: 'Complexity Engine', icon: TrendingUp },
    { path: '/adaptive-learning', title: 'AI Learning Core', icon: Layers },
    { path: '/valuation', title: 'Value Calculator', icon: Coins },
    { path: '/blocks', title: 'Data Vault', icon: Database },
    { path: '/wallet', title: 'Research Vault', icon: Wallet },
    { path: '/data-management', title: 'Data Center', icon: HardDrive },
    { path: '/api', title: 'API Docs', icon: FileCode },
    { path: '/about', title: 'Game Info', icon: Info }
  ];

  return (
    <nav className="nav-modern sticky top-0 z-50">
      <div className="flex justify-between items-center h-16">
        <div className="nav-brand">
          Productive Mining
        </div>
        
        <div className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                title={item.title}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>

        <StartMiningButton />
      </div>
    </nav>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
