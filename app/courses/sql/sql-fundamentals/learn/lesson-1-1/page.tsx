"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Code, BookOpen, CheckCircle, Clock } from "lucide-react";

// SQLEditor component for interactive practice
const SQLEditor = ({ 
  initialCode, 
  sampleData,
  expectedOutput,
  onRun 
}: { 
  initialCode: string; 
  sampleData?: string;
  expectedOutput?: string;
  onRun: (code: string, isCorrect: boolean) => void;
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Simple SQL query validator and executor
  const executeSQL = (sqlCode: string) => {
    setIsRunning(true);
    
    // Simulate SQL execution with a delay
    setTimeout(() => {
      try {
        // This is a simplified SQL parser for demonstration
        // In a real app, you would use a proper SQL execution engine
        const normalizedQuery = sqlCode.trim().toLowerCase().replace(/\s+/g, ' ');
        const normalizedExpected = expectedOutput ? expectedOutput.trim().toLowerCase().replace(/\s+/g, ' ') : null;
        
        // Check if the query is a SELECT statement
        if (normalizedQuery.startsWith('select')) {
          // Very basic parsing - this would be much more sophisticated in a real app
          if (normalizedQuery.includes('from employees') && normalizedQuery.includes('where')) {
            // Generate a sample result based on the query
            const result = `
| id | first_name | last_name  | email                   | department  | salary |
|----|------------|------------|-------------------------|-------------|--------|
| 2  | Sarah      | Johnson    | sarah.j@company.com     | Engineering | 65000  |
| 3  | Michael    | Williams   | michael.w@company.com   | Engineering | 70000  |
| 6  | Emily      | Davis      | emily.d@company.com     | Engineering | 62000  |
            `;
            
            setOutput(result);
            
            // Check if the query matches the expected output
            const isQueryCorrect = normalizedExpected ? normalizedQuery.includes(normalizedExpected) : true;
            setIsCorrect(isQueryCorrect);
            onRun(sqlCode, isQueryCorrect);
          } else {
            setOutput("Query executed successfully, but no results match your criteria.");
            setIsCorrect(false);
            onRun(sqlCode, false);
          }
        } else {
          setOutput("Error: Only SELECT statements are supported in this exercise.");
          setIsCorrect(false);
          onRun(sqlCode, false);
        }
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
        setIsCorrect(false);
        onRun(sqlCode, false);
      } finally {
        setIsRunning(false);
      }
    }, 500);
  };
  
  const handleRun = () => {
    executeSQL(code);
  };
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm font-medium">SQL Editor</div>
        <button 
          onClick={handleRun}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex items-center disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run Query"}
          {!isRunning && <Code className="ml-1 h-3 w-3" />}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
          <div className="p-1 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">
            Write your SQL query here
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-40 p-3 font-mono text-sm bg-white dark:bg-gray-800 focus:outline-none"
            placeholder="SELECT * FROM employees WHERE..."
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="p-1 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">
            Sample data
          </div>
          <pre className="text-xs p-3 overflow-auto h-40 bg-white dark:bg-gray-800">
            {sampleData}
          </pre>
        </div>
      </div>
      
      {output && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-1 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700 flex justify-between">
            <span>Results</span>
            {isCorrect !== null && (
              <span className={`font-medium ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isCorrect ? 'Correct!' : 'Not quite right. Try again!'}
              </span>
            )}
          </div>
          <pre className="text-xs p-3 overflow-auto max-h-40 bg-white dark:bg-gray-800">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};

// Quiz component
const Quiz = ({ 
  questions, 
  onComplete 
}: { 
  questions: {
    id: string;
    question: string;
    type: 'multiple_choice' | 'fill_blank';
    options?: string[];
    answer: string | string[];
  }[]; 
  onComplete: (score: number) => void;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers({ ...answers, [questionId]: answer });
  };
  
  const handleSubmit = () => {
    let correctAnswers = 0;
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      
      if (question.type === 'multiple_choice') {
        if (userAnswer === question.answer) {
          correctAnswers++;
        }
      } else if (question.type === 'fill_blank') {
        // For fill in the blank, we'll do a case-insensitive match
        if (typeof userAnswer === 'string' && 
            typeof question.answer === 'string' && 
            userAnswer.toLowerCase() === question.answer.toLowerCase()) {
          correctAnswers++;
        }
      }
    });
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    onComplete(finalScore);
  };
  
  const question = questions[currentQuestion];
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-6">
      {!showResults ? (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Question {currentQuestion + 1} of {questions.length}</h3>
              <div className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${Math.round(((currentQuestion + 1) / questions.length) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-4">{question.question}</h4>
            
            {question.type === 'multiple_choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <label key={index} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswer(question.id, option)}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
            
            {question.type === 'fill_blank' && (
              <input
                type="text"
                placeholder="Type your answer here"
                value={(answers[question.id] as string) || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={!answers[question.id]}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < questions.length}
                className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
              >
                Submit
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
          <p className="text-lg mb-4">Your score: {score}%</p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md mr-2"
            >
              Retry Quiz
            </button>
            <Link href="/courses/sql/sql-fundamentals/learn/lesson-1-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Next Lesson
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Lesson content
const LESSON_DATA = {
  id: "lesson-1-1",
  title: "What is SQL?",
  moduleId: "module-1",
  moduleName: "Introduction to SQL",
  course: {
    id: "sql-fundamentals",
    title: "SQL Fundamentals",
    category: "sql"
  },
  nextLessonId: "lesson-1-2",
  prevLessonId: null,
  content: `
    <h2>Learning Objectives</h2>
    <ul>
      <li>Understand what SQL is and why it's important</li>
      <li>Learn the basic structure of a SQL database</li>
      <li>Recognize the most common SQL database systems</li>
      <li>Write your first simple SQL query</li>
    </ul>

    <h2>What is SQL?</h2>
    <p>SQL (Structured Query Language) is a specialized programming language designed for managing and manipulating data stored in relational database management systems (RDBMS). It was developed in the 1970s by IBM researchers and has since become the standard language for database interaction.</p>
    
    <p>SQL allows you to:</p>
    <ul>
      <li>Create and modify database structures</li>
      <li>Insert, update, and delete data</li>
      <li>Query databases to retrieve specific information</li>
      <li>Set permissions on database objects</li>
    </ul>

    <h2>Why Learn SQL?</h2>
    <p>SQL is an essential skill for many roles, including:</p>
    <ul>
      <li><strong>Data Analysts</strong> - Extract and analyze data to inform business decisions</li>
      <li><strong>Data Scientists</strong> - Query and prepare data for advanced analysis</li>
      <li><strong>Software Developers</strong> - Build applications that interact with databases</li>
      <li><strong>Database Administrators</strong> - Manage and optimize database systems</li>
      <li><strong>Business Intelligence Professionals</strong> - Create reports and dashboards</li>
    </ul>

    <h2>Relational Database Basics</h2>
    <p>A relational database organizes data into tables (also called relations). Each table consists of:</p>
    <ul>
      <li><strong>Rows</strong> (or records) - Individual entries in the table</li>
      <li><strong>Columns</strong> (or fields) - Categories of data being stored</li>
    </ul>

    <p>For example, an "employees" table might have columns for employee ID, name, department, and salary, with each row representing a different employee.</p>

    <h2>Common SQL Database Systems</h2>
    <p>There are many relational database management systems that use SQL, including:</p>
    <ul>
      <li><strong>MySQL</strong> - Open-source, widely used for web applications</li>
      <li><strong>PostgreSQL</strong> - Open-source, known for standards compliance and extensibility</li>
      <li><strong>Microsoft SQL Server</strong> - Microsoft's enterprise database solution</li>
      <li><strong>Oracle Database</strong> - Enterprise-level database system</li>
      <li><strong>SQLite</strong> - Lightweight, file-based database</li>
    </ul>

    <h2>Your First SQL Query</h2>
    <p>The most basic SQL query uses the SELECT statement to retrieve data from a table:</p>
    <pre>
    SELECT column1, column2, ...
    FROM table_name;
    </pre>

    <p>For example, to get all data from an employees table:</p>
    <pre>
    SELECT * FROM employees;
    </pre>

    <p>The asterisk (*) is a wildcard that selects all columns. You can also specify exactly which columns you want:</p>
    <pre>
    SELECT first_name, last_name, department FROM employees;
    </pre>
  `,
  interactiveExercise: {
    instructions: "Try writing a SQL query to select all employees from the Engineering department. Use the employees table in the sample data.",
    startingCode: "SELECT * FROM employees\nWHERE -- Add your condition here",
    sampleData: `
Table: employees
Columns:
- id (integer)
- first_name (text)
- last_name (text) 
- email (text)
- department (text)
- salary (integer)

Sample data:
| id | first_name | last_name  | email                   | department  | salary |
|----|------------|------------|-------------------------|-------------|--------|
| 1  | John       | Smith      | john.s@company.com      | Sales       | 55000  |
| 2  | Sarah      | Johnson    | sarah.j@company.com     | Engineering | 65000  |
| 3  | Michael    | Williams   | michael.w@company.com   | Engineering | 70000  |
| 4  | Jessica    | Brown      | jessica.b@company.com   | Marketing   | 52000  |
| 5  | David      | Miller     | david.m@company.com     | Sales       | 58000  |
| 6  | Emily      | Davis      | emily.d@company.com     | Engineering | 62000  |
`,
    expectedOutput: "department = 'engineering'"
  },
  quiz: {
    questions: [
      {
        id: "q1",
        question: "What does SQL stand for?",
        type: "multiple_choice",
        options: [
          "Structured Query Language",
          "Simple Question Language",
          "Standard Query Logic",
          "System Quality Language"
        ],
        answer: "Structured Query Language"
      },
      {
        id: "q2",
        question: "Which of the following is NOT a common SQL database system?",
        type: "multiple_choice",
        options: [
          "MongoDB",
          "MySQL",
          "PostgreSQL",
          "Microsoft SQL Server"
        ],
        answer: "MongoDB"
      },
      {
        id: "q3",
        question: "In a relational database, data is organized into _______.",
        type: "fill_blank",
        answer: "tables"
      },
      {
        id: "q4",
        question: "Which SQL statement is used to retrieve data from a database?",
        type: "multiple_choice",
        options: [
          "SELECT",
          "EXTRACT",
          "RETRIEVE",
          "GET"
        ],
        answer: "SELECT"
      },
      {
        id: "q5",
        question: "What symbol can be used to select all columns in a SQL query?",
        type: "fill_blank",
        answer: "*"
      }
    ]
  }
};

export default function LessonPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Track user progress through the lesson
  useEffect(() => {
    // In a real app, you would load the user's progress from an API
    // and update it as they progress through the lesson
    setProgress(0);
  }, []);
  
  const handleCodeRun = (code: string, isCorrect: boolean) => {
    if (isCorrect && progress < 50) {
      setProgress(50);
    }
  };
  
  const handleQuizComplete = (score: number) => {
    // In a real app, you would save the quiz results to an API
    setProgress(100);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Lesson Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/courses/sql/sql-fundamentals" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Course
          </Link>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Lesson Progress:</span>
            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {LESSON_DATA.nextLessonId && (
            <Link href={`/courses/sql/sql-fundamentals/learn/${LESSON_DATA.nextLessonId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
              Next Lesson
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
        
        {/* Lesson Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">{LESSON_DATA.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{LESSON_DATA.moduleName}</span>
          </div>
        </div>
        
        {!showQuiz ? (
          <>
            {/* Lesson Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: LESSON_DATA.content }} />
            </div>
            
            {/* Interactive Exercise */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Practice Exercise</h2>
              <p className="mb-4">{LESSON_DATA.interactiveExercise.instructions}</p>
              
              <SQLEditor 
                initialCode={LESSON_DATA.interactiveExercise.startingCode}
                sampleData={LESSON_DATA.interactiveExercise.sampleData}
                expectedOutput={LESSON_DATA.interactiveExercise.expectedOutput}
                onRun={handleCodeRun}
              />
            </div>
            
            {/* Quiz Button */}
            <div className="text-center mb-8">
              <button 
                onClick={() => setShowQuiz(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Take Quiz
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Quiz */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Lesson Quiz</h2>
              <p className="mb-4">Test your understanding of SQL basics with this short quiz.</p>
              
              <Quiz 
                questions={LESSON_DATA.quiz.questions}
                onComplete={handleQuizComplete}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 