"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Star, Zap, Trophy, Target, BarChart3 } from "lucide-react";

type UserProgressProps = {
  userId?: string;
};

type UserProgressData = {
  level: number;
  totalXp: number;
  currentLevelXp: number;
  xpToNextLevel: number;
  xpProgress: number;
  achievements: {
    total: number;
    unlocked: number;
    recent: {
      id: string;
      title: string;
      badge: string;
      earnedAt: string;
    }[];
  };
  skills: {
    total: number;
    unlocked: number;
    inProgress: number;
  };
};

export function UserProgress({ userId }: UserProgressProps) {
  const [data, setData] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call to fetch the user's progress
    // For now, we'll use mock data
    const fetchData = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData({
          level: 5,
          totalXp: 2350,
          currentLevelXp: 350,
          xpToNextLevel: 500,
          xpProgress: 70, // percentage
          achievements: {
            total: 25,
            unlocked: 8,
            recent: [
              {
                id: "ach1",
                title: "Fast Learner",
                badge: "🚀",
                earnedAt: "2025-07-10"
              },
              {
                id: "ach2",
                title: "Quiz Master",
                badge: "🧠",
                earnedAt: "2025-07-08"
              },
              {
                id: "ach3",
                title: "7-Day Streak",
                badge: "🔥",
                earnedAt: "2025-07-05"
              }
            ]
          },
          skills: {
            total: 32,
            unlocked: 12,
            inProgress: 4
          }
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user progress:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">No progress data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Your Progress</h3>
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2.5 py-0.5 rounded-full text-sm font-medium">
            <Star className="w-3.5 h-3.5 mr-1" />
            Level {data.level}
          </span>
        </div>
      </div>

      {/* XP Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Experience Points</span>
          <span className="text-sm text-gray-500">{data.currentLevelXp}/{data.xpToNextLevel} XP</span>
        </div>
        <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.xpProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {data.xpToNextLevel - data.currentLevelXp} XP to Level {data.level + 1}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center">
            <Award className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <div className="text-sm font-medium">Achievements</div>
              <div className="text-lg font-bold">{data.achievements.unlocked}/{data.achievements.total}</div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
            <div>
              <div className="text-sm font-medium">Skills</div>
              <div className="text-lg font-bold">{data.skills.unlocked}/{data.skills.total}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-3">Recent Achievements</h4>
        <div className="space-y-3">
          {data.achievements.recent.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-3">
                {achievement.badge}
              </div>
              <div>
                <div className="font-medium text-sm">{achievement.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skill Progress */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium">Skills in Progress</h4>
          <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
            View All
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>SQL Joins</span>
              <span>65%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Python Functions</span>
              <span>40%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>JavaScript Async</span>
              <span>25%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: "25%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 