"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from "lucide-react";

// Excel spreadsheet simulator component with formatting options
const ExcelFormattingSimulator = ({ 
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
  const [cellFormat, setCellFormat] = useState<{
    bold: boolean;
    italic: boolean;
    align: 'left' | 'center' | 'right';
    color: string;
    background: string;
  }>({
    bold: false,
    italic: false,
    align: 'left',
    color: '#000000',
    background: 'transparent'
  });
  
  const [cellFormats, setCellFormats] = useState<Record<string, any>>({});
  
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell({row: rowIndex, col: colIndex});
    setCellContent(data.rows[rowIndex][colIndex]?.toString() || "");
    
    // Load cell formatting if exists
    const cellKey = `${rowIndex}-${colIndex}`;
    if (cellFormats[cellKey]) {
      setCellFormat(cellFormats[cellKey]);
    } else {
      setCellFormat({
        bold: false,
        italic: false,
        align: 'left',
        color: '#000000',
        background: 'transparent'
      });
    }
    
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
  
  const handleFormatChange = (property: string, value: any) => {
    if (!selectedCell) return;
    
    const newFormat = { ...cellFormat, [property]: value };
    setCellFormat(newFormat);
    
    // Save format for this cell
    const cellKey = `${selectedCell.row}-${selectedCell.col}`;
    setCellFormats({
      ...cellFormats,
      [cellKey]: newFormat
    });
    
    onInteract("format_cell");
  };
  
  // Convert column index to Excel column letter (A, B, C, etc.)
  const getColumnLabel = (index: number) => {
    return String.fromCharCode(65 + index);
  };
  
  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    const format = cellFormats[cellKey] || {
      bold: false,
      italic: false,
      align: 'left',
      color: '#000000',
      background: 'transparent'
    };
    
    return {
      fontWeight: format.bold ? 'bold' : 'normal',
      fontStyle: format.italic ? 'italic' : 'normal',
      textAlign: format.align,
      color: format.color,
      backgroundColor: format.background !== 'transparent' ? format.background : undefined,
    };
  };
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm font-medium">Excel Formatting Simulator</div>
      </div>
      
      {selectedCell && (
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 mr-4">
            <div className="text-xs text-gray-500">
              {getColumnLabel(selectedCell.col)}{selectedCell.row + 1}:
            </div>
            <input
              type="text"
              value={cellContent}
              onChange={(e) => handleCellChange(e.target.value)}
              className="w-32 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded"
              aria-label="Cell content"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFormatChange('bold', !cellFormat.bold)}
              className={`p-1 rounded ${cellFormat.bold ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}
              aria-label="Bold"
            >
              <span className="font-bold">B</span>
            </button>
            <button
              onClick={() => handleFormatChange('italic', !cellFormat.italic)}
              className={`p-1 rounded ${cellFormat.italic ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}
              aria-label="Italic"
            >
              <span className="italic">I</span>
            </button>
            
            <select
              value={cellFormat.align}
              onChange={(e) => handleFormatChange('align', e.target.value)}
              className="p-1 text-xs border border-gray-300 dark:border-gray-600 rounded"
              aria-label="Text alignment"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            
            <input
              type="color"
              value={cellFormat.color}
              onChange={(e) => handleFormatChange('color', e.target.value)}
              className="w-6 h-6 rounded cursor-pointer"
              aria-label="Text color"
            />
            
            <select
              value={cellFormat.background}
              onChange={(e) => handleFormatChange('background', e.target.value)}
              className="p-1 text-xs border border-gray-300 dark:border-gray-600 rounded"
              aria-label="Background color"
            >
              <option value="transparent">No Fill</option>
              <option value="#f0f0f0">Light Gray</option>
              <option value="#ffffcc">Light Yellow</option>
              <option value="#ccffcc">Light Green</option>
              <option value="#ccccff">Light Blue</option>
              <option value="#ffcccc">Light Red</option>
            </select>
          </div>
        </div>
      )}
      
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
                    style={getCellStyle(rowIndex, colIndex)}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  const [feedback, setFeedback] = useState<Record<string, {correct: boolean, message: string}>>({});
  
  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers({ ...answers, [questionId]: answer });
  };
  
  const handleSubmit = () => {
    let correctAnswers = 0;
    const newFeedback: Record<string, {correct: boolean, message: string}> = {};
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      let isCorrect = false;
      
      if (question.type === 'multiple_choice') {
        isCorrect = userAnswer === question.answer;
      } else if (question.type === 'fill_blank') {
        // For fill in the blank, we'll do a case-insensitive match
        if (typeof userAnswer === 'string' && 
            typeof question.answer === 'string') {
          isCorrect = userAnswer.toLowerCase() === question.answer.toLowerCase();
        }
      }
      
      if (isCorrect) {
        correctAnswers++;
        newFeedback[question.id] = {
          correct: true,
          message: "Correct! Well done."
        };
      } else {
        newFeedback[question.id] = {
          correct: false,
          message: `Incorrect. The correct answer is: ${question.answer}`
        };
      }
    });
    
    setFeedback(newFeedback);
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
          
          <div className="mb-8">
            <h4 className="font-medium text-left mb-4">Review Your Answers:</h4>
            <div className="space-y-4 text-left">
              {questions.map((q, index) => (
                <div key={q.id} className={`p-4 rounded-md ${
                  feedback[q.id]?.correct ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900' : 
                  'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900'
                }`}>
                  <p className="font-medium mb-2">Question {index + 1}: {q.question}</p>
                  <p className="text-sm mb-1">Your answer: {answers[q.id]}</p>
                  <p className={`text-sm ${feedback[q.id]?.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {feedback[q.id]?.message}
                  </p>
                </div>
              ))}
            </div>
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
              href="/courses/excel/excel-basics/learn/lesson-1-3"
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
        lessonId: "lesson-1-2",
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
            <span className="text-sm text-gray-500">20 min</span>
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Cell Formatting</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Learn how to format cells in Excel to improve data presentation and readability.
          </p>
          
          <div className="flex items-center gap-2 mb-8">
            <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
              Lesson 2
            </div>
            <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">
              Beginner
            </div>
          </div>
        </div>
        
        <div className="prose dark:prose-invert max-w-none mb-8">
          <h2>Why Cell Formatting Matters</h2>
          <p>
            Proper cell formatting in Excel makes your data more readable, professional, and easier to understand. 
            It helps highlight important information, distinguish between different types of data, and create a 
            consistent visual style across your spreadsheets.
          </p>
          
          <h3>Basic Text Formatting</h3>
          <p>
            You can format text in Excel cells similar to how you would in a word processor:
          </p>
          <ul>
            <li><strong>Font:</strong> Change the typeface to improve readability or match your organization's style.</li>
            <li><strong>Size:</strong> Adjust text size for headings, subheadings, and body text.</li>
            <li><strong>Bold, Italic, Underline:</strong> Emphasize important information or create visual hierarchy.</li>
            <li><strong>Color:</strong> Use text color to categorize or highlight data (use with caution for accessibility).</li>
          </ul>
          
          <h3>Number Formatting</h3>
          <p>
            Excel provides specialized formatting options for numbers:
          </p>
          <ul>
            <li><strong>Currency:</strong> Display values with currency symbols ($, €, £, etc.) and decimal places.</li>
            <li><strong>Percentage:</strong> Show values as percentages with the % symbol.</li>
            <li><strong>Date and Time:</strong> Format dates and times in various regional and custom formats.</li>
            <li><strong>Decimal Places:</strong> Control how many decimal places are displayed.</li>
            <li><strong>Thousands Separator:</strong> Add commas or spaces to make large numbers more readable.</li>
          </ul>
          
          <h3>Cell Alignment and Text Wrapping</h3>
          <p>
            Proper alignment improves the visual organization of your data:
          </p>
          <ul>
            <li><strong>Horizontal Alignment:</strong> Left, center, or right-align content within cells.</li>
            <li><strong>Vertical Alignment:</strong> Top, middle, or bottom-align content, especially useful for cells with multiple lines.</li>
            <li><strong>Text Wrapping:</strong> Allow text to display on multiple lines within a cell.</li>
            <li><strong>Text Rotation:</strong> Rotate text for column headers to save space.</li>
          </ul>
          
          <h3>Cell Borders and Fill Colors</h3>
          <p>
            Visual elements help organize and group related data:
          </p>
          <ul>
            <li><strong>Borders:</strong> Add lines around cells or ranges to create tables and separate sections.</li>
            <li><strong>Fill Colors:</strong> Add background colors to highlight cells, create alternating row colors, or indicate categories.</li>
          </ul>
          
          <h3>Conditional Formatting</h3>
          <p>
            Conditional formatting automatically changes cell appearance based on their values:
          </p>
          <ul>
            <li><strong>Highlight Cells Rules:</strong> Format cells that are greater than, less than, between, or equal to specific values.</li>
            <li><strong>Color Scales:</strong> Apply color gradients to visualize data distribution.</li>
            <li><strong>Data Bars:</strong> Add in-cell bars that represent values proportionally.</li>
            <li><strong>Icon Sets:</strong> Add icons that indicate value categories (high/medium/low).</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Interactive Practice</h2>
          <p className="mb-4">
            Try formatting cells in this simplified Excel interface. Click on cells to select them and apply different formatting options.
          </p>
          
          <ExcelFormattingSimulator 
            initialData={{
              headers: ["Product", "Category", "Price", "Quantity", "Total"],
              rows: [
                ["Laptop", "Electronics", 1299.99, 3, 3899.97],
                ["Monitor", "Electronics", 249.50, 5, 1247.50],
                ["Keyboard", "Accessories", 59.99, 10, 599.90],
                ["Mouse", "Accessories", 24.99, 15, 374.85],
                ["Headphones", "Audio", 89.95, 8, 719.60]
              ]
            }}
            onInteract={handleExcelInteraction}
          />
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <h3 className="text-lg font-medium mb-2">Formatting Challenge:</h3>
            <p className="mb-2">Try to format the spreadsheet above with these improvements:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Make the header row bold and center-aligned</li>
              <li>Format the Price column as currency</li>
              <li>Right-align all number columns</li>
              <li>Add a light background color to the Total column</li>
              <li>Make any total above 1000 appear in a different text color</li>
            </ol>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Knowledge Check</h2>
          <p className="mb-4">
            Test your understanding of cell formatting with this short quiz.
          </p>
          
          <Quiz 
            questions={[
              {
                id: "q1",
                question: "Which of these is NOT a basic text formatting option in Excel?",
                type: "multiple_choice",
                options: ["Bold", "Italic", "Underline", "Strikethrough", "Highlight"],
                answer: "Highlight"
              },
              {
                id: "q2",
                question: "To display a number as a percentage in Excel, you should use:",
                type: "multiple_choice",
                options: ["Text formatting", "Number formatting", "Percentage formatting", "Custom formatting"],
                answer: "Percentage formatting"
              },
              {
                id: "q3",
                question: "What is the default horizontal alignment for text values in Excel?",
                type: "fill_blank",
                answer: "Left"
              },
              {
                id: "q4",
                question: "What is the default horizontal alignment for number values in Excel?",
                type: "fill_blank",
                answer: "Right"
              },
              {
                id: "q5",
                question: "Which formatting feature automatically changes cell appearance based on their values?",
                type: "multiple_choice",
                options: ["Custom Formatting", "Conditional Formatting", "Cell Styles", "Format Painter"],
                answer: "Conditional Formatting"
              }
            ]}
            onComplete={handleQuizComplete}
          />
        </div>
        
        <div className="mt-8 flex justify-between">
          <Link 
            href="/courses/excel/excel-basics/learn/lesson-1-1"
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Lesson
          </Link>
          <Link 
            href="/courses/excel/excel-basics/learn/lesson-1-3"
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