"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  BookOpen, 
  Code, 
  Trophy, 
  Star, 
  Clock, 
  Target, 
  ChevronRight,
  Lightbulb,
  CheckCircle,
  XCircle,
  Zap,
  Award,
  Brain
} from 'lucide-react';

interface LessonData {
  overview: {
    title: string;
    objectives: string[];
    estimatedTime: number;
    prerequisites: string[];
  };
  sections: {
    id: string;
    type: 'content' | 'example' | 'practice' | 'quiz';
    title: string;
    content: string;
    metadata?: any;
  }[];
  practiceExercises: {
    id: string;
    title: string;
    description: string;
    type: 'code' | 'query' | 'formula';
    initialCode?: string;
    sampleData?: string;
    expectedOutput?: string;
    hints: string[];
    difficulty: string;
  }[];
  quiz: {
    questions: {
      id: string;
      question: string;
      type: 'multiple_choice' | 'fill_blank' | 'code_completion';
      options?: string[];
      answer: string | string[];
      explanation: string;
      difficulty: string;
    }[];
  };
  gamification: {
    xpReward: number;
    badges: string[];
    achievements: string[];
  };
  nextSteps: {
    recommendations: string[];
    relatedTopics: string[];
  };
}

interface AILessonGeneratorProps {
  courseId: string;
  lessonId: string;
  topic: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  onLessonComplete?: (score: number, xpEarned: number) => void;
}

const AILessonGenerator: React.FC<AILessonGeneratorProps> = ({
  courseId,
  lessonId,
  topic,
  difficulty,
  onLessonComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [practiceResults, setPracticeResults] = useState<Record<string, boolean>>({});
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const generateLesson = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/lessons/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          topic,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson');
      }

      const result = await response.json();
      setLessonData(result.data);
    } catch (error) {
      console.error('Error generating lesson:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startLesson = () => {
    setHasStarted(true);
    setCurrentSection(0);
  };

  const handlePracticeComplete = (exerciseId: string, isCorrect: boolean) => {
    setPracticeResults(prev => ({
      ...prev,
      [exerciseId]: isCorrect
    }));

    if (isCorrect) {
      setXpEarned(prev => prev + 25);
    }
  };

  const handleQuizComplete = (questionId: string, isCorrect: boolean) => {
    setQuizResults(prev => ({
      ...prev,
      [questionId]: isCorrect
    }));

    if (isCorrect) {
      setXpEarned(prev => prev + 15);
    }
  };

  const calculateFinalScore = () => {
    const practiceScore = Object.values(practiceResults).filter(Boolean).length;
    const quizScore = Object.values(quizResults).filter(Boolean).length;
    const totalExercises = (lessonData?.practiceExercises.length || 0) + (lessonData?.quiz.questions.length || 0);
    
    return totalExercises > 0 ? Math.round(((practiceScore + quizScore) / totalExercises) * 100) : 0;
  };

  const completeLesson = () => {
    const finalScore = calculateFinalScore();
    const bonusXP = lessonData?.gamification.xpReward || 0;
    const finalXP = xpEarned + bonusXP;
    
    setTotalScore(finalScore);
    setXpEarned(finalXP);
    setShowCelebration(true);
    
    onLessonComplete?.(finalScore, finalXP);
  };

  if (!lessonData && !isGenerating) {
    return (
      <LessonOverview
        topic={topic}
        difficulty={difficulty}
        onBeginLesson={generateLesson}
        isGenerating={isGenerating}
      />
    );
  }

  if (isGenerating) {
    return <LessonGenerationLoader />;
  }

  if (!hasStarted && lessonData) {
    return (
      <LessonIntroduction 
        lessonData={lessonData} 
        onStartLesson={startLesson}
      />
    );
  }

  if (showCelebration) {
    return (
      <LessonCelebration
        score={totalScore}
        xpEarned={xpEarned}
        badges={lessonData?.gamification.badges || []}
        achievements={lessonData?.gamification.achievements || []}
        nextSteps={lessonData?.nextSteps}
      />
    );
  }

  return (
    <InteractiveLessonContent
      lessonData={lessonData!}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      onPracticeComplete={handlePracticeComplete}
      onQuizComplete={handleQuizComplete}
      onLessonComplete={completeLesson}
      practiceResults={practiceResults}
      quizResults={quizResults}
    />
  );
};

