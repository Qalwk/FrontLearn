import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { useLanguage } from "@/app/providers/LanguageContext";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Progress } from "@/shared/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";

export interface Question {
  id: string;
  question: Record<string, string>;
  options: Record<string, string[]>;
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  title: Record<string, string>;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

interface QuizViewProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

export function QuizView({ quiz, onComplete, onCancel }: QuizViewProps) {
  const { language, t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit as number || 0);
  const [quizComplete, setQuizComplete] = useState(false);
  
  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleQuizTimeout = useCallback(() => {
    toast.error(t("quiz.timeUp"));
    setShowResults(true);
  }, [t]);
  
  // Timer for the quiz
  useEffect(() => {
    if (quiz.timeLimit !== undefined && !showResults && !quizComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleQuizTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [quiz.timeLimit, showResults, quizComplete, handleQuizTimeout]);
  
  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitQuiz = () => {
    setQuizComplete(true);
    
    // Calculate score
    const score = Object.keys(answers).reduce((acc, questionId) => {
      const question = questions.find((q: Question) => q.id === questionId);
      if (question && answers[questionId] === question.correctOptionIndex) {
        return acc + 1;
      }
      return acc;
    }, 0);
    
    // Pass score to parent component
    onComplete(score);
  };
  
  // Results view
  if (showResults) {
    const correctAnswers = Object.keys(answers).reduce((acc, questionId) => {
      const question = questions.find((q: Question) => q.id === questionId);
      if (question && answers[questionId] === question.correctOptionIndex) {
        return acc + 1;
      }
      return acc;
    }, 0);
    
    const score = correctAnswers;
    const totalQuestions = questions.length;
    const percentCorrect = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;
    
    return (
      <div className="container mx-auto py-6 space-y-6 max-w-2xl">
        <Card>
          <CardHeader className={passed ? "bg-green-50" : "bg-red-50"}>
            <CardTitle className="flex items-center">
              {passed ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700">{t("quiz.passed")}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">{t("quiz.failed")}</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <h2 className="text-xl mb-4">{quiz.title[language]}</h2>
            <p className="mb-6">{t("quiz.results")}:</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t("quiz.score")}</label>
                <div className="text-2xl">{correctAnswers}/{totalQuestions}</div>
              </div>
              
              <Progress value={percentCorrect} className="h-2 mb-1" />
              <p className="text-sm text-muted-foreground">{percentCorrect}% {t("common.correct")}</p>
              
              <div className="mt-4 space-y-6">
                {questions.map((question: Question, index: number) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correctOptionIndex;
                  
                  return (
                    <div 
                      key={question.id}
                      className={`p-4 rounded-lg ${
                        userAnswer !== undefined
                          ? isCorrect 
                            ? "bg-green-50 border border-green-200" 
                            : "bg-red-50 border border-red-200"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <span className="font-medium">
                          {index + 1}. {question.question[language]}
                        </span>
                        {userAnswer !== undefined && (
                          isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 ml-2" />
                          )
                        )}
                      </div>
                      
                      <div className="grid gap-2 pl-4">
                        {question.options[language].map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`flex items-center p-2 rounded ${
                              question.correctOptionIndex === optionIndex
                                ? "bg-green-100 text-green-800"
                                : userAnswer === optionIndex && userAnswer !== question.correctOptionIndex
                                ? "bg-red-100 text-red-800"
                                : ""
                            }`}
                          >
                            {optionIndex === question.correctOptionIndex ? (
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            ) : userAnswer === optionIndex ? (
                              <XCircle className="h-4 w-4 mr-2 text-red-500" />
                            ) : (
                              <div className="w-4 h-4 mr-2" />
                            )}
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmitQuiz}>
              {passed ? t("common.continue") : t("quiz.tryAgain")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Quiz view
  return (
    <div className="container mx-auto py-6 space-y-6 max-w-2xl">
      <div className="flex items-center mb-2">
        <Button variant="ghost" onClick={onCancel} className="p-0 mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> {t("common.back")}
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle>{quiz.title[language]}</CardTitle>
            {quiz.timeLimit !== undefined && quiz.timeLimit > 0 && (
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
          <Progress 
            value={(currentQuestionIndex / questions.length) * 100} 
            className="h-1 mt-4" 
          />
        </CardHeader>
        
        <CardContent>
          {currentQuestion && (
            <div className="space-y-4">
              <h2 className="text-xl font-medium">
                {currentQuestionIndex + 1}. {currentQuestion.question[language]}
              </h2>
              
              <RadioGroup
                value={answers[currentQuestion.id]?.toString()}
                onValueChange={(value: string) => 
                  handleAnswerSelect(currentQuestion.id, parseInt(value, 10))
                }
                className="space-y-3"
              >
                {currentQuestion.options[language].map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`} 
                    />
                    <Label htmlFor={`option-${index}`} className="flex-grow">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            {t("common.previous")}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
          
          <Button 
            onClick={handleNextQuestion}
            disabled={answers[currentQuestion?.id] === undefined}
          >
            {currentQuestionIndex < questions.length - 1
              ? t("common.next")
              : t("quiz.submit")
            }
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}