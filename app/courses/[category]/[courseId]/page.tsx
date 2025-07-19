"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

// Types for course data
interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: {
    id: string;
    title: string;
    duration: number; // in minutes
    type: "video" | "text" | "interactive" | "quiz";
  }[];
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  category: "SQL" | "PYTHON" | "EXCEL";
  duration: number; // in minutes
  learningOutcomes: string[];
  prerequisites: string[];
  modules: CourseModule[];
  instructor: {
    name: string;
    bio: string;
    avatarUrl?: string;
  };
  rating: number;
  studentsCount: number;
  updatedAt: string;
}

// Mock data for a course
const SQL_FUNDAMENTALS: CourseDetails = {
  id: "sql-fundamentals",
    title: "SQL Fundamentals",
  description: "Learn the core SQL concepts and commands to query databases effectively. Perfect for beginners with no prior SQL knowledge.",
  longDescription: "This comprehensive course on SQL Fundamentals will take you from a beginner to confident in working with relational databases. You'll learn how to query data, filter results, join tables, and perform aggregate functions. By the end of this course, you'll be able to write complex SQL queries to extract meaningful insights from databases.",
    level: "BEGINNER",
    category: "SQL",
  duration: 600, // 10 hours
  learningOutcomes: [
    "Understand relational database concepts and terminology",
    "Write SQL queries to retrieve data from a single table",
    "Filter query results using WHERE clauses",
    "Sort and group query results",
    "Join multiple tables together",
    "Perform calculations using aggregate functions",
    "Insert, update, and delete data from tables",
    "Create and modify database tables"
  ],
  prerequisites: [
    "No prior SQL experience required",
    "Basic understanding of data concepts is helpful but not required",
    "Computer with internet connection to access the online SQL environment"
  ],
    modules: [
      {
      id: "module-1",
        title: "Introduction to Databases",
      description: "Learn the fundamentals of relational databases and why SQL is important.",
        lessons: [
          {
          id: "lesson-1-1",
            title: "What is a Database?",
            duration: 15,
          type: "video"
          },
          {
          id: "lesson-1-2",
          title: "Relational Database Concepts",
            duration: 20,
          type: "text"
        },
        {
          id: "lesson-1-3",
          title: "Introduction to SQL",
          duration: 15,
          type: "video"
        },
        {
          id: "lesson-1-4",
          title: "Setting Up Your Practice Environment",
          duration: 10,
          type: "text"
        }
      ]
    },
    {
      id: "module-2",
        title: "Basic SQL Queries",
      description: "Learn how to retrieve data from a database using SELECT statements.",
        lessons: [
          {
          id: "lesson-2-1",
          title: "The SELECT Statement",
            duration: 25,
          type: "video"
        },
        {
          id: "lesson-2-2",
          title: "Selecting Specific Columns",
          duration: 15,
          type: "interactive"
        },
        {
          id: "lesson-2-3",
            title: "Filtering with WHERE",
            duration: 30,
          type: "video"
          },
          {
          id: "lesson-2-4",
          title: "Practice: Basic Queries",
            duration: 20,
          type: "interactive"
        },
        {
          id: "lesson-2-5",
          title: "Module 2 Quiz",
          duration: 15,
          type: "quiz"
        }
      ]
    },
    {
      id: "module-3",
      title: "Sorting and Filtering Data",
      description: "Learn advanced filtering techniques and how to sort your query results.",
        lessons: [
          {
          id: "lesson-3-1",
          title: "Sorting with ORDER BY",
          duration: 20,
          type: "video"
        },
        {
          id: "lesson-3-2",
          title: "Filtering with Comparison Operators",
          duration: 25,
          type: "interactive"
        },
        {
          id: "lesson-3-3",
          title: "Using AND, OR, and NOT",
          duration: 20,
          type: "video"
        },
        {
          id: "lesson-3-4",
          title: "The IN and BETWEEN Operators",
          duration: 15,
          type: "interactive"
        },
        {
          id: "lesson-3-5",
          title: "Wildcards and the LIKE Operator",
          duration: 20,
          type: "video"
        },
        {
          id: "lesson-3-6",
          title: "Module 3 Quiz",
          duration: 15,
          type: "quiz"
        }
      ]
    }
  ],
  instructor: {
    name: "Sarah Johnson",
    bio: "Database expert with over 10 years of experience in SQL and data engineering. Previously worked as a senior database administrator at major tech companies.",
    avatarUrl: ""
  },
  rating: 4.7,
  studentsCount: 1250,
  updatedAt: "2023-10-15",
};

// Helper function to get course data - in a real app, this would fetch from an API
const getCourseData = (category: string, courseId: string): CourseDetails => {
  // For now just return SQL fundamentals as mock data
  return SQL_FUNDAMENTALS;
};

// Icon components for lesson types
const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const InteractiveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const QuizIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video": return <VideoIcon />;
    case "text": return <TextIcon />;
    case "interactive": return <InteractiveIcon />;
    case "quiz": return <QuizIcon />;
    default: return <TextIcon />;
  }
};

