import { Link } from "wouter";
import { useState } from "react";
import { ExternalLink, TrendingUp, Database, Shield, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Cross-page discovery linking component
export function DiscoveryLink({ discoveryId, workType, scientificValue, showDetails = false }: {
  discoveryId: number;
  workType: string;
  scientificValue: number;
  showDetails?: boolean;
}) {
  const workTypeDisplay = workType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <Link href={`/discoveries?id=${discoveryId}`}>
      <div className="cross-page-link inline-flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
        <Brain className="h-4 w-4" />
        <span className="font-medium">Discovery #{discoveryId}</span>
        {showDetails && (
          <>
            <Badge variant="outline" className="text-xs">
              {workTypeDisplay}
            </Badge>
            <span className="text-green-400 text-sm">
              ${scientificValue.toLocaleString()}
            </span>
          </>
        )}
        <ExternalLink className="h-3 w-3 opacity-60" />
      </div>
    </Link>
  );
}

// Cross-page block linking component
export function BlockLink({ blockId, blockIndex, showDetails = false }: {
  blockId: number;
  blockIndex: number;
  showDetails?: boolean;
}) {
  return (
    <Link href={`/blocks?id=${blockId}`}>
      <div className="cross-page-link inline-flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
        <Database className="h-4 w-4" />
        <span className="font-medium">Block #{blockIndex}</span>
        {showDetails && (
          <Badge variant="outline" className="text-xs">
            ID: {blockId}
          </Badge>
        )}
        <ExternalLink className="h-3 w-3 opacity-60" />
      </div>
    </Link>
  );
}

// Cross-page validator linking component
export function ValidatorLink({ validatorId, stake, accuracy, showDetails = false }: {
  validatorId: string;
  stake?: number;
  accuracy?: number;
  showDetails?: boolean;
}) {
  return (
    <Link href={`/mining?tab=validators&validator=${validatorId}`}>
      <div className="cross-page-link inline-flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
        <Shield className="h-4 w-4" />
        <span className="font-medium">{validatorId}</span>
        {showDetails && stake && (
          <>
            <Badge variant="outline" className="text-xs">
              {stake.toLocaleString()} PROD
            </Badge>
            {accuracy && (
              <span className="text-green-400 text-sm">
                {accuracy}%
              </span>
            )}
          </>
        )}
        <ExternalLink className="h-3 w-3 opacity-60" />
      </div>
    </Link>
  );
}

// Cross-page mining operation linking component
export function MiningOperationLink({ operationId, operationType, progress, showDetails = false }: {
  operationId: number;
  operationType: string;
  progress?: number;
  showDetails?: boolean;
}) {
  const operationDisplay = operationType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <Link href={`/mining?operation=${operationId}`}>
      <div className="cross-page-link inline-flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
        <Zap className="h-4 w-4" />
        <span className="font-medium">Operation #{operationId}</span>
        {showDetails && (
          <>
            <Badge variant="outline" className="text-xs">
              {operationDisplay}
            </Badge>
            {progress !== undefined && (
              <div className="flex items-center gap-1">
                <div className="w-12 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {Math.round(progress * 100)}%
                </span>
              </div>
            )}
          </>
        )}
        <ExternalLink className="h-3 w-3 opacity-60" />
      </div>
    </Link>
  );
}

// Quick navigation breadcrumbs
export function NavigationBreadcrumbs({ currentPage, relatedPages }: {
  currentPage: string;
  relatedPages?: Array<{ name: string; path: string; description: string }>;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
      <Link href="/" className="cross-page-link hover:text-white">
        Dashboard
      </Link>
      <span>/</span>
      <span className="text-white font-medium">{currentPage}</span>
      
      {relatedPages && relatedPages.length > 0 && (
        <div className="ml-4 flex items-center gap-2">
          <span className="text-gray-500">Related:</span>
          {relatedPages.map((page, index) => (
            <Tooltip key={page.path}>
              <TooltipTrigger asChild>
                <Link href={page.path} className="cross-page-link text-xs">
                  {page.name}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{page.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}

// Quick action buttons for cross-page functionality
export function QuickActions({ actions }: {
  actions: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    path?: string;
    onClick?: () => void;
    variant?: "default" | "secondary" | "outline";
  }>;
}) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {actions.map((action, index) => {
        const Icon = action.icon;
        
        if (action.path) {
          return (
            <Link key={index} href={action.path}>
              <Button variant={action.variant || "outline"} size="sm" className="gap-2">
                <Icon className="h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          );
        }
        
        return (
          <Button 
            key={index}
            variant={action.variant || "outline"} 
            size="sm" 
            className="gap-2"
            onClick={action.onClick}
          >
            <Icon className="h-4 w-4" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

// Real-time status indicator with cross-page context
export function CrossPageStatus({ 
  type, 
  value, 
  trend, 
  linkTo 
}: {
  type: "mining" | "discoveries" | "security" | "network";
  value: string | number;
  trend?: "up" | "down" | "stable";
  linkTo?: string;
}) {
  const getTypeConfig = () => {
    switch (type) {
      case "mining":
        return { label: "Active Mining", icon: Zap, color: "text-orange-400" };
      case "discoveries":
        return { label: "New Discoveries", icon: Brain, color: "text-purple-400" };
      case "security":
        return { label: "Security Score", icon: Shield, color: "text-green-400" };
      case "network":
        return { label: "Network Health", icon: TrendingUp, color: "text-blue-400" };
    }
  };
  
  const config = getTypeConfig();
  const Icon = config.icon;
  
  const content = (
    <div className="integration-card flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${config.color}`} />
        <div>
          <div className="text-sm text-gray-400">{config.label}</div>
          <div className={`font-bold ${config.color}`}>{value}</div>
        </div>
      </div>
      
      {trend && (
        <div className={`text-xs px-2 py-1 rounded ${
          trend === "up" ? "bg-green-500/20 text-green-400" :
          trend === "down" ? "bg-red-500/20 text-red-400" :
          "bg-gray-500/20 text-gray-400"
        }`}>
          {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
        </div>
      )}
    </div>
  );
  
  if (linkTo) {
    return (
      <Link href={linkTo}>
        <div className="cursor-pointer hover:scale-105 transition-transform">
          {content}
        </div>
      </Link>
    );
  }
  
  return content;
}

// Context-aware page footer with related links
export function PageFooter({ relatedPages }: {
  relatedPages: Array<{ name: string; path: string; description: string }>;
}) {
  return (
    <div className="mt-12 pt-6 border-t border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedPages.map((page) => (
          <Link key={page.path} href={page.path}>
            <div className="integration-card p-4 text-center hover:bg-slate-700/50">
              <div className="font-medium text-white mb-1">{page.name}</div>
              <div className="text-xs text-gray-400">{page.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}