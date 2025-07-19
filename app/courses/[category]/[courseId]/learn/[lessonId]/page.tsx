"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QuizCard } from "@/app/components/quiz/quiz-card";

// Types for lesson content
interface LessonContent {
  id: string;
  title: string;
  content: string;
  type: "video" | "text" | "interactive" | "quiz";
  moduleId: string;
  moduleName: string;
  course: {
    id: string;
    title: string;
    category: string;
  };
  nextLessonId?: string;
  prevLessonId?: string;
  codeExamples?: {
    language: "sql" | "python" | "excel";
    code: string;
    explanation: string;
  }[];
  interactiveExercise?: {
    instructions: string;
    startingCode: string;
    sampleData?: string;
    expectedOutput?: string;
    hints: string[];
  };
  quizzes?: {
    id: string;
    title: string;
    description?: string;
    questionsCount: number;
    timeLimit?: number;
    passingScore: number;
    difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
    isCompleted?: boolean;
    bestScore?: number;
  }[];
}

// Mock lesson data
const SQL_LESSON: LessonContent = {
  id: "lesson-2-3",
  title: "Filtering with WHERE",
  content: `
    <h1>Filtering Data with the WHERE Clause</h1>
    
    <p>The WHERE clause is one of the most important features in SQL as it allows you to filter the results of your query based on specified conditions.</p>
    
    <h2>Basic Syntax</h2>
    
    <p>The basic syntax for using the WHERE clause is:</p>
    
    <pre>
    SELECT column1, column2, ...
    FROM table_name
    WHERE condition;
    </pre>
    
    <p>The condition in the WHERE clause can use comparison operators like:</p>
    
    <ul>
      <li><strong>=</strong> Equal to</li>
      <li><strong>></strong> Greater than</li>
      <li><strong><</strong> Less than</li>
      <li><strong>>=</strong> Greater than or equal to</li>
      <li><strong><=</strong> Less than or equal to</li>
      <li><strong>!=</strong> or <strong><></strong> Not equal to</li>
    </ul>
    
    <h2>Examples</h2>
    
    <p>Let's look at some examples using our sample employees database:</p>
  `,
  type: "interactive",
  moduleId: "module-2",
  moduleName: "Basic SQL Queries",
  course: {
    id: "sql-fundamentals",
    title: "SQL Fundamentals",
    category: "sql"
  },
  nextLessonId: "lesson-2-4",
  prevLessonId: "lesson-2-2",
  codeExamples: [
    {
      language: "sql",
      code: "SELECT * FROM employees WHERE department = 'Sales';",
      explanation: "This query selects all columns for employees in the Sales department."
    },
    {
      language: "sql",
      code: "SELECT first_name, last_name, salary FROM employees WHERE salary > 50000;",
      explanation: "This query selects employees with a salary greater than 50,000."
    },
    {
      language: "sql",
      code: "SELECT * FROM employees WHERE hire_date >= '2020-01-01';",
      explanation: "This query finds all employees hired on or after January 1, 2020."
    }
  ],
  interactiveExercise: {
    instructions: "Using the employees table, write a query to find all employees in the 'Engineering' department who were hired after '2019-06-01' and have a salary of at least 60000.",
    startingCode: "SELECT * FROM employees\nWHERE -- Your conditions here\n",
    sampleData: `
      Table: employees
      Columns:
      - id (integer)
      - first_name (text)
      - last_name (text) 
      - email (text)
      - department (text)
      - salary (integer)
      - hire_date (date)
      
      Sample data:
      | id | first_name | last_name  | email                      | department   | salary | hire_date  |
      |----|------------|------------|----------------------------|--------------|--------|------------|
      | 1  | John       | Smith      | john.smith@company.com     | Sales        | 55000  | 2018-03-15 |
      | 2  | Sarah      | Johnson    | sarah.johnson@company.com  | Engineering  | 65000  | 2020-01-10 |
      | 3  | Michael    | Williams   | michael.w@company.com      | Engineering  | 70000  | 2019-07-22 |
      | 4  | Jessica    | Brown      | jessica.b@company.com      | Marketing    | 52000  | 2021-02-28 |
      | 5  | David      | Miller     | david.m@company.com        | Engineering  | 58000  | 2019-05-15 |
      | 6  | Emily      | Davis      | emily.d@company.com        | Engineering  | 62000  | 2019-11-08 |
    `,
    expectedOutput: "SELECT * FROM employees WHERE department = 'Engineering' AND hire_date > '2019-06-01' AND salary >= 60000;",
    hints: [
      "Use the AND operator to combine multiple conditions",
      "Check the sample data to make sure your date format is correct",
      "Remember to use single quotes around text and date values"
    ]
  },
  quizzes: [
    {
      id: "sql-where-quiz",
      title: "WHERE Clause Quiz",
      description: "Test your knowledge of SQL WHERE clauses and filtering data.",
      questionsCount: 5,
      timeLimit: 10,
      passingScore: 70,
      difficulty: "MEDIUM",
      isCompleted: false
    }
  ]
};

