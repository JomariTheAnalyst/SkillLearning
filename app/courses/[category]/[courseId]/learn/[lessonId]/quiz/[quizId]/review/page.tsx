"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, X, HelpCircle } from "lucide-react";
import Link from "next/link";
import { MultipleChoiceQuestion } from "@/app/components/quiz/multiple-choice-question";
import { CodeChallengeQuestion } from "@/app/components/quiz/code-challenge-question";

// Reuse the same mock quiz data function from the quiz page
const getMockQuiz = (quizId: string) => {
  return {
    id: quizId,
    title: "JavaScript Fundamentals Quiz",
    description: "Test your knowledge of JavaScript fundamentals.",
    lessonId: "lesson-1",
    courseId: "course-1",
    category: "web-development",
    passingScore: 70,
    timeLimit: 10, // minutes
    difficulty: "MEDIUM" as const,
    questions: [
      {
        id: "q1",
        type: "MULTIPLE_CHOICE",
        text: "What is the correct way to declare a JavaScript variable?",
        options: [
          { id: "o1", text: "var myVar = 5;", isCorrect: true },
          { id: "o2", text: "variable myVar = 5;", isCorrect: false },
          { id: "o3", text: "v myVar = 5;", isCorrect: false },
          { id: "o4", text: "int myVar = 5;", isCorrect: false },
        ],
        explanation: "In JavaScript, variables can be declared using var, let, or const keywords.",
        points: 1
      },
      {
        id: "q2",
        type: "MULTIPLE_CHOICE",
        text: "Which of the following is NOT a JavaScript data type?",
        options: [
          { id: "o1", text: "String", isCorrect: false },
          { id: "o2", text: "Boolean", isCorrect: false },
          { id: "o3", text: "Float", isCorrect: true, explanation: "JavaScript has Number type, not Float and Integer separately." },
          { id: "o4", text: "Object", isCorrect: false },
        ],
        explanation: "JavaScript has six primitive data types: String, Number, Boolean, Undefined, Null, and Symbol. Additionally, it has the Object reference type.",
        points: 2
      },
      {
        id: "q3",
        type: "CODE_CHALLENGE",
        text: "Write a function that returns the sum of two numbers.",
        codeSnippet: `function addNumbers(a, b) {\n  // TODO: Implement this function\n  \n}`,
        language: "javascript",
        explanation: "This function should take two parameters and return their sum.",
        expectedOutput: "addNumbers(5, 3) should return 8",
        hints: [
          "Remember to use the return keyword to return a value from a function.",
          "You can add two numbers using the + operator.",
          "The function should work for any two numbers."
        ],
        points: 3
      }
    ]
  };
};

// Mock user answers - in a real app, this would come from a database or state
const getMockAnswers = () => {
  return {
    "q1": {
      answerId: "o1",
      isCorrect: true,
      points: 1
    },
    "q2": {
      answerId: "o2", // Incorrect answer
      isCorrect: false,
      points: 0
    },
    "q3": {
      answerId: "function addNumbers(a, b) {\n  return a + b;\n}", // Code submission
      isCorrect: true,
      points: 3
    }
  };
};

interface ReviewPageProps {
  params: {
    category: string;
    courseId: string;
    lessonId: string;
    quizId: string;
  };
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const { category, courseId, lessonId, quizId } = params;
  const [quiz, setQuiz] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // In a real app, these would be API calls
    const quizData = getMockQuiz(quizId);
    const answers = getMockAnswers();
    
    setQuiz(quizData);
    setUserAnswers(answers);
    
    // Calculate score
    const totalPoints = quizData.questions.reduce((sum: number, q: any) => sum + (q.points || 1), 0);
    const earnedPoints = Object.values(answers).reduce((sum: number, a: any) => sum + (a.points || 0), 0);
    setScore(Math.round((earnedPoints / totalPoints) * 100));
    
    setLoading(false);
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link 
          href={`/courses/${category}/${courseId}/learn/${lessonId}/quiz/${quizId}`}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Results
        </Link>
        
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Your Score:</span>
          <span className={`px-2 py-1 rounded-md text-white font-medium ${
            score >= quiz.passingScore ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {score}%
          </span>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden shadow-lg bg-white mb-6">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold mb-2">{quiz.title} - Review</h1>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-sm font-medium">Correct</span>
            </div>
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-600 mr-1" />
              <span className="text-sm font-medium">Incorrect</span>
            </div>
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 text-blue-600 mr-1" />
              <span className="text-sm font-medium">Explanation</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {quiz.questions.map((question: any, index: number) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-2 flex items-center">
                <span className="bg-gray-200 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  Question {index + 1}
                </span>
                {userAnswers[question.id]?.isCorrect ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Correct
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
                    <X className="h-3 w-3 mr-1" />
                    Incorrect
                  </span>
                )}
                <span className="text-xs text-gray-600">
                  {userAnswers[question.id]?.points || 0} / {question.points || 1} points
                </span>
              </div>
              
              {question.type === 'MULTIPLE_CHOICE' && (
                <MultipleChoiceQuestion
                  id={question.id}
                  questionNumber={index + 1}
                  text={question.text}
                  options={question.options}
                  explanation={question.explanation}
                  points={question.points}
                  onAnswerSubmit={() => {}}
                  isReview={true}
                  selectedOptionId={userAnswers[question.id]?.answerId}
                />
              )}
              
              {question.type === 'CODE_CHALLENGE' && (
                <CodeChallengeQuestion
                  id={question.id}
                  questionNumber={index + 1}
                  text={question.text}
                  codeSnippet={question.codeSnippet}
                  language={question.language}
                  explanation={question.explanation}
                  expectedOutput={question.expectedOutput}
                  hints={question.hints}
                  points={question.points}
                  onAnswerSubmit={() => {}}
                  isReview={true}
                  submittedCode={userAnswers[question.id]?.answerId}
                  submissionResult={{
                    isCorrect: userAnswers[question.id]?.isCorrect || false,
                    output: "Your function correctly returns the sum of two numbers.",
                    feedback: userAnswers[question.id]?.isCorrect 
                      ? "Great job! Your solution works correctly."
                      : "Your solution doesn't return the correct sum. Try again.",
                    pointsEarned: userAnswers[question.id]?.points || 0
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Link
          href={`/courses/${category}/${courseId}/learn/${lessonId}/quiz/${quizId}`}
          className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Results
        </Link>
        
        <Link
          href={`/courses/${category}/${courseId}/learn/${lessonId}`}
          className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <ChevronRight className="h-4 w-4 mr-2" />
          Continue Learning
        </Link>
      </div>
    </div>
  );
} 