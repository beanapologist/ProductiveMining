import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricSparkline, TrendSparkline } from '@/components/ui/sparkline';
import { usePerformanceMetrics } from '@/hooks/use-performance-metrics';
import { 
  Activity, 
  Zap, 
  Database, 
  Leaf, 
  DollarSign, 
  Clock, 
  Shield, 
  Atom,
  CheckCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface PerformanceSparklineGridProps {
  className?: string;
}

export function PerformanceSparklineGrid({ className = "" }: PerformanceSparklineGridProps) {
  const { currentMetrics, sparklineData, isLoading } = usePerformanceMetrics();

  if (isLoading || !currentMetrics) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Real-Time Performance Sparklines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-400">Loading performance metrics...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatValue = (value: number, suffix: string = "") => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${suffix}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K${suffix}`;
    }
    return `${value.toFixed(1)}${suffix}`;
  };

  const performanceMetrics = [
    {
      icon: Cpu,
      label: "Active Miners",
      value: currentMetrics.activeMiners,
      data: sparklineData.activeMiners,
      color: "#3b82f6",
      suffix: ""
    },
    {
      icon: Zap,
      label: "Discovery Rate",
      value: formatValue(currentMetrics.discoveryRate, "/h"),
      data: sparklineData.discoveryRate,
      color: "#10b981",
      suffix: ""
    },
    {
      icon: Database,
      label: "Network Hashrate",
      value: formatValue(currentMetrics.networkHashrate, " H/s"),
      data: sparklineData.networkHashrate,
      color: "#8b5cf6",
      suffix: ""
    },
    {
      icon: Leaf,
      label: "Energy Efficiency",
      value: `${currentMetrics.energyEfficiency.toFixed(0)}%`,
      data: sparklineData.energyEfficiency,
      color: "#22c55e",
      suffix: ""
    },
    {
      icon: DollarSign,
      label: "Scientific Value",
      value: formatValue(currentMetrics.scientificValue, "/h"),
      data: sparklineData.scientificValue,
      color: "#f59e0b",
      suffix: ""
    },
    {
      icon: Clock,
      label: "Block Time",
      value: `${currentMetrics.blockTime.toFixed(1)}min`,
      data: sparklineData.blockTime,
      color: "#ef4444",
      suffix: ""
    },
    {
      icon: Shield,
      label: "Security Score",
      value: `${currentMetrics.securityScore.toFixed(1)}%`,
      data: sparklineData.securityScore,
      color: "#dc2626",
      suffix: ""
    },
    {
      icon: Atom,
      label: "Quantum Coherence",
      value: `${currentMetrics.quantumCoherence.toFixed(1)}%`,
      data: sparklineData.quantumCoherence,
      color: "#06b6d4",
      suffix: ""
    },
    {
      icon: CheckCircle,
      label: "Validation Accuracy",
      value: `${currentMetrics.validationAccuracy.toFixed(1)}%`,
      data: sparklineData.validationAccuracy,
      color: "#84cc16",
      suffix: ""
    }
  ];

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Real-Time Performance Sparklines
        </CardTitle>
        <p className="text-gray-400 text-sm">Live network performance trends with mini-charts</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div 
                key={index}
                className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-400">{metric.label}</span>
                  </div>
                </div>
                
                <div className="flex items-end justify-between">
                  <div className="text-xl font-bold text-white">
                    {metric.value}
                  </div>
                  <div className="flex-shrink-0">
                    <TrendSparkline
                      data={metric.data}
                      width={60}
                      height={20}
                      strokeWidth={1.5}
                      color={metric.color}
                      animate={true}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface CompactSparklineRowProps {
  className?: string;
}

export function CompactSparklineRow({ className = "" }: CompactSparklineRowProps) {
  const { currentMetrics, sparklineData, isLoading } = usePerformanceMetrics();

  if (isLoading || !currentMetrics) {
    return (
      <div className={`flex gap-4 ${className}`}>
        <div className="text-gray-400 text-sm">Loading sparklines...</div>
      </div>
    );
  }

  const keyMetrics = [
    {
      label: "Miners",
      value: currentMetrics.activeMiners,
      data: sparklineData.activeMiners,
      color: "#3b82f6"
    },
    {
      label: "Discoveries",
      value: `${currentMetrics.discoveryRate.toFixed(1)}/h`,
      data: sparklineData.discoveryRate,
      color: "#10b981"
    },
    {
      label: "Security",
      value: `${currentMetrics.securityScore.toFixed(0)}%`,
      data: sparklineData.securityScore,
      color: "#dc2626"
    },
    {
      label: "Quantum",
      value: `${currentMetrics.quantumCoherence.toFixed(1)}%`,
      data: sparklineData.quantumCoherence,
      color: "#06b6d4"
    }
  ];

  return (
    <div className={`flex gap-6 ${className}`}>
      {keyMetrics.map((metric, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-400">{metric.label}</div>
            <div className="text-sm font-semibold text-white">{metric.value}</div>
          </div>
          <TrendSparkline
            data={metric.data}
            width={40}
            height={16}
            strokeWidth={1}
            color={metric.color}
            animate={true}
          />
        </div>
      ))}
    </div>
  );
}

interface PerformanceTrendCardProps {
  title: string;
  value: string | number;
  data: number[];
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function PerformanceTrendCard({
  title,
  value,
  data,
  trend,
  color = "#3b82f6",
  icon: Icon = TrendingUp,
  className = ""
}: PerformanceTrendCardProps) {
  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <Icon className="h-4 w-4" style={{ color }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">{value}</div>
          <TrendSparkline
            data={data}
            trend={trend}
            width={80}
            height={32}
            strokeWidth={2}
            color={color}
            animate={true}
            showDots={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}