// Python lesson mock data
const PYTHON_LESSON: LessonContent = {
  id: "python-lesson-1",
  title: "Introduction to Python Lists",
  content: `
    <h1>Python Lists: The Versatile Data Structure</h1>
    
    <p>Lists are one of the most versatile and commonly used data structures in Python. They allow you to store multiple items in a single variable.</p>
    
    <h2>Creating Lists</h2>
    
    <p>Lists in Python are created using square brackets:</p>
    
    <pre>
    # Empty list
    empty_list = []
    
    # List with values
    numbers = [1, 2, 3, 4, 5]
    fruits = ["apple", "banana", "cherry"]
    mixed = [1, "hello", 3.14, True]
    </pre>
    
    <p>Lists can contain items of different data types and can even contain other lists!</p>
    
    <h2>Accessing List Items</h2>
    
    <p>You can access list items using their index (position). Remember that Python uses zero-based indexing, meaning the first item is at index 0.</p>
  `,
  type: "interactive",
  moduleId: "python-module-1",
  moduleName: "Python Basics",
  course: {
    id: "python-basics",
    title: "Python Programming Basics",
    category: "python"
  },
  nextLessonId: "python-lesson-2",
  prevLessonId: "",
  codeExamples: [
    {
      language: "python",
      code: "fruits = ['apple', 'banana', 'cherry']\nprint(fruits[0])  # Output: apple\nprint(fruits[2])  # Output: cherry",
      explanation: "Accessing list items using their index (position)."
    },
    {
      language: "python",
      code: "fruits = ['apple', 'banana', 'cherry']\nprint(fruits[-1])  # Output: cherry\nprint(fruits[-2])  # Output: banana",
      explanation: "Using negative indices to access items from the end of the list."
    },
    {
      language: "python",
      code: "fruits = ['apple', 'banana', 'cherry', 'orange', 'kiwi']\nprint(fruits[1:3])  # Output: ['banana', 'cherry']",
      explanation: "Using slicing to access a range of items."
    }
  ],
  interactiveExercise: {
    instructions: "Create a list called 'colors' containing the colors 'red', 'green', 'blue', and 'yellow'. Then write code to print the first and last colors.",
    startingCode: "# Create your list here\ncolors = \n\n# Print the first color\n\n# Print the last color\n",
    hints: [
      "Use square brackets [] to create a list",
      "Remember that list indices start at 0",
      "You can use negative indices to access items from the end"
    ]
  },
  quizzes: [
    {
      id: "python-lists-quiz",
      title: "Python Lists Quiz",
      description: "Test your understanding of Python lists and related operations.",
      questionsCount: 8,
      timeLimit: 15,
      passingScore: 80,
      difficulty: "EASY",
      isCompleted: true,
      bestScore: 90
    },
    {
      id: "python-advanced-quiz",
      title: "Advanced Python Concepts",
      description: "Challenge yourself with advanced Python concepts and techniques.",
      questionsCount: 10,
      timeLimit: 20,
      passingScore: 75,
      difficulty: "HARD",
      isCompleted: false
    }
  ]
};

// Function to get lesson data - in a real app, this would fetch from API
const getLessonData = (category: string, courseId: string, lessonId: string): LessonContent => {
  if (category === "sql") {
    return SQL_LESSON;
  } else if (category === "python") {
    return PYTHON_LESSON;
  }
  
  // Default to SQL lesson as mock data
  return SQL_LESSON;
};

