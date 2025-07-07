import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Users, Trophy, Gift, Star, Heart, Award, Crown, Zap, Target, TrendingUp, Activity, UserPlus, Handshake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollaborationMetrics {
  totalCollaborators: number;
  activeProjects: number;
  rewardsDistributed: number;
  totalContributions: number;
  communityValue: number;
}

interface Collaborator {
  id: number;
  username: string;
  avatar: string;
  reputation: number;
  contributions: number;
  specializations: string[];
  totalRewards: number;
  level: string;
  badges: string[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  reward: number;
  participants: number;
  maxParticipants: number;
  deadline: string;
  status: string;
  creator: string;
  tags: string[];
}

interface Reward {
  id: number;
  type: string;
  amount: number;
  recipient: string;
  reason: string;
  timestamp: string;
  status: string;
}

export default function CommunityCollaborationPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // Fetch collaboration metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery<CollaborationMetrics>({
    queryKey: ['/api/community/metrics'],
    queryFn: () => fetch('/api/community/metrics').then(res => res.json()),
    refetchInterval: 10000,
  });

  // Fetch top collaborators
  const { data: collaborators = [], isLoading: collaboratorsLoading } = useQuery<Collaborator[]>({
    queryKey: ['/api/community/collaborators'],
    queryFn: () => fetch('/api/community/collaborators').then(res => res.json()),
    refetchInterval: 15000,
  });

  // Fetch active projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/community/projects'],
    queryFn: () => fetch('/api/community/projects').then(res => res.json()),
    refetchInterval: 20000,
  });

  // Fetch recent rewards
  const { data: rewards = [], isLoading: rewardsLoading } = useQuery<Reward[]>({
    queryKey: ['/api/community/rewards'],
    queryFn: () => fetch('/api/community/rewards').then(res => res.json()),
    refetchInterval: 12000,
  });

  // Join project mutation
  const joinProjectMutation = useMutation({
    mutationFn: async ({ projectId }: { projectId: number }) => {
      const response = await fetch('/api/community/join-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      if (!response.ok) throw new Error('Failed to join project');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully Joined Project",
        description: "You've been added to the collaboration project",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community/projects'] });
    },
    onError: () => {
      toast({
        title: "Failed to Join",
        description: "Could not join the project",
        variant: "destructive",
      });
    }
  });

  // Distribute rewards mutation
  const distributeRewardsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/community/distribute-rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to distribute rewards');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Rewards Distributed",
        description: "Community rewards have been distributed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community/rewards'] });
      queryClient.invalidateQueries({ queryKey: ['/api/community/metrics'] });
    },
    onError: () => {
      toast({
        title: "Distribution Failed",
        description: "Could not distribute rewards",
        variant: "destructive",
      });
    }
  });

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'pioneer': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'contributor': return <Star className="w-4 h-4 text-blue-400" />;
      case 'expert': return <Award className="w-4 h-4 text-purple-400" />;
      case 'collaborator': return <Users className="w-4 h-4 text-green-400" />;
      default: return <Trophy className="w-4 h-4 text-orange-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (metricsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-purple-400 animate-pulse" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Community Collaboration
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="space-y-3">
                  <div className="h-3 bg-slate-600 rounded"></div>
                  <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Community Collaboration
          </h1>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            Active Community
          </Badge>
        </div>
        
        <Button
          onClick={() => distributeRewardsMutation.mutate()}
          disabled={distributeRewardsMutation.isPending}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {distributeRewardsMutation.isPending ? (
            <Activity className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Gift className="w-4 h-4 mr-2" />
          )}
          Distribute Rewards
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-purple-600">Active Projects</TabsTrigger>
          <TabsTrigger value="collaborators" className="data-[state=active]:bg-purple-600">Top Collaborators</TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-purple-600">Reward System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Total Collaborators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{metrics?.totalCollaborators || 2847}</div>
                <div className="text-sm text-slate-400">Active contributors</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{metrics?.activeProjects || projects.length}</div>
                <div className="text-sm text-slate-400">Open collaborations</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  Rewards Distributed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{metrics?.rewardsDistributed || 1247}</div>
                <div className="text-sm text-slate-400">PROD tokens</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  Total Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{metrics?.totalContributions || 8937}</div>
                <div className="text-sm text-slate-400">Community efforts</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  Community Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">${metrics?.communityValue || 582}M</div>
                <div className="text-sm text-slate-400">Total created value</div>
              </CardContent>
            </Card>
          </div>

          {/* Community Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Community Activity
                </CardTitle>
                <p className="text-slate-400 text-sm">Recent collaboration statistics</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">New Members (7 days)</span>
                  <span className="text-sm text-white">+127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Projects Completed</span>
                  <span className="text-sm text-white">43</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Average Project Time</span>
                  <span className="text-sm text-white">5.2 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Success Rate</span>
                  <span className="text-sm text-green-400">94.7%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Top Categories
                </CardTitle>
                <p className="text-slate-400 text-sm">Most popular collaboration areas</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Mathematical Research', value: 35, color: 'bg-purple-500' },
                  { name: 'Algorithm Development', value: 28, color: 'bg-blue-500' },
                  { name: 'Validation & Review', value: 22, color: 'bg-green-500' },
                  { name: 'Documentation', value: 15, color: 'bg-orange-500' }
                ].map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{category.name}</span>
                      <span className="text-sm text-white">{category.value}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${category.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Active Collaboration Projects</CardTitle>
              <p className="text-slate-400 text-sm">Join ongoing community projects and earn rewards</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectsLoading ? (
                  <div className="col-span-full text-center py-8">
                    <Activity className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-400" />
                    <p className="text-slate-400">Loading active projects...</p>
                  </div>
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                    <Card key={project.id} className="bg-slate-700 border-slate-600">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-white">{project.title}</CardTitle>
                            <p className="text-sm text-slate-400 mt-1">{project.description}</p>
                          </div>
                          <Badge className={`${getDifficultyColor(project.difficulty)} text-white`}>
                            {project.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">Reward</span>
                          <span className="text-sm font-bold text-green-400">{project.reward} PROD</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">Participants</span>
                          <span className="text-sm text-white">{project.participants}/{project.maxParticipants}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">Deadline</span>
                          <span className="text-sm text-slate-400">{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                        <Progress 
                          value={(project.participants / project.maxParticipants) * 100} 
                          className="h-2" 
                        />
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          onClick={() => joinProjectMutation.mutate({ projectId: project.id })}
                          disabled={joinProjectMutation.isPending || project.participants >= project.maxParticipants}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          size="sm"
                        >
                          {joinProjectMutation.isPending ? (
                            <Activity className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <UserPlus className="w-4 h-4 mr-2" />
                          )}
                          {project.participants >= project.maxParticipants ? 'Project Full' : 'Join Project'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-slate-400">
                    <Target className="w-12 h-12 mx-auto mb-4" />
                    <p>No active projects available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Collaborators Tab */}
        <TabsContent value="collaborators" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Top Community Collaborators</CardTitle>
              <p className="text-slate-400 text-sm">Leading contributors to the productive mining ecosystem</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collaboratorsLoading ? (
                  <div className="text-center py-8">
                    <Users className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-400" />
                    <p className="text-slate-400">Loading collaborators...</p>
                  </div>
                ) : collaborators.length > 0 ? (
                  collaborators.map((collaborator, index) => (
                    <div key={collaborator.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">#{index + 1}</span>
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {collaborator.username.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{collaborator.username}</span>
                            <Badge className="bg-purple-600 text-white">{collaborator.level}</Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-slate-400">Reputation: {collaborator.reputation}</span>
                            <div className="flex items-center gap-1">
                              {collaborator.badges.slice(0, 3).map((badge, i) => (
                                <div key={i} title={badge}>
                                  {getBadgeIcon(badge)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">{collaborator.totalRewards} PROD</div>
                        <div className="text-sm text-slate-400">{collaborator.contributions} contributions</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-4" />
                    <p>No collaborators data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reward System Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Community Reward System</CardTitle>
              <p className="text-slate-400 text-sm">Recent reward distributions and system activity</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {rewardsLoading ? (
                  <div className="text-center py-8">
                    <Gift className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-400" />
                    <p className="text-slate-400">Loading reward history...</p>
                  </div>
                ) : rewards.length > 0 ? (
                  rewards.map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <Gift className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{reward.type}</div>
                          <div className="text-sm text-slate-400">{reward.reason}</div>
                          <div className="text-xs text-slate-500">
                            To: {reward.recipient} • {new Date(reward.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">+{reward.amount} PROD</div>
                        <Badge className={reward.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}>
                          {reward.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Gift className="w-12 h-12 mx-auto mb-4" />
                    <p>No reward history available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}