"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Target, Clock, Award, CheckCircle, XCircle } from "lucide-react";

type Challenge = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  progress: number;
  deadline?: string;
  type: "daily" | "weekly";
};

type ChallengesProps = {
  userId?: string;
};

export function Challenges({ userId }: ChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    // In a real app, this would be an API call to fetch the challenges
    const fetchChallenges = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for challenges
        const mockChallenges: Challenge[] = [
          {
            id: "daily1",
            title: "Complete a Quiz",
            description: "Finish any quiz with at least 70% score",
            xpReward: 50,
            isCompleted: true,
            progress: 100,
            deadline: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
            type: "daily"
          },
          {
            id: "daily2",
            title: "Study for 15 Minutes",
            description: "Spend at least 15 minutes on any lesson",
            xpReward: 30,
            isCompleted: false,
            progress: 0,
            deadline: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
            type: "daily"
          },
          {
            id: "daily3",
            title: "Practice Coding",
            description: "Complete at least one coding exercise",
            xpReward: 40,
            isCompleted: false,
            progress: 0,
            deadline: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
            type: "daily"
          },
          {
            id: "weekly1",
            title: "Complete a Course Module",
            description: "Finish all lessons in any course module",
            xpReward: 200,
            isCompleted: false,
            progress: 60,
            deadline: getNextWeekday(7).toISOString(), // Next Sunday
            type: "weekly"
          },
          {
            id: "weekly2",
            title: "Earn 3 Achievements",
            description: "Unlock any 3 new achievements this week",
            xpReward: 150,
            isCompleted: false,
            progress: 33,
            deadline: getNextWeekday(7).toISOString(), // Next Sunday
            type: "weekly"
          },
          {
            id: "weekly3",
            title: "Maintain a 5-Day Streak",
            description: "Log in and complete at least one activity for 5 consecutive days",
            xpReward: 250,
            isCompleted: false,
            progress: 40,
            deadline: getNextWeekday(7).toISOString(), // Next Sunday
            type: "weekly"
          }
        ];
        
        setChallenges(mockChallenges);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [userId]);

  // Helper function to get next specific weekday
  function getNextWeekday(dayIndex: number) {
    const today = new Date();
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + (7 + dayIndex - today.getDay()) % 7);
    resultDate.setHours(23, 59, 59, 999);
    return resultDate;
  }

  // Filter challenges based on active tab
  const filteredChallenges = challenges.filter(challenge => challenge.type === activeTab);

  // Calculate completion percentage
  const completionPercentage = (challenges: Challenge[]) => {
    const filtered = challenges.filter(c => c.type === activeTab);
    if (filtered.length === 0) return 0;
    return Math.round((filtered.filter(c => c.isCompleted).length / filtered.length) * 100);
  };

  // Format deadline to relative time
  const formatDeadline = (isoString: string) => {
    const deadline = new Date(isoString);
    const now = new Date();
    
    const diffMs = deadline.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 24) {
      return `${diffHrs} hours left`;
    } else {
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays} days left`;
    }
  };

  if (loading) {
    return (
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold">Challenges</h3>
        </div>
        
        <div className="flex text-sm rounded-md overflow-hidden border">
          <button 
            className={`px-3 py-1 ${activeTab === 'daily' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-800'}`}
            onClick={() => setActiveTab('daily')}
          >
            Daily
          </button>
          <button 
            className={`px-3 py-1 ${activeTab === 'weekly' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-800'}`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly
          </button>
        </div>
      </div>
      
      {/* Progress Summary */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {activeTab === 'daily' ? "Today's Progress" : "This Week's Progress"}
            </span>
          </div>
          <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
            {completionPercentage(challenges)}%
          </span>
        </div>
        <div className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage(challenges)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
          />
        </div>
      </div>
      
      {/* Challenge List */}
      <div className="space-y-4">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No {activeTab} challenges available
          </div>
        ) : (
          filteredChallenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg border ${
                challenge.isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    {challenge.isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 mr-2 flex-shrink-0" />
                    )}
                    <h4 className="font-medium">{challenge.title}</h4>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
                    {challenge.description}
                  </p>
                </div>
                
                <div className="flex items-center text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  <Award className="w-3.5 h-3.5 mr-1" />
                  {challenge.xpReward} XP
                </div>
              </div>
              
              {!challenge.isCompleted && challenge.progress > 0 && (
                <div className="mt-3 ml-7">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {challenge.deadline && (
                <div className="flex items-center mt-3 ml-7 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {formatDeadline(challenge.deadline)}
                </div>
              )}
              
              {!challenge.isCompleted && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 ml-7 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded"
                >
                  {challenge.progress > 0 ? "Continue" : "Start Challenge"}
                </motion.button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 