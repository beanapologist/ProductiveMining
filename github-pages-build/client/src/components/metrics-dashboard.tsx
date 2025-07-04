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
        <div className="pm-card pm-metric-card-green">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-400/20 p-3 rounded-lg">
              <Leaf className="text-green-400 h-6 w-6" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">
                {Math.round(metrics.energyEfficiency)}x
              </div>
              <div className="text-sm text-slate-400">vs Bitcoin</div>
            </div>
          </div>
          <h3 className="font-semibold text-white">⚡ Energy Efficiency</h3>
          <p className="text-sm text-green-300 mt-1">How much more efficient than Bitcoin mining</p>
        </div>
        
        <div className="pm-card pm-metric-card-purple">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-400/20 p-3 rounded-lg">
              <Brain className="text-purple-400 h-6 w-6" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-400">
                {formatValue(metrics.totalScientificValue)}
              </div>
              <div className="text-sm text-slate-400">value created</div>
            </div>
          </div>
          <h3 className="font-semibold text-white">🧠 Scientific Value</h3>
          <p className="text-sm text-purple-300 mt-1">Real mathematical discoveries worth money</p>
        </div>
        
        <div className="pm-card pm-metric-card-orange">
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
        
        <div className="pm-card pm-metric-card-blue">
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
