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
          let result = "";
          
          if (normalizedQuery.includes('from products')) {
            if (normalizedQuery.includes('select *')) {
              result = `
| id | name              | category    | price  | stock | description                               |
|----|-------------------|-------------|--------|-------|-------------------------------------------|
| 1  | Laptop Pro        | Electronics | 1299.99| 45    | High-performance laptop for professionals |
| 2  | Smartphone X      | Electronics | 899.99 | 120   | Latest smartphone with advanced features  |
| 3  | Coffee Maker      | Appliances  | 79.99  | 30    | Automatic drip coffee maker              |
| 4  | Running Shoes     | Clothing    | 129.99 | 200   | Lightweight running shoes                 |
| 5  | Wireless Earbuds  | Electronics | 149.99 | 75    | Bluetooth wireless earbuds               |
| 6  | Blender           | Appliances  | 69.99  | 45    | High-speed blender for smoothies         |
| 7  | T-shirt           | Clothing    | 19.99  | 300   | Cotton t-shirt, various colors           |
| 8  | External Monitor  | Electronics | 249.99 | 60    | 27-inch 4K external monitor              |
              `;
            } else if (normalizedQuery.includes('select name, price')) {
              result = `
| name              | price  |
|-------------------|--------|
| Laptop Pro        | 1299.99|
| Smartphone X      | 899.99 |
| Coffee Maker      | 79.99  |
| Running Shoes     | 129.99 |
| Wireless Earbuds  | 149.99 |
| Blender           | 69.99  |
| T-shirt           | 19.99  |
| External Monitor  | 249.99 |
              `;
            } else {
              result = "Query executed successfully with custom column selection.";
            }
          } else {
            result = "Query executed successfully but table not recognized in this exercise.";
          }
          
          setOutput(result);
          
          // Check if the query matches the expected output
          const isQueryCorrect = normalizedExpected ? normalizedQuery.includes(normalizedExpected) : true;
          setIsCorrect(isQueryCorrect);
          onRun(sqlCode, isQueryCorrect);
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
            placeholder="SELECT * FROM products;"
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
            <Link href="/courses/sql/sql-fundamentals/learn/lesson-2-2">
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
  id: "lesson-2-1",
  title: "SELECT Statements",
  moduleId: "module-2",
  moduleName: "Basic SQL Queries",
  course: {
    id: "sql-fundamentals",
    title: "SQL Fundamentals",
    category: "sql"
  },
  nextLessonId: "lesson-2-2",
  prevLessonId: "lesson-1-3",
  content: `
    <h2>Learning Objectives</h2>
    <ul>
      <li>Understand the basic structure of a SELECT statement</li>
      <li>Learn how to retrieve all columns from a table</li>
      <li>Learn how to retrieve specific columns from a table</li>
      <li>Understand how to use column aliases</li>
      <li>Learn how to work with expressions in SELECT statements</li>
    </ul>

    <h2>Introduction to SELECT Statements</h2>
    <p>The SELECT statement is the most commonly used command in SQL. It allows you to retrieve data from one or more tables in a database. The basic syntax of a SELECT statement is:</p>
    
    <pre>
    SELECT column1, column2, ...
    FROM table_name;
    </pre>
    
    <p>This tells the database to retrieve the specified columns from the specified table.</p>

    <h2>Retrieving All Columns</h2>
    <p>To retrieve all columns from a table, you can use the asterisk (*) wildcard character:</p>
    
    <pre>
    SELECT *
    FROM products;
    </pre>
    
    <p>This query will return all columns and all rows from the products table. While convenient for exploration, using SELECT * in production code is generally not recommended for several reasons:</p>
    
    <ul>
      <li>It retrieves unnecessary data, which can impact performance</li>
      <li>It makes your code less resilient to changes in the table structure</li>
      <li>It can expose sensitive data that shouldn't be accessible</li>
    </ul>

    <h2>Retrieving Specific Columns</h2>
    <p>To retrieve only specific columns, list them after the SELECT keyword:</p>
    
    <pre>
    SELECT name, price
    FROM products;
    </pre>
    
    <p>This query will return only the name and price columns for all rows in the products table. Retrieving only the columns you need has several advantages:</p>
    
    <ul>
      <li>Improved query performance by reducing data transfer</li>
      <li>Clearer code that explicitly states what data is being used</li>
      <li>Better security by limiting access to only necessary data</li>
    </ul>

    <h2>Column Aliases</h2>
    <p>You can rename columns in your result set using aliases with the AS keyword:</p>
    
    <pre>
    SELECT 
      name AS product_name,
      price AS product_price
    FROM products;
    </pre>
    
    <p>This query will return the same data as the previous example, but the column headers in the result will be "product_name" and "product_price" instead of "name" and "price". Aliases are useful for:</p>
    
    <ul>
      <li>Making column names more descriptive</li>
      <li>Handling column name conflicts when querying multiple tables</li>
      <li>Giving meaningful names to calculated columns</li>
    </ul>
    
    <p>The AS keyword is optional, so you could also write:</p>
    
    <pre>
    SELECT 
      name product_name,
      price product_price
    FROM products;
    </pre>
    
    <p>However, using AS makes your queries more readable and is considered a best practice.</p>

    <h2>Working with Expressions</h2>
    <p>SELECT statements can include expressions that perform calculations on your data:</p>
    
    <pre>
    SELECT 
      name,
      price,
      price * 0.9 AS sale_price
    FROM products;
    </pre>
    
    <p>This query returns the name, regular price, and a calculated sale price (90% of the regular price) for each product. You can use various operators in expressions:</p>
    
    <ul>
      <li>Arithmetic operators: +, -, *, /</li>
      <li>Concatenation operator: || (in some databases) or CONCAT() function</li>
      <li>Built-in functions like ROUND(), UPPER(), etc.</li>
    </ul>
    
    <h2>Best Practices for SELECT Statements</h2>
    <ul>
      <li>Only select the columns you need</li>
      <li>Use meaningful aliases for columns, especially for expressions</li>
      <li>Be consistent with your SQL formatting for readability</li>
      <li>Consider performance implications for large tables</li>
    </ul>
  `,
  interactiveExercise: {
    instructions: "Try writing a SELECT query to retrieve only the name and price columns from the products table. Then modify it to include an alias for the price column as 'retail_price'.",
    startingCode: "SELECT * FROM products;",
    sampleData: `
Table: products
Columns:
- id (integer)
- name (text)
- category (text)
- price (decimal)
- stock (integer)
- description (text)

Sample data:
| id | name              | category    | price  | stock | description                               |
|----|-------------------|-------------|--------|-------|-------------------------------------------|
| 1  | Laptop Pro        | Electronics | 1299.99| 45    | High-performance laptop for professionals |
| 2  | Smartphone X      | Electronics | 899.99 | 120   | Latest smartphone with advanced features  |
| 3  | Coffee Maker      | Appliances  | 79.99  | 30    | Automatic drip coffee maker              |
| 4  | Running Shoes     | Clothing    | 129.99 | 200   | Lightweight running shoes                 |
| 5  | Wireless Earbuds  | Electronics | 149.99 | 75    | Bluetooth wireless earbuds               |
| 6  | Blender           | Appliances  | 69.99  | 45    | High-speed blender for smoothies         |
| 7  | T-shirt           | Clothing    | 19.99  | 300   | Cotton t-shirt, various colors           |
| 8  | External Monitor  | Electronics | 249.99 | 60    | 27-inch 4K external monitor              |
`,
    expectedOutput: "select name, price"
  },
  quiz: {
    questions: [
      {
        id: "q1",
        question: "Which character is used to select all columns from a table?",
        type: "fill_blank",
        answer: "*"
      },
      {
        id: "q2",
        question: "What keyword is used to rename a column in the result set?",
        type: "multiple_choice",
        options: [
          "AS",
          "RENAME",
          "ALIAS",
          "LIKE"
        ],
        answer: "AS"
      },
      {
        id: "q3",
        question: "Which of the following is the correct way to select only the name and price columns from a products table?",
        type: "multiple_choice",
        options: [
          "SELECT name, price FROM products;",
          "SELECT (name, price) FROM products;",
          "SELECT COLUMNS name, price FROM products;",
          "RETRIEVE name, price FROM products;"
        ],
        answer: "SELECT name, price FROM products;"
      },
      {
        id: "q4",
        question: "To create a calculated column that shows the price with a 20% discount, which SQL statement would you use?",
        type: "multiple_choice",
        options: [
          "SELECT name, price, price * 0.8 AS discount_price FROM products;",
          "SELECT name, price, DISCOUNT(price, 20) FROM products;",
          "SELECT name, price, price - 20% FROM products;",
          "SELECT name, price, CALCULATE price * 0.8 AS discount_price FROM products;"
        ],
        answer: "SELECT name, price, price * 0.8 AS discount_price FROM products;"
      },
      {
        id: "q5",
        question: "Why is it generally not recommended to use SELECT * in production code?",
        type: "multiple_choice",
        options: [
          "It retrieves unnecessary data and can impact performance",
          "It is not valid SQL syntax in most databases",
          "It always causes syntax errors in complex queries",
          "It can only be used with small tables"
        ],
        answer: "It retrieves unnecessary data and can impact performance"
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
              <p className="mb-4">Test your understanding of SELECT statements with this quiz.</p>
              
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