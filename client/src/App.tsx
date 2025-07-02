import { Switch, Route } from "wouter";
import { Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BarChart3, Pickaxe, Database, Brain, Info, Shield } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import BlockExplorer from "@/pages/block-explorer";
import MiningPage from "@/pages/mining";
import DiscoveriesPage from "@/pages/discoveries";
import SecurityDashboard from "@/pages/security-dashboard";
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
        <Route path="/security" component={SecurityDashboard} />
        <Route path="/blocks" component={BlockExplorer} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function Navigation() {
  const [location] = useLocation();
  
  const navItems = [
    { path: '/', label: 'Computation Dashboard', icon: BarChart3 },
    { path: '/mining', label: 'Mathematical Mining', icon: Pickaxe },
    { path: '/discoveries', label: 'Research Results', icon: Brain },
    { path: '/security', label: 'Cryptographic Security', icon: Shield },
    { path: '/blocks', label: 'Blockchain Explorer', icon: Database },
    { path: '/about', label: 'About', icon: Info }
  ];

  return (
    <nav className="nav-clean border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="text-2xl font-bold text-white">
                Mathematical<span className="text-math-green">Mining</span>
              </div>
              <div className="status-indicator status-active"></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-item flex items-center space-x-2 text-sm font-medium ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-pm-primary">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
