import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface DetectionEntry {
  result: string;
  isHealthy: boolean;
  timestamp: string;
}

const CircleProgress = ({
  percentage = 85,
  size = 140,
  strokeWidth = 14,
}: {
  percentage?: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="mx-auto drop-shadow-lg sm:w-36 sm:h-36"
    >
      <circle
        stroke="rgba(34,197,94,0.2)"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        stroke="#fcfcfc"
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
        style={{ filter: "drop-shadow(0 0 6px #22c55e)" }}
      />
      <text
        x="50%"
        y="50%"
        dy="0.3em"
        textAnchor="middle"
        fontSize="2rem"
        className="font-bold font-poppins select-none drop-shadow-md sm:text-2xl"
        fill="#15803d"
      >
        {percentage}%
      </text>
    </svg>
  );
};

const Dashboard = () => {
  const [activeScans, setActiveScans] = useState(0);
  const [detectionHistory, setDetectionHistory] = useState<DetectionEntry[]>([]);
  const [averageHealthScore, setAverageHealthScore] = useState(85);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        const savedCount = localStorage.getItem("scanCount");
        setActiveScans(savedCount ? Number(savedCount) : 0);

        const savedHistory = localStorage.getItem("detectionHistory");
        if (savedHistory) {
          const history = JSON.parse(savedHistory) as DetectionEntry[];
          setDetectionHistory(history);
          updateAverageHealthScore(history);
        } else {
          setDetectionHistory([]);
          setAverageHealthScore(85);
        }
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();

          setActiveScans(data.scanCount ?? 0);

          const historyRaw = data.detectionHistory ?? [];
          const history: DetectionEntry[] = historyRaw.map((item: any) => ({
            result: item.result || "Unknown",
            isHealthy: !!item.isHealthy,
            timestamp: item.timestamp || new Date().toISOString(),
          }));

          setDetectionHistory(history);
          updateAverageHealthScore(history);
        } else {
          await setDoc(doc(db, "users", user.uid), {
            scanCount: 0,
            detectionHistory: [],
          });
          setActiveScans(0);
          setDetectionHistory([]);
          setAverageHealthScore(85);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);

        const savedCount = localStorage.getItem("scanCount");
        setActiveScans(savedCount ? Number(savedCount) : 0);

        const savedHistory = localStorage.getItem("detectionHistory");
        if (savedHistory) {
          const history = JSON.parse(savedHistory) as DetectionEntry[];
          setDetectionHistory(history);
          updateAverageHealthScore(history);
        } else {
          setDetectionHistory([]);
          setAverageHealthScore(85);
        }
      }
    };

    const updateAverageHealthScore = (history: DetectionEntry[]) => {
      if (history.length === 0) {
        setAverageHealthScore(0);
        return;
      }
      const healthyCount = history.filter((d) => d.isHealthy).length;
      const avgScore = Math.round((healthyCount / history.length) * 100);
      setAverageHealthScore(avgScore);
    };

    fetchUserData();
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const diseaseCount = detectionHistory.filter((d) => !d.isHealthy).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-4 sm:px-6 lg:px-12 py-6 sm:py-8 font-inter text-gray-800 m-0">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 font-poppins text-green-900 gap-3 sm:gap-4 select-none text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md">
          🌿 Dashboard
        </h1>
        <Badge
          variant="outline"
          className="bg-green-200 text-green-900 flex items-center gap-2 animate-pulse rounded-lg px-3 py-2 sm:px-4 sm:py-2 shadow-md"
        >
          <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          Last updated: Today
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">

        {/* Active Scans */}
        <motion.div whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="flex flex-col justify-around items-center text-center rounded-3xl border-0 shadow-xl bg-gradient-to-tr from-green-300 via-green-400 to-green-500 min-h-[280px] sm:min-h-[300px] text-white px-4 sm:px-6 py-6">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-[1.1rem] font-semibold uppercase tracking-widest drop-shadow-lg">
                Active Scans
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <motion.div className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg select-none">
                {activeScans}
              </motion.div>
              <div className="w-full bg-green-700 rounded-full h-4 sm:h-5 mt-4 sm:mt-5 overflow-hidden shadow-inner shadow-green-900/30">
                <motion.div
                  className="bg-white h-4 sm:h-5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(activeScans * 10, 100)}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{ filter: "drop-shadow(0 0 6px white)" }}
                />
              </div>
              <p className="text-xs sm:text-sm font-medium mt-2 sm:mt-3 tracking-wider drop-shadow-md select-none">
                Scans completed successfully
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disease Alerts */}
        <motion.div whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="flex flex-col justify-around items-center text-center rounded-3xl border-0 shadow-xl bg-gradient-to-tr from-amber-300 via-amber-400 to-amber-500 min-h-[280px] sm:min-h-[300px] text-white px-4 sm:px-6 py-6">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-[1.1rem] font-semibold uppercase tracking-widest drop-shadow-lg">
                Disease Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <motion.div className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg select-none">
                {diseaseCount}
              </motion.div>
              <div className="w-full bg-amber-700 rounded-full h-4 sm:h-5 mt-4 sm:mt-5 overflow-hidden shadow-inner shadow-amber-900/30">
                <motion.div
                  className="bg-white h-4 sm:h-5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(diseaseCount * 10, 100)}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{ filter: "drop-shadow(0 0 6px white)" }}
                />
              </div>
              <p className="text-xs sm:text-sm font-medium mt-2 sm:mt-3 tracking-wider drop-shadow-md select-none">
                Issues detected, immediate action required
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Average Health Score */}
        <motion.div whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="flex flex-col justify-around items-center text-center rounded-3xl border-0 shadow-xl bg-gradient-to-tr from-green-300 via-green-400 to-green-500 min-h-[280px] sm:min-h-[300px] text-white px-4 sm:px-6 py-6">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-[1.1rem] font-semibold uppercase tracking-widest drop-shadow-lg select-none">
                Average Health Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <CircleProgress percentage={averageHealthScore} />
              <motion.p
                className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold drop-shadow-md select-none"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                +2% from last week
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <Card className="rounded-3xl border border-gray-300 shadow-lg bg-white max-w-4xl mx-auto mb-10">
        <CardHeader>
          <CardTitle className="font-poppins text-2xl sm:text-3xl font-extrabold text-gray-900 drop-shadow-sm select-none">
            📜 Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-700 select-none">
            Latest disease detections from your fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[320px] sm:max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-green-100 rounded-md px-2 sm:px-4">
            {detectionHistory.length === 0 ? (
              <p className="text-gray-500 font-inter select-none text-center py-12">
                No recent detections yet.
              </p>
            ) : (
              detectionHistory.map(({ result, isHealthy, timestamp }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-3 last:border-none"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-gray-900 font-poppins">{result}</p>
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
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
