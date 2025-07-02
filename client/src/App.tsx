import { Switch, Route } from "wouter";
import { Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BarChart3, Pickaxe, Database, Brain } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import BlockExplorer from "@/pages/block-explorer";
import MiningPage from "@/pages/mining";
import DiscoveriesPage from "@/pages/discoveries";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pm-primary via-pm-primary to-slate-900">
      <Navigation />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/mining" component={MiningPage} />
        <Route path="/blocks" component={BlockExplorer} />
        <Route path="/discoveries" component={DiscoveriesPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function Navigation() {
  const [location] = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/mining', label: 'Mining Operations', icon: Pickaxe },
    { path: '/discoveries', label: 'Discoveries', icon: Brain },
    { path: '/blocks', label: 'Block Explorer', icon: Database }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 backdrop-blur border-b border-purple-500/30 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="text-3xl">🧮</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Productive Mining</span>
                <div className="text-xs text-yellow-300 font-medium">Real Math • Real Value</div>
              </div>
            </div>
            <div className="hidden md:flex space-x-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location === item.path
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-semibold shadow-lg transform scale-105' 
                        : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 ${location === item.path ? 'text-gray-900' : ''}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
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
