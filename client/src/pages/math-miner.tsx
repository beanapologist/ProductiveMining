import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Zap, Award, TrendingUp, Users, Medal, Crown, Sparkles, Brain, Target, Coins, User } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

interface MathMiner {
  id: number;
  minerId: string;
  nickname: string;
  level: number;
  experience: number;
  totalDiscoveries: number;
  totalScientificValue: string;
  preferredWorkType?: string;
  rank: string;
  joinedAt: string;
  lastActiveAt: string;
  avatar: string;
  title: string;
}

interface Achievement {
  achievement: {
    achievementId: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
    xpReward: number;
    category: string;
  };
  unlockedAt: string;
}

interface LevelProgression {
  isMaxLevel: boolean;
  progress: number;
  currentXp?: number;
  nextLevelXp?: number;
  xpNeeded?: number;
  nextLevel?: {
    level: number;
    rank: string;
    title: string;
    description: string;
  };
}

export default function MathMinerPage() {
  const [minerId, setMinerId] = useState("miner_001");
  const [nickname, setNickname] = useState("");
  const queryClient = useQueryClient();

  // Fetch miner profile
  const { data: minerProfile, isLoading: profileLoading } = useQuery({
    queryKey: [`/api/miners/${minerId}`],
    enabled: !!minerId,
    staleTime: 30000, // 30 seconds
  });

  // Fetch miner achievements
  const { data: achievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: [`/api/miners/${minerId}/achievements`],
    enabled: !!minerId,
    staleTime: 30000,
  });

  // Fetch level progression
  const { data: progression, isLoading: progressionLoading } = useQuery({
    queryKey: [`/api/miners/${minerId}/progression`],
    enabled: !!minerId,
    staleTime: 30000,
  });

  // Fetch leaderboard
  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ['/api/miners/leaderboard'],
    staleTime: 60000, // 1 minute
  });

  // Create/Update miner mutation
  const createMinerMutation = useMutation({
    mutationFn: async (data: { minerId: string; nickname?: string }) => {
      return await apiRequest('/api/miners/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/miners/${minerId}`] });
    }
  });

  // Award XP mutation (for testing)
  const awardXpMutation = useMutation({
    mutationFn: async (data: { xp: number; source: string }) => {
      return await apiRequest(`/api/miners/${minerId}/award-xp`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/miners/${minerId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/miners/${minerId}/progression`] });
      queryClient.invalidateQueries({ queryKey: [`/api/miners/${minerId}/achievements`] });
      queryClient.invalidateQueries({ queryKey: ['/api/miners/leaderboard'] });
    }
  });

  const handleCreateMiner = () => {
    createMinerMutation.mutate({ minerId, nickname });
  };

  const handleAwardXp = (xp: number, source: string) => {
    awardXpMutation.mutate({ xp, source });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 border-yellow-500';
      case 'epic': return 'text-purple-500 border-purple-500';
      case 'rare': return 'text-blue-500 border-blue-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10';
      case 'epic': return 'bg-gradient-to-r from-purple-500/10 to-pink-500/10';
      case 'rare': return 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Mythic': return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'Legend': return <Trophy className="h-5 w-5 text-purple-500" />;
      case 'Grandmaster': return <Medal className="h-5 w-5 text-blue-500" />;
      case 'Master': return <Star className="h-5 w-5 text-green-500" />;
      case 'Expert': return <Award className="h-5 w-5 text-orange-500" />;
      case 'Journeyman': return <Target className="h-5 w-5 text-blue-400" />;
      default: return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
            <Sparkles className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Math Miner</h1>
            <p className="text-gray-400">Level up through mathematical discovery!</p>
          </div>
        </div>
        {minerProfile && (
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
            <span className="text-2xl">{minerProfile.avatar}</span>
            <div>
              <p className="font-medium text-white">{minerProfile.nickname}</p>
              <p className="text-sm text-gray-400">Level {minerProfile.level} {minerProfile.rank}</p>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="admin">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {!minerProfile ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Create Your Math Miner Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Miner ID</label>
                    <Input
                      value={minerId}
                      onChange={(e) => setMinerId(e.target.value)}
                      placeholder="Enter unique miner ID"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Nickname</label>
                    <Input
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Choose a nickname"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleCreateMiner}
                  disabled={createMinerMutation.isPending || !minerId}
                  className="w-full"
                >
                  {createMinerMutation.isPending ? "Creating..." : "Create Math Miner"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Miner Stats */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {getRankIcon(minerProfile.rank)}
                    Miner Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Level</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-white border-blue-500">
                        {minerProfile.level}
                      </Badge>
                      <span className="text-blue-400">{minerProfile.title}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Experience</span>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-white font-mono">{minerProfile.experience.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total Discoveries</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-green-500" />
                      <span className="text-white font-mono">{minerProfile.totalDiscoveries}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Scientific Value</span>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-blue-500" />
                      <span className="text-white font-mono">${Number(minerProfile.totalScientificValue).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Rank</span>
                    <Badge className={`${getRarityColor(minerProfile.rank.toLowerCase())} bg-transparent`}>
                      {minerProfile.rank}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Level Progress */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Level Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {progressionLoading ? (
                    <div className="text-gray-400">Loading progression...</div>
                  ) : progression?.isMaxLevel ? (
                    <div className="text-center">
                      <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white">Maximum Level Reached!</h3>
                      <p className="text-gray-400">You've mastered the art of mathematical discovery</p>
                    </div>
                  ) : progression ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Level {minerProfile.level}</span>
                        <span className="text-gray-300">Level {progression.nextLevel?.level}</span>
                      </div>
                      <Progress value={progression.progress} className="h-3" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{progression.currentXp} XP</span>
                        <span className="text-gray-400">{progression.nextLevelXp} XP</span>
                      </div>
                      {progression.nextLevel && (
                        <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                          <h4 className="font-medium text-white">Next: {progression.nextLevel.title}</h4>
                          <p className="text-sm text-gray-400">{progression.nextLevel.description}</p>
                          <p className="text-xs text-blue-400 mt-1">{progression.xpNeeded} XP needed</p>
                        </div>
                      )}
                    </>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievement Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievementsLoading ? (
                <div className="text-gray-400">Loading achievements...</div>
              ) : achievements.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400">No achievements yet</h3>
                  <p className="text-gray-500">Start mining to unlock your first achievement!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement: Achievement) => (
                    <div
                      key={achievement.achievement.achievementId}
                      className={`p-4 rounded-lg border ${getRarityColor(achievement.achievement.rarity)} ${getRarityBg(achievement.achievement.rarity)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{achievement.achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{achievement.achievement.name}</h4>
                          <p className="text-sm text-gray-400 mb-2">{achievement.achievement.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={getRarityColor(achievement.achievement.rarity)}>
                              {achievement.achievement.rarity}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-yellow-500">
                              <Zap className="h-3 w-3" />
                              {achievement.achievement.xpReward} XP
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Math Miners
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboardLoading ? (
                <div className="text-gray-400">Loading leaderboard...</div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((miner: MathMiner, index: number) => (
                    <div
                      key={miner.id}
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' : 'bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {index === 0 && <Crown className="h-6 w-6 text-yellow-500" />}
                        {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                        {index === 2 && <Medal className="h-6 w-6 text-orange-600" />}
                        <span className="font-mono text-lg font-bold text-white w-8">#{index + 1}</span>
                      </div>
                      
                      <div className="text-2xl">{miner.avatar}</div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{miner.nickname}</span>
                          <Badge variant="outline" className="text-xs">
                            Level {miner.level}
                          </Badge>
                          <Badge className={`${getRarityColor(miner.rank.toLowerCase())} bg-transparent text-xs`}>
                            {miner.rank}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{miner.title}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Zap className="h-4 w-4" />
                          <span className="font-mono">{miner.experience.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-500 text-sm">
                          <Star className="h-3 w-3" />
                          <span>{miner.totalDiscoveries}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Testing Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleAwardXp(50, "Manual Test Award")}
                  disabled={awardXpMutation.isPending || !minerProfile}
                  variant="outline"
                >
                  Award 50 XP
                </Button>
                <Button
                  onClick={() => handleAwardXp(200, "Discovery Simulation")}
                  disabled={awardXpMutation.isPending || !minerProfile}
                  variant="outline"
                >
                  Award 200 XP
                </Button>
                <Button
                  onClick={() => handleAwardXp(1000, "Achievement Test")}
                  disabled={awardXpMutation.isPending || !minerProfile}
                  variant="outline"
                >
                  Award 1000 XP
                </Button>
                <Button
                  onClick={() => handleAwardXp(5000, "Level Up Test")}
                  disabled={awardXpMutation.isPending || !minerProfile}
                  variant="outline"
                >
                  Award 5000 XP
                </Button>
              </div>
              {awardXpMutation.isPending && (
                <p className="text-gray-400">Awarding XP...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}