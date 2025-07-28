"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Trophy, Target, BookOpen, Calculator } from 'lucide-react';
import AILessonGenerator from '@/app/components/lesson/AILessonGenerator';

const ExcelFormulasPage = () => {
  const [hasStartedLesson, setHasStartedLesson] = useState(false);

  const lessonOverview = {
    title: "Excel Formulas & Functions Mastery",
    description: "Master Excel formulas and functions to automate calculations and data analysis. This AI-powered lesson adapts to your skill level and provides real-world spreadsheet scenarios.",
    level: "BEGINNER" as const,
    estimatedTime: "35-50 minutes",
    category: "Excel Fundamentals",
    topics: [
      "Formula syntax and structure",
      "Basic mathematical operations",
      "SUM, AVERAGE, COUNT functions",
      "Cell references (relative/absolute)",
      "IF statements and logical functions",
      "Text manipulation functions",
      "Error handling in formulas"
    ],
    prerequisites: [
      "Basic Excel navigation",
      "Understanding of cells and ranges",
      "Familiarity with data entry"
    ],
    learningOutcomes: [
      "Write and edit Excel formulas confidently",
      "Use common functions for calculations",
      "Apply logical functions for decision making",
      "Handle errors and troubleshoot formulas",
      "Create dynamic spreadsheet solutions"
    ]
  };

  const handleLessonComplete = (score: number, xpEarned: number) => {
    console.log(`Lesson completed with score: ${score}%, XP earned: ${xpEarned}`);
    // Here you would typically save progress to the database
  };

  if (hasStartedLesson) {
    return (
      <AILessonGenerator
        courseId="excel-fundamentals"
        lessonId="formulas"
        topic="formulas"
        difficulty="BEGINNER"
        onLessonComplete={handleLessonComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/courses/excel" 
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Excel Course
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-2xl mb-6">
              <Calculator className="h-8 w-8" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {lessonOverview.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {lessonOverview.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">{lessonOverview.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">{lessonOverview.level}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Users className="h-4 w-4 text-blue-600" />
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
                  <Target className="h-6 w-6 text-emerald-600" />
                  What You'll Learn
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Core Topics</h3>
                    <ul className="space-y-2">
                      {lessonOverview.topics.map((topic, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
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
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI Features */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  📊 AI-Enhanced Excel Learning
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Calculator className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Smart Formula Builder</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI suggests formulas based on your data patterns
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Interactive Spreadsheets</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Practice with real Excel-like interface and data
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Real-world Scenarios</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Business cases and practical applications
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
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Calculate?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Start your AI-powered Excel formulas lesson
                  </p>
                </div>

                <button
                  onClick={() => setHasStartedLesson(true)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🚀 Begin Excel Lesson
                </button>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Estimated time:</span>
                    <span className="font-medium">{lessonOverview.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">Difficulty:</span>
                    <span className="font-medium text-emerald-600">{lessonOverview.level}</span>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {lessonOverview.prerequisites.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">
                    📋 Prerequisites
                  </h3>
                  <ul className="space-y-2">
                    {lessonOverview.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-amber-700 dark:text-amber-300 text-sm">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Progress */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  📈 Excel Course Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Formulas Module</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Formulas • Charts • Analysis</span>
                    <span>6 hrs remaining</span>
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
              👀 Preview: Excel Formulas in Action
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sample Exercise</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  {/* Mock Excel Grid */}
                  <div className="border border-gray-300 dark:border-gray-600 rounded text-xs">
                    <div className="grid grid-cols-4 border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600 font-medium">A</div>
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600 font-medium">B</div>
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600 font-medium">C</div>
                      <div className="p-2 font-medium">D</div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600 border-b border-gray-300 dark:border-gray-600">Item</div>
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600 border-b border-gray-300 dark:border-gray-600">Price</div>
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600 border-b border-gray-300 dark:border-gray-600">Qty</div>
                      <div className="p-2 border-b border-gray-300 dark:border-gray-600">Total</div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600 border-b border-gray-300 dark:border-gray-600">Laptop</div>
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600 border-b border-gray-300 dark:border-gray-600">999</div>
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600 border-b border-gray-300 dark:border-gray-600">2</div>
                      <div className="p-2 border-b border-gray-300 dark:border-gray-600 text-blue-600 font-mono">=B2*C2</div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600">Mouse</div>
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600">25</div>
                      <div className="p-2 border-r border-gray-300 dark:border-gray-600">5</div>
                      <div className="p-2 text-blue-600 font-mono">=B3*C3</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Interactive Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm">Interactive Excel-like interface</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Real-time formula validation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">AI-powered formula suggestions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Business scenario practice</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Common Functions</h4>
                  <div className="space-y-1 text-sm">
                    <div><code className="text-emerald-600">=SUM(A1:A10)</code> - Add values</div>
                    <div><code className="text-emerald-600">=AVERAGE(B1:B5)</code> - Calculate average</div>
                    <div><code className="text-emerald-600">=IF(C1>100,"High","Low")</code> - Logical test</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExcelFormulasPage;