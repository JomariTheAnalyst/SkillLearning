"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Trophy, Target, BookOpen } from 'lucide-react';
import AILessonGenerator from '@/app/components/lesson/AILessonGenerator';

const SQLSelectStatementsPage = () => {
  const [hasStartedLesson, setHasStartedLesson] = useState(false);

  const lessonOverview = {
    title: "Mastering SQL SELECT Statements",
    description: "Learn to retrieve and filter data from databases using SQL SELECT statements. This AI-powered lesson adapts to your learning style and provides personalized practice exercises.",
    level: "BEGINNER" as const,
    estimatedTime: "30-45 minutes",
    category: "SQL Fundamentals",
    topics: [
      "Basic SELECT syntax",
      "Selecting specific columns",
      "Using WHERE clauses",
      "Filtering data with conditions",
      "Working with comparison operators",
      "Hands-on database practice"
    ],
    prerequisites: [
      "Basic understanding of databases",
      "Familiarity with tables and columns"
    ],
    learningOutcomes: [
      "Write basic SELECT statements to retrieve data",
      "Filter records using WHERE clauses",
      "Use comparison operators effectively",
      "Apply best practices for SQL queries"
    ]
  };

  const handleLessonComplete = (score: number, xpEarned: number) => {
    console.log(`Lesson completed with score: ${score}%, XP earned: ${xpEarned}`);
    // Here you would typically save progress to the database
  };

  if (hasStartedLesson) {
    return (
      <AILessonGenerator
        courseId="sql-fundamentals"
        lessonId="select-statements"
        topic="select-statements"
        difficulty="BEGINNER"
        onLessonComplete={handleLessonComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/courses/sql" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to SQL Course
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-6">
              <BookOpen className="h-8 w-8" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {lessonOverview.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {lessonOverview.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">{lessonOverview.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">{lessonOverview.level}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{lessonOverview.category}</span>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Overview */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* What You'll Learn */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-600" />
                  What You'll Learn
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Core Topics</h3>
                    <ul className="space-y-2">
                      {lessonOverview.topics.map((topic, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Learning Outcomes</h3>
                    <ul className="space-y-2">
                      {lessonOverview.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI Features */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  🤖 AI-Powered Learning Experience
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Adaptive Content</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI generates content based on your learning style and pace
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Interactive Practice</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Real-time code execution and immediate feedback
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Gamified Progress</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Earn XP, badges, and unlock achievements
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Action Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Begin Lesson Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Start Learning?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Click below to generate your personalized AI lesson
                  </p>
                </div>

                <button
                  onClick={() => setHasStartedLesson(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🚀 Begin AI Lesson
                </button>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Estimated time:</span>
                    <span className="font-medium">{lessonOverview.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">Difficulty:</span>
                    <span className="font-medium text-blue-600">{lessonOverview.level}</span>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {lessonOverview.prerequisites.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                    📋 Prerequisites
                  </h3>
                  <ul className="space-y-2">
                    {lessonOverview.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-yellow-700 dark:text-yellow-300 text-sm">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Progress */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  📈 Course Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>3 of 12 lessons completed</span>
                    <span>8 hrs remaining</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sample Content Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              👀 Preview: What's Inside This Lesson
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sample Exercise</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-600 dark:text-green-400 mb-2">-- Example SQL Query</div>
                  <div className="text-blue-600 dark:text-blue-400">SELECT</div>
                  <div className="ml-4">first_name, last_name, salary</div>
                  <div className="text-blue-600 dark:text-blue-400">FROM</div>
                  <div className="ml-4">employees</div>
                  <div className="text-blue-600 dark:text-blue-400">WHERE</div>
                  <div className="ml-4">department = 'Engineering';</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Interactive Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Live SQL code editor</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Instant query execution</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">AI-powered hints and feedback</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Progressive difficulty levels</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SQLSelectStatementsPage;