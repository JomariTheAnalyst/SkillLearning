"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Types
type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type CourseCategory = "SQL" | "PYTHON" | "EXCEL";

interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  category: CourseCategory;
  duration: number; // in minutes
  imageUrl?: string;
  tags: string[];
  rating: number;
  studentsCount: number;
  updatedAt: string;
}

// Component to display a single course card with animations
const CourseCard = ({ course }: { course: Course }) => {
  const isAIPowered = course.tags.includes('AI-Powered');
  const getCourseLinkPath = (course: Course) => {
    if (isAIPowered) {
      return `/courses/${course.category.toLowerCase()}/${course.id}`;
    }
    return `/courses/${course.category.toLowerCase()}/${course.id}`;
  };

  return (
    <motion.div 
      className={`bg-card border rounded-xl overflow-hidden card-3d shadow-sm hover:shadow-md transition-all ${
        isAIPowered ? 'border-gradient-to-r from-blue-500 to-purple-500 border-2' : ''
      }`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`aspect-video relative ${
        isAIPowered 
          ? 'bg-gradient-to-tr from-blue-500/20 to-purple-500/20' 
          : 'bg-gradient-to-tr from-primary/10 to-primary/30'
      }`}>
        {course.imageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${course.imageUrl})` }} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {isAIPowered ? (
              <div className="text-center">
                <div className="text-3xl mb-2">🤖</div>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">AI-Powered</span>
              </div>
            ) : (
              <span className="text-2xl text-primary/40 font-semibold">{course.category}</span>
            )}
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/40 text-white text-xs rounded-full backdrop-blur-sm">
          {course.level}
        </div>
        {isAIPowered && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full font-medium">
            🚀 AI-Enhanced
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-xl mb-1">{course.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({course.studentsCount} students)</span>
          </div>
          <span className="text-sm text-muted-foreground">{Math.ceil(course.duration / 60)} hours</span>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {course.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-secondary text-xs rounded-full text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
        
        <Link 
          href={getCourseLinkPath(course)}
          className="block w-full mt-4"
        >
          <motion.button 
            className={`w-full py-2 rounded-md font-medium ${
              isAIPowered 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAIPowered ? '🚀 Begin AI Lesson' : 'View Course'}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

// Mock data for courses
const MOCK_COURSES: Course[] = [
  {
    id: "select-statements",
    title: "Mastering SQL SELECT Statements",
    description: "AI-powered lesson that adapts to your learning style. Learn to retrieve and filter data from databases with personalized practice exercises.",
    level: "BEGINNER",
    category: "SQL",
    duration: 45, // 45 minutes
    tags: ["AI-Powered", "Databases", "Interactive"],
    rating: 4.9,
    studentsCount: 85,
    updatedAt: "2024-01-15",
  },
  {
    id: "sql-fundamentals",
    title: "SQL Fundamentals",
    description: "Learn the core SQL concepts and commands to query databases effectively. Perfect for beginners with no prior SQL knowledge.",
    level: "BEGINNER",
    category: "SQL",
    duration: 600, // 10 hours
    tags: ["Databases", "Data Analysis", "Query Language"],
    rating: 4.7,
    studentsCount: 1250,
    updatedAt: "2023-10-15",
  },
  {
    id: "advanced-sql",
    title: "Advanced SQL for Data Analysis",
    description: "Take your SQL skills to the next level with advanced querying techniques, window functions, CTEs, and performance optimization.",
    level: "INTERMEDIATE",
    category: "SQL",
    duration: 720, // 12 hours
    tags: ["Advanced Queries", "Optimization", "Data Modeling"],
    rating: 4.8,
    studentsCount: 850,
    updatedAt: "2023-11-20",
  },
  {
    id: "functions",
    title: "Python Functions Mastery",
    description: "AI-enhanced lesson for creating reusable code with Python functions. Personalized examples and practice exercises tailored to your programming experience.",
    level: "INTERMEDIATE",
    category: "PYTHON",
    duration: 60, // 60 minutes
    tags: ["AI-Powered", "Programming", "Interactive"],
    rating: 4.8,
    studentsCount: 142,
    updatedAt: "2024-01-20",
  },
  {
    id: "python-basics",
    title: "Python Programming Basics",
    description: "Start your Python journey with this comprehensive introduction to Python syntax, data types, and core programming concepts.",
    level: "BEGINNER",
    category: "PYTHON",
    duration: 540, // 9 hours
    tags: ["Programming", "Data Science", "Automation"],
    rating: 4.6,
    studentsCount: 2100,
    updatedAt: "2023-12-05",
  },
  {
    id: "python-data-analysis",
    title: "Data Analysis with Python",
    description: "Learn how to analyze data using Python libraries like Pandas, NumPy, and Matplotlib to extract insights and create visualizations.",
    level: "INTERMEDIATE",
    category: "PYTHON",
    duration: 780, // 13 hours
    tags: ["Data Science", "Pandas", "Visualization"],
    rating: 4.9,
    studentsCount: 1800,
    updatedAt: "2024-01-10",
  },
  {
    id: "formulas",
    title: "Excel Formulas & Functions Mastery",
    description: "AI-powered Excel lesson that adapts to your skill level. Master formulas and functions with real-world spreadsheet scenarios and interactive practice.",
    level: "BEGINNER",
    category: "EXCEL",
    duration: 50, // 50 minutes
    tags: ["AI-Powered", "Formulas", "Interactive"],
    rating: 4.9,
    studentsCount: 76,
    updatedAt: "2024-01-18",
  },
  {
    id: "excel-essentials",
    title: "Excel Essentials for Data Management",
    description: "Master the fundamentals of Excel for organizing, analyzing, and visualizing data efficiently in your day-to-day work.",
    level: "BEGINNER",
    category: "EXCEL",
    duration: 480, // 8 hours
    tags: ["Spreadsheets", "Data Entry", "Formulas"],
    rating: 4.5,
    studentsCount: 1600,
    updatedAt: "2023-09-25",
  },
  {
    id: "advanced-excel",
    title: "Advanced Excel for Business Analytics",
    description: "Become an Excel power user with advanced functions, pivot tables, macros, and business intelligence techniques.",
    level: "ADVANCED",
    category: "EXCEL",
    duration: 840, // 14 hours
    tags: ["Business Intelligence", "Macros", "Pivot Tables"],
    rating: 4.8,
    studentsCount: 920,
    updatedAt: "2024-02-01",
  },
  {
    id: "sql-performance",
    title: "SQL Performance Optimization",
    description: "Learn advanced techniques to write high-performance SQL queries and optimize database performance for large datasets.",
    level: "ADVANCED",
    category: "SQL",
    duration: 660, // 11 hours
    tags: ["Performance", "Indexing", "Query Optimization"],
    rating: 4.7,
    studentsCount: 750,
    updatedAt: "2024-01-15",
  },
  {
    id: "python-web-scraping",
    title: "Web Scraping with Python",
    description: "Learn how to extract data from websites using Python libraries like Beautiful Soup and Scrapy.",
    level: "INTERMEDIATE",
    category: "PYTHON",
    duration: 540, // 9 hours
    tags: ["Web Scraping", "Automation", "Data Collection"],
    rating: 4.6,
    studentsCount: 1100,
    updatedAt: "2023-11-05",
  },
  {
    id: "excel-dashboards",
    title: "Creating Interactive Dashboards in Excel",
    description: "Design and build dynamic, interactive dashboards in Excel to visualize data and create impactful reports.",
    level: "INTERMEDIATE",
    category: "EXCEL",
    duration: 600, // 10 hours
    tags: ["Dashboards", "Data Visualization", "Reporting"],
    rating: 4.7,
    studentsCount: 1300,
    updatedAt: "2023-12-15",
  },
];

// Course catalog component
export default function CourseCatalog() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CourseCategory[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<CourseLevel[]>([]);
  const [sortOption, setSortOption] = useState<string>("popularity");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(MOCK_COURSES);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...MOCK_COURSES];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (course) => 
          course.title.toLowerCase().includes(term) || 
          course.description.toLowerCase().includes(term) ||
          course.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((course) => selectedCategories.includes(course.category));
    }
    
    // Apply level filter
    if (selectedLevels.length > 0) {
      result = result.filter((course) => selectedLevels.includes(course.level));
    }
    
    // Apply sorting
    switch (sortOption) {
      case "popularity":
        result.sort((a, b) => b.studentsCount - a.studentsCount);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "duration-asc":
        result.sort((a, b) => a.duration - b.duration);
        break;
      case "duration-desc":
        result.sort((a, b) => b.duration - a.duration);
        break;
    }
    
    setFilteredCourses(result);
  }, [searchTerm, selectedCategories, selectedLevels, sortOption]);

  // Toggle category selection
  const toggleCategory = (category: CourseCategory) => {
    setSelectedCategories((prev) => 
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Toggle level selection
  const toggleLevel = (level: CourseLevel) => {
    setSelectedLevels((prev) => 
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">Explore Courses</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Discover our curated collection of courses designed to help you master essential technical skills for your career advancement.
        </p>
      </motion.div>

      {/* Featured AI-Powered Lessons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 mb-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            🤖 AI-Powered Learning Experience
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Try our revolutionary AI-powered lessons that adapt to your learning style and provide personalized practice exercises
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {MOCK_COURSES.filter(course => course.tags.includes('AI-Powered')).map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  {course.category.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{course.title}</h3>
                  <p className="text-xs text-muted-foreground">{course.duration} min • {course.level}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
              <Link href={`/courses/${course.category.toLowerCase()}/${course.id}`}>
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all">
                  🚀 Try AI Lesson
                </button>
              </Link>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search and filters */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
                    <input
                type="text"
                placeholder="Search courses, topics, or skills..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
                  </div>
                  </div>
          <div className="w-full md:w-48">
            <select
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="duration-asc">Duration (Short to Long)</option>
              <option value="duration-desc">Duration (Long to Short)</option>
            </select>
                  </div>
                </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
            <h3 className="text-sm font-medium mb-2">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {["SQL", "PYTHON", "EXCEL"].map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category as CourseCategory)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  onClick={() => toggleCategory(category as CourseCategory)}
                >
                  {category}
                </button>
              ))}
                  </div>
                </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Filter by Level</h3>
            <div className="flex flex-wrap gap-2">
              {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
                <button
                  key={level}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedLevels.includes(level as CourseLevel)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  onClick={() => toggleLevel(level as CourseLevel)}
                >
                  {level}
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>
        
      {/* Course grid */}
      <div className="mb-8">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No courses match your criteria</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search term to find more courses
            </p>
        </div>
        )}
      </div>
      
      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-r from-primary/80 to-primary text-primary-foreground rounded-lg p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Not sure where to start?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Take our skill assessment quiz to get personalized course recommendations based on your experience and goals.
        </p>
        <motion.button
          className="bg-background text-foreground px-6 py-2 rounded-md font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/survey")}
        >
          Take Skill Assessment
        </motion.button>
      </motion.div>
    </div>
  );
} 