// Course detail page component
export default function CourseDetailPage({
  params 
}: { 
  params: { category: string; courseId: string } 
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setIsLoading(true);
        // In a real app, you would fetch the course data from an API
        const courseData = getCourseData(params.category, params.courseId);
        setCourse(courseData);
        
        // Auto-expand the first module
        if (courseData.modules.length > 0) {
          setExpandedModules([courseData.modules[0].id]);
        }
        
        // Check if user is enrolled - API call to check enrollment status
        if (session?.user?.id) {
          try {
            const response = await fetch(`/api/enrollments/check?userId=${session.user.id}&courseId=${params.courseId}`);
            if (response.ok) {
              const data = await response.json();
              setIsEnrolled(data.isEnrolled);
            }
          } catch (error) {
            console.error("Error checking enrollment status:", error);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCourseData();
  }, [params.category, params.courseId, session]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const enrollInCourse = async () => {
    if (status === "unauthenticated") {
      // Store the current URL to redirect back after login
      const callbackUrl = `/courses/${params.category}/${params.courseId}`;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }
    
    try {
      // In a real app, this would make an API call to enroll the user
      const response = await fetch('/api/enrollments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: params.courseId,
        }),
      });
      
      if (response.ok) {
        setIsEnrolled(true);
        toast.success("Successfully enrolled in the course!");
        
        // Navigate to first lesson
        if (course?.modules[0]?.lessons[0]) {
          router.push(`/courses/${params.category}/${params.courseId}/learn/${course.modules[0].lessons[0].id}`);
        }
      } else {
        toast.error("Failed to enroll in the course. Please try again.");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  if (!course) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course details - left column on desktop */}
        <div className="md:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight mb-4">{course.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="flex items-center">
                <span className="font-medium mr-2">Level:</span>
                <span className="px-2 py-1 bg-secondary rounded-full">{course.level}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Duration:</span>
                <span>{Math.ceil(course.duration / 60)} hours</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Students:</span>
                <span>{course.studentsCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Rating:</span>
                <span className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  {course.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Last Updated:</span>
                <span>{new Date(course.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="mb-6">{course.longDescription}</p>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">What You'll Learn</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Prerequisites</h2>
              <ul className="space-y-2">
                {course.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Instructor</h2>
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/20 mr-4 flex-shrink-0 flex items-center justify-center text-primary font-semibold">
                  {course.instructor.avatarUrl ? (
                    <img src={course.instructor.avatarUrl} alt={course.instructor.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    course.instructor.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{course.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.instructor.bio}</p>
              </div>
            </div>
          </div>
          
          <div>
              <h2 className="text-xl font-semibold mb-3">Course Content</h2>
              <div className="space-y-3 border rounded-lg overflow-hidden">
                <div className="bg-muted p-3 text-sm">
                  <span>{course.modules.length} modules</span>
                  <span className="mx-2">•</span>
                  <span>
                    {course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
                  </span>
                  <span className="mx-2">•</span>
                  <span>{Math.ceil(course.duration / 60)} hours total</span>
                </div>
                
              {course.modules.map((module) => (
                  <div key={module.id} className="border-t first:border-t-0">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left hover:bg-muted/50 transition-colors"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted-foreground">{module.lessons.length} lessons</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transition-transform ${expandedModules.includes(module.id) ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                  </div>
                    </button>
                    
                    {expandedModules.includes(module.id) && (
                      <div className="px-4 pb-4 space-y-2">
                    {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <div className="mr-3 text-primary">
                              {getLessonIcon(lesson.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{lesson.title}</h4>
                        </div>
                            <div className="text-xs text-muted-foreground">
                          {lesson.duration} min
                        </div>
                      </div>
                    ))}
                  </div>
                    )}
                </div>
              ))}
            </div>
          </div>
          </motion.div>
        </div>
        
        {/* Sidebar - right column on desktop */}
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border rounded-lg p-6 sticky top-20"
          >
            <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="mb-6">
              <div className="text-3xl font-bold mb-1">Free</div>
              <p className="text-sm text-muted-foreground mb-4">
                Full access to all course materials
              </p>
              
              {isLoading ? (
                <div className="w-full py-3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md h-10"></div>
              ) : isEnrolled ? (
                <Link href={`/courses/${params.category}/${params.courseId}/learn/${course?.modules[0]?.lessons[0]?.id || ''}`}>
                  <motion.button
                    className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Learning
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={enrollInCourse}
                >
                  Enroll Now
                </motion.button>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">This course includes:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {Math.ceil(course.duration / 60)} hours on-demand video
                </li>
                <li className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Comprehensive text lessons
                </li>
                <li className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Interactive coding exercises
                </li>
                <li className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quizzes to test your knowledge
                </li>
                <li className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Access to community forum
                </li>
                <li className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Downloadable resources
                </li>
                <li className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Certificate of completion
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 