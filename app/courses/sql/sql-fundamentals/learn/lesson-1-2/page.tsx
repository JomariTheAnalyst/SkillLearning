"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Code, BookOpen, CheckCircle, Clock } from "lucide-react";

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
            <Link href="/courses/sql/sql-fundamentals/learn/lesson-1-3">
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
  id: "lesson-1-2",
  title: "Relational Database Concepts",
  moduleId: "module-1",
  moduleName: "Introduction to SQL",
  course: {
    id: "sql-fundamentals",
    title: "SQL Fundamentals",
    category: "sql"
  },
  nextLessonId: "lesson-1-3",
  prevLessonId: "lesson-1-1",
  content: `
    <h2>Learning Objectives</h2>
    <ul>
      <li>Understand the fundamental concepts of relational databases</li>
      <li>Learn about tables, rows, columns, and relationships</li>
      <li>Recognize primary keys and foreign keys</li>
      <li>Understand database normalization principles</li>
      <li>Identify common data types used in SQL databases</li>
    </ul>

    <h2>What is a Relational Database?</h2>
    <p>A relational database is a collection of data organized into tables (or relations). This structure allows data to be accessed or reassembled in many different ways without having to reorganize the database tables.</p>
    
    <p>The relational database model was invented by E.F. Codd at IBM in 1970 and has since become the dominant database approach for applications that need to manage large amounts of structured data.</p>

    <h2>Key Components of a Relational Database</h2>
    
    <h3>Tables</h3>
    <p>Tables are the primary storage structure in a relational database. Each table represents a specific entity type (like customers, products, or orders) and consists of rows and columns.</p>
    
    <h3>Rows</h3>
    <p>Rows (also called records or tuples) represent individual instances of the entity that the table represents. For example, in a customers table, each row would represent a single customer.</p>
    
    <h3>Columns</h3>
    <p>Columns (also called fields or attributes) represent the specific pieces of data that are stored for each instance of the entity. For example, a customers table might have columns for customer ID, name, email, and address.</p>
    
    <h2>Primary Keys and Foreign Keys</h2>
    
    <h3>Primary Keys</h3>
    <p>A primary key is a column (or combination of columns) that uniquely identifies each row in a table. Primary keys must contain unique values and cannot be null. Common examples include:</p>
    <ul>
      <li>Customer ID in a customers table</li>
      <li>Product ID in a products table</li>
      <li>Order ID in an orders table</li>
    </ul>
    
    <h3>Foreign Keys</h3>
    <p>A foreign key is a column (or combination of columns) that creates a relationship between two tables. It references the primary key of another table, establishing a link between the two tables. For example:</p>
    <ul>
      <li>An orders table might have a customer_id column that references the id column in the customers table</li>
      <li>An order_items table might have both order_id and product_id columns that reference the orders and products tables respectively</li>
    </ul>

    <h2>Relationships Between Tables</h2>
    <p>Tables in a relational database can be connected to each other through relationships. There are three main types of relationships:</p>
    
    <h3>One-to-One (1:1)</h3>
    <p>Each record in the first table is related to exactly one record in the second table, and vice versa. For example, a person and their passport information might have a one-to-one relationship.</p>
    
    <h3>One-to-Many (1:N)</h3>
    <p>Each record in the first table can be related to multiple records in the second table, but each record in the second table is related to only one record in the first table. For example, a customer can place many orders, but each order is placed by only one customer.</p>
    
    <h3>Many-to-Many (N:M)</h3>
    <p>Each record in the first table can be related to multiple records in the second table, and vice versa. This type of relationship typically requires a junction table (also called a bridge table or associative table). For example, students and courses have a many-to-many relationship - each student can take multiple courses, and each course can have multiple students.</p>

    <h2>Database Normalization</h2>
    <p>Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, related tables and defining relationships between them.</p>
    
    <p>The main goals of normalization are:</p>
    <ul>
      <li>Eliminate redundant data (the same information stored in multiple places)</li>
      <li>Ensure data dependencies make sense (data is stored in the right place)</li>
      <li>Facilitate data maintenance and reduce update anomalies</li>
    </ul>
    
    <p>There are several "normal forms" that describe the level of normalization, with the most common being First Normal Form (1NF), Second Normal Form (2NF), and Third Normal Form (3NF).</p>

    <h2>Common SQL Data Types</h2>
    <p>SQL databases support various data types for storing different kinds of information. Here are some common data types:</p>
    
    <h3>Numeric Types</h3>
    <ul>
      <li><strong>INTEGER</strong> - Whole numbers without decimals</li>
      <li><strong>DECIMAL/NUMERIC</strong> - Exact numeric values with decimals</li>
      <li><strong>FLOAT/REAL</strong> - Approximate numeric values</li>
    </ul>
    
    <h3>String Types</h3>
    <ul>
      <li><strong>CHAR</strong> - Fixed-length character strings</li>
      <li><strong>VARCHAR</strong> - Variable-length character strings</li>
      <li><strong>TEXT</strong> - Long text strings</li>
    </ul>
    
    <h3>Date and Time Types</h3>
    <ul>
      <li><strong>DATE</strong> - Calendar date (year, month, day)</li>
      <li><strong>TIME</strong> - Time of day</li>
      <li><strong>TIMESTAMP</strong> - Date and time combined</li>
    </ul>
    
    <h3>Boolean Type</h3>
    <ul>
      <li><strong>BOOLEAN</strong> - True or false values</li>
    </ul>
    
    <h3>Binary Types</h3>
    <ul>
      <li><strong>BLOB</strong> - Binary Large Object, for storing binary data like images or files</li>
    </ul>
    
    <p>Different database systems may have variations or additional data types beyond these common ones.</p>
  `,
  quiz: {
    questions: [
      {
        id: "q1",
        question: "What is the primary storage structure in a relational database?",
        type: "multiple_choice",
        options: [
          "Tables",
          "Records",
          "Fields",
          "Indexes"
        ],
        answer: "Tables"
      },
      {
        id: "q2",
        question: "A column that uniquely identifies each row in a table is called a:",
        type: "multiple_choice",
        options: [
          "Primary key",
          "Foreign key",
          "Unique identifier",
          "Index key"
        ],
        answer: "Primary key"
      },
      {
        id: "q3",
        question: "In a relational database, individual instances of an entity are represented as:",
        type: "fill_blank",
        answer: "rows"
      },
      {
        id: "q4",
        question: "Which type of relationship requires a junction table?",
        type: "multiple_choice",
        options: [
          "One-to-one",
          "One-to-many",
          "Many-to-many",
          "None of the above"
        ],
        answer: "Many-to-many"
      },
      {
        id: "q5",
        question: "Which SQL data type would be most appropriate for storing a person's name?",
        type: "multiple_choice",
        options: [
          "INTEGER",
          "VARCHAR",
          "BOOLEAN",
          "DATE"
        ],
        answer: "VARCHAR"
      },
      {
        id: "q6",
        question: "The process of organizing data to reduce redundancy and improve data integrity is called:",
        type: "fill_blank",
        answer: "normalization"
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
              <p className="mb-4">Test your understanding of relational database concepts with this quiz.</p>
              
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