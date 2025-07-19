"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, BookOpen, Clock, Code, Star, Users } from "lucide-react";

// Types
type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  duration: number; // in minutes
  imageUrl?: string;
  tags: string[];
  rating: number;
  studentsCount: number;
  updatedAt: string;
  modules: number;
  lessons: number;
}

// SQL Courses data
const SQL_COURSES: Course[] = [
  {
    id: "sql-fundamentals",
    title: "SQL Fundamentals",
    description: "Learn the core SQL concepts and commands to query databases effectively. Perfect for beginners with no prior SQL knowledge.",
    level: "BEGINNER",
    duration: 600, // 10 hours
    tags: ["Databases", "Data Analysis", "Query Language"],
    rating: 4.7,
    studentsCount: 1250,
    updatedAt: "2023-10-15",
    modules: 5,
    lessons: 20
  },
  {
    id: "advanced-sql",
    title: "Advanced SQL for Data Analysis",
    description: "Take your SQL skills to the next level with advanced querying techniques, window functions, CTEs, and performance optimization.",
    level: "INTERMEDIATE",
    duration: 720, // 12 hours
    tags: ["Advanced Queries", "Optimization", "Data Modeling"],
    rating: 4.8,
    studentsCount: 850,
    updatedAt: "2023-11-20",
    modules: 6,
    lessons: 24
  },
  {
    id: "sql-performance",
    title: "SQL Performance Optimization",
    description: "Learn advanced techniques to write high-performance SQL queries and optimize database performance for large datasets.",
    level: "ADVANCED",
    duration: 660, // 11 hours
    tags: ["Performance", "Indexing", "Query Optimization"],
    rating: 4.7,
    studentsCount: 750,
    updatedAt: "2024-01-15",
    modules: 5,
    lessons: 22
  }
];

// Component to display a single course card with animations
const CourseCard = ({ course }: { course: Course }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-video relative bg-gradient-to-tr from-blue-100 to-blue-300 dark:from-blue-900/30 dark:to-blue-700/30">
        {course.imageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${course.imageUrl})` }} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl text-blue-500 dark:text-blue-400 font-semibold">SQL</span>
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/40 text-white text-xs rounded-full backdrop-blur-sm">
          {course.level}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-xl mb-1">{course.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{course.description}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({course.studentsCount} students)</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{Math.ceil(course.duration / 60)} hours</span>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {course.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 pt-2">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{course.modules} modules</span>
          </div>
          <div className="flex items-center">
            <Code className="h-4 w-4 mr-1" />
            <span>{course.lessons} lessons</span>
          </div>
        </div>
        
        <Link 
          href={`/courses/sql/${course.id}`}
          className="block w-full mt-4"
        >
          <motion.button 
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Course
            <ArrowRight className="h-4 w-4 ml-2" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default function SQLCoursesPage() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState<CourseLevel | null>(null);

  // Filter courses based on level if filter is applied
  const filteredCourses = filter 
    ? SQL_COURSES.filter(course => course.level === filter)
    : SQL_COURSES;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">SQL Courses</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Master database querying and management with our comprehensive SQL courses.
            From basic queries to advanced optimization techniques, we have courses for every skill level.
          </p>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === null 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setFilter('BEGINNER')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'BEGINNER' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setFilter('INTERMEDIATE')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'INTERMEDIATE' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setFilter('ADVANCED')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'ADVANCED' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* No results message */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No courses match your current filter. Try another option.</p>
          </div>
        )}
      </div>
    </div>
  );
} 