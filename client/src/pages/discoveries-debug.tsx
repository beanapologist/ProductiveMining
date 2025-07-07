import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MathematicalWork {
  id: number;
  workType: string;
  difficulty: number;
  result: any;
  verificationData: any;
  computationalCost: number;
  energyEfficiency: number;
  scientificValue: number;
  workerId: string;
  signature: string;
  timestamp: Date | string;
}

export default function DiscoveriesDebug() {
  const { data: allDiscoveries = [], isLoading, error } = useQuery({
    queryKey: ["/api/discoveries"],
    queryFn: async () => {
      console.log("🔍 Fetching discoveries...");
      const response = await fetch("/api/discoveries");
      const data = await response.json();
      console.log(`🔍 Received ${data.length} discoveries:`, data.slice(0, 3));
      return data;
    },
    refetchInterval: 25000, // Reduced from 5s to 25s
  });

  console.log("🔍 Component rendered with:", { 
    discoveryCount: allDiscoveries.length, 
    isLoading, 
    error: error?.message 
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading discoveries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-400 text-xl mb-4">Error loading discoveries</div>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">DEBUG: Mathematical Discoveries</h1>
          <p className="text-gray-400 mt-2">
            Found {allDiscoveries.length} discoveries (Debug Mode)
          </p>
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>Total Discoveries: <span className="text-green-400">{allDiscoveries.length}</span></div>
            <div>Loading State: <span className="text-blue-400">{isLoading ? 'Loading' : 'Complete'}</span></div>
            <div>Error State: <span className="text-red-400">{error ? error.message : 'None'}</span></div>
            <div>Data Type: <span className="text-yellow-400">{Array.isArray(allDiscoveries) ? 'Array' : typeof allDiscoveries}</span></div>
          </div>
        </CardContent>
      </Card>

      {allDiscoveries.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sample Discoveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allDiscoveries.slice(0, 5).map((discovery: MathematicalWork) => (
                <div key={discovery.id} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">#{discovery.id} - {discovery.workType}</div>
                      <div className="text-sm text-gray-400">
                        Value: ${discovery.scientificValue} | Difficulty: {discovery.difficulty}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(discovery.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {allDiscoveries.length === 0 && !isLoading && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-12">
            <div className="text-yellow-400 text-xl mb-4">No Discoveries Found</div>
            <p className="text-gray-400">The API returned an empty array</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}