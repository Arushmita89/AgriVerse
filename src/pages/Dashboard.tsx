import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DetectionEntry {
  result: string;
  isHealthy: boolean;
  timestamp: string;
}

const Dashboard = () => {
  const [activeScans, setActiveScans] = useState(0);
  const [detectionHistory, setDetectionHistory] = useState<DetectionEntry[]>([]);

  useEffect(() => {
    const scansCount = Number(localStorage.getItem("scanCount") || "0");
    setActiveScans(scansCount);

    const existingHistory = localStorage.getItem("detectionHistory");
    if (existingHistory) {
      setDetectionHistory(JSON.parse(existingHistory));
    }
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Last updated: Today
        </Badge>
      </div>

      {/* Dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeScans}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Disease Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {/* You can enhance this logic by counting Diseased entries */}
            <div className="text-3xl font-bold text-amber-500">
              {detectionHistory.filter((d) => !d.isHealthy).length}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            {/* You can calculate average health here, using your own logic */}
            <div className="text-3xl font-bold text-green-600">85%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest disease detections from your fields</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {detectionHistory.length === 0 ? (
              <p className="text-muted-foreground">No recent detections yet.</p>
            ) : (
              detectionHistory.map(({ result, isHealthy, timestamp }, idx) => (
                <div key={idx} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{result}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(timestamp)}</p>
                  </div>
                  <Badge variant={isHealthy ? "outline" : "destructive"}>
                    {isHealthy ? "Healthy" : "Diseased"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
