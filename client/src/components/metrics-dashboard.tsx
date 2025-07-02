import { Leaf, Brain, Box, Users } from "lucide-react";
import type { NetworkMetrics } from "@shared/schema";

interface MetricsDashboardProps {
  metrics: NetworkMetrics | null | undefined;
}

export default function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  if (!metrics) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 animate-pulse">
              <div className="h-8 bg-slate-700 rounded mb-4" />
              <div className="h-6 bg-slate-700 rounded mb-2" />
              <div className="h-4 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const formatValue = (value: number, suffix: string = "") => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M${suffix}`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k${suffix}`;
    }
    return `${Math.round(value)}${suffix}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-pm-accent/20 p-2 rounded-lg">
              <Leaf className="text-pm-accent h-5 w-5" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-pm-accent">
                {Math.round(metrics.energyEfficiency)}x
              </div>
              <div className="text-sm text-slate-400">vs Bitcoin</div>
            </div>
          </div>
          <h3 className="font-semibold text-slate-200">Energy Efficiency</h3>
          <p className="text-sm text-slate-400 mt-1">Computational power utilization</p>
        </div>
        
        <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-pm-scientific/20 p-2 rounded-lg">
              <Brain className="text-pm-scientific h-5 w-5" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-pm-scientific">
                {formatValue(metrics.totalScientificValue)}
              </div>
              <div className="text-sm text-slate-400">value created</div>
            </div>
          </div>
          <h3 className="font-semibold text-slate-200">Scientific Value</h3>
          <p className="text-sm text-slate-400 mt-1">Research contribution worth</p>
        </div>
        
        <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-pm-warning/20 p-2 rounded-lg">
              <Box className="text-pm-warning h-5 w-5" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-pm-warning">
                {metrics.blocksPerHour}
              </div>
              <div className="text-sm text-slate-400">last hour</div>
            </div>
          </div>
          <h3 className="font-semibold text-slate-200">Blocks Mined</h3>
          <p className="text-sm text-slate-400 mt-1">Productive blocks per hour</p>
        </div>
        
        <div className="bg-pm-secondary/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Users className="text-purple-400 h-5 w-5" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                {metrics.totalMiners.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">global miners</div>
            </div>
          </div>
          <h3 className="font-semibold text-slate-200">Active Miners</h3>
          <p className="text-sm text-slate-400 mt-1">Distributed researchers</p>
        </div>
      </div>
    </section>
  );
}
