"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Users, ArrowUp, ArrowDown, Minus } from "lucide-react";

type LeaderboardEntry = {
  id: string;
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  change: "up" | "down" | "same";
};

type LeaderboardProps = {
  type?: "XP_TOTAL" | "STREAK" | "COURSE_COMPLETION" | "QUIZ_SCORE";
  limit?: number;
  userId?: string;
};

export function Leaderboard({ type = "XP_TOTAL", limit = 10, userId }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<"weekly" | "monthly" | "allTime">("weekly");
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call to fetch the leaderboard
    const fetchLeaderboard = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Mock data for the leaderboard
        const mockEntries: LeaderboardEntry[] = [
          {
            id: "entry1",
            rank: 1,
            userId: "user1",
            username: "CodeMaster",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            score: 5840,
            change: "same"
          },
          {
            id: "entry2",
            rank: 2,
            userId: "user2",
            username: "DataWizard",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
            score: 5210,
            change: "up"
          },
          {
            id: "entry3",
            rank: 3,
            userId: "user3",
            username: "SQLNinja",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
            score: 4950,
            change: "down"
          },
          {
            id: "entry4",
            rank: 4,
            userId: "user4",
            username: "PythonPro",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
            score: 4820,
            change: "up"
          },
          {
            id: "entry5",
            rank: 5,
            userId: "user5",
            username: "WebDev101",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
            score: 4650,
            change: "down"
          },
          {
            id: "entry6",
            rank: 6,
            userId: "currentUser", // This would be the current user
            username: "You",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
            score: 4320,
            change: "up"
          },
          {
            id: "entry7",
            rank: 7,
            userId: "user7",
            username: "JavaScriptJedi",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
            score: 4100,
            change: "same"
          },
          {
            id: "entry8",
            rank: 8,
            userId: "user8",
            username: "ReactRanger",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
            score: 3950,
            change: "down"
          },
          {
            id: "entry9",
            rank: 9,
            userId: "user9",
            username: "CSSMaster",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
            score: 3800,
            change: "up"
          },
          {
            id: "entry10",
            rank: 10,
            userId: "user10",
            username: "GitGuru",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
            score: 3650,
            change: "same"
          }
        ];
        
        // Find the current user's rank
        const currentUserEntry = mockEntries.find(entry => entry.userId === "currentUser");
        if (currentUserEntry) {
          setUserRank(currentUserEntry);
        }
        
        setEntries(mockEntries);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [type, timeFrame, userId]);

  const getLeaderboardTitle = () => {
    switch (type) {
      case "XP_TOTAL":
        return "XP Leaderboard";
      case "STREAK":
        return "Streak Leaderboard";
      case "COURSE_COMPLETION":
        return "Course Completion";
      case "QUIZ_SCORE":
        return "Quiz Masters";
      default:
        return "Leaderboard";
    }
  };

  const getScoreLabel = () => {
    switch (type) {
      case "XP_TOTAL":
        return "XP";
      case "STREAK":
        return "Days";
      case "COURSE_COMPLETION":
        return "Courses";
      case "QUIZ_SCORE":
        return "Score";
      default:
        return "Points";
    }
  };

  const getRankChangeIcon = (change: "up" | "down" | "same") => {
    switch (change) {
      case "up":
        return <ArrowUp size={14} className="text-green-500" />;
      case "down":
        return <ArrowDown size={14} className="text-red-500" />;
      case "same":
        return <Minus size={14} className="text-gray-400" />;
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-700";
      default:
        return "text-blue-500";
    }
  };

  if (loading) {
    return (
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold">{getLeaderboardTitle()}</h3>
        </div>
        
        <div className="flex text-sm rounded-md overflow-hidden border">
          <button 
            className={`px-3 py-1 ${timeFrame === 'weekly' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-800'}`}
            onClick={() => setTimeFrame('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`px-3 py-1 border-l border-r ${timeFrame === 'monthly' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-800'}`}
            onClick={() => setTimeFrame('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`px-3 py-1 ${timeFrame === 'allTime' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-800'}`}
            onClick={() => setTimeFrame('allTime')}
          >
            All Time
          </button>
        </div>
      </div>
      
      <div className="space-y-1">
        {entries.slice(0, limit).map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center p-2 rounded-lg ${
              entry.userId === "currentUser" 
                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30" 
                : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
            }`}
          >
            <div className="w-8 text-center font-semibold">
              {entry.rank <= 3 ? (
                <Medal className={`w-5 h-5 mx-auto ${getMedalColor(entry.rank)}`} />
              ) : (
                entry.rank
              )}
            </div>
            
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mx-2">
              {entry.avatar ? (
                <img src={entry.avatar} alt={entry.username} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-4 h-4 m-2 text-gray-500" />
              )}
            </div>
            
            <div className="flex-1 font-medium text-sm">
              {entry.username}
              {entry.userId === "currentUser" && (
                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(You)</span>
              )}
            </div>
            
            <div className="flex items-center">
              <span className="font-semibold mr-2">{entry.score.toLocaleString()}</span>
              <span className="text-xs text-gray-500">{getScoreLabel()}</span>
            </div>
            
            <div className="w-6 flex justify-center ml-2">
              {getRankChangeIcon(entry.change)}
            </div>
          </motion.div>
        ))}
      </div>
      
      {userRank && userRank.rank > limit && (
        <div className="mt-4 pt-4 border-t">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30"
          >
            <div className="w-8 text-center font-semibold">
              {userRank.rank}
            </div>
            
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mx-2">
              {userRank.avatar ? (
                <img src={userRank.avatar} alt={userRank.username} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-4 h-4 m-2 text-gray-500" />
              )}
            </div>
            
            <div className="flex-1 font-medium text-sm">
              {userRank.username}
              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(You)</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-semibold mr-2">{userRank.score.toLocaleString()}</span>
              <span className="text-xs text-gray-500">{getScoreLabel()}</span>
            </div>
            
            <div className="w-6 flex justify-center ml-2">
              {getRankChangeIcon(userRank.change)}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 