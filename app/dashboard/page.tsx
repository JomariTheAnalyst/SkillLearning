"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, GraduationCap, BarChart3, Award, Target, Users } from "lucide-react";
import { toast } from "sonner";

// Types
type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  bgClass: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // This callback is executed when the user is not authenticated
      console.log("User is not authenticated, redirecting to login from onUnauthenticated callback");
      window.location.href = "/auth/login";
    },
  });
  
  const router = useRouter();
  const [userName, setUserName] = useState<string>("User");
  const [isLoading, setIsLoading] = useState(true);

  // Sample courses data
  const courses: Course[] = [
    {
      id: "sql-fundamentals",
      title: "SQL Fundamentals",
      description: "Learn the basics of SQL for database management and data analysis.",
      category: "SQL",
      imageUrl: "/images/courses/sql.jpg",
      bgClass: "from-blue-500 to-blue-700"
    },
    {
      id: "python-basics",
      title: "Python for Beginners",
      description: "Start your Python journey with this beginner-friendly course.",
      category: "Python",
      imageUrl: "/images/courses/python.jpg",
      bgClass: "from-green-500 to-green-700"
    },
    {
      id: "excel-basics",
      title: "Excel Basics",
      description: "Learn essential Excel skills for data organization and analysis.",
      category: "Excel",
      imageUrl: "/images/courses/excel.jpg",
      bgClass: "from-yellow-500 to-yellow-700"
    }
  ];

  useEffect(() => {
    console.log("Authentication status:", status);
    console.log("Session data:", session);

    // Handle loading state
    if (status === "loading") {
      console.log("Authentication status: loading");
      return; // Don't do anything while loading
    }
    
    // Handle authenticated state
    if (status === "authenticated" && session) {
      if (session.user?.name) {
        console.log("Setting user name:", session.user.name);
      setUserName(session.user.name);
    }
    
    setIsLoading(false);
    
    // Show welcome toast
      toast.success(`Welcome to your dashboard, ${session.user?.name || 'User'}!`);
      return;
    }

    // If we get here, the user is not authenticated
    // This should not happen due to the required: true setting above,
    // but adding as an extra safety measure
    console.log("User is not authenticated, redirecting to login from useEffect");
    window.location.href = "/auth/login";
  }, [session, status]);

  // Show loading state while checking authentication or loading data
  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800">
                <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If we reach this point, the user is authenticated and data is loaded
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue your learning journey or explore new courses below.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Courses</p>
            <p className="text-xl font-bold">3</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
            <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Skills</p>
            <p className="text-xl font-bold">12</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
            <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Achievements</p>
            <p className="text-xl font-bold">5</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-3 mr-4">
            <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
            <p className="text-xl font-bold">28%</p>
          </div>
        </div>
      </div>

      {/* Available Courses */}
      <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map(course => (
          <div 
            key={course.id}
            className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 transition-all hover:shadow-md"
          >
            <div className={`h-32 bg-gradient-to-r ${course.bgClass} relative flex items-center justify-center`}>
              <h3 className="text-white text-xl font-bold px-4 text-center drop-shadow-md">
                {course.title}
              </h3>
            </div>
            
            <div className="p-4">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{course.category}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {course.description}
              </p>
              
              <div className="flex justify-between items-center">
                <Link
                  href={`/courses/${course.category.toLowerCase()}/${course.id}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  View Details
                </Link>
                <Link
                  href={`/courses/${course.category.toLowerCase()}/${course.id}/learn/lesson-1-1`}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link 
          href="/profile" 
          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Users className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
          <span>Your Profile</span>
        </Link>
        
        <Link 
          href="/achievements" 
          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Award className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
          <span>Achievements</span>
        </Link>
        
        <Link 
          href="/leaderboard" 
          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <BarChart3 className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
          <span>Leaderboard</span>
        </Link>
        
        <Link 
          href="/settings" 
          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <GraduationCap className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
          <span>Learning Settings</span>
        </Link>
      </div>
    </div>
  );
} 