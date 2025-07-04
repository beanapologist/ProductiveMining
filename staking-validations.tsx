import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Shield, University } from "lucide-react";
import type { DiscoveryValidation, Staker } from "@shared/schema";

interface StakingValidationsProps {
  workId: number;
  workTitle: string;
}

export default function StakingValidations({ workId, workTitle }: StakingValidationsProps) {
  const { data: validations, isLoading: validationsLoading } = useQuery({
    queryKey: ['/api/validations', workId],
    enabled: !!workId
  });

  const { data: stakers, isLoading: stakersLoading } = useQuery({
    queryKey: ['/api/stakers']
  });

  const getStakerInfo = (stakerId: number) => {
    return Array.isArray(stakers) ? stakers.find((s: Staker) => s.id === stakerId) : undefined;
  };

  const getValidationIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getValidationBadge = (status: string, stakeAmount: number) => {
    const color = status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800';
    
    return (
      <Badge className={`${color} text-xs`}>
        {status.toUpperCase()} • ${stakeAmount.toLocaleString()} staked
      </Badge>
    );
  };

  if (validationsLoading || stakersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Institutional Validations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading validation data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Institutional Validations
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Mathematical discoveries validated by staking institutions before blockchain inclusion
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Discovery: {workTitle}
          </div>
          
          {Array.isArray(validations) && validations.length > 0 ? (
            <div className="space-y-3">
              {validations.map((validation: DiscoveryValidation) => {
                const staker = getStakerInfo(validation.stakerId);
                return (
                  <div key={validation.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <University className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-sm">
                            {staker?.institutionName || 'Unknown Institution'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Reputation: {((staker?.validationReputation || 0) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getValidationIcon(validation.status)}
                        {getValidationBadge(validation.status, validation.stakeAmount)}
                      </div>
                    </div>
                    
                    {validation.validationData && (
                      <div className="mt-3 text-xs bg-white dark:bg-gray-900 rounded p-3">
                        <div className="font-medium mb-1">Validation Details:</div>
                        {typeof validation.validationData === 'object' && validation.validationData !== null && (
                          <div className="space-y-1">
                            {(validation.validationData as any).peer_review_notes && (
                              <div>
                                <span className="font-medium">Notes:</span> {(validation.validationData as any).peer_review_notes}
                              </div>
                            )}
                            {(validation.validationData as any).verification_method && (
                              <div>
                                <span className="font-medium">Method:</span> {(validation.validationData as any).verification_method}
                              </div>
                            )}
                            {(validation.validationData as any).confidence_score && (
                              <div>
                                <span className="font-medium">Confidence:</span> {((validation.validationData as any).confidence_score * 100).toFixed(4)}%
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No validations found for this mathematical discovery.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}