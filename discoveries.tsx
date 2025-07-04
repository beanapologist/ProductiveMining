import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calculator, 
  Atom, 
  Infinity, 
  Trophy, 
  TrendingUp, 
  BarChart3,
  Download
} from "lucide-react";
import type { MathematicalWork } from "@shared/schema";

// Mock data to ensure build works
const mockDiscoveries: MathematicalWork[] = [
  {
    id: 1,
    workType: "riemann_zero",
    difficulty: 45,
    result: { value: "1.234567" },
    verificationData: { hash: "abc123" },
    computationalCost: 1000,
    energyEfficiency: 0.95,
    scientificValue: 2500,
    timestamp: new Date(),
    workerId: "miner_001",
    signature: "sig123"
  }
];

const getWorkTypeIcon = (workType: string) => {
  switch (workType) {
    case "riemann_zero": return <Infinity className="h-4 w-4" />;
    case "prime_pattern": return <Calculator className="h-4 w-4" />;
    case "yang_mills": return <Atom className="h-4 w-4" />;
    default: return <Trophy className="h-4 w-4" />;
  }
};

const formatWorkType = (workType: string) => {
  return workType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatTimestamp = (timestamp: Date) => {
  return new Date(timestamp).toLocaleString();
};

export default function DiscoveriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscovery, setSelectedDiscovery] = useState<MathematicalWork | null>(null);

  const discoveries = mockDiscoveries;

  const filteredDiscoveries = discoveries.filter(discovery =>
    formatWorkType(discovery.workType).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = discoveries.reduce((sum, d) => sum + d.scientificValue, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Mathematical Discoveries</h1>
          <p className="text-gray-400">Explore groundbreaking mathematical breakthroughs from productive mining</p>
        </div>
        <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="discoveries" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="discoveries" className="text-white">
            Discoveries ({discoveries.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discoveries" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Discovery Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{discoveries.length}</div>
                  <div className="text-sm text-gray-400">Total Discoveries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">${totalValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Scientific Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">9</div>
                  <div className="text-sm text-gray-400">Work Types</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search discoveries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Discoveries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredDiscoveries.map((discovery) => (
                  <div 
                    key={discovery.id}
                    className="p-4 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700/70"
                    onClick={() => setSelectedDiscovery(discovery)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getWorkTypeIcon(discovery.workType)}
                        <span className="font-medium text-white">
                          {formatWorkType(discovery.workType)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        Difficulty {discovery.difficulty}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      Value: ${discovery.scientificValue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedDiscovery && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    {getWorkTypeIcon(selectedDiscovery.workType)}
                    <span className="ml-2">{formatWorkType(selectedDiscovery.workType)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">Discovery ID</div>
                    <div className="text-white">#{selectedDiscovery.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Timestamp</div>
                    <div className="text-white">{formatTimestamp(selectedDiscovery.timestamp)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Scientific Value</div>
                    <div className="text-green-400 font-bold">
                      ${selectedDiscovery.scientificValue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Difficulty Level</div>
                    <div className="text-white">{selectedDiscovery.difficulty}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Energy Efficiency</div>
                    <div className="text-white">{(selectedDiscovery.energyEfficiency * 100).toFixed(1)}%</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Discovery Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  Advanced analytics and insights coming soon...
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {discoveries.length} Discoveries Analyzed
                </div>
                <div className="text-green-400">
                  Total Value: ${totalValue.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}