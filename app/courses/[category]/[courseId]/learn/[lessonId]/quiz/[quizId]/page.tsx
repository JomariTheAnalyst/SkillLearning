"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Award, ChevronLeft, AlertTriangle, BarChart, ChevronRight, Flag } from "lucide-react";
import Link from "next/link";
import { MultipleChoiceQuestion } from "@/app/components/quiz/multiple-choice-question";
import { CodeChallengeQuestion } from "@/app/components/quiz/code-challenge-question";

// Mock quiz data - in a real app, this would come from the database
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

interface QuizPageProps {
  params: {
    category: string;
    courseId: string;
    lessonId: string;
    quizId: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const router = useRouter();
  const { category, courseId, lessonId, quizId } = params;
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // In a real app, this would be an API call
    const quizData = getMockQuiz(quizId);
    setQuiz(quizData);
    
    if (quizData.timeLimit) {
      setTimeRemaining(quizData.timeLimit * 60); // Convert to seconds
    }
    
    const totalPts = quizData.questions.reduce((sum: number, q: any) => sum + (q.points || 1), 0);
    setTotalPoints(totalPts);
    
    setLoading(false);
  }, [quizId]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time runs out
          if (!quizCompleted) {
            handleQuizSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerSubmit = (questionId: string, answerId: string, isCorrect: boolean, pointsEarned?: number) => {
    const question = quiz.questions[currentQuestionIndex];
    const points = pointsEarned !== undefined ? pointsEarned : (isCorrect ? (question.points || 1) : 0);
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        answerId,
        isCorrect,
        points
      }
    }));
  };

  const handleQuizSubmit = () => {
    // Calculate the score
    let totalEarned = 0;
    
    Object.values(answers).forEach((answer: any) => {
      totalEarned += answer.points || 0;
    });
    
    const calculatedScore = Math.round((totalEarned / totalPoints) * 100);
    setScore(calculatedScore);
    setQuizCompleted(true);
    
    // In a real app, you would save the results to the database here
    console.log("Quiz submitted", {
      quizId,
      score: calculatedScore,
      answers,
      timeTaken: quiz.timeLimit ? (quiz.timeLimit * 60) - (timeRemaining || 0) : null
    });
  };

  const navigateToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const navigateToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (quizCompleted) {
    const isPassed = score >= quiz.passingScore;
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link 
            href={`/courses/${category}/${courseId}/learn/${lessonId}`}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Lesson
          </Link>
        </div>
        
        <motion.div
          className="border rounded-lg overflow-hidden shadow-lg bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
          
          <div className="p-6">
            <div className="flex justify-center mb-8">
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{score}%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={isPassed ? "#22c55e" : "#ef4444"}
                    strokeWidth="3"
                    strokeDasharray={`${score}, 100`}
                  />
                </svg>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold flex items-center justify-center">
                {isPassed ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Quiz Passed!
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    Quiz Failed
                  </>
                )}
              </h2>
              <p className="text-gray-600 mt-2">
                {isPassed 
                  ? "Congratulations! You've successfully completed this quiz." 
                  : `You didn't meet the passing score of ${quiz.passingScore}%. Try again!`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">Correct Answers</span>
                </div>
                <p className="text-2xl font-bold">
                  {Object.values(answers).filter((a: any) => a.isCorrect).length} / {quiz.questions.length}
                </p>
              </div>
              
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-medium">Points Earned</span>
                </div>
                <p className="text-2xl font-bold">
                  {Object.values(answers).reduce((sum: number, a: any) => sum + (a.points || 0), 0)} / {totalPoints}
                </p>
              </div>
              
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">Time Taken</span>
                </div>
                <p className="text-2xl font-bold">
                  {quiz.timeLimit 
                    ? formatTime((quiz.timeLimit * 60) - (timeRemaining || 0))
                    : "N/A"}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Link
                href={`/courses/${category}/${courseId}/learn/${lessonId}`}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Lesson
              </Link>
              
              <button
                onClick={() => {
                  setQuizCompleted(false);
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  if (quiz.timeLimit) {
                    setTimeRemaining(quiz.timeLimit * 60);
                  }
                }}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Retake Quiz
              </button>
              
              <Link
                href={`/courses/${category}/${courseId}/learn/${lessonId}/quiz/${quizId}/review`}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Review Answers
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const hasAnsweredCurrentQuestion = answers[currentQuestion.id] !== undefined;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href={`/courses/${category}/${courseId}/learn/${lessonId}`}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Exit Quiz
        </Link>
        
        {timeRemaining !== null && (
          <div className={`flex items-center text-sm font-medium ${
            timeRemaining < 60 ? 'text-red-600' : 'text-gray-600'
          }`}>
            <Clock className="h-4 w-4 mr-1" />
            Time Remaining: {formatTime(timeRemaining)}
          </div>
        )}
      </div>
      
      <div className="border rounded-lg overflow-hidden shadow-lg bg-white mb-6">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-gray-600">{quiz.description}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                quiz.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                quiz.difficulty === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                quiz.difficulty === 'HARD' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {quiz.difficulty.charAt(0) + quiz.difficulty.slice(1).toLowerCase()}
              </span>
              
              <span className="text-sm text-gray-600">
                {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}
              </span>
              
              <span className="text-sm text-gray-600">
                Passing: {quiz.passingScore}%
              </span>
            </div>
            
            <div className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                <MultipleChoiceQuestion
                  id={currentQuestion.id}
                  questionNumber={currentQuestionIndex + 1}
                  text={currentQuestion.text}
                  options={currentQuestion.options}
                  explanation={currentQuestion.explanation}
                  showHints={true}
                  points={currentQuestion.points}
                  onAnswerSubmit={handleAnswerSubmit}
                  selectedOptionId={answers[currentQuestion.id]?.answerId}
                />
              )}
              
              {currentQuestion.type === 'CODE_CHALLENGE' && (
                <CodeChallengeQuestion
                  id={currentQuestion.id}
                  questionNumber={currentQuestionIndex + 1}
                  text={currentQuestion.text}
                  codeSnippet={currentQuestion.codeSnippet}
                  language={currentQuestion.language}
                  explanation={currentQuestion.explanation}
                  expectedOutput={currentQuestion.expectedOutput}
                  hints={currentQuestion.hints}
                  points={currentQuestion.points}
                  onAnswerSubmit={(questionId, code, isCorrect, pointsEarned) => 
                    handleAnswerSubmit(questionId, code, isCorrect, pointsEarned)
                  }
                  submittedCode={answers[currentQuestion.id]?.answerId}
                />
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-between mt-6">
            <button
              onClick={navigateToPrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`
                flex items-center px-4 py-2 rounded-md font-medium
                ${currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleQuizSubmit}
                className="flex items-center px-4 py-2 rounded-md text-white font-medium bg-green-600 hover:bg-green-700"
                disabled={Object.keys(answers).length < quiz.questions.length}
              >
                <Flag className="h-4 w-4 mr-2" />
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={navigateToNextQuestion}
                className={`
                  flex items-center px-4 py-2 rounded-md font-medium
                  ${hasAnsweredCurrentQuestion
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-700 bg-gray-200'
                  }
                `}
                disabled={!hasAnsweredCurrentQuestion}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 border rounded-md bg-yellow-50 border-yellow-200">
        <div className="flex items-start">
          <BarChart className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Quiz Progress</h3>
            <p className="text-sm text-yellow-700 mt-1">
              You've answered {Object.keys(answers).length} of {quiz.questions.length} questions.
              {Object.keys(answers).length < quiz.questions.length &&
                " Make sure to answer all questions before submitting."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 