"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { CheckCircle, Code, HelpCircle, Terminal, AlertTriangle } from "lucide-react";
import Editor from "@monaco-editor/react";

interface CodeChallengeQuestionProps {
  id: string;
  questionNumber: number;
  text: string;
  codeSnippet: string;
  language: string;
  explanation?: string;
  expectedOutput?: string;
  hints?: string[];
  points?: number;
  onAnswerSubmit: (questionId: string, code: string, isCorrect: boolean, pointsEarned: number) => void;
  isReview?: boolean;
  submittedCode?: string;
  submissionResult?: {
    isCorrect: boolean;
    output: string;
    feedback: string;
    pointsEarned: number;
  };
}

export function CodeChallengeQuestion({
  id,
  questionNumber,
  text,
  codeSnippet,
  language,
  explanation,
  expectedOutput,
  hints = [],
  points = 5,
  onAnswerSubmit,
  isReview = false,
  submittedCode,
  submissionResult,
}: CodeChallengeQuestionProps) {
  const [code, setCode] = useState<string>(submittedCode || codeSnippet);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(isReview);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [output, setOutput] = useState(submissionResult?.output || "");
  const [feedback, setFeedback] = useState(submissionResult?.feedback || "");
  const [isCorrect, setIsCorrect] = useState(submissionResult?.isCorrect || false);
  const [pointsEarned, setPointsEarned] = useState(submissionResult?.pointsEarned || 0);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring" as const, 
        stiffness: 120, 
        damping: 20 
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const simulateCodeExecution = async () => {
    // This is a simulation since we can't actually run code on the client
    // In a real implementation, you'd send the code to a server for execution
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
    
    // Simple simulation - check if code includes some expected patterns
    // In a real implementation, you'd have proper code evaluation
    const testResults = {
      isCorrect: code.includes("return") && !code.includes("// TODO"),
      output: "Simulation output based on your code...",
      feedback: code.includes("return") 
        ? "Good job! Your solution includes a return statement."
        : "Make sure your function returns a value.",
      pointsEarned: code.includes("return") && !code.includes("// TODO") ? points : Math.floor(points / 2),
    };
    
    setOutput(testResults.output);
    setFeedback(testResults.feedback);
    setIsCorrect(testResults.isCorrect);
    setPointsEarned(testResults.pointsEarned);
    setIsAnswerSubmitted(true);
    setIsSubmitting(false);
    
    onAnswerSubmit(id, code, testResults.isCorrect, testResults.pointsEarned);
  };

  const handleNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevHint = () => {
    if (currentHintIndex > 0) {
      setCurrentHintIndex(prevIndex => prevIndex - 1);
    }
  };

  return (
    <motion.div
      className="border rounded-lg p-6 mb-6 bg-white shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            Coding Challenge {questionNumber}
          </span>
          <Code className="h-4 w-4 mr-2 text-purple-600" />
          {text}
        </h3>
        {points && (
          <span className="text-sm text-gray-500 font-medium">
            {points} {points === 1 ? "point" : "points"}
          </span>
        )}
      </div>

      {explanation && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-700">{explanation}</p>
        </div>
      )}

      {expectedOutput && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Expected Output:</h4>
          <div className="p-3 bg-gray-800 text-gray-200 rounded-md overflow-x-auto">
            <code className="text-sm">{expectedOutput}</code>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Code Editor:</h4>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">Language: {language}</span>
        </div>
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <Editor
            height="300px"
            language={language.toLowerCase()}
            value={code}
            onChange={handleCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              readOnly: isReview,
              lineNumbers: "on",
              wordWrap: "on",
            }}
            theme="vs-dark"
          />
        </div>
      </div>

      {isAnswerSubmitted && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Results:</h4>
          <div className="p-4 rounded-md border mb-2 bg-gray-50">
            <div className="flex items-start space-x-2">
              <div className={`p-1 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {isCorrect ? "Solution passed!" : "Solution needs improvement"}
                </p>
                <p className="text-sm text-gray-600">{feedback}</p>
                <p className="text-sm font-medium mt-1">
                  Points earned: {pointsEarned} / {points}
                </p>
              </div>
            </div>
          </div>
          
          {output && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2">Output:</h4>
              <div className="p-3 bg-gray-800 text-gray-200 rounded-md overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">{output}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {hints.length > 0 && (
        <div className="mb-4">
          <button
            className="text-purple-600 text-sm flex items-center"
            onClick={() => setShowHint(!showHint)}
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            {showHint ? "Hide Hints" : "Show Hints"}
          </button>
          
          {showHint && (
            <motion.div
              className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-md"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Hint {currentHintIndex + 1} of {hints.length}:</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevHint}
                    disabled={currentHintIndex === 0}
                    className={`text-xs px-2 py-1 rounded ${
                      currentHintIndex === 0 
                        ? "bg-gray-100 text-gray-400" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextHint}
                    disabled={currentHintIndex === hints.length - 1}
                    className={`text-xs px-2 py-1 rounded ${
                      currentHintIndex === hints.length - 1 
                        ? "bg-gray-100 text-gray-400" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700">{hints[currentHintIndex]}</p>
            </motion.div>
          )}
        </div>
      )}

      {!isReview && (
        <div className="flex justify-end">
          <button
            className={`
              flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors
              ${isSubmitting || isAnswerSubmitted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
              }
            `}
            onClick={simulateCodeExecution}
            disabled={isSubmitting || isAnswerSubmitted}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Running...
              </>
            ) : (
              <>
                <Terminal className="h-4 w-4 mr-2" />
                {isAnswerSubmitted ? "Submitted" : "Run & Submit"}
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
} 