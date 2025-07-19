"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Code, BookOpen, CheckCircle, Clock } from "lucide-react";

// Excel spreadsheet simulator component
const ExcelSimulator = ({ 
  initialData, 
  onInteract 
}: { 
  initialData: {
    headers: string[];
    rows: (string | number)[][];
  };
  onInteract: (action: string) => void;
}) => {
  const [data, setData] = useState(initialData);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [cellContent, setCellContent] = useState("");
  
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell({row: rowIndex, col: colIndex});
    setCellContent(data.rows[rowIndex][colIndex]?.toString() || "");
    onInteract("select_cell");
  };
  
  const handleCellChange = (value: string) => {
    if (!selectedCell) return;
    
    const newRows = [...data.rows];
    newRows[selectedCell.row][selectedCell.col] = value;
    
    setData({...data, rows: newRows});
    setCellContent(value);
    onInteract("edit_cell");
  };
  
  // Convert column index to Excel column letter (A, B, C, etc.)
  const getColumnLabel = (index: number) => {
    return String.fromCharCode(65 + index);
  };
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm font-medium">Excel Simulator</div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="w-10 p-2 border border-gray-200 dark:border-gray-700 text-center text-xs font-medium text-gray-500"></th>
              {data.headers.map((header, index) => (
                <th 
                  key={index} 
                  className="p-2 border border-gray-200 dark:border-gray-700 text-center text-xs font-medium text-gray-500"
                >
                  {getColumnLabel(index)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="w-10 p-2 border border-gray-200 dark:border-gray-700 text-center text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-900">
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`p-2 border border-gray-200 dark:border-gray-700 text-sm ${
                      selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : ""
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedCell && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <div className="text-xs text-gray-500">
            {getColumnLabel(selectedCell.col)}{selectedCell.row + 1}:
          </div>
          <input
            type="text"
            value={cellContent}
            onChange={(e) => handleCellChange(e.target.value)}
            className="flex-1 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded"
            aria-label="Cell content"
          />
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
                      aria-label={option}
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
                aria-label="Your answer"
              />
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50"
              aria-label="Previous question"
            >
              Previous
            </button>
            
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label="Next question"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                aria-label="Submit quiz"
              >
                Submit
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
            <p className="text-gray-500 dark:text-gray-400">
              You scored {score}% on this quiz.
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              aria-label="Retry quiz"
            >
              Try Again
            </button>
            <Link
              href="/courses/excel/excel-basics/learn/lesson-1-2"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next Lesson
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default function LessonPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [hasInteracted, setHasInteracted] = useState(false);
  
  useEffect(() => {
    // Check if user is enrolled
    if (session) {
      checkEnrollment();
    }
  }, [session]);
  
  async function checkEnrollment() {
    try {
      const response = await fetch(`/api/enrollments/check?courseId=excel-basics&category=excel`);
      const data = await response.json();
      
      if (!data.isEnrolled) {
        router.push('/courses/excel/excel-basics');
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  }
  
  const handleExcelInteraction = (action: string) => {
    setHasInteracted(true);
    // In a real app, you might want to track specific interactions
    console.log(`Excel interaction: ${action}`);
  };
  
  const handleQuizComplete = (score: number) => {
    // In a real app, you would save the quiz results to the database
    console.log(`Quiz completed with score: ${score}`);
    
    // Mark lesson as completed
    fetch("/api/user/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: "excel-basics",
        lessonId: "lesson-1-1",
        completed: true,
      }),
    }).catch(error => {
      console.error("Error saving progress:", error);
    });
  };
  
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/courses/excel/excel-basics"
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Course
          </Link>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">15 min</span>
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Excel Interface Basics</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Learn how to navigate the Excel interface and understand its key components.
          </p>
          
          <div className="flex items-center gap-2 mb-8">
            <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
              Lesson 1
            </div>
            <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">
              Beginner
            </div>
          </div>
        </div>
        
        <div className="prose dark:prose-invert max-w-none mb-8">
          <h2>Understanding the Excel Interface</h2>
          <p>
            Microsoft Excel is a powerful spreadsheet application that allows you to organize, analyze, and visualize data. 
            Before diving into formulas and functions, it's important to understand the basic components of the Excel interface.
          </p>
          
          <h3>Key Components of the Excel Interface</h3>
          <ol>
            <li>
              <strong>Ribbon:</strong> The ribbon is the toolbar at the top of the Excel window that contains all the commands organized into tabs. The main tabs include Home, Insert, Page Layout, Formulas, Data, Review, and View.
            </li>
            <li>
              <strong>Quick Access Toolbar:</strong> Located above the ribbon, this customizable toolbar provides one-click access to commonly used commands.
            </li>
            <li>
              <strong>Formula Bar:</strong> This is where you can enter or edit data in the active cell. It displays the contents of the selected cell.
            </li>
            <li>
              <strong>Worksheet Grid:</strong> The main area of Excel where you work with your data. It consists of cells arranged in rows (numbered) and columns (lettered).
            </li>
            <li>
              <strong>Sheet Tabs:</strong> Located at the bottom of the workbook, these tabs allow you to navigate between different worksheets in your Excel file.
            </li>
            <li>
              <strong>Status Bar:</strong> At the bottom of the Excel window, the status bar provides information about the current state of your workbook and quick access to certain features.
            </li>
          </ol>
          
          <h3>Navigating the Excel Worksheet</h3>
          <p>
            The Excel worksheet is organized into a grid of cells. Each cell is identified by its column letter and row number (e.g., A1, B2, C3).
          </p>
          <ul>
            <li>To select a cell, simply click on it.</li>
            <li>To select multiple adjacent cells, click and drag across them.</li>
            <li>To select non-adjacent cells, hold down the Ctrl key while clicking on individual cells.</li>
            <li>To select an entire row, click on the row number.</li>
            <li>To select an entire column, click on the column letter.</li>
          </ul>
          
          <h3>Entering and Editing Data</h3>
          <p>
            To enter data into a cell:
          </p>
          <ol>
            <li>Select the cell where you want to enter data.</li>
            <li>Type your data.</li>
            <li>Press Enter, Tab, or use the arrow keys to move to another cell.</li>
          </ol>
          <p>
            To edit data in a cell:
          </p>
          <ol>
            <li>Double-click the cell you want to edit, or</li>
            <li>Select the cell and press F2, or</li>
            <li>Select the cell and edit in the formula bar.</li>
          </ol>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Interactive Practice</h2>
          <p className="mb-4">
            Try navigating and entering data in this simplified Excel interface. Click on cells to select them and enter data.
          </p>
          
          <ExcelSimulator 
            initialData={{
              headers: ["Product", "Category", "Price", "Stock", "Status"],
              rows: [
                ["Laptop", "Electronics", 999.99, 45, "In Stock"],
                ["Desk Chair", "Furniture", 149.50, 28, "In Stock"],
                ["Coffee Maker", "Appliances", 79.99, 0, "Out of Stock"],
                ["Wireless Mouse", "Electronics", 24.99, 156, "In Stock"],
                ["Bookshelf", "Furniture", 89.95, 12, "Low Stock"]
              ]
            }}
            onInteract={handleExcelInteraction}
          />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Knowledge Check</h2>
          <p className="mb-4">
            Test your understanding of the Excel interface with this short quiz.
          </p>
          
          <Quiz 
            questions={[
              {
                id: "q1",
                question: "Which part of the Excel interface contains tabs like Home, Insert, and Formulas?",
                type: "multiple_choice",
                options: ["Status Bar", "Formula Bar", "Ribbon", "Quick Access Toolbar"],
                answer: "Ribbon"
              },
              {
                id: "q2",
                question: "How would you refer to the cell in column C, row 5?",
                type: "fill_blank",
                answer: "C5"
              },
              {
                id: "q3",
                question: "To select an entire column in Excel, you should click on:",
                type: "multiple_choice",
                options: ["Any cell in the column", "The column letter", "The first cell in the column", "The column header"],
                answer: "The column letter"
              },
              {
                id: "q4",
                question: "Which key can you press to edit the contents of a selected cell?",
                type: "multiple_choice",
                options: ["F1", "F2", "F3", "F4"],
                answer: "F2"
              },
              {
                id: "q5",
                question: "The area at the bottom of the Excel window that shows information about the current state of your workbook is called:",
                type: "fill_blank",
                answer: "Status Bar"
              }
            ]}
            onComplete={handleQuizComplete}
          />
        </div>
        
        <div className="mt-8 flex justify-between">
          <Link 
            href="/courses/excel/excel-basics"
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Course Overview
          </Link>
          <Link 
            href="/courses/excel/excel-basics/learn/lesson-1-2"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next Lesson
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
} 