"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Trophy, Target, BookOpen, Code } from 'lucide-react';
import AILessonGenerator from '@/app/components/lesson/AILessonGenerator';

const PythonFunctionsPage = () => {
  const [hasStartedLesson, setHasStartedLesson] = useState(false);

  const lessonOverview = {
    title: "Python Functions Mastery",
    description: "Learn to create reusable code with Python functions. This AI-powered lesson provides personalized examples and practice exercises tailored to your programming experience.",
    level: "INTERMEDIATE" as const,
    estimatedTime: "45-60 minutes",
    category: "Python Programming",
    topics: [
      "Function definition and syntax",
      "Parameters and arguments",
      "Return values and statements",
      "Local vs global scope",
      "Default parameters",
      "Lambda functions",
      "Function documentation"
    ],
    prerequisites: [
      "Basic Python syntax knowledge",
      "Understanding of variables and data types",
      "Experience with control structures"
    ],
    learningOutcomes: [
      "Define and call custom functions",
      "Work with different types of parameters",
      "Understand variable scope in Python",
      "Create lambda functions for simple operations",
      "Write clean, documented code"
    ]
  };

  const handleLessonComplete = (score: number, xpEarned: number) => {
    console.log(`Lesson completed with score: ${score}%, XP earned: ${xpEarned}`);
    // Here you would typically save progress to the database
  };

  if (hasStartedLesson) {
    return (
      <AILessonGenerator
        courseId="python-fundamentals"
        lessonId="functions"
        topic="functions"
        difficulty="INTERMEDIATE"
        onLessonComplete={handleLessonComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/courses/python" 
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Python Course
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-2xl mb-6">
              <Code className="h-8 w-8" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {lessonOverview.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {lessonOverview.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Clock className="h-4 w-4 text-green-600" />
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
                  <Target className="h-6 w-6 text-green-600" />
                  What You'll Learn
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Core Topics</h3>
                    <ul className="space-y-2">
                      {lessonOverview.topics.map((topic, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
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
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  🐍 AI-Enhanced Python Learning
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Code className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Smart Code Editor</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI-powered code completion and error detection
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Adaptive Examples</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Code examples that match your experience level
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Real-time Feedback</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Instant code execution and personalized tips
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
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Code?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Start your AI-powered Python functions lesson
                  </p>
                </div>

                <button
                  onClick={() => setHasStartedLesson(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🚀 Begin Python Lesson
                </button>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Estimated time:</span>
                    <span className="font-medium">{lessonOverview.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">Difficulty:</span>
                    <span className="font-medium text-green-600">{lessonOverview.level}</span>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {lessonOverview.prerequisites.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">
                    📋 Prerequisites
                  </h3>
                  <ul className="space-y-2">
                    {lessonOverview.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-orange-700 dark:text-orange-300 text-sm">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Progress */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  📈 Python Course Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Functions Module</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Functions • Modules • OOP</span>
                    <span>12 hrs remaining</span>
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
              👀 Preview: Python Functions in Action
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sample Exercise</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-600 dark:text-green-400 mb-2"># Define a function</div>
                  <div className="text-blue-600 dark:text-blue-400">def</div>
                  <span className="text-purple-600 dark:text-purple-400"> calculate_area</span>
                  <span>(length, width):</span>
                  <div className="ml-4 text-gray-600 dark:text-gray-400">"""Calculate rectangle area."""</div>
                  <div className="ml-4"><span className="text-blue-600 dark:text-blue-400">return</span> length * width</div>
                  <div className="mt-2 text-green-600 dark:text-green-400"># Call the function</div>
                  <div>area = calculate_area(5, 3)</div>
                  <div className="text-blue-600 dark:text-blue-400">print</div>
                  <span>(f"Area: {`{area}`}")</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Interactive Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Live Python interpreter</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Function testing environment</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">AI-powered debugging help</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Progressive challenges</span>
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

export default PythonFunctionsPage;