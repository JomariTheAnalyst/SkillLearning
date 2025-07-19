"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Define the survey questions
const surveyQuestions = [
  {
    id: "name",
    question: "What's your full name?",
    type: "text",
    placeholder: "John Doe",
    validation: z.string().min(2, "Name must be at least 2 characters"),
    required: true,
  },
  {
    id: "age",
    question: "How old are you?",
    type: "number",
    placeholder: "25",
    validation: z.number().int().min(13, "You must be at least 13 years old").optional(),
    required: false,
  },
  {
    id: "educationLevel",
    question: "What's your highest level of education?",
    type: "select",
    options: [
      { value: "", label: "Select your education level" },
      { value: "High School", label: "High School" },
      { value: "Associate's Degree", label: "Associate's Degree" },
      { value: "Bachelor's Degree", label: "Bachelor's Degree" },
      { value: "Master's Degree", label: "Master's Degree" },
      { value: "Doctorate", label: "Doctorate" },
      { value: "Other", label: "Other" }
    ],
    validation: z.string().optional(),
    required: false,
  },
  {
    id: "profession",
    question: "What's your current profession?",
    type: "text",
    placeholder: "Software Developer",
    validation: z.string().min(2, "Profession must be at least 2 characters"),
    required: true,
  },
  {
    id: "careerGoals",
    question: "What are your career goals?",
    type: "textarea",
    placeholder: "I want to become a senior developer in the next 3 years...",
    validation: z.string().min(10, "Please provide more details about your career goals"),
    required: true,
  },
  {
    id: "learningStyle",
    question: "What's your preferred learning style?",
    type: "radio",
    options: [
      { value: "VISUAL", label: "Visual - I learn best through images and diagrams" },
      { value: "AUDITORY", label: "Auditory - I learn best by listening and discussing" },
      { value: "READING", label: "Reading - I learn best by reading text and articles" },
      { value: "KINESTHETIC", label: "Kinesthetic - I learn best through hands-on practice" }
    ],
    validation: z.enum(["VISUAL", "AUDITORY", "READING", "KINESTHETIC"]),
    required: true,
  },
  {
    id: "timeAvailability",
    question: "How much time can you dedicate to learning each week?",
    type: "select",
    options: [
      { value: "", label: "Select time availability" },
      { value: "Less than 5 hours", label: "Less than 5 hours" },
      { value: "5-10 hours", label: "5-10 hours" },
      { value: "10-20 hours", label: "10-20 hours" },
      { value: "More than 20 hours", label: "More than 20 hours" }
    ],
    validation: z.string().min(2, "Please specify your time availability"),
    required: true,
  }
];

// Create a schema based on all questions
const createSchema = () => {
  const schemaMap = {};
  surveyQuestions.forEach(q => {
    if (q.id === "age") {
      schemaMap[q.id] = q.validation;
    } else {
      schemaMap[q.id] = q.required ? q.validation : q.validation.optional();
    }
  });
  return z.object(schemaMap);
};

const surveySchema = createSchema();
type SurveyFormValues = z.infer<typeof surveySchema>;

// Progress bar component
const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
        <motion.div
        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

