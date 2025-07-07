import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function MetricSparkline({ 
  data, 
  width = 100, 
  height = 30, 
  color = "#3b82f6",
  className = ""
}: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-gray-500 text-xs">No data</div>
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={className}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Fill area under curve */}
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill={`${color}20`}
          stroke="none"
        />
      </svg>
    </div>
  );
}

export function TrendSparkline({ 
  data, 
  width = 100, 
  height = 30, 
  color = "#10b981",
  className = ""
}: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-gray-500 text-xs">No data</div>
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Calculate trend
  const firstValue = data[0];
  const lastValue = data[data.length - 1];
  const isIncreasing = lastValue > firstValue;
  const trendColor = isIncreasing ? "#10b981" : "#ef4444";

  return (
    <div className={className}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={trendColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Trend indicator */}
        <circle
          cx={width - 4}
          cy={height - ((lastValue - min) / range) * height}
          r="3"
          fill={trendColor}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}