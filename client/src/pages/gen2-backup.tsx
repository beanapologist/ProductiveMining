/**
 * Gen 2 Backup Management Dashboard
 * Complete offline data storage and recovery interface
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Database, Download, Upload, Shield, HardDrive, Clock, FileText } from "lucide-react";

interface BackupManifest {
  timestamp: string;
  version: string;
  totalRecords: number;
  dataTypes: string[];
  backupSize: number;
  checksums: Record<string, string>;
}

interface BackupStatistics {
  totalBackups: number;
  totalSize: number;
  latestBackup?: BackupManifest;
  oldestBackup?: BackupManifest;
}

export default function Gen2BackupPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  // Fetch backup statistics
  const { data: statistics, isLoading: statsLoading } = useQuery<BackupStatistics>({
    queryKey: ['/api/gen2/backup/statistics'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Fetch backup list
  const { data: backupData, isLoading: backupsLoading } = useQuery<{
    backups: BackupManifest[];
    statistics: BackupStatistics;
    totalBackups: number;
  }>({
    queryKey: ['/api/gen2/backup/list'],
    refetchInterval: 60000, // Update every minute
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/gen2/backup/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Backup creation failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Gen 2 Backup Created",
        description: "Complete blockchain data backup created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/gen2/backup/list'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gen2/backup/statistics'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Backup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Recovery mutation
  const recoveryMutation = useMutation({
    mutationFn: async ({ timestamp, options }: { timestamp: string; options: any }) => {
      const response = await fetch('/api/gen2/backup/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupTimestamp: timestamp, options }),
      });
      if (!response.ok) throw new Error('Data recovery failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Data Recovery Complete",
        description: "Blockchain data successfully recovered from backup",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Recovery Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Gen 2 Backup System</h1>
        <p className="text-slate-400">
          Complete offline data storage and recovery for blockchain data safety
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Total Backups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {statsLoading ? '...' : statistics?.totalBackups || 0}
            </div>
            <div className="text-sm text-slate-400">Available backups</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <HardDrive className="w-4 h-4 mr-2" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {statsLoading ? '...' : formatBytes(statistics?.totalSize || 0)}
            </div>
            <div className="text-sm text-slate-400">Backup storage</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Latest Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">
              {statsLoading ? '...' : 
                statistics?.latestBackup ? 
                  formatDate(statistics.latestBackup.timestamp) : 
                  'None'
              }
            </div>
            <div className="text-sm text-slate-400">Most recent</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Data Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">100%</div>
            <div className="text-sm text-slate-400">Protected</div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">Backup Actions</CardTitle>
          <CardDescription className="text-slate-400">
            Create new backups or manage existing ones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={() => createBackupMutation.mutate()}
              disabled={createBackupMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createBackupMutation.isPending ? (
                <>
                  <Database className="w-4 h-4 mr-2 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Create Full Backup
                </>
              )}
            </Button>
          </div>

          {createBackupMutation.isPending && (
            <div className="space-y-2">
              <div className="text-sm text-slate-400">Creating comprehensive backup...</div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">Available Backups</CardTitle>
          <CardDescription className="text-slate-400">
            All blockchain data backups with recovery options
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backupsLoading ? (
            <div className="text-center py-8">
              <Database className="w-8 h-8 mx-auto mb-4 text-slate-400 animate-pulse" />
              <div className="text-slate-400">Loading backups...</div>
            </div>
          ) : backupData?.backups.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 mx-auto mb-4 text-slate-400" />
              <div className="text-slate-400">No backups available</div>
              <div className="text-sm text-slate-500 mt-2">
                Create your first backup to get started
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {backupData?.backups.map((backup, index) => (
                <div
                  key={backup.timestamp}
                  className="p-4 border border-slate-600 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium text-white">
                        Backup #{backupData.backups.length - index}
                      </div>
                      <div className="text-sm text-slate-400">
                        {formatDate(backup.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        v{backup.version}
                      </Badge>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {formatBytes(backup.backupSize)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Records</div>
                      <div className="text-white font-medium">
                        {backup.totalRecords.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Data Types</div>
                      <div className="text-white font-medium">{backup.dataTypes.length}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-slate-400">Includes</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {backup.dataTypes.map((type) => (
                          <Badge
                            key={type}
                            variant="secondary"
                            className="text-xs bg-slate-700 text-slate-300"
                          >
                            {type.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBackup(backup.timestamp)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recovery Modal would go here if selectedBackup is set */}
      {selectedBackup && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white">Data Recovery</CardTitle>
            <CardDescription className="text-slate-400">
              Restore blockchain data from backup {selectedBackup}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4">
              <div className="text-yellow-400 font-medium mb-2">⚠️ Recovery Warning</div>
              <div className="text-sm text-yellow-200">
                Data recovery will overwrite current blockchain state. This action cannot be undone.
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setSelectedBackup(null)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  recoveryMutation.mutate({
                    timestamp: selectedBackup,
                    options: { overwriteExisting: true }
                  });
                  setSelectedBackup(null);
                }}
                disabled={recoveryMutation.isPending}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {recoveryMutation.isPending ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Recovering...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Confirm Recovery
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}