// Question component
const QuestionComponent = ({ 
  question, 
  register, 
  errors, 
  currentValue,
  setValue
}: { 
  question: any; 
  register: any; 
  errors: any;
  currentValue: any;
  setValue: any;
}) => {
  useEffect(() => {
    // Initialize radio buttons with current value
    if (question.type === "radio" && currentValue) {
      setValue(question.id, currentValue);
    }
  }, [question.id, currentValue, setValue]);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-2">{question.question}</h2>
      
      {question.type === "text" && (
          <input
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder={question.placeholder}
          defaultValue={currentValue || ""}
          {...register(question.id, {
            required: question.required ? `${question.id} is required` : false,
          })}
        />
      )}
      
      {question.type === "number" && (
          <input
            type="number"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder={question.placeholder}
          defaultValue={currentValue || ""}
          {...register(question.id, {
            valueAsNumber: true,
            required: question.required ? `${question.id} is required` : false,
          })}
        />
      )}
      
      {question.type === "textarea" && (
        <textarea
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[150px]"
          placeholder={question.placeholder}
          defaultValue={currentValue || ""}
          {...register(question.id, {
            required: question.required ? `${question.id} is required` : false,
          })}
        />
      )}
      
      {question.type === "select" && (
          <select
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          defaultValue={currentValue || ""}
          {...register(question.id, {
            required: question.required ? `${question.id} is required` : false,
          })}
        >
          {question.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      
      {question.type === "radio" && (
        <div className="space-y-3">
          {question.options.map((option) => (
            <label 
              key={option.value} 
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                currentValue === option.value 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                className="hidden"
                {...register(question.id, {
                  required: question.required ? `${question.id} is required` : false,
                })}
                onChange={() => setValue(question.id, option.value)}
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                currentValue === option.value 
                  ? 'border-blue-500' 
                  : 'border-gray-400 dark:border-gray-500'
              }`}>
                {currentValue === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                )}
              </div>
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}
      
      {errors[question.id] && (
        <p className="text-red-500 text-sm mt-1">{errors[question.id].message}</p>
      )}
    </motion.div>
  );
};

// Success Animation
const SuccessAnimation = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, times: [0, 0.8, 1] }}
      >
        <svg
          className="w-12 h-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>
      
      <motion.h2
        className="text-3xl font-bold mb-3 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Profile Complete!
      </motion.h2>
      
      <motion.p
        className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Your personalized learning journey is ready
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <p className="text-gray-500 dark:text-gray-400">
          Redirecting to your dashboard...
        </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main onboarding component
export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<SurveyFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(surveySchema),
    defaultValues: formData,
    mode: "onChange"
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }
  }, [status]);

  // Handle next question
  const handleNextQuestion = (data: Partial<SurveyFormValues>) => {
    const currentQuestionId = surveyQuestions[currentQuestionIndex].id;
    const updatedData = { ...formData, [currentQuestionId]: data[currentQuestionId] };
    setFormData(updatedData);
    
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinalSubmit(updatedData as SurveyFormValues);
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit all data
  const handleFinalSubmit = async (data: SurveyFormValues) => {
    setIsSubmitting(true);

    try {
      console.log("Submitting profile data:", data);
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save profile data");
      }

      // Set onboarding as complete
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompleted: true }),
      });

      setIsComplete(true);
      toast.success("Profile completed successfully!");
      
      // Redirect to dashboard after success
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
      
    } catch (error) {
      console.error("Profile submission error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Get current question
  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === surveyQuestions.length - 1;
  const currentValue = formData[currentQuestion?.id as keyof SurveyFormValues];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-850 shadow-lg rounded-xl p-8 md:p-10">
          {!isComplete ? (
            <>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {surveyQuestions.length}
                  </span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {Math.round((currentQuestionIndex + 1) / surveyQuestions.length * 100)}% Complete
                  </span>
                </div>
                <ProgressBar 
                  currentStep={currentQuestionIndex + 1} 
                  totalSteps={surveyQuestions.length} 
                />
              </div>
              
              <form onSubmit={handleSubmit(handleNextQuestion)}>
          <AnimatePresence mode="wait">
                  <QuestionComponent 
                    key={currentQuestion.id}
                    question={currentQuestion}
                    register={register}
                    errors={errors}
                    currentValue={currentValue}
                    setValue={setValue}
                  />
                </AnimatePresence>
                
                <div className="flex justify-between mt-8">
                  <motion.button
                    type="button"
                    onClick={handlePreviousQuestion}
                    className={`px-6 py-3 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition-all ${
                      currentQuestionIndex === 0 
                        ? 'opacity-0 cursor-default' 
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    disabled={currentQuestionIndex === 0}
                    whileHover={{ scale: currentQuestionIndex === 0 ? 1 : 1.02 }}
                    whileTap={{ scale: currentQuestionIndex === 0 ? 1 : 0.98 }}
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        <span>{isLastQuestion ? "Saving..." : "Next..."}</span>
                      </div>
                    ) : (
                      <>{isLastQuestion ? "Complete Profile" : "Next"}</>
                    )}
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <SuccessAnimation />
          )}
        </div>
      </div>
    </div>
  );
} 