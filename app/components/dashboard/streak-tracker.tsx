"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Award, Flame, Trophy, ArrowRight, Gift } from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakStartDate: string | null;
  activity: {
    date: string;
    completed: boolean;
  }[];
}

// Mock streak data - in a real app, this would come from an API
const getMockStreakData = (): StreakData => {
  const today = new Date();
  
  // Generate last 28 days of activity
  const activity = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (27 - i));
    
    // Random activity for the past, with more recent days more likely to be completed
    const completed = i < 23 
      ? Math.random() < (0.3 + (i * 0.03)) 
      : i === 27; // Today is completed
    
    return {
      date: date.toISOString().split('T')[0],
      completed
    };
  });
  
  // Calculate current streak
  let currentStreak = 0;
  for (let i = activity.length - 1; i >= 0; i--) {
    if (activity[i].completed) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // Find longest streak
  let longestStreak = 0;
  let currentRun = 0;
  let streakStartDate = null;
  
  for (let i = 0; i < activity.length; i++) {
    if (activity[i].completed) {
      currentRun++;
      if (currentRun > longestStreak) {
        longestStreak = currentRun;
        streakStartDate = activity[i - currentRun + 1]?.date || null;
      }
    } else {
      currentRun = 0;
    }
  }
  
  // If the current streak is the longest, update the start date
  if (currentStreak === longestStreak && currentStreak > 0) {
    streakStartDate = activity[activity.length - currentStreak].date;
  }
  
  return {
    currentStreak,
    longestStreak,
    lastActivityDate: activity.find(a => a.completed)?.date || null,
    streakStartDate,
    activity
  };
};

export function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const data = getMockStreakData();
    setStreakData(data);
    setLoading(false);
  }, []);
  
  if (loading || !streakData) {
    return (
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const getDateColor = (index: number) => {
    const day = streakData.activity[index];
    
    if (!day.completed) {
      return "bg-gray-100";
    }
    
    // Determine if this day is part of the current streak
    const today = new Date().toISOString().split('T')[0];
    const isToday = day.date === today;
    
    if (isToday) {
      return "bg-green-500";
    }
    
    // Check if it's part of the current streak
    const dayIndex = streakData.activity.findIndex(a => a.date === day.date);
    const isPartOfCurrentStreak = streakData.currentStreak > 1 && 
      dayIndex >= streakData.activity.length - streakData.currentStreak;
    
    return isPartOfCurrentStreak ? "bg-green-400" : "bg-green-200";
  };
  
  return (
    <motion.div
      className="p-6 border rounded-lg bg-white shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Flame className="mr-2 h-5 w-5 text-orange-500" />
          Learning Streak
        </h3>
        
        {streakData.currentStreak >= 7 && (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full flex items-center">
            <Flame className="h-3 w-3 mr-1" />
            On fire!
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500 mb-1">Current Streak</p>
          <div className="flex items-center justify-center">
            <Flame className="h-5 w-5 mr-1 text-orange-500" />
            <span className="text-2xl font-bold">{streakData.currentStreak}</span>
            <span className="text-sm text-gray-500 ml-1">days</span>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500 mb-1">Longest Streak</p>
          <div className="flex items-center justify-center">
            <Trophy className="h-5 w-5 mr-1 text-yellow-500" />
            <span className="text-2xl font-bold">{streakData.longestStreak}</span>
            <span className="text-sm text-gray-500 ml-1">days</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-blue-500" />
            Recent Activity
          </h4>
          
          <span className="text-xs text-gray-500">
            {streakData.activity[0].date} – {streakData.activity[streakData.activity.length - 1].date}
          </span>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-xs text-center text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {streakData.activity.map((day, i) => (
            <motion.div 
              key={i}
              className={`h-8 rounded-md ${getDateColor(i)} flex items-center justify-center cursor-pointer transition-colors hover:opacity-80`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={`${day.date}${day.completed ? ' - Completed' : ' - No activity'}`}
            >
              {day.completed && (
                <div className="w-1 h-1 rounded-full bg-white" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {streakData.currentStreak > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
          <div className="flex items-start">
            <Award className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Keep up the momentum!</p>
              <p className="text-xs text-blue-600 mt-1">
                You've been learning for {streakData.currentStreak} consecutive day{streakData.currentStreak !== 1 ? 's' : ''}. 
                Come back tomorrow to continue your streak.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {streakData.currentStreak === 0 && (
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg mb-4">
          <div className="flex items-start">
            <Flame className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800">Start a new streak today!</p>
              <p className="text-xs text-orange-600 mt-1">
                Complete a lesson or quiz today to begin your learning streak.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          {streakData.currentStreak >= 5 && (
            <motion.div 
              className="flex items-center text-sm text-purple-600"
              whileHover={{ scale: 1.05 }}
            >
              <Gift className="h-4 w-4 mr-1" />
              Rewards available
              <ArrowRight className="h-3 w-3 ml-1" />
            </motion.div>
          )}
        </div>
        
        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          View all stats
          <ArrowRight className="h-3 w-3 ml-1" />
        </button>
      </div>
    </motion.div>
  );
} 