// Interactive SQL Editor component
const SQLEditor = ({ 
  initialCode, 
  sampleData,
  onRun 
}: { 
  initialCode: string; 
  sampleData?: string;
  onRun: (code: string) => void;
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  
  // Mock function to simulate SQL execution
  const executeSQL = (sqlCode: string) => {
    // In a real app, this would make an API call to a backend that can execute SQL
    let result = "Query executed successfully!\n\n";
    
    // Simple mock responses based on the query
    if (sqlCode.toLowerCase().includes("select") && sqlCode.toLowerCase().includes("where")) {
      if (
        sqlCode.toLowerCase().includes("engineering") && 
        sqlCode.toLowerCase().includes("hire_date") && 
        sqlCode.toLowerCase().includes("60000")
      ) {
        result += `Results (2 rows):\n\n`;
        result += `| id | first_name | last_name | email                     | department  | salary | hire_date  |\n`;
        result += `|----|------------|-----------|---------------------------|-------------|--------|------------|\n`;
        result += `| 2  | Sarah      | Johnson   | sarah.johnson@company.com | Engineering | 65000  | 2020-01-10 |\n`;
        result += `| 3  | Michael    | Williams  | michael.w@company.com     | Engineering | 70000  | 2019-07-22 |`;
      } else if (sqlCode.toLowerCase().includes("engineering")) {
        result += `Results (4 rows):\n\n`;
        result += `| id | first_name | last_name | email                     | department  | salary | hire_date  |\n`;
        result += `|----|------------|-----------|---------------------------|-------------|--------|------------|\n`;
        result += `| 2  | Sarah      | Johnson   | sarah.johnson@company.com | Engineering | 65000  | 2020-01-10 |\n`;
        result += `| 3  | Michael    | Williams  | michael.w@company.com     | Engineering | 70000  | 2019-07-22 |\n`;
        result += `| 5  | David      | Miller    | david.m@company.com       | Engineering | 58000  | 2019-05-15 |\n`;
        result += `| 6  | Emily      | Davis     | emily.d@company.com       | Engineering | 62000  | 2019-11-08 |`;
      } else if (sqlCode.toLowerCase().includes("sales")) {
        result += `Results (1 row):\n\n`;
        result += `| id | first_name | last_name | email                 | department | salary | hire_date  |\n`;
        result += `|----|------------|-----------|------------------------|------------|--------|------------|\n`;
        result += `| 1  | John       | Smith     | john.smith@company.com | Sales      | 55000  | 2018-03-15 |`;
      } else {
        result += `No results match your query criteria.`;
      }
    } else if (sqlCode.trim() === "") {
      result = "Please enter a SQL query.";
    } else {
      result += "Query executed, but no results to display.";
    }
    
    return result;
  };
  
  const handleRun = () => {
    const result = executeSQL(code);
    setOutput(result);
    onRun(code);
  };
  
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="bg-muted px-4 py-2 border-b flex justify-between items-center">
        <h3 className="font-medium">SQL Editor</h3>
        <button
          className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          onClick={handleRun}
        >
          Run Query
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x">
        <div className="p-4">
          <textarea
            className="w-full h-48 p-3 font-mono text-sm bg-background border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
          {sampleData && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Sample Data</h4>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                {sampleData}
              </pre>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="font-medium text-sm mb-2">Output</div>
          <pre className="bg-background border rounded-md p-3 h-full min-h-48 text-sm overflow-auto whitespace-pre-wrap">
            {output || "Run your query to see results."}
          </pre>
        </div>
      </div>
    </div>
  );
};

// Python code editor component
const PythonEditor = ({ 
  initialCode, 
  onRun 
}: { 
  initialCode: string; 
  onRun: (code: string) => void;
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  
  // Mock function to simulate Python execution
  const executePython = (pythonCode: string) => {
    // In a real app, this would make an API call to a backend that can execute Python
    let result = "";
    
    try {
      // Very simple mock responses based on the code
      if (pythonCode.includes("colors = ") && pythonCode.includes("print")) {
        if (
          pythonCode.includes("'red'") && 
          pythonCode.includes("'green'") && 
          pythonCode.includes("'blue'") && 
          pythonCode.includes("'yellow'")
        ) {
          // Extract what they're trying to print
          if (pythonCode.includes("colors[0]")) {
            result += "red\n";
          }
          if (pythonCode.includes("colors[-1]") || pythonCode.includes("colors[3]")) {
            result += "yellow";
          }
        } else {
          result = "Make sure your list includes all the required colors: red, green, blue, and yellow.";
        }
      } else if (pythonCode.trim() === "") {
        result = "Please enter some Python code.";
      } else {
        result = "Code executed, but no output to display.";
      }
    } catch (error) {
      result = `Error: ${error}`;
    }
    
    return result;
  };
  
  const handleRun = () => {
    const result = executePython(code);
    setOutput(result);
    onRun(code);
  };
  
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="bg-muted px-4 py-2 border-b flex justify-between items-center">
        <h3 className="font-medium">Python Editor</h3>
        <button
          className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          onClick={handleRun}
        >
          Run Code
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x">
        <div className="p-4">
          <textarea
            className="w-full h-48 p-3 font-mono text-sm bg-background border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="p-4">
          <div className="font-medium text-sm mb-2">Output</div>
          <pre className="bg-background border rounded-md p-3 h-full min-h-48 text-sm overflow-auto whitespace-pre-wrap">
            {output || "Run your code to see results."}
          </pre>
        </div>
      </div>
    </div>
  );
};

// Main lesson page component
export default function LessonPage({ 
  params 
}: { 
  params: { category: string; courseId: string; lessonId: string } 
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [currentHintIndex, setCurrentHintIndex] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real app, this would fetch the lesson data from an API
    const lessonData = getLessonData(params.category, params.courseId, params.lessonId);
    setLesson(lessonData);
    setShowHint(false);
    setCurrentHintIndex(0);
    
    // Scroll to top when lesson changes
    window.scrollTo(0, 0);
  }, [params.category, params.courseId, params.lessonId]);
  
  // Handle code submission
  const handleCodeRun = (code: string) => {
    // In a real app, this would store the user's progress
    console.log("Code submitted:", code);
  };
  
  // Show next hint
  const showNextHint = () => {
    if (!lesson?.interactiveExercise?.hints) return;
    
    if (currentHintIndex < lesson.interactiveExercise.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
    
    if (!showHint) {
      setShowHint(true);
    }
  };
  
  if (!lesson) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content - left side on desktop */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Link href={`/courses/${params.category}/${params.courseId}`} className="hover:text-foreground">
              {lesson.course.title}
            </Link>
            <span className="mx-2">/</span>
            <span>{lesson.moduleName}</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold tracking-tight mb-6">{lesson.title}</h1>
            
            {/* Lesson content */}
            <div 
              ref={contentRef}
              className="prose prose-slate dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
            
            {/* Code examples */}
            {lesson.codeExamples && lesson.codeExamples.length > 0 && (
              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold">Examples</h2>
                {lesson.codeExamples.map((example, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden bg-card">
                    <pre className="bg-muted p-4 font-mono text-sm overflow-x-auto">
                      {example.code}
                    </pre>
                    <div className="p-4 text-sm">
                      {example.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Interactive exercise */}
            {lesson.interactiveExercise && (
              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold">Practice Exercise</h2>
                <div className="bg-card border rounded-lg p-4 mb-4">
                  <h3 className="font-medium mb-2">Instructions</h3>
                  <p className="text-sm mb-4">{lesson.interactiveExercise.instructions}</p>
                  
                  {showHint && lesson.interactiveExercise.hints && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md p-3 mb-4">
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="font-medium text-sm mb-1">Hint {currentHintIndex + 1}:</div>
                          <p className="text-sm">{lesson.interactiveExercise.hints[currentHintIndex]}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    {lesson.interactiveExercise.hints && (
                      <button
                        className="text-sm text-primary font-medium"
                        onClick={showNextHint}
                      >
                        {showHint 
                          ? currentHintIndex < lesson.interactiveExercise.hints.length - 1 
                            ? "Show Next Hint" 
                            : "All Hints Shown"
                          : "Show Hint"}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Code editor based on course type */}
                {lesson.course.category === "sql" && (
                  <SQLEditor 
                    initialCode={lesson.interactiveExercise.startingCode}
                    sampleData={lesson.interactiveExercise.sampleData}
                    onRun={handleCodeRun}
                  />
                )}
                
                {lesson.course.category === "python" && (
                  <PythonEditor 
                    initialCode={lesson.interactiveExercise.startingCode}
                    onRun={handleCodeRun}
                  />
                )}
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between pt-6 border-t">
              {lesson.prevLessonId ? (
                <Link 
                  href={`/courses/${params.category}/${params.courseId}/learn/${lesson.prevLessonId}`}
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Lesson
                </Link>
              ) : (
                <div></div>
              )}
              
              {lesson.nextLessonId ? (
                <Link 
                  href={`/courses/${params.category}/${params.courseId}/learn/${lesson.nextLessonId}`}
                  className="flex items-center"
                >
                  Next Lesson
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link 
                  href={`/courses/${params.category}/${params.courseId}`}
                  className="flex items-center"
                >
                  Complete Module
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Sidebar - right side on desktop */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-card border rounded-lg p-4 sticky top-20"
          >
            <h3 className="font-medium mb-3">Course Navigation</h3>
            <Link 
              href={`/courses/${params.category}/${params.courseId}`}
              className="flex items-center text-sm text-primary mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Course
            </Link>
            
            <div className="text-sm text-muted-foreground mb-2">Current Module</div>
            <div className="font-medium mb-4">{lesson.moduleName}</div>
            
            <div className="border-t pt-4 mt-4">
              <div className="text-sm text-muted-foreground mb-2">Your Progress</div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: "35%" }}></div>
              </div>
              <div className="text-xs mt-1">35% Complete</div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="text-sm text-muted-foreground mb-2">Need Help?</div>
              <Link 
                href="#"
                className="text-sm text-primary font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ask in Community Forum
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Add Quiz Section */}
      {lesson.quizzes && lesson.quizzes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 mb-8"
        >
          <div className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold">
              Quizzes & Assessments
            </h2>
            <p className="text-gray-600 mt-1">
              Test your knowledge and understanding of the concepts covered in this lesson.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lesson.quizzes.map(quiz => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
                lessonId={lesson.id}
                courseId={lesson.course.id}
                category={lesson.course.category}
                questionsCount={quiz.questionsCount}
                timeLimit={quiz.timeLimit}
                passingScore={quiz.passingScore}
                difficulty={quiz.difficulty}
                isCompleted={quiz.isCompleted}
                bestScore={quiz.bestScore}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
} 