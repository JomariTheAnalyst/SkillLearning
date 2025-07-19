"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, CheckCircle2, BarChart, Award } from "lucide-react";

interface QuizCardProps {
  id: string;
  title: string;
  description?: string;
  lessonId: string;
  courseId: string;
  category: string;
  questionsCount: number;
  timeLimit?: number;
  passingScore: number;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  isCompleted?: boolean;
  bestScore?: number;
}

export function QuizCard({
  id,
  title,
  description,
  lessonId,
  courseId,
  category,
  questionsCount,
  timeLimit,
  passingScore,
  difficulty,
  isCompleted,
  bestScore,
}: QuizCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const difficultyColors = {
    EASY: "bg-green-100 text-green-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HARD: "bg-orange-100 text-orange-800",
    EXPERT: "bg-red-100 text-red-800",
  };

  const difficultyColor = difficultyColors[difficulty];

  return (
    <div 
      className={`
        relative overflow-hidden border rounded-lg shadow-sm transition-all duration-300 
        ${isHovered ? "shadow-md transform -translate-y-1" : ""}
        ${isCompleted ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center mb-2">
          <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${difficultyColor}`}>
            {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
          </span>
          {timeLimit && (
            <span className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {timeLimit} min
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && <p className="text-gray-600 mb-4 text-sm">{description}</p>}
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
            <span className="text-sm text-gray-500">Questions</span>
            <span className="font-semibold">{questionsCount}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
            <span className="text-sm text-gray-500">Passing Score</span>
            <span className="font-semibold">{passingScore}%</span>
          </div>
        </div>
        
        {bestScore !== undefined && (
          <div className="flex items-center mb-4">
            <BarChart className="w-4 h-4 mr-1 text-purple-500" />
            <span className="text-sm text-gray-700">Best Score: <span className="font-semibold">{bestScore}%</span></span>
          </div>
        )}
        
        <Link
          href={`/courses/${category}/${courseId}/learn/${lessonId}/quiz/${id}`}
          className={`
            w-full inline-flex justify-center items-center px-4 py-2 rounded-md text-white font-medium
            ${isCompleted 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-blue-600 hover:bg-blue-700"
            }
            transition-colors
          `}
        >
          {isCompleted ? "Retake Quiz" : "Start Quiz"}
        </Link>
      </div>
      
      {isCompleted && bestScore && bestScore >= 90 && (
        <div className="absolute -top-1 -left-1 transform -rotate-45 translate-x-2">
          <Award className="w-5 h-5 text-yellow-500" />
        </div>
      )}
      
      <div 
        className={`
          absolute bottom-0 left-0 h-1 transition-all duration-300
          ${isHovered ? "w-full" : "w-0"}
          ${isCompleted ? "bg-green-500" : "bg-blue-500"}
        `}
      />
    </div>
  );
} 