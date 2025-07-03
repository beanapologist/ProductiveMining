import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  fillColor?: string;
  showDots?: boolean;
  animate?: boolean;
}

export function Sparkline({
  data,
  width = 120,
  height = 30,
  strokeWidth = 2,
  className = "",
  color = "#3b82f6",
  fillColor,
  showDots = false,
  animate = true
}: SparklineProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-xs text-gray-400">No data</div>
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const pathData = `M ${points.split(' ').join(' L ')}`;

  // Generate area fill path if fillColor is provided
  const areaPath = fillColor ? `${pathData} L ${width},${height} L 0,${height} Z` : '';

  return (
    <div className={className}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Area fill */}
        {fillColor && (
          <path
            d={areaPath}
            fill={fillColor}
            opacity={0.2}
            className={animate ? "transition-all duration-500" : ""}
          />
        )}
        
        {/* Main line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animate ? "transition-all duration-500" : ""}
        />
        
        {/* Data points */}
        {showDots && data.map((value, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={2}
              fill={color}
              className={animate ? "transition-all duration-500" : ""}
            />
          );
        })}
      </svg>
    </div>
  );
}

interface TrendSparklineProps extends SparklineProps {
  trend?: 'up' | 'down' | 'neutral';
  showTrend?: boolean;
}

export function TrendSparkline({ 
  data, 
  trend, 
  showTrend = true, 
  ...props 
}: TrendSparklineProps) {
  // Auto-detect trend if not provided
  const detectedTrend = trend || (() => {
    if (data.length < 2) return 'neutral';
    const first = data[0];
    const last = data[data.length - 1];
    if (last > first * 1.02) return 'up';
    if (last < first * 0.98) return 'down';
    return 'neutral';
  })();

  const trendColors = {
    up: '#10b981',
    down: '#ef4444',
    neutral: '#6b7280'
  };

  const fillColors = {
    up: '#10b981',
    down: '#ef4444',
    neutral: '#6b7280'
  };

  return (
    <Sparkline
      {...props}
      data={data}
      color={trendColors[detectedTrend]}
      fillColor={showTrend ? fillColors[detectedTrend] : props.fillColor}
    />
  );
}

interface MetricSparklineProps {
  label: string;
  value: string | number;
  data: number[];
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  sparklineProps?: Partial<SparklineProps>;
}

export function MetricSparkline({
  label,
  value,
  data,
  trend,
  className = "",
  sparklineProps = {}
}: MetricSparklineProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        <div className="text-sm text-gray-400 mb-1">{label}</div>
        <div className="text-lg font-semibold text-white">{value}</div>
      </div>
      <div className="ml-4">
        <TrendSparkline
          data={data}
          trend={trend}
          width={80}
          height={24}
          strokeWidth={1.5}
          {...sparklineProps}
        />
      </div>
    </div>
  );
}