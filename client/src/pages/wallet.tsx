import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, Copy, Check, Coins, Lock, Award, TrendingUp, 
  PieChart, Zap, Plus, ExternalLink, Unlock, Gamepad2, 
  Sparkles, Trophy, Target, Crown, Shield, Gem, Flame,
  Brain, Rocket, Star, Gift, Lightning, Swords, Bot,
  ChevronRight, Users, Hexagon
} from 'lucide-react';

interface PlayerStats {
  level: number;
  experience: number;
  experienceToNext: number;
  totalXP: number;
  researcherRank: string;
  prestigeLevel: number;
  dailyStreak: number;
  totalDiscoveries: number;
  rareDiscoveries: number;
  totalEarnings: number;
  powerLevel: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  reward: string;
  category: string;
}

interface WalletData {
  address: string;
  balance: {
    liquid: number;
    staked: number;
    locked: number;
    pending: number;
  };
  nfts: {
    total: number;
    discoveries: number;
    achievements: number;
    rare: number;
  };
  portfolio: {
    total: number;
    change24h: number;
    allTimeHigh: number;
    rank: number;
  };
}

interface TokenMetrics {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  stakingRatio: number;
  stakingRewards: number;
  holders: number;
  discoveryNFTs: number;
  revenueGenerated: number;
  treasuryBalance: number;
}

interface GamingQuest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'legendary';
  progress: number;
  maxProgress: number;
  reward: string;
  timeLeft: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

