import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wallet, Copy, Check, Coins, Lock, Award, TrendingUp, 
  PieChart, Zap, Plus, ExternalLink, Unlock 
} from 'lucide-react';

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

interface StakingData {
  totalStaked: number;
  activeStakers: number;
  stakingPools: Array<{
    id: string;
    name: string;
    apy: number;
    minStake: number;
    totalStaked: number;
    stakers: number;
    features: string[];
  }>;
  annualRewards: number;
  networkSecurity: number;
}

interface NFTData {
  totalMinted: number;
  uniqueHolders: number;
  totalVolume: number;
  floorPrice: number;
  collections: Array<{
    type: string;
    name: string;
    count: number;
    floorPrice: number;
    description: string;
  }>;
  monthlyGrowth: number;
  holderSatisfaction: number;
}

export default function WalletPage() {
  const [copied, setCopied] = useState(false);
  const walletAddress = "0x742d35Cc4Bf8f3b8f8C8F8D8E8F8G8H8I8J8K8L8M8N8";

  const { data: tokenMetrics } = useQuery<TokenMetrics>({
    queryKey: ['/api/token/metrics'],
    staleTime: 30000,
  });

  const { data: stakingData } = useQuery<StakingData>({
    queryKey: ['/api/token/staking'],
    staleTime: 30000,
  });

  const { data: nftData } = useQuery<NFTData>({
    queryKey: ['/api/token/nfts'],
    staleTime: 30000,
  });

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate portfolio values based on realistic user holdings
  const prodBalance = 15847.23;
  const tokenPrice = tokenMetrics?.price || 10.58;
  const myStaked = 12000; // User's staked tokens
  const myNFTs = 8; // User's NFT count
  const avgNFTPrice = nftData?.floorPrice || 2847; // Average NFT price from API
  
  const prodValue = prodBalance * tokenPrice;
  const stakedValue = myStaked * tokenPrice;
  const nftValue = myNFTs * avgNFTPrice;
  const totalPortfolioValue = prodValue + stakedValue + nftValue;
  
  // Calculate pool-specific APY for display
  const elitePool = stakingData?.stakingPools?.find(pool => pool.id === 'elite');
  const standardPool = stakingData?.stakingPools?.find(pool => pool.id === 'standard');
  const currentAPY = elitePool?.apy || standardPool?.apy || tokenMetrics?.stakingRewards || 18.7;
  
  // Calculate pending rewards (estimated based on stake and APY)
  const pendingRewards = (myStaked * currentAPY / 100 / 365) * 30; // 30 days of rewards
  
  // Get staking ratio from token metrics
  const stakingRatio = tokenMetrics?.stakingRatio || 76.2;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Research Vault Portfolio</h1>
          <p className="text-gray-400 mt-2">
            Your productive mining ecosystem dashboard
          </p>
        </div>
        <Button
          onClick={copyAddress}
          variant="outline"
          className="border-slate-600 text-gray-300 flex items-center gap-2"
        >
          <Wallet className="h-4 w-4" />
          <span className="font-mono">{walletAddress.slice(0, 10)}...{walletAddress.slice(-4)}</span>
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      {/* Portfolio Value Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-white">
            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </CardTitle>
          <CardDescription className="text-xl text-gray-300">
            Total Portfolio Value
          </CardDescription>
          <div className="flex items-center justify-center gap-2 mt-4">
            <TrendingUp className="h-6 w-6 text-green-400" />
            <span className="text-green-400 font-semibold text-lg">
              +{tokenMetrics?.change24h?.toFixed(1) || 12.3}% (24h)
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Asset Allocation */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PieChart className="h-6 w-6 text-cyan-400" />
            Asset Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-4">
              <Coins className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-white font-bold">Liquid PROD</div>
                <div className="text-gray-400 text-sm">{prodBalance.toLocaleString()} tokens available</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">
                ${prodValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {((prodValue && totalPortfolioValue ? (prodValue / totalPortfolioValue) * 100 : 0)).toFixed(1)}%
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-4">
              <Lock className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-white font-bold">Staked PROD</div>
                <div className="text-gray-400 text-sm">
                  {myStaked.toLocaleString()} tokens earning {currentAPY.toFixed(1)}% APY
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">
                ${stakedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {((stakedValue && totalPortfolioValue ? (stakedValue / totalPortfolioValue) * 100 : 0)).toFixed(1)}%
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-4">
              <Award className="h-8 w-8 text-pink-400" />
              <div>
                <div className="text-white font-bold">Discovery NFTs</div>
                <div className="text-gray-400 text-sm">{myNFTs} unique mathematical discoveries</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">
                ${nftValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <Badge variant="outline" className="text-pink-400 border-pink-400">
                {((nftValue && totalPortfolioValue ? (nftValue / totalPortfolioValue) * 100 : 0)).toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Performance */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-yellow-400" />
            Market Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">PROD Price</span>
            <span className="text-white font-bold text-lg">${tokenPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">24h Change</span>
            <span className="text-green-400 font-bold">+{tokenMetrics?.change24h?.toFixed(1) || 12.3}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Market Cap</span>
            <span className="text-white font-semibold">${(tokenMetrics?.marketCap || 582000000).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Your Holdings</span>
            <span className="text-cyan-400 font-bold">{(prodBalance + myStaked).toLocaleString()} PROD</span>
          </div>
        </CardContent>
      </Card>

      {/* Staking Rewards */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-6 w-6 text-purple-400" />
            Staking Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Current APY</span>
            <span className="text-purple-400 font-bold text-lg">{currentAPY.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Pending Rewards</span>
            <span className="text-green-400 font-bold">{pendingRewards.toLocaleString()} PROD</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Network Staking</span>
            <span className="text-white font-semibold">{stakingRatio.toFixed(1)}%</span>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Unlock className="h-4 w-4 mr-2" />
            Claim Rewards
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Stake More PROD
          </Button>
          <Button variant="outline" className="w-full border-slate-600 text-gray-300">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Explorer
          </Button>
        </CardContent>
      </Card>

      {/* NFT Collection */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-pink-400" />
            NFT Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total NFTs</span>
            <span className="text-white font-bold">{myNFTs}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Floor Price</span>
            <span className="text-white font-semibold">${avgNFTPrice.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Top Collection</span>
            <span className="text-pink-400 font-semibold">Riemann Discoveries</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div key="riemann" className="text-center p-2 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="text-white font-bold">3</div>
              <div className="text-xs text-pink-300">Riemann</div>
            </div>
            <div key="prime" className="text-center p-2 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="text-white font-bold">2</div>
              <div className="text-xs text-blue-300">Prime</div>
            </div>
            <div key="yang-mills" className="text-center p-2 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="text-white font-bold">2</div>
              <div className="text-xs text-purple-300">Yang-Mills</div>
            </div>
            <div key="quantum" className="text-center p-2 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="text-white font-bold">1</div>
              <div className="text-xs text-green-300">Quantum</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}