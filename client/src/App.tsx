import { Switch, Route } from "wouter";
import { Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import BlockExplorer from "@/pages/block-explorer";
import MiningPage from "@/pages/mining";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pm-primary via-pm-primary to-slate-900">
      <Navigation />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/mining" component={MiningPage} />
        <Route path="/blocks" component={BlockExplorer} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function Navigation() {
  const [location] = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/mining', label: 'Mining', icon: '⛏️' },
    { path: '/blocks', label: 'Block Explorer', icon: '🔗' }
  ];

  return (
    <nav className="bg-pm-secondary/80 backdrop-blur border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🧮</div>
              <span className="text-xl font-bold text-white">Productive Mining</span>
            </div>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === item.path
                      ? 'bg-pm-accent text-pm-primary'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
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
