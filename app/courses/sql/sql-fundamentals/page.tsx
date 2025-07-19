"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { ArrowRight, CheckCircle, Clock, BookOpen, Code, FileText } from "lucide-react";

// SQL Course structure
const SQL_COURSE = {
  id: "sql-fundamentals",
  title: "SQL Fundamentals",
  description: "Learn the fundamentals of SQL for data querying and database management. This course covers everything from basic queries to advanced operations.",
  category: "sql",
  level: "BEGINNER",
  duration: 480, // in minutes
  modules: [
    {
      id: "module-1",
      title: "Introduction to SQL",
      description: "Learn the basics of SQL and database concepts",
      lessons: [
        {
          id: "lesson-1-1",
          title: "What is SQL?",
          description: "Introduction to SQL and its importance in data management",
          duration: 15,
          type: "text"
        },
        {
          id: "lesson-1-2",
          title: "Relational Database Concepts",
          description: "Understanding tables, relationships, and database structure",
          duration: 20,
          type: "text"
        },
        {
          id: "lesson-1-3",
          title: "Setting Up Your Practice Environment",
          description: "Getting started with our embedded SQL environment",
          duration: 10,
          type: "text"
        }
      ]
    },
    {
      id: "module-2",
      title: "Basic SQL Queries",
      description: "Master the fundamental SQL query statements",
      lessons: [
        {
          id: "lesson-2-1",
          title: "SELECT Statements",
          description: "Learn how to retrieve data from tables",
          duration: 25,
          type: "text"
        },
        {
          id: "lesson-2-2",
          title: "WHERE Clause",
          description: "Filtering data with conditions",
          duration: 20,
          type: "text"
        },
        {
          id: "lesson-2-3",
          title: "ORDER BY and LIMIT",
          description: "Sorting and limiting results",
          duration: 15,
          type: "text"
        },
        {
          id: "lesson-2-4",
          title: "Basic SQL Quiz",
          description: "Test your knowledge of basic SQL queries",
          duration: 15,
          type: "quiz"
        }
      ]
    },
    {
      id: "module-3",
      title: "Joining Tables",
      description: "Learn how to combine data from multiple tables",
      lessons: [
        {
          id: "lesson-3-1",
          title: "Introduction to JOINs",
          description: "Understanding table relationships and join concepts",
          duration: 20,
          type: "text"
        },
        {
          id: "lesson-3-2",
          title: "INNER JOIN",
          description: "Combining rows from tables with matching values",
          duration: 25,
          type: "text"
        },
        {
          id: "lesson-3-3",
          title: "LEFT JOIN and RIGHT JOIN",
          description: "Working with outer joins",
          duration: 25,
          type: "text"
        },
        {
          id: "lesson-3-4",
          title: "JOINs Quiz",
          description: "Test your understanding of SQL joins",
          duration: 15,
          type: "quiz"
        }
      ]
    },
    {
      id: "module-4",
      title: "Aggregation and Grouping",
      description: "Analyze data with aggregate functions and grouping",
      lessons: [
        {
          id: "lesson-4-1",
          title: "Aggregate Functions",
          description: "Using COUNT, SUM, AVG, MIN, and MAX",
          duration: 20,
          type: "text"
        },
        {
          id: "lesson-4-2",
          title: "GROUP BY Clause",
          description: "Grouping data for aggregate calculations",
          duration: 25,
          type: "text"
        },
        {
          id: "lesson-4-3",
          title: "HAVING Clause",
          description: "Filtering grouped data",
          duration: 20,
          type: "text"
        },
        {
          id: "lesson-4-4",
          title: "Aggregation Quiz",
          description: "Test your knowledge of SQL aggregation",
          duration: 15,
          type: "quiz"
        }
      ]
    },
    {
      id: "module-5",
      title: "Final Assessment",
      description: "Comprehensive assessment of SQL fundamentals",
      lessons: [
        {
          id: "lesson-5-1",
          title: "SQL Fundamentals Final Quiz",
          description: "Comprehensive test covering all course material",
          duration: 30,
          type: "quiz"
        }
      ]
    }
  ]
};

// Module card component
const ModuleCard = ({ module, index, courseId, category, isEnrolled }: { 
  module: any; 
  index: number;
  courseId: string;
  category: string;
  isEnrolled: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div 
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div 
        className="bg-white dark:bg-gray-800 p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-8 h-8 rounded-full flex items-center justify-center mr-3">
            {index + 1}
          </div>
          <div>
            <h3 className="font-medium">{module.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="bg-gray-50 dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          {module.lessons.map((lesson: any, i: number) => (
            <div key={lesson.id} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Link 
                href={isEnrolled ? `/courses/${category}/${courseId}/learn/${lesson.id}` : `/courses/${category}/${courseId}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  {lesson.type === 'text' && <FileText className="h-4 w-4 mr-2 text-gray-500" />}
                  {lesson.type === 'quiz' && <BookOpen className="h-4 w-4 mr-2 text-green-500" />}
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">{lesson.duration} min</span>
                  {isEnrolled ? (
                    <ArrowRight className="h-4 w-4 text-blue-500" />
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default function SQLCoursePage() {
  const { data: session } = useSession();
  const isEnrolled = true; // This would normally be determined by checking user enrollment status
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">{SQL_COURSE.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{SQL_COURSE.description}</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <span>{Math.floor(SQL_COURSE.duration / 60)} hours {SQL_COURSE.duration % 60} min</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-gray-500" />
              <span>{SQL_COURSE.modules.reduce((acc, module) => acc + module.lessons.length, 0)} lessons</span>
            </div>
            <div className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-gray-500" />
              <span>Interactive exercises</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{SQL_COURSE.level}</span>
            </div>
          </div>
          
          {isEnrolled ? (
            <Link href={`/courses/${SQL_COURSE.category}/${SQL_COURSE.id}/learn/${SQL_COURSE.modules[0].lessons[0].id}`}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center">
                Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
          ) : (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
              Enroll Now
            </button>
          )}
        </div>
        
        {/* Course Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          
          {SQL_COURSE.modules.map((module, index) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              index={index} 
              courseId={SQL_COURSE.id} 
              category={SQL_COURSE.category}
              isEnrolled={isEnrolled} 
            />
          ))}
        </div>
      </div>
    </div>
  );
} 