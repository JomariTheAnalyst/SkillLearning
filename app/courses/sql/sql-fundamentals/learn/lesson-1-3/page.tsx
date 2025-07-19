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
          // Generate a sample result based on the query
          const result = `
| id | name       | description                | created_at          |
|----|------------|----------------------------|---------------------|
| 1  | Project A  | First sample project       | 2023-01-15 09:30:00 |
| 2  | Project B  | Second sample project      | 2023-02-20 14:45:00 |
| 3  | Project C  | Third sample project       | 2023-03-10 11:15:00 |
          `;
          
          setOutput(result);
          
          // Check if the query matches the expected output
          const isQueryCorrect = normalizedExpected ? normalizedQuery.includes(normalizedExpected) : true;
          setIsCorrect(isQueryCorrect);
          onRun(sqlCode, isQueryCorrect);
        } else if (normalizedQuery.startsWith('create table')) {
          setOutput("Table created successfully.");
          const isQueryCorrect = normalizedExpected ? normalizedQuery.includes(normalizedExpected) : true;
          setIsCorrect(isQueryCorrect);
          onRun(sqlCode, isQueryCorrect);
        } else {
          setOutput("Query executed successfully.");
          const isQueryCorrect = normalizedExpected ? normalizedQuery.includes(normalizedExpected) : true;
          setIsCorrect(isQueryCorrect);
          onRun(sqlCode, isQueryCorrect);
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
            placeholder="SELECT * FROM projects;"
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
    type: 'multiple_choice' | 'fill_blank' | 'drag_drop';
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
      } else if (question.type === 'drag_drop') {
        // For drag and drop, we'll compare arrays
        if (Array.isArray(userAnswer) && 
            Array.isArray(question.answer) && 
            userAnswer.length === question.answer.length &&
            userAnswer.every((item, index) => item === question.answer[index])) {
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
            <Link href="/courses/sql/sql-fundamentals/learn/lesson-2-1">
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
  id: "lesson-1-3",
  title: "Setting Up Your Practice Environment",
  moduleId: "module-1",
  moduleName: "Introduction to SQL",
  course: {
    id: "sql-fundamentals",
    title: "SQL Fundamentals",
    category: "sql"
  },
  nextLessonId: "lesson-2-1",
  prevLessonId: "lesson-1-2",
  content: `
    <h2>Learning Objectives</h2>
    <ul>
      <li>Understand the SQL practice environment available in this course</li>
      <li>Learn how to use the embedded SQL editor</li>
      <li>Get familiar with the sample databases we'll use throughout the course</li>
      <li>Run your first SQL queries in the practice environment</li>
    </ul>

    <h2>Our SQL Practice Environment</h2>
    <p>Throughout this course, you'll be using our embedded SQL editor to practice writing and running SQL queries. This environment allows you to execute SQL commands against sample databases without needing to install any software or set up your own database server.</p>
    
    <p>The practice environment has the following features:</p>
    <ul>
      <li><strong>SQL Editor</strong> - A text area where you can write your SQL queries</li>
      <li><strong>Sample Data View</strong> - Shows the structure and sample data for the tables you'll be working with</li>
      <li><strong>Results Panel</strong> - Displays the results of your queries or any error messages</li>
      <li><strong>Run Button</strong> - Executes your SQL code</li>
    </ul>

    <h2>Sample Databases</h2>
    <p>Throughout this course, we'll be working with several sample databases designed to help you learn different aspects of SQL. Here are the main databases we'll use:</p>
    
    <h3>1. Employee Database</h3>
    <p>This database contains information about employees, departments, and salaries. It includes the following tables:</p>
    <ul>
      <li><strong>employees</strong> - Contains employee information (id, first_name, last_name, email, department, salary, hire_date)</li>
      <li><strong>departments</strong> - Contains department information (id, name, location)</li>
      <li><strong>salaries</strong> - Contains historical salary information (id, employee_id, amount, effective_date)</li>
    </ul>
    
    <h3>2. E-commerce Database</h3>
    <p>This database simulates an online store with products, customers, and orders. It includes:</p>
    <ul>
      <li><strong>products</strong> - Product information (id, name, description, price, category)</li>
      <li><strong>customers</strong> - Customer information (id, first_name, last_name, email, address)</li>
      <li><strong>orders</strong> - Order information (id, customer_id, order_date, total_amount)</li>
      <li><strong>order_items</strong> - Items in each order (id, order_id, product_id, quantity, price)</li>
    </ul>
    
    <h3>3. Project Management Database</h3>
    <p>A simple database for tracking projects and tasks:</p>
    <ul>
      <li><strong>projects</strong> - Project information (id, name, description, created_at)</li>
      <li><strong>tasks</strong> - Task information (id, project_id, name, description, status, due_date)</li>
      <li><strong>users</strong> - User information (id, name, email)</li>
      <li><strong>task_assignments</strong> - Which users are assigned to which tasks (id, task_id, user_id)</li>
    </ul>

    <h2>Running Your First Query</h2>
    <p>Let's try running a simple query in our SQL editor. The most basic query is a SELECT statement that retrieves data from a table.</p>
    
    <p>For example, to see all the projects in our project management database, you would write:</p>
    <pre>
    SELECT * FROM projects;
    </pre>
    
    <p>This query uses the asterisk (*) wildcard to select all columns from the projects table.</p>
    
    <p>Try running this query in the practice area below. You should see a table with all the projects in the database.</p>
  `,
  interactiveExercise: {
    instructions: "Try running a SELECT query to retrieve all data from the projects table. Then try modifying it to only select specific columns like id and name.",
    startingCode: "SELECT * FROM projects;",
    sampleData: `
Table: projects
Columns:
- id (integer)
- name (text)
- description (text)
- created_at (timestamp)

Sample data:
| id | name       | description                | created_at          |
|----|------------|----------------------------|---------------------|
| 1  | Project A  | First sample project       | 2023-01-15 09:30:00 |
| 2  | Project B  | Second sample project      | 2023-02-20 14:45:00 |
| 3  | Project C  | Third sample project       | 2023-03-10 11:15:00 |
`,
    expectedOutput: "select * from projects"
  },
  quiz: {
    questions: [
      {
        id: "q1",
        question: "What SQL statement is used to retrieve data from a table?",
        type: "multiple_choice",
        options: [
          "SELECT",
          "RETRIEVE",
          "GET",
          "FETCH"
        ],
        answer: "SELECT"
      },
      {
        id: "q2",
        question: "Which wildcard character is used to select all columns in a SQL query?",
        type: "fill_blank",
        answer: "*"
      },
      {
        id: "q3",
        question: "What character is used to end SQL statements?",
        type: "multiple_choice",
        options: [
          ";",
          ".",
          ":",
          "!"
        ],
        answer: ";"
      },
      {
        id: "q4",
        question: "To select only the name and description columns from the projects table, you would write:",
        type: "multiple_choice",
        options: [
          "SELECT name, description FROM projects;",
          "SELECT (name, description) FROM projects;",
          "GET name, description FROM projects;",
          "SELECT * FROM projects WHERE name, description;"
        ],
        answer: "SELECT name, description FROM projects;"
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
    
    // Simulate progress as user scrolls through content
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll percentage
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
      
      // Update progress based on scroll position
      if (scrollPercentage > progress && progress < 70) {
        setProgress(Math.min(70, Math.floor(scrollPercentage)));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [progress]);
  
  const handleCodeRun = (code: string, isCorrect: boolean) => {
    if (isCorrect && progress < 80) {
      setProgress(80);
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
          
          <div className="flex space-x-4">
            {LESSON_DATA.prevLessonId && (
              <Link href={`/courses/sql/sql-fundamentals/learn/${LESSON_DATA.prevLessonId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            )}
            
            {LESSON_DATA.nextLessonId && (
              <Link href={`/courses/sql/sql-fundamentals/learn/${LESSON_DATA.nextLessonId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>
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
              <p className="mb-4">Test your understanding of the SQL practice environment with this short quiz.</p>
              
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