const LessonOverview: React.FC<{
  topic: string;
  difficulty: string;
  onBeginLesson: () => void;
  isGenerating: boolean;
}> = ({ topic, difficulty, onBeginLesson, isGenerating }) => (
  <div className="max-w-4xl mx-auto p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
          <Brain className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">AI-Powered Learning Experience</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Get ready to learn <span className="font-semibold text-blue-600">{topic}</span> at the {difficulty.toLowerCase()} level
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
          <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Personalized Content</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">AI generates content tailored to your learning style</p>
        </div>
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
          <Code className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Interactive Practice</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Hands-on exercises and real-world scenarios</p>
        </div>
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
          <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Gamified Learning</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Earn XP, badges, and track your progress</p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onBeginLesson}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center mx-auto gap-2 transition-all transform hover:scale-105"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating Your Lesson...
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Begin AI Lesson
            </>
          )}
        </button>
      </div>
    </motion.div>
  </div>
);

const LessonGenerationLoader: React.FC = () => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="text-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-full mb-6"
      >
        <Brain className="h-10 w-10" />
      </motion.div>
      
      <h2 className="text-2xl font-bold mb-4">Creating Your Personalized Lesson</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Our AI is crafting engaging content, interactive exercises, and practice scenarios just for you...
      </p>
      
      <div className="max-w-md mx-auto">
        <div className="space-y-3">
          {[
            "Analyzing your learning preferences...",
            "Generating interactive content...",
            "Creating practice exercises...",
            "Preparing quiz questions...",
            "Adding gamification elements..."
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.5 }}
              className="flex items-center gap-3 text-left"
            >
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const LessonIntroduction: React.FC<{
  lessonData: LessonData;
  onStartLesson: () => void;
}> = ({ lessonData, onStartLesson }) => (
  <div className="max-w-4xl mx-auto p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">{lessonData.overview.title}</h1>
        <div className="flex items-center gap-4 text-blue-100">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{lessonData.overview.estimatedTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>+{lessonData.gamification.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Learning Objectives
            </h2>
            <ul className="space-y-2">
              {lessonData.overview.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              What You'll Earn
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{lessonData.gamification.xpReward} Experience Points</span>
              </div>
              {lessonData.gamification.badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{badge} Badge</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {lessonData.overview.prerequisites.length > 0 && (
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Prerequisites</h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300">
              {lessonData.overview.prerequisites.map((prereq, index) => (
                <li key={index}>• {prereq}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={onStartLesson}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center mx-auto gap-2 transition-all transform hover:scale-105"
          >
            <BookOpen className="h-5 w-5" />
            Start Learning
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);

const InteractiveLessonContent: React.FC<{
  lessonData: LessonData;
  currentSection: number;
  onSectionChange: (section: number) => void;
  onPracticeComplete: (exerciseId: string, isCorrect: boolean) => void;
  onQuizComplete: (questionId: string, isCorrect: boolean) => void;
  onLessonComplete: () => void;
  practiceResults: Record<string, boolean>;
  quizResults: Record<string, boolean>;
}> = ({ 
  lessonData, 
  currentSection, 
  onSectionChange, 
  onPracticeComplete, 
  onQuizComplete, 
  onLessonComplete,
  practiceResults,
  quizResults 
}) => {
  const totalSections = lessonData.sections.length + lessonData.practiceExercises.length + 1; // +1 for quiz
  const progress = ((currentSection + 1) / totalSections) * 100;
  
  const renderCurrentContent = () => {
    if (currentSection < lessonData.sections.length) {
      const section = lessonData.sections[currentSection];
      return (
        <ContentSection 
          section={section} 
          onNext={() => onSectionChange(currentSection + 1)}
          isLast={currentSection === totalSections - 1}
        />
      );
    } else if (currentSection < lessonData.sections.length + lessonData.practiceExercises.length) {
      const exerciseIndex = currentSection - lessonData.sections.length;
      const exercise = lessonData.practiceExercises[exerciseIndex];
      return (
        <PracticeExercise
          exercise={exercise}
          onComplete={(isCorrect) => {
            onPracticeComplete(exercise.id, isCorrect);
            if (currentSection < totalSections - 1) {
              onSectionChange(currentSection + 1);
            }
          }}
          result={practiceResults[exercise.id]}
        />
      );
    } else {
      return (
        <QuizSection
          quiz={lessonData.quiz}
          onComplete={onLessonComplete}
          onAnswerSubmit={onQuizComplete}
          results={quizResults}
        />
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Lesson Progress</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-blue-600 h-2 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderCurrentContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ContentSection: React.FC<{
  section: LessonData['sections'][0];
  onNext: () => void;
  isLast: boolean;
}> = ({ section, onNext, isLast }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
    <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
    <div 
      className="prose dark:prose-invert max-w-none mb-8"
      dangerouslySetInnerHTML={{ __html: section.content }}
    />
    
    <div className="flex justify-end">
      <button
        onClick={onNext}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
      >
        Continue
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);

const PracticeExercise: React.FC<{
  exercise: LessonData['practiceExercises'][0];
  onComplete: (isCorrect: boolean) => void;
  result?: boolean;
}> = ({ exercise, onComplete, result }) => {
  const [code, setCode] = useState(exercise.initialCode || '');
  const [showHints, setShowHints] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    const isCorrect = code.toLowerCase().includes(exercise.expectedOutput?.toLowerCase() || '');
    setIsSubmitted(true);
    onComplete(isCorrect);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Code className="h-6 w-6 text-purple-600" />
        {exercise.title}
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">{exercise.description}</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Your Code</h3>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-40 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
            placeholder="Write your code here..."
          />
        </div>
        
        {exercise.sampleData && (
          <div>
            <h3 className="font-semibold mb-2">Sample Data</h3>
            <pre className="text-xs p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto h-40">
              {exercise.sampleData}
            </pre>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setShowHints(!showHints)}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Lightbulb className="h-4 w-4" />
          {showHints ? 'Hide' : 'Show'} Hints
        </button>
        
        <div className="flex items-center gap-3">
          {result !== undefined && (
            <div className={`flex items-center gap-1 ${result ? 'text-green-600' : 'text-red-600'}`}>
              {result ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {result ? 'Correct!' : 'Try again'}
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
      
      {showHints && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
        >
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Hints</h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            {exercise.hints.map((hint, index) => (
              <li key={index}>• {hint}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

const QuizSection: React.FC<{
  quiz: LessonData['quiz'];
  onComplete: () => void;
  onAnswerSubmit: (questionId: string, isCorrect: boolean) => void;
  results: Record<string, boolean>;
}> = ({ quiz, onComplete, onAnswerSubmit, results }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const question = quiz.questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: answer }));
    
    const isCorrect = answer === question.answer;
    onAnswerSubmit(question.id, isCorrect);
    
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  if (showResults) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You answered {Object.values(results).filter(Boolean).length} out of {quiz.questions.length} questions correctly.
        </p>
        <button
          onClick={onComplete}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
        >
          Complete Lesson
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Quiz Time!</h2>
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-6">{question.question}</h3>
      
      {question.type === 'multiple_choice' && question.options && (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={!!answers[question.id]}
              className={`w-full text-left p-4 border rounded-lg transition-all ${
                answers[question.id] === option
                  ? option === question.answer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      
      {question.type === 'fill_blank' && (
        <div>
          <input
            type="text"
            placeholder="Type your answer here"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg mb-4"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAnswer(e.currentTarget.value);
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input') as HTMLInputElement;
              if (input) handleAnswer(input.value);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Submit Answer
          </button>
        </div>
      )}
      
      {answers[question.id] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
        >
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Explanation</h4>
          <p className="text-blue-700 dark:text-blue-300">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
};

const LessonCelebration: React.FC<{
  score: number;
  xpEarned: number;
  badges: string[];
  achievements: string[];
  nextSteps?: LessonData['nextSteps'];
}> = ({ score, xpEarned, badges, achievements, nextSteps }) => (
  <div className="max-w-4xl mx-auto p-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="inline-flex items-center justify-center w-20 h-20 bg-green-500 text-white rounded-full mb-6"
      >
        <Trophy className="h-10 w-10" />
      </motion.div>
      
      <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        You've successfully completed this AI-generated lesson!
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">{score}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Final Score</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">+{xpEarned}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">XP Earned</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{badges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</div>
        </div>
      </div>
      
      {nextSteps && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-left">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Recommendations</h3>
              <ul className="text-sm space-y-1">
                {nextSteps.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-blue-600" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {nextSteps.relatedTopics.map((topic, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  </div>
);

export default AILessonGenerator;