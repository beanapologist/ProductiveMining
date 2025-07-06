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
import DataManagementPage from "@/pages/data-management";

import WalletPage from "@/pages/wallet";
import ApiPage from "@/pages/api-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/mining" component={MiningPage} />
        <Route path="/discoveries" component={DiscoveriesPage} />
        <Route path="/security" component={SecurityDashboard} />
        <Route path="/blocks" component={BlockExplorer} />
        <Route path="/block-explorer" component={BlockExplorer} />
        <Route path="/database" component={DataManagementPage} />
        <Route path="/data-management" component={DataManagementPage} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/about" component={ApiPage} />
        
        {/* Legacy routes for bookmarks/direct links */}
        <Route path="/validators" component={SecurityDashboard} />
        <Route path="/institutional" component={SecurityDashboard} />
        <Route path="/research" component={SecurityDashboard} />
        <Route path="/complexity" component={SecurityDashboard} />
        <Route path="/valuation" component={DiscoveriesPage} />
        <Route path="/adaptive-learning" component={SecurityDashboard} />
        <Route path="/data-management" component={BlockExplorer} />
        <Route path="/api" component={ApiPage} />
        <Route path="/miner-demo" component={MiningPage} />
        
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
    { path: '/', title: 'Dashboard', icon: BarChart3 },
    { path: '/mining', title: 'Mining', icon: Pickaxe },
    { path: '/discoveries', title: 'Discoveries', icon: Brain },
    { path: '/security', title: 'Security', icon: Shield },
    { path: '/blocks', title: 'Explorer', icon: Layers },
    { path: '/database', title: 'Database', icon: Database },
    { path: '/wallet', title: 'Wallet', icon: Wallet },
    { path: '/about', title: 'API', icon: FileCode }
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