export default function GamifiedWalletPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  // AI-Powered Gaming Data
  const { data: playerStats } = useQuery<PlayerStats>({
    queryKey: ['/api/gaming/player-stats'],
    staleTime: 10000,
    refetchInterval: 30000,
  });

  const { data: walletData } = useQuery<WalletData>({
    queryKey: ['/api/gaming/wallet-data'],
    staleTime: 10000,
    refetchInterval: 30000,
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ['/api/gaming/achievements'],
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const { data: activeQuests = [] } = useQuery<GamingQuest[]>({
    queryKey: ['/api/gaming/quests'],
    staleTime: 10000,
    refetchInterval: 15000,
  });

  const { data: leaderboard = [] } = useQuery<any[]>({
    queryKey: ['/api/gaming/leaderboard'],
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const { data: tokenMetrics } = useQuery<TokenMetrics>({
    queryKey: ['/api/token/metrics'],
    staleTime: 30000,
  });

  const copyAddress = () => {
    const address = walletData?.address || "0x742d35Cc4Bf8f3b8f8C8F8D8E8F8G8H8I8J8K8L8M8N8";
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Gaming Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 border border-purple-500/30">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                {playerStats?.level || 47}
              </div>
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-2 py-1">
                P{playerStats?.prestigeLevel || 3}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{playerStats?.researcherRank || "Quantum Explorer"}</h1>
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Power: {(playerStats?.powerLevel || 9847).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Streak: {playerStats?.dailyStreak || 23} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Rank #{walletData?.portfolio?.rank || 847}</span>
                </div>
              </div>
              
              {/* XP Progress Bar */}
              <div className="w-80">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Level {playerStats?.level || 47}</span>
                  <span>{(playerStats?.experience || 14250).toLocaleString()} / {((playerStats?.experience || 14250) + (playerStats?.experienceToNext || 1750)).toLocaleString()} XP</span>
                </div>
                <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000 ease-out relative"
                    style={{ width: `${((playerStats?.experience || 14250) / ((playerStats?.experience || 14250) + (playerStats?.experienceToNext || 1750))) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Portfolio Value */}
          <div className="text-right">
            <div className="text-4xl font-bold text-white">
              ${(walletData?.portfolio?.total || 407300).toLocaleString()}
            </div>
            <div className={`flex items-center gap-2 ${(walletData?.portfolio?.change24h || 12.4) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp className="w-4 h-4" />
              <span>{(walletData?.portfolio?.change24h || 12.4) >= 0 ? '+' : ''}{walletData?.portfolio?.change24h || 12.4}%</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700 grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            <Gamepad2 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assets" className="data-[state=active]:bg-purple-600">
            <Coins className="w-4 h-4 mr-2" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="quests" className="data-[state=active]:bg-purple-600">
            <Target className="w-4 h-4 mr-2" />
            Quests
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
            <Crown className="w-4 h-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Liquid Balance */}
            <Card className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  Liquid PROD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{(walletData?.balance?.liquid || 5247).toLocaleString()}</div>
                <div className="text-sm text-slate-400">Ready to use</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Zap className="w-3 h-3 mr-1" />
                    Stake
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Trade
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Staked Balance */}
            <Card className="bg-slate-800 border-slate-700 hover:border-green-500/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-400" />
                  Staked PROD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{(walletData?.balance?.staked || 8950).toLocaleString()}</div>
                <div className="text-sm text-green-400">+{tokenMetrics?.stakingRewards || 18.7}% APY</div>
                <div className="text-xs text-slate-400 mt-1">
                  Earning: +{Math.round((walletData?.balance?.staked || 8950) * 0.187 / 365)} PROD/day
                </div>
              </CardContent>
            </Card>

            {/* Discovery NFTs */}
            <Card className="bg-slate-800 border-slate-700 hover:border-yellow-500/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Gem className="w-4 h-4 text-yellow-400" />
                  Discovery NFTs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{walletData?.nfts?.discoveries || 67}</div>
                <div className="text-sm text-yellow-400">{walletData?.nfts?.rare || 7} rare discoveries</div>
                <div className="text-xs text-slate-400 mt-1">
                  Floor: {(tokenMetrics?.discoveryNFTs || 1247) / 10} PROD
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-400" />
                  Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{walletData?.nfts?.achievements || 15}</div>
                <div className="text-sm text-orange-400">Unlocked badges</div>
                <div className="text-xs text-slate-400 mt-1">
                  Progress: {Math.round(((walletData?.nfts?.achievements || 15) / 50) * 100)}% complete
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Address */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Gaming Wallet Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg">
                <code className="flex-1 font-mono text-sm text-slate-300 break-all">
                  {walletData?.address || "0x742d35Cc4Bf8f3b8f8C8F8D8E8F8G8H8I8J8K8L8M8N8"}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyAddress}
                  className="text-slate-400 hover:text-green-400"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Token Holdings */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-cyan-400" />
                  Token Holdings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">PROD Token</div>
                      <div className="text-sm text-slate-400">Liquid: {(walletData?.balance?.liquid || 5247).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">${((walletData?.balance?.liquid || 5247) * (tokenMetrics?.price || 10.58)).toLocaleString()}</div>
                    <div className="text-sm text-green-400">+{tokenMetrics?.change24h || 12.3}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Staked PROD</div>
                      <div className="text-sm text-slate-400">Earning {tokenMetrics?.stakingRewards || 18.7}% APY</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">${((walletData?.balance?.staked || 8950) * (tokenMetrics?.price || 10.58)).toLocaleString()}</div>
                    <div className="text-sm text-green-400">+{Math.round((walletData?.balance?.staked || 8950) * 0.187)} PROD/year</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NFT Collection */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="w-5 h-5 text-yellow-400" />
                  NFT Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-900 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">{walletData?.nfts?.discoveries || 67}</div>
                    <div className="text-sm text-slate-400">Discovery NFTs</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">{walletData?.nfts?.achievements || 15}</div>
                    <div className="text-sm text-slate-400">Achievement Badges</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Rare Discoveries</span>
                    <Badge className="bg-purple-600">{walletData?.nfts?.rare || 7}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Collection Value</span>
                    <span className="text-white font-semibold">${((walletData?.nfts?.total || 89) * 1477).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`bg-slate-800 border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                  achievement.unlocked ? getRarityColor(achievement.rarity) : 'border-slate-700'
                } ${achievement.unlocked ? 'bg-gradient-to-br from-slate-800 to-slate-700' : 'opacity-75'}`}
                onClick={() => setSelectedAchievement(achievement)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className={`text-lg ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                          {achievement.name}
                        </CardTitle>
                        <Badge className={`mt-1 ${getRarityColor(achievement.rarity)} bg-transparent`}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                    {achievement.unlocked && <Trophy className="w-6 h-6 text-yellow-400" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-3">{achievement.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className={achievement.unlocked ? 'text-green-400' : 'text-slate-300'}>
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="mt-3 p-2 bg-slate-900 rounded text-xs text-slate-400">
                    Reward: {achievement.reward}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quests Tab */}
        <TabsContent value="quests" className="space-y-6">
          <div className="space-y-4">
            {activeQuests.map((quest) => (
              <Card key={quest.id} className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getDifficultyColor(quest.difficulty)}`}></div>
                      <div>
                        <CardTitle className="text-white">{quest.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${
                            quest.type === 'daily' ? 'bg-green-600' : 
                            quest.type === 'weekly' ? 'bg-blue-600' : 'bg-purple-600'
                          }`}>
                            {quest.type}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(quest.difficulty)} text-white`}>
                            {quest.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Time Left</div>
                      <div className="font-semibold text-white">{quest.timeLeft}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">{quest.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white">{quest.progress}/{quest.maxProgress}</span>
                    </div>
                    <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-3" />
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="p-2 bg-slate-900 rounded text-sm text-green-400">
                      Reward: {quest.reward}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={quest.progress >= quest.maxProgress}
                    >
                      {quest.progress >= quest.maxProgress ? 'Claim Reward' : 'Continue Quest'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                Global Researcher Rankings
              </CardTitle>
              <CardDescription>
                Your current rank: #{walletData?.portfolio?.rank || 847} out of {(tokenMetrics?.holders || 15420).toLocaleString()} players
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((player, index) => (
                  <div 
                    key={player.rank} 
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      player.name === 'You' ? 'bg-purple-900/50 border-2 border-purple-500' : 'bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        player.rank <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : 'bg-slate-700 text-white'
                      }`}>
                        {player.rank <= 3 ? <Crown className="w-4 h-4" /> : player.rank}
                      </div>
                      <div>
                        <div className={`font-semibold ${player.name === 'You' ? 'text-purple-400' : 'text-white'}`}>
                          {player.name}
                        </div>
                        <div className="text-sm text-slate-400">Level {player.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{player.discoveries} discoveries</div>
                      <div className="text-sm text-slate-400">${player.earnings.toLocaleString()} earned</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}