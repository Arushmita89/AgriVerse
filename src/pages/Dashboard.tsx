import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface DetectionEntry {
  result: string;
  isHealthy: boolean;
  timestamp: string;
}

const CircleProgress = ({ percentage = 85, size = 120, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="mx-auto">
      <circle
        stroke="#d1fae5"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        stroke="#16a34a" // green-700
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <text
        x="50%"
        y="50%"
        dy="0.3em"
        textAnchor="middle"
        fontSize="2rem"
        fill="#15803d" // green-700 darker
        className="font-bold font-poppins"
      >
        {percentage}%
      </text>
    </svg>
  );
};

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

  const diseaseCount = detectionHistory.filter((d) => !d.isHealthy).length;
  const averageHealthScore = 85; // replace with real logic if available

  return (
    <div className="space-y-6 font-inter text-gray-700 bg-gray-50 min-h-screen px-4 py-6">
      <div className="flex items-center justify-between font-poppins text-gray-900">
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 flex items-center gap-1 animate-pulse rounded-md px-3 py-1"
        >
          <Clock className="w-5 h-5" />
          Last updated: Today
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Scans */}
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(22,163,74,0.25)" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="cursor-pointer"
          style={{
            boxShadow: "0 15px 30px rgba(22,163,74,0)", // reserve shadow space but transparent initially
          }}
        >
          <Card className="transition-transform rounded-xl border border-green-200 shadow-sm bg-white min-h-[250px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-green-800 uppercase tracking-wide">
                Active Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-green-700">{activeScans}</div>
              <div className="w-full bg-green-100 rounded-full h-4 mt-3 overflow-hidden">
                <motion.div
                  className="bg-green-600 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(activeScans * 10, 100)}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-green-600 font-medium mt-1">Active</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disease Alerts */}
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(217,119,6,0.25)" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="cursor-pointer"
        >
          <Card className="transition-transform rounded-xl border border-amber-300 shadow-sm bg-white min-h-[250px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                Disease Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-amber-600">{diseaseCount}</div>
              <div className="w-full bg-amber-100 rounded-full h-4 mt-3 overflow-hidden">
                <motion.div
                  className="bg-amber-600 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(diseaseCount * 10, 100)}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-amber-700 font-medium mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Average Health Score */}
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(22,163,74,0.25)" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="cursor-pointer"
        >
          <Card className="transition-transform rounded-xl border border-green-200 shadow-sm bg-white min-h-[250px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-green-800 uppercase tracking-wide">
                Average Health Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <CircleProgress percentage={averageHealthScore} />
              <p className="mt-2 text-sm text-green-700 font-semibold">+2% from last week</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <Card className="rounded-xl border border-gray-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="font-poppins text-xl font-extrabold text-gray-900">
            Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-600">
            Latest disease detections from your fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100">
            {detectionHistory.length === 0 ? (
              <p className="text-gray-500 font-inter">No recent detections yet.</p>
            ) : (
              detectionHistory.map(({ result, isHealthy, timestamp }, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-gray-200 pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-800 font-poppins">{result}</p>
                    <p className="text-sm text-gray-500 font-inter">{formatDate(timestamp)}</p>
                  </div>
                  <Badge
                    variant={isHealthy ? "outline" : "destructive"}
                    className={
                      isHealthy
                        ? "border-green-600 text-green-800"
                        : "border-red-600 text-red-700"
                    }
                  >
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
