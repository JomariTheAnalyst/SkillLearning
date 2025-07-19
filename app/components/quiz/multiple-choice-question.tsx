"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { CheckCircle, HelpCircle, X } from "lucide-react";

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
  explanation?: string;
}

interface MultipleChoiceQuestionProps {
  id: string;
  questionNumber: number;
  text: string;
  options: Option[];
  explanation?: string;
  showHints?: boolean;
  points?: number;
  onAnswerSubmit: (questionId: string, answerId: string, isCorrect: boolean) => void;
  isReview?: boolean;
  selectedOptionId?: string;
}

export function MultipleChoiceQuestion({
  id,
  questionNumber,
  text,
  options,
  explanation,
  showHints = false,
  points = 1,
  onAnswerSubmit,
  isReview = false,
  selectedOptionId,
}: MultipleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(selectedOptionId || null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(isReview);
  const [showExplanation, setShowExplanation] = useState(isReview);

  const handleOptionSelect = (optionId: string) => {
    if (isAnswerSubmitted || isReview) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (selectedOption && !isAnswerSubmitted) {
      const selectedOptionObj = options.find(opt => opt.id === selectedOption);
      const isCorrect = selectedOptionObj?.isCorrect || false;
      onAnswerSubmit(id, selectedOption, isCorrect);
      setIsAnswerSubmitted(true);
    }
  };

  const getCorrectOption = () => {
    return options.find(option => option.isCorrect)?.id || null;
  };

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

  const optionVariants: Variants = {
    hover: { scale: 1.02, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.05)" },
    tap: { scale: 0.98 },
    correct: { 
      backgroundColor: "rgba(34, 197, 94, 0.1)", 
      borderColor: "rgb(34, 197, 94)",
      transition: { duration: 0.3 }
    },
    incorrect: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      borderColor: "rgb(239, 68, 68)",
      transition: { duration: 0.3 }
    },
    selected: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgb(59, 130, 246)",
      transition: { duration: 0.3 }
    }
  };

  const getOptionState = (optionId: string) => {
    if (!isAnswerSubmitted && !isReview) {
      return selectedOption === optionId ? "selected" : "";
    }

    if (optionId === getCorrectOption()) {
      return "correct";
    }

    if (selectedOption === optionId && optionId !== getCorrectOption()) {
      return "incorrect";
    }

    return "";
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
          <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            Question {questionNumber}
          </span>
          {text}
        </h3>
        {points && (
          <span className="text-sm text-gray-500 font-medium">
            {points} {points === 1 ? "point" : "points"}
          </span>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <motion.div
            key={option.id}
            className={`
              border p-4 rounded-md cursor-pointer transition-colors
              ${isAnswerSubmitted || isReview
                ? getOptionState(option.id) === "correct"
                  ? "border-green-500 bg-green-50"
                  : getOptionState(option.id) === "incorrect"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
                : selectedOption === option.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
              }
            `}
            variants={optionVariants}
            whileHover={!isAnswerSubmitted && !isReview ? "hover" : undefined}
            whileTap={!isAnswerSubmitted && !isReview ? "tap" : undefined}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="flex justify-between items-center">
              <span>{option.text}</span>
              {(isAnswerSubmitted || isReview) && (
                <>
                  {option.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : selectedOption === option.id ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : null}
                </>
              )}
            </div>
            {(isAnswerSubmitted || isReview) && option.explanation && selectedOption === option.id && (
              <div className="mt-2 text-sm text-gray-600 border-t pt-2">
                {option.explanation}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {!isAnswerSubmitted && !isReview && (
        <div className="flex justify-between items-center">
          {showHints && (
            <button
              className="text-blue-600 text-sm flex items-center"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              {showExplanation ? "Hide Hint" : "Show Hint"}
            </button>
          )}
          <button
            className={`
              px-4 py-2 rounded-md text-white font-medium transition-colors
              ${selectedOption 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-300 cursor-not-allowed"
              }
            `}
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit Answer
          </button>
        </div>
      )}

      {(showExplanation && explanation) && (
        <motion.div
          className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <p className="text-sm text-gray-700">
            <span className="font-medium">Hint: </span>
            {explanation}
          </p>
        </motion.div>
      )}

      {isAnswerSubmitted && explanation && (
        <motion.div
          className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <p className="text-sm text-gray-700">
            <span className="font-medium">Explanation: </span>
            {explanation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
} 