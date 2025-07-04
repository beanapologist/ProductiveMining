import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Users, 
  Lock,
  Zap,
  Target,
  Gift,
  BarChart3,
  PieChart,
  Wallet,
  Crown,
  Star,
  Globe
} from "lucide-react";

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

export default function Token() {
  const { data: tokenData, isLoading } = useQuery<TokenMetrics>({
    queryKey: ['/api/token/metrics'],
    refetchInterval: 10000,
  });

  const { data: stakingData, isLoading: stakingLoading } = useQuery({
    queryKey: ['/api/token/staking'],
    refetchInterval: 30000,
  });

  const { data: nftData, isLoading: nftLoading } = useQuery({
    queryKey: ['/api/token/nfts'],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tokenMetrics = tokenData || {
    price: 10.58,
    change24h: 12.3,
    marketCap: 582000000,
    volume24h: 45200000,
    circulatingSupply: 55000000,
    totalSupply: 100000000,
    stakingRatio: 76.2,
    stakingRewards: 18.7,
    holders: 28450,
    discoveryNFTs: 1247,
    revenueGenerated: 580000000,
    treasuryBalance: 125000000
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Coins className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">PROD Token</h1>
            <p className="text-slate-400">Productive Mining Platform Token</p>
          </div>
        </div>
        <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
          Energy Generating • Patent-Protected • Institutional Backed
        </Badge>
      </div>

      {/* Price Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Token Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              ${tokenMetrics.price.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400">+{tokenMetrics.change24h}%</span>
              <span className="text-slate-400">24h</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Market Cap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {formatCurrency(tokenMetrics.marketCap)}
            </div>
            <div className="text-sm text-slate-400">
              Rank #47 • Volume {formatCurrency(tokenMetrics.volume24h)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-400" />
              Staking Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {tokenMetrics.stakingRatio}%
            </div>
            <div className="text-sm text-slate-400">
              APY {tokenMetrics.stakingRewards}% • High Security
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-400" />
              Token Holders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">
              {formatNumber(tokenMetrics.holders)}
            </div>
            <div className="text-sm text-slate-400">
              Discovery NFTs: {formatNumber(tokenMetrics.discoveryNFTs)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="nfts">Discovery NFTs</TabsTrigger>
          <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Generation */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Revenue Generation
                </CardTitle>
                <CardDescription>
                  Platform revenue from scientific discoveries and energy generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Revenue Generated</span>
                  <span className="text-2xl font-bold text-green-400">
                    {formatCurrency(tokenMetrics.revenueGenerated)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Treasury Balance</span>
                  <span className="text-lg font-semibold text-blue-400">
                    {formatCurrency(tokenMetrics.treasuryBalance)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Scientific Discovery Licensing</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Energy Generation Credits</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Staking & Validation Fees</span>
                    <span>10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Token Distribution */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-400" />
                  Token Distribution
                </CardTitle>
                <CardDescription>
                  Current token allocation and supply metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Circulating Supply</span>
                  <span className="text-lg font-semibold text-white">
                    {formatNumber(tokenMetrics.circulatingSupply)} PROD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Supply</span>
                  <span className="text-lg font-semibold text-slate-300">
                    {formatNumber(tokenMetrics.totalSupply)} PROD
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Staked Tokens</span>
                    <span>{tokenMetrics.stakingRatio}%</span>
                  </div>
                  <Progress value={tokenMetrics.stakingRatio} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Public Circulation</span>
                    <span>{(100 - tokenMetrics.stakingRatio).toFixed(1)}%</span>
                  </div>
                  <Progress value={100 - tokenMetrics.stakingRatio} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-green-400" />
                  Elite Staking
                </CardTitle>
                <CardDescription>Premium staking tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400 mb-2">22.5% APY</div>
                <div className="text-sm text-slate-400 mb-4">Minimum: 10,000 PROD</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    Priority validation rewards
                  </li>
                  <li className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-purple-400" />
                    Discovery NFT bonuses
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-400" />
                    Governance voting power
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-400" />
                  Standard Staking
                </CardTitle>
                <CardDescription>Regular staking rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400 mb-2">18.7% APY</div>
                <div className="text-sm text-slate-400 mb-4">Minimum: 100 PROD</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-400" />
                    Energy generation rewards
                  </li>
                  <li className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-orange-400" />
                    Discovery validation fees
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-400" />
                    Network security rewards
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-purple-400" />
                  Flexible Staking
                </CardTitle>
                <CardDescription>No lock-up period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400 mb-2">12.3% APY</div>
                <div className="text-sm text-slate-400 mb-4">Minimum: 10 PROD</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    Instant unstaking
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    Community rewards
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-orange-400" />
                    Basic validation rewards
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Staking Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {formatNumber(tokenMetrics.circulatingSupply * tokenMetrics.stakingRatio / 100)}
                  </div>
                  <div className="text-sm text-slate-400">Total Staked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">2,847</div>
                  <div className="text-sm text-slate-400">Active Stakers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {formatCurrency(tokenMetrics.circulatingSupply * tokenMetrics.stakingRatio / 100 * tokenMetrics.stakingRewards / 100)}
                  </div>
                  <div className="text-sm text-slate-400">Annual Rewards</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">94.3%</div>
                  <div className="text-sm text-slate-400">Network Security</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nfts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  Discovery NFTs
                </CardTitle>
                <CardDescription>
                  Unique NFTs representing major mathematical discoveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {formatNumber(tokenMetrics.discoveryNFTs)}
                    </div>
                    <div className="text-sm text-slate-400">Total Minted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">847</div>
                    <div className="text-sm text-slate-400">Unique Holders</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Riemann Hypothesis NFTs</span>
                    <Badge className="bg-blue-500/20 text-blue-400">247</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prime Pattern NFTs</span>
                    <Badge className="bg-green-500/20 text-green-400">189</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quantum Field NFTs</span>
                    <Badge className="bg-purple-500/20 text-purple-400">156</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Yang-Mills NFTs</span>
                    <Badge className="bg-orange-500/20 text-orange-400">134</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  NFT Market Performance
                </CardTitle>
                <CardDescription>
                  Trading volume and value metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(45700000)}
                    </div>
                    <div className="text-sm text-slate-400">Total Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {formatCurrency(2847)}
                    </div>
                    <div className="text-sm text-slate-400">Floor Price</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Volume Growth</span>
                    <span className="text-green-400">+34.7%</span>
                  </div>
                  <Progress value={34.7} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Holder Satisfaction</span>
                    <span className="text-blue-400">87.3%</span>
                  </div>
                  <Progress value={87.3} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tokenomics" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Token Economics Overview</CardTitle>
              <CardDescription>
                Comprehensive breakdown of PROD token economics and utility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Token Utility</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-green-400" />
                      Staking for network validation
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      Governance voting rights
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      Energy generation rewards
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-purple-400" />
                      Discovery NFT minting
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-400" />
                      Platform fee payments
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Revenue Streams</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-green-400" />
                      Scientific discovery licensing
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-400" />
                      Energy generation credits
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-purple-400" />
                      Discovery NFT royalties
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-orange-400" />
                      Staking and validation fees
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-cyan-400" />
                      Institutional partnerships
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold mb-3">Token Allocation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Public Sale & Liquidity</span>
                    <div className="flex items-center gap-2">
                      <Progress value={35} className="w-32 h-2" />
                      <span className="text-sm">35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Staking Rewards</span>
                    <div className="flex items-center gap-2">
                      <Progress value={30} className="w-32 h-2" />
                      <span className="text-sm">30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Development Fund</span>
                    <div className="flex items-center gap-2">
                      <Progress value={20} className="w-32 h-2" />
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Team & Advisors</span>
                    <div className="flex items-center gap-2">
                      <Progress value={10} className="w-32 h-2" />
                      <span className="text-sm">10%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Partnerships</span>
                    <div className="flex items-center gap-2">
                      <Progress value={5} className="w-32 h-2" />
                      <span className="text-sm">5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}