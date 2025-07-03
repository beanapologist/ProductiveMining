import { Switch, Route } from "wouter";
import { Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { BarChart3, Pickaxe, Database, Brain, Info, Shield, Users, GraduationCap, HardDrive, Coins, Wallet, Copy, Check, FileCode } from "lucide-react";
import Dashboard from "@/pages/dashboard-new";
import BlockExplorer from "@/pages/block-explorer";
import MiningPage from "@/pages/mining-simple";
import DiscoveriesPage from "@/pages/discoveries-clean";
import SecurityDashboard from "@/pages/security-dashboard";
import ValidatorsPage from "@/pages/validators";
import { InstitutionalValidation } from "@/pages/institutional-validation";
import DataManagement from "@/pages/data-management";

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
        <Route path="/security" component={SecurityDashboard} />

        <Route path="/blocks" component={BlockExplorer} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/data-management" component={DataManagement} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function WalletComponent() {
  const [walletAddress] = useState("0x742d35Cc6634C0532925a3b8D");
  const [balance] = useState(15847.23);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 mr-4">
      <div className="wallet-display">
        <div className="wallet-balance">
          <span className="text-lg font-bold text-green-400">
            {balance.toLocaleString()} PROD
          </span>
        </div>
        <div className="wallet-address-container">
          <span className="wallet-address text-sm text-gray-400">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
          <button
            onClick={copyAddress}
            className="wallet-copy-btn"
            title="Copy wallet address"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
      </div>
      <Wallet className="h-6 w-6 text-cyan-400" />
    </div>
  );
}

function Navigation() {
  const [location] = useLocation();
  
  const navItems = [
    { path: '/', title: 'Adventure Hub', icon: BarChart3 },
    { path: '/mining', title: 'Mining Quest', icon: Pickaxe },
    { path: '/discoveries', title: 'Discovery Lab', icon: Brain },
    { path: '/validators', title: 'Guild Council', icon: Users },
    { path: '/institutional', title: 'Academy', icon: GraduationCap },
    { path: '/security', title: 'Crypto Fortress', icon: Shield },
    { path: '/blocks', title: 'Data Vault', icon: Database },
    { path: '/wallet', title: 'Research Vault', icon: Wallet },
    { path: '/data-management', title: 'Data Center', icon: HardDrive },
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

        <WalletComponent />
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
