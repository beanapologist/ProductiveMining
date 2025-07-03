import { Switch, Route } from "wouter";
import { Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BarChart3, Pickaxe, Database, Brain, Info, Shield, Users, GraduationCap, HardDrive } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import BlockExplorer from "@/pages/block-explorer";
import MiningPage from "@/pages/mining";
import DiscoveriesPage from "@/pages/discoveries";
import SecurityDashboard from "@/pages/security-dashboard";
import ValidatorsPage from "@/pages/validators";
import { InstitutionalValidation } from "@/pages/institutional-validation";
import DataManagement from "@/pages/data-management";
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
        <Route path="/data-management" component={DataManagement} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function Navigation() {
  const [location] = useLocation();
  
  const navItems = [
    { path: '/', label: '🎮 Adventure Hub', icon: BarChart3 },
    { path: '/mining', label: '⛏️ Mining Quest', icon: Pickaxe },
    { path: '/discoveries', label: '🧬 Discovery Lab', icon: Brain },
    { path: '/validators', label: '🏛️ Guild Council', icon: Users },
    { path: '/institutional', label: '🎓 Academy', icon: GraduationCap },
    { path: '/security', label: '🛡️ Crypto Fortress', icon: Shield },
    { path: '/blocks', label: '📊 Data Vault', icon: Database },
    { path: '/data-management', label: '🏛️ Data Center', icon: HardDrive },
    { path: '/about', label: 'ℹ️ Game Info', icon: Info }
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
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
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
